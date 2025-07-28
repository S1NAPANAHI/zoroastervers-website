import { test, expect } from '@playwright/test'

test('Character lifecycle test', async ({ page }) => {
  // Navigate to character management page
  await page.goto('http://localhost:3000/admin/characters')

  // Create new character
  await page.click('text=Add Character')
  await page.fill('input[placeholder="Enter character name"]', 'Character Cypress')
  await page.click('text=Create Character')

  // Verify character creation
  await expect(page).toHaveURL(/characters/)
  await expect(page.locator('text=Character Cypress')).toBeVisible()

  // Edit character
  await page.click(`text=Character Cypress >> ../button[text=Edit]`)
  await page.fill('input[placeholder="Character name"]', 'Character Cypress Edited')
  await page.click('text=Update Character')

  // Verify character update
  await expect(page.locator('text=Character Cypress Edited')).toBeVisible()

  // Relate character
  await page.click(`text=Character Cypress Edited >> ../button[text=Relate]`)
  await page.selectOption('select#relatedCharacter', 'Another Character')
  await page.click('text=Create Relationship')

  // Verify relationship creation
  await expect(page.locator('text=Another Character')).toBeVisible()

  // Delete character
  await page.click(`text=Character Cypress Edited >> ../button[text=Delete]`)
  await page.click('text=Confirm')

  // Verify deletion
  await expect(page.locator('text=Character Cypress Edited')).not.toBeVisible()
})
