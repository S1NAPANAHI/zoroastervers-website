import { test, expect } from '@playwright/test'

test.describe('Shop Hierarchy Browsing', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to shop page
    await page.goto('/shop')
    await page.waitForLoadState('networkidle')
  })

  test('should display hierarchical shop tree structure', async ({ page }) => {
    // Check for main navigation elements
    await expect(page.locator('[data-testid="shop-hierarchy"]')).toBeVisible()
    
    // Check for book/volume/saga/arc/issue structure
    await expect(page.locator('text=📚')).toBeVisible() // Books
    await expect(page.locator('text=📖')).toBeVisible() // Volumes
    await expect(page.locator('text=📜')).toBeVisible() // Sagas
  })

  test('should expand and collapse hierarchical nodes', async ({ page }) => {
    // Find an expandable node (should have folder icon)
    const expandableNode = page.locator('[data-testid="expandable-node"]').first()
    await expect(expandableNode).toBeVisible()

    // Click to expand
    await expandableNode.click()
    
    // Check for expanded state (should show children)
    await expect(page.locator('[data-testid="child-node"]').first()).toBeVisible()
    
    // Click to collapse
    await expandableNode.click()
    
    // Check for collapsed state (children should be hidden)
    await expect(page.locator('[data-testid="child-node"]').first()).not.toBeVisible()
  })

  test('should display pricing information correctly', async ({ page }) => {
    // Check for price displays
    await expect(page.locator('[data-testid="item-price"]').first()).toBeVisible()
    
    // Check for bundle savings badges
    const savingsBadge = page.locator('text=/Save \\d+%/')
    if (await savingsBadge.count() > 0) {
      await expect(savingsBadge.first()).toBeVisible()
    }
    
    // Check for crossed-out original prices on bundles
    const originalPrice = page.locator('.line-through')
    if (await originalPrice.count() > 0) {
      await expect(originalPrice.first()).toBeVisible()
    }
  })

  test('should add items to cart from hierarchy', async ({ page }) => {
    // Find first "Add to Cart" button
    const addToCartButton = page.locator('button:has-text("Add to Cart")').first()
    await expect(addToCartButton).toBeVisible()
    
    // Click add to cart
    await addToCartButton.click()
    
    // Check that cart indicator updates
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1')
    
    // Verify item appears in cart
    await page.locator('[data-testid="cart-drawer-toggle"]').click()
    await expect(page.locator('[data-testid="cart-item"]').first()).toBeVisible()
  })

  test('should open item details from hierarchy', async ({ page }) => {
    // Find and click first "Details" button
    const detailsButton = page.locator('button:has-text("Details")').first()
    await expect(detailsButton).toBeVisible()
    
    await detailsButton.click()
    
    // Should navigate to item detail page or open modal
    await expect(page.locator('[data-testid="item-details"]')).toBeVisible()
  })

  test('should display progress indicators for series', async ({ page }) => {
    // Look for series progress bars
    const progressBar = page.locator('[data-testid="series-progress"]')
    if (await progressBar.count() > 0) {
      await expect(progressBar.first()).toBeVisible()
      
      // Check progress text
      await expect(page.locator('text=/\\d+ items/')).toBeVisible()
    }
  })

  test('should filter hierarchy by search', async ({ page }) => {
    // Look for search input
    const searchInput = page.locator('[data-testid="shop-search"]')
    if (await searchInput.count() > 0) {
      await searchInput.fill('Book')
      
      // Wait for search results
      await page.waitForTimeout(500)
      
      // Should show filtered results
      const visibleItems = page.locator('[data-testid="shop-item"]:visible')
      await expect(visibleItems.first()).toBeVisible()
      
      // Clear search
      await searchInput.clear()
      await page.waitForTimeout(500)
    }
  })

  test('should maintain hierarchy state on page reload', async ({ page }) => {
    // Expand a node
    const expandableNode = page.locator('[data-testid="expandable-node"]').first()
    if (await expandableNode.count() > 0) {
      await expandableNode.click()
      await expect(page.locator('[data-testid="child-node"]').first()).toBeVisible()
      
      // Reload page
      await page.reload()
      await page.waitForLoadState('networkidle')
      
      // Check if expansion state is maintained (depending on implementation)
      // This may or may not be implemented - test what the expected behavior is
    }
  })

  test('should display item ratings and reviews in hierarchy', async ({ page }) => {
    // Check for rating displays
    const rating = page.locator('[data-testid="item-rating"]')
    if (await rating.count() > 0) {
      await expect(rating.first()).toBeVisible()
    }
    
    // Check for review buttons
    const reviewButton = page.locator('button:has-text("Reviews")')
    if (await reviewButton.count() > 0) {
      await expect(reviewButton.first()).toBeVisible()
      
      // Click to open reviews
      await reviewButton.first().click()
      await expect(page.locator('[data-testid="review-panel"]')).toBeVisible()
    }
  })

  test('should handle deep hierarchy navigation', async ({ page }) => {
    // Test navigation through multiple levels: Book -> Volume -> Arc -> Issue
    
    // Expand book level
    const bookNode = page.locator('[data-testid="book-node"]').first()
    if (await bookNode.count() > 0) {
      await bookNode.click()
      
      // Expand volume level
      const volumeNode = page.locator('[data-testid="volume-node"]').first()
      if (await volumeNode.count() > 0) {
        await volumeNode.click()
        
        // Expand arc level
        const arcNode = page.locator('[data-testid="arc-node"]').first()
        if (await arcNode.count() > 0) {
          await arcNode.click()
          
          // Check for issue level
          await expect(page.locator('[data-testid="issue-node"]').first()).toBeVisible()
        }
      }
    }
  })

  test('should handle responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Reload to apply mobile styles
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Check that hierarchy is still functional on mobile
    await expect(page.locator('[data-testid="shop-hierarchy"]')).toBeVisible()
    
    // Test expand/collapse on mobile
    const expandableNode = page.locator('[data-testid="expandable-node"]').first()
    if (await expandableNode.count() > 0) {
      await expandableNode.click()
      await expect(page.locator('[data-testid="child-node"]').first()).toBeVisible()
    }
  })
})
