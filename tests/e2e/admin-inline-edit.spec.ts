import { test, expect } from '@playwright/test'

test.describe('Admin Inline Edit', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
  })

  test('should enable inline edit mode and modify a field', async ({ page }) => {
    // Enable inline admin mode
    await page.click('[data-testid="toggle-inline-admin"]')

    // Modify a sample field
    const field = page.locator('[data-testid="editable-field"]')
    await field.click()
    await field.fill('Updated Value')
    await page.click('[data-testid="save-btn"]')

    // Verify update
    await expect(field).toHaveText('Updated Value')
  })

  test('should cancel modifications and preserve original value', async ({ page }) => {
    // Enable inline admin mode
    await page.click('[data-testid="toggle-inline-admin"]')

    // Modify a sample field
    const field = page.locator('[data-testid="editable-field"]')
    await field.click()
    await field.fill('Temporary Change')
    await page.click('[data-testid="cancel-btn"]')

    // Verify original value is preserved
    await expect(field).not.toHaveText('Temporary Change')
  })

  test('should display validation error messages', async ({ page }) => {
    // Enable inline admin mode
    await page.click('[data-testid="toggle-inline-admin"]')

    // Attempt invalid modification
    const field = page.locator('[data-testid="editable-field"]')
    await field.click()
    await field.fill('')  // Assuming empty field is invalid
    await page.click('[data-testid="save-btn"]')

    // Check for validation message
    await expect(page.locator('[data-testid="validation-error"]')).toBeVisible()
  })

  test('should navigate between inline editable fields using keyboard', async ({ page }) => {
    // Enable inline admin mode
    await page.click('[data-testid="toggle-inline-admin"]')

    // Select a field and press Tab
    const firstField = page.locator('[data-testid="editable-field"]:nth-child(1)')
    await firstField.click()
    await page.keyboard.press('Tab')

    // Verify second field gets focus
    const secondField = page.locator('[data-testid="editable-field"]:nth-child(2)')
    await expect(secondField).toBeFocused()
  })
})
