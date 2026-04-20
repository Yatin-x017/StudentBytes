import { test, expect } from '@playwright/test';

test('verify premium dashboard redesign', async ({ page }) => {
  await page.goto('http://localhost:5173/dashboard');

  // Check premium sidebar
  await expect(page.locator('aside')).toBeVisible();
  await expect(page.getByText('Student Bytes')).toBeVisible();
  await expect(page.getByText('Premium')).toBeVisible();

  // Check header
  await expect(page.getByText('Hey, ready to learn?')).toBeVisible();

  // Check input box
  const input = page.getByPlaceholder('Ask anything about DSA...');
  await expect(input).toBeVisible();

  // Trigger a response
  await input.fill('What is a Linked List?');
  await page.click('button:has-text("Analyze")');

  // Wait for "Thinking" and then the response cards
  await expect(page.getByText('Thinking...')).toBeVisible();
  await page.waitForTimeout(3000); // Wait for streaming/stagger

  await expect(page.getByText('Conceptual Insight')).toBeVisible();
  await expect(page.getByText('Key Takeaways')).toBeVisible();

  await page.screenshot({ path: 'verification/screenshots/premium_dashboard.png', fullPage: true });
});
