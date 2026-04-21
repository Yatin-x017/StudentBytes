import { test, expect } from '@playwright/test';

test.describe('Student Bytes Phase 3 Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Start from landing page
    await page.goto('http://localhost:5173/');
  });

  test('Landing Page has correct copy and no OAuth buttons', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Your AI Tutor for CS.');
    await expect(page.locator('p')).toContainText('Master DSA, OS, DBMS, and more with Byte');
    await expect(page.locator('button:has-text("Start Learning Free")')).toBeVisible();

    // Ensure no Google/GitHub buttons
    await expect(page.locator('button:has-text("Google")')).not.toBeVisible();
    await expect(page.locator('button:has-text("GitHub")')).not.toBeVisible();

    // Check disclaimer
    await expect(page.locator('text=No account needed. Your data stays on your device.')).toBeVisible();

    await page.screenshot({ path: 'verification/landing_v3.png' });
  });

  test('API Key Banner and Inline Modal Flow', async ({ page }) => {
    await page.click('button:has-text("Start Learning Free")');
    await expect(page).toHaveURL(/.*study/);

    // Banner visible
    await expect(page.locator('text=Byte needs an Anthropic API key to respond')).toBeVisible();

    // Click Enter Key
    await page.click('button:has-text("Enter key")');

    // Modal visible
    await expect(page.locator('h2:has-text("Activate Byte")')).toBeVisible();

    // Enter key and save
    await page.fill('input[type="password"]', 'sk-ant-test-key');
    await page.click('button:has-text("Save & Activate")');

    // Modal closed, toast shown
    await expect(page.locator('h2:has-text("Activate Byte")')).not.toBeVisible();
    await expect(page.locator('text=Byte is ready ✓')).toBeVisible();

    // Banner should be gone
    await expect(page.locator('text=Byte needs an Anthropic API key to respond')).not.toBeVisible();

    await page.screenshot({ path: 'verification/study_activated.png' });
  });

  test('Mobile Responsiveness - Bottom Nav', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5173/dashboard');

    // Bottom nav visible
    const bottomNav = page.locator('nav.lg\\:hidden.fixed.bottom-0');
    await expect(bottomNav).toBeVisible();

    // Check icons/labels
    await expect(bottomNav.locator('text=Home')).toBeVisible();
    await expect(bottomNav.locator('text=Study')).toBeVisible();
    await expect(bottomNav.locator('text=Quiz')).toBeVisible();

    await page.screenshot({ path: 'verification/mobile_nav.png' });
  });

  test('Quiz Completion and Score Breakdown', async ({ page }) => {
    // Mock API key in localStorage
    await page.evaluate(() => {
      localStorage.setItem('sb_api_key', 'test-key');
      localStorage.setItem('sb_quiz_state', JSON.stringify({
        topic: 'React Hooks',
        questions: [
          { question: 'What is useState?', options: ['A hook', 'A component', 'A prop'], correctIndex: 0, explanation: 'It handles state.' }
        ],
        currentIndex: 0,
        answers: [0],
        quizStarted: true,
        quizFinished: true
      }));
    });

    await page.goto('http://localhost:5173/quiz');

    // Check score screen
    await expect(page.locator('h1:has-text("Quiz Complete!")')).toBeVisible();
    await expect(page.locator('text=1/1')).toBeVisible(); // Prominent score
    await expect(page.locator('text=Question Breakdown')).toBeVisible();
    await expect(page.locator('text=What is useState?')).toBeVisible();

    // Check buttons
    await expect(page.locator('button:has-text("Retake Quiz")')).toBeVisible();
    await expect(page.locator('button:has-text("Study This Topic")')).toBeVisible();

    await page.screenshot({ path: 'verification/quiz_score.png' });
  });
});
