const { test, expect } = require('@playwright/test');

test.describe('Planning Poker - Critical Flow', () => {
  
  test('should create session and display session ID', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Click create session
    await page.click('text=Create New Session');
    
    // Wait for session ID to appear
    await expect(page.locator('code').first()).toBeVisible();
    
    // Verify session ID exists
    const sessionId = await page.locator('code').first().textContent();
    expect(sessionId).toBeTruthy();
    expect(sessionId.length).toBeGreaterThan(3);
  });

  test('should join session and vote', async ({ page }) => {
    // First create a session
    await page.goto('http://localhost:5173');
    await page.click('text=Create New Session');
    
    // Get session ID
    const sessionId = await page.locator('code').first().textContent();
    
    // Enter name and join
    await page.fill('input[placeholder="Your name"]', 'Test User');
    await page.click('text=Join Session');
    
    // Wait for voting screen
    await expect(page.locator('text=Select Your Estimate')).toBeVisible();
    
    // Click on vote card (5 points)
    await page.click('button:has-text("5")');
    
    // Verify checkmark appears (vote submitted)
    await expect(page.locator('text=✓').first()).toBeVisible();
  });

  test('should reveal votes as moderator', async ({ page }) => {
    // Create session as moderator
    await page.goto('http://localhost:5173');
    await page.click('text=Create New Session');
    
    // Join as moderator
    await page.fill('input[placeholder="Your name"]', 'Moderator');
    await page.check('text=Moderator');
    await page.click('text=Join Session');
    
    // Wait for moderator controls
    await expect(page.locator('text=Reveal')).toBeVisible();
    
    // Click reveal
    await page.click('text=Reveal');
    
    // Verify "Hide" button appears (votes revealed)
    await expect(page.locator('text=Hide')).toBeVisible();
  });
});