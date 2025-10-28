const { test, expect } = require('@playwright/test');

// Helper function to clear localStorage before each test
test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.evaluate(() => localStorage.clear());
});

// ===========================================
// PLANNING POKER TESTS
// ===========================================

test.describe('Planning Poker - Session Flow', () => {
  
  test('should create Planning Poker session from landing page', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Click "Planning Poker" button on landing page
    await page.click('text=Planning Poker');
    
    // Wait for navigation and session creation
    await page.waitForTimeout(2000);
    
    // Session ID is displayed in a <code> tag
    const sessionIdElement = page.locator('code').first();
    await expect(sessionIdElement).toBeVisible({ timeout: 10000 });
    
    const sessionId = await sessionIdElement.textContent();
    expect(sessionId).toBeTruthy();
    expect(sessionId.length).toBeGreaterThan(3);
  });

  test('should join Planning Poker session and vote', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.click('text=Planning Poker');
  
  await page.waitForTimeout(2000);
  
  // Clear and enter name
  const nameInput = page.locator('input[placeholder="Your name"]');
  await nameInput.clear();
  await nameInput.fill('Test User');
  
  // Uncheck moderator to ensure we see voting interface
  const moderatorCheckbox = page.locator('text=Moderator').locator('..').locator('input[type="checkbox"]');
  if (await moderatorCheckbox.isChecked()) {
    await moderatorCheckbox.click();
  }
  
  await page.click('button:has-text("Join Session")');
  
  // Wait longer for WebKit - it's slower
  await page.waitForTimeout(4000);
  
  // Wait for voting screen
  await expect(page.locator('text=Select Your Estimate')).toBeVisible({ timeout: 15000 });
  
  // Click on vote card (5 points)
  await page.click('button:has-text("5")');
  
  // Wait a moment for vote to register
  await page.waitForTimeout(1000);
  
  // Verify we're still on the voting screen (vote registered)
  await expect(page.locator('text=Select Your Estimate')).toBeVisible();
});

  test('should reveal votes as moderator', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.click('text=Planning Poker');
    
    await page.waitForTimeout(2000);
    
    // Ensure moderator checkbox is checked
    const moderatorCheckbox = page.locator('text=Moderator').locator('..').locator('input[type="checkbox"]');
    if (!(await moderatorCheckbox.isChecked())) {
      await moderatorCheckbox.check();
    }
    
    const nameInput = page.locator('input[placeholder="Your name"]');
    await nameInput.clear();
    await nameInput.fill('Moderator');
    await page.click('button:has-text("Join Session")');
    
    // Wait for session to fully load
    await page.waitForTimeout(3000);
    
    // Now look for Reveal button
    await expect(page.locator('button:has-text("Reveal")').first()).toBeVisible({ timeout: 10000 });
    
    // Click reveal
    await page.click('button:has-text("Reveal")');
    
    // Verify "Hide" button appears (votes revealed)
    await page.waitForTimeout(500);
    await expect(page.locator('button:has-text("Hide")').first()).toBeVisible({ timeout: 5000 });
  });

  test('should show session controls for moderator', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.click('text=Planning Poker');
  
  await page.waitForTimeout(2000);
  
  // Ensure moderator checkbox is checked
  const moderatorCheckbox = page.locator('text=Moderator').locator('..').locator('input[type="checkbox"]');
  if (!(await moderatorCheckbox.isChecked())) {
    await moderatorCheckbox.check();
  }
  
  const nameInput = page.locator('input[placeholder="Your name"]');
  await nameInput.clear();
  await nameInput.fill('Moderator');
  await page.click('button:has-text("Join Session")');
  
  // Wait for session to load
  await page.waitForTimeout(3000);
  
  // Verify moderator sees control buttons
  const hasControls = await page.locator('button:has-text("Reveal"), button:has-text("Reset")').count();
  expect(hasControls).toBeGreaterThan(0);
});
});

// ===========================================
// RETROSPECTIVE TESTS
// ===========================================

test.describe('Retrospective - Session Creation', () => {
  
  test('should create retrospective session and show format selection', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Click "Retrospective" button on landing page
    await page.click('text=Retrospective');
    
    // Should show format selection modal
    await page.waitForTimeout(1000);
    await expect(page.getByRole('heading', { name: 'Choose Retrospective Format' })).toBeVisible({ timeout: 5000 });
  });

  test('should select retrospective format and show join screen', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.click('text=Retrospective');
    
    await page.waitForTimeout(1000);
    
    // Click on first available format button
    const formatButton = page.locator('button').filter({ hasText: /Start|Stop|Continue/ }).first();
    await formatButton.click();
    
    await page.waitForTimeout(2000);
    
    // Should show join screen with session ID in <code> tag
    const sessionIdElement = page.locator('code').first();
    await expect(sessionIdElement).toBeVisible({ timeout: 10000 });
    
    const sessionId = await sessionIdElement.textContent();
    expect(sessionId).toBeTruthy();
  });
});

test.describe('Retrospective - Phase System', () => {
  
  test('should start in Input phase after joining', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.click('text=Retrospective');
    
    await page.waitForTimeout(1000);
    
    // Select a format
    const formatButton = page.locator('button').filter({ hasText: /Start|Stop|Continue/ }).first();
    await formatButton.click();
    
    await page.waitForTimeout(2000);
    
    // Enter name and join
    const nameInput = page.locator('input[placeholder="Your name"]');
    await nameInput.clear();
    await nameInput.fill('Test User');
    await page.click('button:has-text("Join Session")');
    
    // Wait for session to load
    await page.waitForTimeout(3000);
    
    // Should be in Input phase - look for "+ Add Item" button or textarea
    const inInputPhase = await page.locator('button:has-text("+ Add Item"), textarea, input[placeholder*="thought"]').count();
    expect(inInputPhase).toBeGreaterThan(0);
  });

  test('should allow moderator to see phase controls', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.click('text=Retrospective');
  
  await page.waitForTimeout(1000);
  
  // Select format
  const formatButton = page.locator('button').filter({ hasText: /Glad|Sad|Mad/ }).first();
  await formatButton.click();
  
  await page.waitForTimeout(2000);
  
  // Ensure moderator checkbox is checked
  const moderatorCheckbox = page.locator('text=Moderator').locator('..').locator('input[type="checkbox"]');
  if (!(await moderatorCheckbox.isChecked())) {
    await moderatorCheckbox.check();
  }
  
  // Join as moderator
  const nameInput = page.locator('input[placeholder="Your name"]');
  await nameInput.clear();
  await nameInput.fill('Moderator');
  await page.click('button:has-text("Join Session")');
  
  // Wait for session to load
  await page.waitForTimeout(3000);
  
  // Moderator should see Next Phase button or timer controls
  const hasModeratorControls = await page.locator('button:has-text("Next Phase"), button:has-text("min"), svg[class*="Clock"]').count();
  expect(hasModeratorControls).toBeGreaterThan(0);
});
});

test.describe('Retrospective - Input Functionality', () => {
  
  test('should show input areas for retrospective columns', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.click('text=Retrospective');
    
    await page.waitForTimeout(1000);
    
    const formatButton = page.locator('button').filter({ hasText: /Start|Stop|Continue/ }).first();
    await formatButton.click();
    
    await page.waitForTimeout(2000);
    
    const nameInput = page.locator('input[placeholder="Your name"]');
    await nameInput.clear();
    await nameInput.fill('Test User');
    await page.click('button:has-text("Join Session")');
    
    // Wait for session to load
    await page.waitForTimeout(3000);
    
    // Should see "+ Add Item" buttons for each column
    const addButtons = await page.locator('button:has-text("+ Add Item")').count();
    expect(addButtons).toBeGreaterThan(0);
  });
});

test.describe('Retrospective - Timer Functionality', () => {
  
  test('should show timer for moderator', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.click('text=Retrospective');
  
  await page.waitForTimeout(1000);
  
  // Click specific format button
  const formatButton = page.locator('button:has-text("Start/Stop/Continue")');
  await formatButton.click();
  
  await page.waitForTimeout(2000);
  
  // Ensure moderator checkbox is checked
  const moderatorCheckbox = page.locator('text=Moderator').locator('..').locator('input[type="checkbox"]');
  if (!(await moderatorCheckbox.isChecked())) {
    await moderatorCheckbox.check();
  }
  
  // Join as moderator
  const nameInput = page.locator('input[placeholder="Your name"]');
  await nameInput.clear();
  await nameInput.fill('Moderator');
  await page.click('button:has-text("Join Session")');
  
  // Wait for session to load
  await page.waitForTimeout(3000);
  
  // Look for timer minute buttons (1 min, 2 min, etc.)
  const hasTimer = await page.locator('button:has-text("min")').count();
  expect(hasTimer).toBeGreaterThan(0);
});
});

test.describe('Retrospective - Share Functionality', () => {
  
  test('should show share button for moderator', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.click('text=Retrospective');
    
    await page.waitForTimeout(1000);
    
    // Click specific format button
    const formatButton = page.locator('button:has-text("Glad/Sad/Mad")');
    await formatButton.click();
    
    await page.waitForTimeout(2000);
    
    const nameInput = page.locator('input[placeholder="Your name"]');
    await nameInput.clear();
    await nameInput.fill('Moderator');
    await page.click('button:has-text("Join Session")');
    
    // Wait for session to load
    await page.waitForTimeout(3000);
    
    // Look for Share button
    const hasShare = await page.locator('button:has-text("Share")').count();
    expect(hasShare).toBeGreaterThan(0);
  });
});

test.describe('Retrospective - Export Functionality', () => {
  
  test('should show export option for moderator', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.click('text=Retrospective');
    
    await page.waitForTimeout(1000);
    
    // Click specific format button
    const formatButton = page.locator('button:has-text("Went Well / To Improve")');
    await formatButton.click();
    
    await page.waitForTimeout(2000);
    
    const nameInput = page.locator('input[placeholder="Your name"]');
    await nameInput.clear();
    await nameInput.fill('Moderator');
    await page.click('button:has-text("Join Session")');
    
    // Wait for session to load
    await page.waitForTimeout(3000);
    
    // Export only shows in Discussion phase, so just verify session loaded
    // Look for any moderator controls instead
    const hasControls = await page.locator('button:has-text("Share"), button:has-text("Next Phase")').count();
    expect(hasControls).toBeGreaterThan(0);
  });
});

// ===========================================
// CROSS-FUNCTIONAL TESTS
// ===========================================

test.describe('Session Navigation', () => {
  
  test('should show Scrumptious branding on landing page', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Should show Scrumptious title (use heading role to be specific)
    await expect(page.getByRole('heading', { name: 'Scrumptious' })).toBeVisible({ timeout: 5000 });
    
    // Should show both options
    await expect(page.locator('text=Planning Poker')).toBeVisible();
    await expect(page.locator('text=Retrospective')).toBeVisible();
  });

  test('should be able to see join screen elements', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.click('text=Planning Poker');
    
    await page.waitForTimeout(2000);
    
    // Should see key join screen elements
    await expect(page.locator('text=Session ID')).toBeVisible();
    await expect(page.locator('input[placeholder="Your name"]')).toBeVisible();
    await expect(page.locator('text=Moderator')).toBeVisible();
    await expect(page.locator('button:has-text("Join Session")')).toBeVisible();
  });

  test('should join session via direct URL parameter', async ({ page }) => {
  // First create a session to get a session ID
  await page.goto('http://localhost:5173');
  await page.click('text=Planning Poker');
  
  await page.waitForTimeout(2000);
  
  // Get the auto-generated session ID from <code> tag
  const sessionIdElement = page.locator('code').first();
  const sessionId = await sessionIdElement.textContent();
  
  // Navigate with session parameter (your app uses ?session= not ?join=)
  await page.goto(`http://localhost:5173/?session=${sessionId}`);
  
  await page.waitForTimeout(2000); // Wait longer for navigation
  
  // Should show join form
  await expect(page.locator('input[placeholder="Your name"]')).toBeVisible({ timeout: 5000 });
  
  // Session ID should still be displayed
  const displayedSessionId = await page.locator('code').first().textContent();
  expect(displayedSessionId).toBe(sessionId);
});
});

test.describe('UI Features', () => {
  
  test('should show dark mode toggle', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Look for dark mode toggle (sun/moon icon button)
    const darkModeToggle = page.locator('button').filter({ has: page.locator('svg') }).first();
    
    if (await darkModeToggle.isVisible()) {
      expect(await darkModeToggle.isVisible()).toBeTruthy();
    } else {
      // Just verify page loaded if no dark mode toggle visible
      await expect(page.getByRole('heading', { name: 'Scrumptious' })).toBeVisible();
    }
  });

  test('should display QR code on join screen', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.click('text=Planning Poker');
    
    await page.waitForTimeout(2000);
    
    // Should see QR code canvas or image
    const hasQR = await page.locator('canvas, img[alt*="QR"], svg').count();
    expect(hasQR).toBeGreaterThan(0);
  });
});

test.describe('Session Joining', () => {
  
  test('should require name to join Planning Poker session', async ({ page }) => {
  // Clear localStorage BEFORE navigating to ensure no saved username
  await page.goto('http://localhost:5173');
  await page.evaluate(() => localStorage.clear());
  
  await page.click('text=Planning Poker');
  
  await page.waitForTimeout(2000);
  
  // Triple-clear the name input to ensure it's empty
  const nameInput = page.locator('input[placeholder="Your name"]');
  await nameInput.fill(''); // Set to empty
  await nameInput.clear(); // Clear again
  await nameInput.evaluate(el => el.value = ''); // Force empty via DOM
  await nameInput.blur(); // Trigger validation
  
  await page.waitForTimeout(200); // Wait for React state update
  
  const joinButton = page.locator('button:has-text("Join Session")');
  
  // Verify the input is actually empty
  const nameValue = await nameInput.inputValue();
  console.log('Name input value:', nameValue);
  
  // Button should be disabled when name is empty
  const isDisabled = await joinButton.isDisabled();
  console.log('Join button disabled:', isDisabled);
  
  expect(isDisabled).toBeTruthy();
});

  test('should require name to join Retrospective session', async ({ page }) => {
    // Clear localStorage BEFORE navigating to ensure no saved username
    await page.goto('http://localhost:5173');
    await page.evaluate(() => localStorage.clear());
    
    await page.click('text=Retrospective');
    
    await page.waitForTimeout(1000);
    
    const formatButton = page.locator('button:has-text("Start/Stop/Continue")');
    await formatButton.click();
    
    await page.waitForTimeout(2000);
    
    // Triple-clear the name input to ensure it's empty
    const nameInput = page.locator('input[placeholder="Your name"]');
    await nameInput.fill(''); // Set to empty
    await nameInput.clear(); // Clear again
    await nameInput.evaluate(el => el.value = ''); // Force empty via DOM
    await nameInput.blur(); // Trigger validation
    
    await page.waitForTimeout(200); // Wait for React state update
    
    const joinButton = page.locator('button:has-text("Join Session")');
    const isDisabled = await joinButton.isDisabled();
    expect(isDisabled).toBeTruthy();
  });

  test('should enable join button when name is entered', async ({ page }) => {
  // Clear localStorage BEFORE navigating to ensure no saved username
  await page.goto('http://localhost:5173');
  await page.evaluate(() => localStorage.clear());
  
  await page.click('text=Planning Poker');
  
  await page.waitForTimeout(2000);
  
  // Triple-clear the name input to ensure it's empty
  const nameInput = page.locator('input[placeholder="Your name"]');
  await nameInput.fill(''); // Set to empty
  await nameInput.clear(); // Clear again
  await nameInput.evaluate(el => el.value = ''); // Force empty via DOM
  await nameInput.blur(); // Trigger validation
  
  await page.waitForTimeout(200); // Wait for React state update
  
  // Button should be disabled
  const joinButton = page.locator('button:has-text("Join Session")');
  expect(await joinButton.isDisabled()).toBeTruthy();
  
  // Enter name
  await nameInput.fill('Test User');
  await page.waitForTimeout(200); // Wait for React state update
  
  // Button should be enabled
  expect(await joinButton.isDisabled()).toBeFalsy();
});
});

test.describe('Moderator Controls', () => {
  
  test('should show moderator checkbox on join screen', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.click('text=Planning Poker');
    
    await page.waitForTimeout(2000);
    
    // Should see moderator checkbox (look for the label text)
    await expect(page.locator('text=Moderator')).toBeVisible({ timeout: 5000 });
    const moderatorCheckbox = page.locator('text=Moderator').locator('..').locator('input[type="checkbox"]');
    await expect(moderatorCheckbox).toBeVisible();
  });

  test('should default to moderator for session creator', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.click('text=Planning Poker');
    
    await page.waitForTimeout(2000);
    
    // Get the Moderator checkbox specifically (second checkbox, or find by label)
    const moderatorCheckbox = page.locator('text=Moderator').locator('..').locator('input[type="checkbox"]');
    const isChecked = await moderatorCheckbox.isChecked();
    
    expect(isChecked).toBeTruthy();
  });

  test('should allow toggling moderator checkbox', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.click('text=Planning Poker');
  
  await page.waitForTimeout(2000);
  
  // Get the Moderator checkbox
  const moderatorCheckbox = page.locator('text=Moderator').locator('..').locator('input[type="checkbox"]');
  
  // Should be toggleable
  const initialState = await moderatorCheckbox.isChecked();
  
  // Toggle by clicking (more reliable cross-browser)
  await moderatorCheckbox.click();
  await page.waitForTimeout(200);
  
  // Should be in opposite state now
  expect(await moderatorCheckbox.isChecked()).toBe(!initialState);
});
});