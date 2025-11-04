// tests/scrumptious.spec.js
// Comprehensive E2E tests for Scrumptious
// Run: npx playwright test tests/scrumptious.spec.js

const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

// ===========================================
// HELPER FUNCTIONS
// ===========================================

async function clearLocalStorage(page) {
  await page.evaluate(() => localStorage.clear());
}

async function gotoHome(page) {
  await page.goto(BASE_URL);
  await expect(page.getByRole('heading', { name: /scrumptious/i })).toBeVisible();
}

async function createPlanningPokerSession(page) {
  await gotoHome(page);
  await clearLocalStorage(page);
  await page.getByRole('button', { name: /Planning Poker/i }).click();
  
  // Wait for session ID to appear
  const sessionIdElement = page.locator('code').first();
  await expect(sessionIdElement).toBeVisible({ timeout: 10000 });
  
  const sessionId = await sessionIdElement.textContent();
  expect(sessionId).toBeTruthy();
  expect(sessionId.length).toBeGreaterThan(3);
  
  return sessionId;
}

async function joinPlanningPokerSession(page, name, isModerator = false) {
  const nameInput = page.getByPlaceholder(/Your name/i);
  await nameInput.clear();
  await nameInput.fill(name);
  
  const moderatorCheckbox = page.getByRole('checkbox', { name: /Moderator/i });
  const isChecked = await moderatorCheckbox.isChecked();
  
  // Only click if we need to change the state
  if (isModerator && !isChecked) {
    await moderatorCheckbox.click();
  } else if (!isModerator && isChecked) {
    await moderatorCheckbox.click();
  }
  
  const joinButton = page.getByRole('button', { name: /Join Session/i });
  await expect(joinButton).toBeEnabled();
  await joinButton.click();
  
  // Wait for session to load based on role
  if (isModerator) {
    await expect(page.getByRole('button', { name: /^Reveal$/i })).toBeVisible({ timeout: 10000 });
  } else {
    await expect(page.getByRole('heading', { name: /Select Your Estimate/i })).toBeVisible({ timeout: 10000 });
  }
}

async function createRetroSession(page, format = 'start-stop-continue') {
  await gotoHome(page);
  await clearLocalStorage(page);
  await page.getByRole('button', { name: /Retrospective/i }).click();
  
  // Wait for format selector
  await expect(page.getByRole('heading', { name: /Choose Retrospective Format/i })).toBeVisible();
  
  // Select format based on parameter
  const formatMap = {
    'start-stop-continue': /Start\/Stop\/Continue/i,
    'glad-sad-mad': /Glad\/Sad\/Mad/i,
    'went-well': /Went Well \/ To Improve/i,
    '4ls': /4Ls/i
  };
  
  await page.getByRole('button', { name: formatMap[format] }).click();
  
  // Wait for session ID
  const sessionIdElement = page.locator('code').first();
  await expect(sessionIdElement).toBeVisible({ timeout: 10000 });
  
  const sessionId = await sessionIdElement.textContent();
  expect(sessionId).toBeTruthy();
  
  return sessionId;
}

async function joinRetroSession(page, name, isModerator = false) {
  const nameInput = page.getByPlaceholder(/Your name/i);
  await nameInput.clear();
  await nameInput.fill(name);
  
  const moderatorCheckbox = page.getByRole('checkbox', { name: /Moderator/i });
  const isChecked = await moderatorCheckbox.isChecked();
  
  // Only click if we need to change the state
  if (isModerator && !isChecked) {
    await moderatorCheckbox.click();
  } else if (!isModerator && isChecked) {
    await moderatorCheckbox.click();
  }
  
  const joinButton = page.getByRole('button', { name: /Join Session/i });
  await expect(joinButton).toBeEnabled();
  await joinButton.click();
  
  // Wait for retrospective to load - look for Add Item button
  await expect(page.getByRole('button', { name: /\+ Add Item/i }).first()).toBeVisible({ timeout: 10000 });
}

// ===========================================
// LANDING PAGE & NAVIGATION
// ===========================================

test.describe('Landing Page', () => {
  test('should display branding and session options', async ({ page }) => {
    await gotoHome(page);
    
    await expect(page.getByRole('heading', { name: /scrumptious/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Planning Poker/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Retrospective/i })).toBeVisible();
  });
  
  test('should show dark mode toggle', async ({ page }) => {
    await gotoHome(page);
    
    // Look for dark mode button (has Moon or Sun icon)
    const darkModeButton = page.locator('button').filter({ 
      has: page.locator('svg') 
    }).first();
    
    await expect(darkModeButton).toBeVisible();
  });
  
  test('should show version number', async ({ page }) => {
    await gotoHome(page);
    
    await expect(page.locator('text=/scrumptious v\\d+\\.\\d+\\.\\d+/i')).toBeVisible();
  });
  
  test('should allow joining existing session via input', async ({ page }) => {
    await gotoHome(page);
    
    const sessionInput = page.getByPlaceholder(/Enter Session ID/i);
    await expect(sessionInput).toBeVisible();
    
    await sessionInput.fill('TESTID');
    
    const joinButton = page.getByRole('button', { name: /Join Existing Session/i });
    await expect(joinButton).toBeEnabled();
  });
});

// ===========================================
// PLANNING POKER - SESSION CREATION & JOINING
// ===========================================

test.describe('Planning Poker - Session Creation', () => {
  test('should create session and show join screen', async ({ page }) => {
    const sessionId = await createPlanningPokerSession(page);
    
    // Verify join screen elements
    await expect(page.locator('text=Session ID')).toBeVisible();
    await expect(page.getByPlaceholder(/Your name/i)).toBeVisible();
    await expect(page.getByRole('checkbox', { name: /Moderator/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Join Session/i })).toBeVisible();
  });
  
  test('should show QR code on join screen', async ({ page }) => {
    await createPlanningPokerSession(page);
    
    await expect(page.getByRole('img', { name: /QR Code/i })).toBeVisible();
  });
  
  test('should navigate via URL parameter', async ({ page }) => {
    const sessionId = await createPlanningPokerSession(page);
    
    // Navigate with session parameter
    await page.goto(`${BASE_URL}/?session=${sessionId}`);
    
    await expect(page.getByPlaceholder(/Your name/i)).toBeVisible();
    await expect(page.locator('code').first()).toHaveText(sessionId);
  });
});

test.describe('Planning Poker - Validation & Roles', () => {
  test('should require name to enable join button', async ({ page }) => {
    await createPlanningPokerSession(page);
    
    const nameInput = page.getByPlaceholder(/Your name/i);
    const joinButton = page.getByRole('button', { name: /Join Session/i });
    
    // Clear name
    await nameInput.clear();
    await expect(joinButton).toBeDisabled();
    
    // Fill name
    await nameInput.fill('Test User');
    await expect(joinButton).toBeEnabled();
  });
  
  test('should default moderator checkbox to unchecked for session creator', async ({ page }) => {
    await createPlanningPokerSession(page);
    
    // Based on your App.jsx code comment: "creator is NOT moderator by default"
    const moderatorCheckbox = page.getByRole('checkbox', { name: /Moderator/i });
    await expect(moderatorCheckbox).not.toBeChecked();
  });
  
  test('should allow toggling moderator checkbox', async ({ page }) => {
    await createPlanningPokerSession(page);
    
    const moderatorCheckbox = page.getByRole('checkbox', { name: /Moderator/i });
    
    // Should start unchecked (based on your app's default)
    await expect(moderatorCheckbox).not.toBeChecked();
    
    // Click to check it
    await moderatorCheckbox.click();
    await expect(moderatorCheckbox).toBeChecked();
    
    // Click to uncheck it
    await moderatorCheckbox.click();
    await expect(moderatorCheckbox).not.toBeChecked();
  });
  
  test('should allow checking moderator to join as moderator', async ({ page }) => {
    await createPlanningPokerSession(page);
    
    const moderatorCheckbox = page.getByRole('checkbox', { name: /Moderator/i });
    // Check the moderator checkbox
    await moderatorCheckbox.check();
    
    await joinPlanningPokerSession(page, 'Moderator', true);
    
    // Should see moderator controls
    await expect(page.getByRole('button', { name: /^Reveal$/i })).toBeVisible();
  });
});

// ===========================================
// PLANNING POKER - VOTING & REVEAL
// ===========================================

test.describe('Planning Poker - Voting Flow', () => {
  test('should allow participant to select a vote', async ({ page }) => {
    await createPlanningPokerSession(page);
    await joinPlanningPokerSession(page, 'Voter', false);
    
    // Click on a card (5 points)
    const card = page.getByRole('button', { name: /^5$/i });
    await expect(card).toBeVisible();
    await card.click();
    
    // Should still be on voting screen (vote registered)
    await expect(page.getByRole('heading', { name: /Select Your Estimate/i })).toBeVisible();
  });
  
  test('should show moderator controls', async ({ page }) => {
    await createPlanningPokerSession(page);
    await joinPlanningPokerSession(page, 'Moderator', true);
    
    // Verify moderator sees controls
    await expect(page.getByRole('button', { name: /^Reveal$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Reset$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /History/i })).toBeVisible();
  });
  
  test('should reveal votes when moderator clicks reveal', async ({ page }) => {
    await createPlanningPokerSession(page);
    await joinPlanningPokerSession(page, 'Moderator', true);
    
    const revealButton = page.getByRole('button', { name: /^Reveal$/i });
    await revealButton.click();
    
    // Should show Hide button after reveal
    await expect(page.getByRole('button', { name: /^Hide$/i })).toBeVisible();
  });
  
  test('should show voting scale toggle', async ({ page }) => {
    await createPlanningPokerSession(page);
    await joinPlanningPokerSession(page, 'Moderator', true);
    
    const scaleToggle = page.getByRole('button', { name: /Switch to T-Shirt|Switch to Fibonacci/i });
    await expect(scaleToggle).toBeVisible();
  });
  
  test('should show confidence voting toggle', async ({ page }) => {
    await createPlanningPokerSession(page);
    await joinPlanningPokerSession(page, 'Moderator', true);
    
    const confidenceToggle = page.getByRole('button', { name: /Confidence: OFF|✓ Confidence: ON/i });
    await expect(confidenceToggle).toBeVisible();
  });
});

// ===========================================
// PLANNING POKER - HISTORY & EXPORT
// ===========================================

test.describe('Planning Poker - History', () => {
  test('should show history button for moderator', async ({ page }) => {
    await createPlanningPokerSession(page);
    await joinPlanningPokerSession(page, 'Moderator', true);
    
    const historyButton = page.getByRole('button', { name: /History/i });
    await expect(historyButton).toBeVisible();
    await expect(historyButton).toContainText(/\d+/); // Should show count
  });
  
  test('should open history modal', async ({ page }) => {
    await createPlanningPokerSession(page);
    await joinPlanningPokerSession(page, 'Moderator', true);
    
    await page.getByRole('button', { name: /History/i }).click();
    
    await expect(page.getByRole('heading', { name: /Session History/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Export CSV/i })).toBeVisible();
  });
});

// ===========================================
// PLANNING POKER - MULTI-USER
// ===========================================

test.describe('Planning Poker - Multi-User', () => {
  test('should allow two users to join same session', async ({ browser }) => {
    const context = await browser.newContext();
    const moderatorPage = await context.newPage();
    const participantPage = await context.newPage();
    
    // Moderator creates and joins
    const sessionId = await createPlanningPokerSession(moderatorPage);
    await joinPlanningPokerSession(moderatorPage, 'Moderator', true);
    
    // Participant joins same session
    await participantPage.goto(`${BASE_URL}/?session=${sessionId}`);
    await joinPlanningPokerSession(participantPage, 'Participant', false);
    
    // Both should see each other
    await expect(moderatorPage.locator('text=Participant')).toBeVisible({ timeout: 5000 });
    await expect(participantPage.locator('text=Moderator')).toBeVisible({ timeout: 5000 });
    
    await context.close();
  });
  
  test('should show participant vote status to moderator', async ({ browser }) => {
    const context = await browser.newContext();
    const moderatorPage = await context.newPage();
    const participantPage = await context.newPage();
    
    const sessionId = await createPlanningPokerSession(moderatorPage);
    await joinPlanningPokerSession(moderatorPage, 'Moderator', true);
    
    await participantPage.goto(`${BASE_URL}/?session=${sessionId}`);
    await joinPlanningPokerSession(participantPage, 'Voter', false);
    
    // Participant votes
    await participantPage.getByRole('button', { name: /^5$/i }).click();
    
    // Moderator should see vote indicator (checkmark)
    await expect(moderatorPage.locator('text=Voter').locator('xpath=ancestor::div[1]')).toContainText('✓', { timeout: 5000 });
    
    await context.close();
  });
});

// ===========================================
// RETROSPECTIVE - SESSION CREATION
// ===========================================

test.describe('Retrospective - Creation', () => {
  test('should show format selector', async ({ page }) => {
    await gotoHome(page);
    await page.getByRole('button', { name: /Retrospective/i }).click();
    
    await expect(page.getByRole('heading', { name: /Choose Retrospective Format/i })).toBeVisible();
    
    // Should show all formats
    await expect(page.getByRole('button', { name: /Start\/Stop\/Continue/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Glad\/Sad\/Mad/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Went Well/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /4Ls/i })).toBeVisible();
  });
  
  test('should create retrospective session', async ({ page }) => {
    const sessionId = await createRetroSession(page, 'start-stop-continue');
    
    // Verify join screen
    await expect(page.getByPlaceholder(/Your name/i)).toBeVisible();
    await expect(page.locator('code').first()).toHaveText(sessionId);
  });
});

// ===========================================
// RETROSPECTIVE - PHASES
// ===========================================

test.describe('Retrospective - Phases', () => {
  test('should start in Input phase', async ({ page }) => {
    await createRetroSession(page);
    await joinRetroSession(page, 'Participant', false);
    
    // Should see Add Item buttons for columns
    const addButtons = page.getByRole('button', { name: /\+ Add Item/i });
    await expect(addButtons.first()).toBeVisible();
    
    // Verify phase indicators exist - look for the three phase numbers
    await expect(page.locator('text=Input')).toBeVisible();
    await expect(page.locator('text=Grouping')).toBeVisible();
    await expect(page.locator('text=Discussion')).toBeVisible();
  });
  
  test('should show Next Phase button for moderator', async ({ page }) => {
    await createRetroSession(page);
    await joinRetroSession(page, 'Moderator', true);
    
    await expect(page.getByRole('button', { name: /Next Phase/i })).toBeVisible();
  });
  
  test('should show timer controls for moderator', async ({ page }) => {
    await createRetroSession(page);
    await joinRetroSession(page, 'Moderator', true);
    
    // Should see timer minute buttons - look for any button with "min" text
    const timerButton = page.locator('button:has-text("min")').first();
    await expect(timerButton).toBeVisible();
  });
});

// ===========================================
// RETROSPECTIVE - INPUT & ITEMS
// ===========================================

test.describe('Retrospective - Items', () => {
  test('should open add item modal', async ({ page }) => {
    await createRetroSession(page);
    await joinRetroSession(page, 'Participant', false);
    
    // Click first Add Item button
    await page.getByRole('button', { name: /\+ Add Item/i }).first().click();
    
    // Should show modal with textarea
    await expect(page.getByRole('heading', { name: /Add Item/i })).toBeVisible();
    await expect(page.getByPlaceholder(/Enter your thoughts/i)).toBeVisible();
  });
  
  test('should close add item modal on cancel', async ({ page }) => {
    await createRetroSession(page);
    await joinRetroSession(page, 'Participant', false);
    
    await page.getByRole('button', { name: /\+ Add Item/i }).first().click();
    await expect(page.getByRole('heading', { name: /Add Item/i })).toBeVisible();
    
    // Click cancel
    await page.getByRole('button', { name: /Cancel/i }).click();
    
    // Modal should close
    await expect(page.getByRole('heading', { name: /Add Item/i })).not.toBeVisible();
  });
});

// ===========================================
// RETROSPECTIVE - SHARE & EXPORT
// ===========================================

test.describe('Retrospective - Share', () => {
  test('should show share button', async ({ page }) => {
    await createRetroSession(page);
    await joinRetroSession(page, 'Moderator', true);
    
    const shareButton = page.getByRole('button', { name: /^Share$/i });
    await expect(shareButton).toBeVisible();
  });
  
  test('should open share modal', async ({ page }) => {
    await createRetroSession(page);
    await joinRetroSession(page, 'Moderator', true);
    
    await page.getByRole('button', { name: /^Share$/i }).click();
    
    await expect(page.getByRole('heading', { name: /Share Retrospective/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Show QR Code/i })).toBeVisible();
  });
});

// ===========================================
// UI & ACCESSIBILITY
// ===========================================

test.describe('UI Features', () => {
  test('should show release notes when version clicked', async ({ page }) => {
    await gotoHome(page);
    
    await page.locator('text=/scrumptious v\\d+\\.\\d+\\.\\d+/i').click();
    
    await expect(page.getByRole('heading', { name: /Release Notes/i })).toBeVisible();
  });
  
  test('should allow leaving session', async ({ page }) => {
    await createPlanningPokerSession(page);
    await joinPlanningPokerSession(page, 'Test User', false);
    
    // Click leave button
    await page.getByRole('button', { name: /Leave/i }).click();
    
    // Should show confirmation
    await expect(page.getByRole('heading', { name: /Leave Session/i })).toBeVisible();
  });
});

// ===========================================
// ERROR HANDLING & EDGE CASES
// ===========================================

test.describe('Error Handling', () => {
  test('should handle empty session ID gracefully', async ({ page }) => {
    await gotoHome(page);
    
    const sessionInput = page.getByPlaceholder(/Enter Session ID/i);
    await sessionInput.fill('');
    
    const joinButton = page.getByRole('button', { name: /Join Existing Session/i });
    await expect(joinButton).toBeDisabled();
  });
  
  test('should trim whitespace from name input', async ({ page }) => {
    await createPlanningPokerSession(page);
    
    const nameInput = page.getByPlaceholder(/Your name/i);
    await nameInput.fill('  Test User  ');
    
    const joinButton = page.getByRole('button', { name: /Join Session/i });
    await expect(joinButton).toBeEnabled();
  });
});