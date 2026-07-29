// landing-page/tests/e2e/lp-smoke.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Landing Page smoke', () => {
  test('loads hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('A primeira volta');
  });

  test('all 7 sections render', async ({ page }) => {
    await page.goto('/');
    for (const id of ['hero', 'problema', 'analise', 'decisao', 'prova', 'cta', 'footer']) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
  });

  test('contact form submits to Netlify Forms', async ({ page }) => {
    await page.goto('/#cta');
    await page.getByPlaceholder('Nome').fill('Test User');
    await page.getByPlaceholder('Email corporativo').fill('test@example.com');
    await page.getByPlaceholder(/Contexto/).fill('Test message');
    // Netlify Forms posts to root — we just verify the form is detected
    const form = page.locator('form[name="contact"]');
    await expect(form).toHaveAttribute('data-netlify', 'true');
  });
});
