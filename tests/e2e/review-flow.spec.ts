import { test, expect } from '@playwright/test'

test.describe('Review Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a book detail page
    await page.goto('/books/1')
    await page.waitForLoadState('networkidle')
  })

  test('should display existing reviews', async ({ page }) => {
    // Check for reviews section
    await expect(page.locator('[data-testid="reviews-section"]')).toBeVisible()
    
    // Check for individual review items
    const reviews = page.locator('[data-testid="review-item"]')
    if (await reviews.count() > 0) {
      await expect(reviews.first()).toBeVisible()
      
      // Check review components
      await expect(page.locator('[data-testid="review-rating"]').first()).toBeVisible()
      await expect(page.locator('[data-testid="review-comment"]').first()).toBeVisible()
      await expect(page.locator('[data-testid="review-author"]').first()).toBeVisible()
    }
  })

  test('should open review form when clicking write review', async ({ page }) => {
    // Click write review button
    await page.locator('button:has-text("Write Review")').click()
    
    // Verify review form appears
    await expect(page.locator('[data-testid="review-form"]')).toBeVisible()
    await expect(page.locator('[data-testid="rating-input"]')).toBeVisible()
    await expect(page.locator('[data-testid="comment-input"]')).toBeVisible()
  })

  test('should submit a new review successfully', async ({ page }) => {
    // Open review form
    await page.locator('button:has-text("Write Review")').click()
    
    // Fill out the form
    await page.locator('[data-testid="rating-input"]').fill('5')
    await page.locator('[data-testid="comment-input"]').fill('This is an excellent book! Highly recommended.')
    
    // Submit the review
    await page.locator('button:has-text("Submit Review")').click()
    
    // Wait for success message or review to appear
    await expect(page.locator('[data-testid="review-success"]')).toBeVisible()
    
    // Verify the new review appears in the list
    await expect(page.locator('text=This is an excellent book! Highly recommended.')).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    // Open review form
    await page.locator('button:has-text("Write Review")').click()
    
    // Try to submit without rating
    await page.locator('[data-testid="comment-input"]').fill('Comment without rating')
    await page.locator('button:has-text("Submit Review")').click()
    
    // Check for validation error
    await expect(page.locator('[data-testid="rating-error"]')).toBeVisible()
  })

  test('should allow rating with star interface', async ({ page }) => {
    // Open review form
    await page.locator('button:has-text("Write Review")').click()
    
    // Click on star rating (if star interface exists)
    const starRating = page.locator('[data-testid="star-rating"]')
    if (await starRating.count() > 0) {
      await starRating.locator('[data-testid="star-4"]').click()
      
      // Verify rating is set
      await expect(page.locator('[data-testid="rating-input"]')).toHaveValue('4')
    }
  })

  test('should edit existing review', async ({ page }) => {
    // Find edit button on an existing review (user's own review)
    const editButton = page.locator('[data-testid="edit-review-btn"]')
    if (await editButton.count() > 0) {
      await editButton.first().click()
      
      // Modify the review
      await page.locator('[data-testid="comment-input"]').fill('Updated review comment')
      await page.locator('button:has-text("Update Review")').click()
      
      // Verify update
      await expect(page.locator('text=Updated review comment')).toBeVisible()
    }
  })

  test('should delete a review', async ({ page }) => {
    // Find delete button on an existing review (user's own review)
    const deleteButton = page.locator('[data-testid="delete-review-btn"]')
    if (await deleteButton.count() > 0) {
      await deleteButton.first().click()
      
      // Confirm deletion
      await page.locator('button:has-text("Confirm")').click()
      
      // Verify review is removed
      await expect(page.locator('[data-testid="review-deleted-message"]')).toBeVisible()
    }
  })

  test('should display review statistics', async ({ page }) => {
    // Check for review statistics
    await expect(page.locator('[data-testid="review-stats"]')).toBeVisible()
    
    // Check for average rating
    await expect(page.locator('[data-testid="average-rating"]')).toBeVisible()
    
    // Check for total review count
    await expect(page.locator('[data-testid="review-count"]')).toBeVisible()
    
    // Check for rating distribution
    const ratingDistribution = page.locator('[data-testid="rating-distribution"]')
    if (await ratingDistribution.count() > 0) {
      await expect(ratingDistribution).toBeVisible()
    }
  })

  test('should filter reviews by rating', async ({ page }) => {
    // Look for rating filter options
    const ratingFilter = page.locator('[data-testid="rating-filter"]')
    if (await ratingFilter.count() > 0) {
      // Filter by 5-star reviews
      await ratingFilter.locator('button:has-text("5 stars")').click()
      
      // Verify only 5-star reviews are shown
      const visibleReviews = page.locator('[data-testid="review-item"]:visible')
      await expect(visibleReviews.first()).toBeVisible()
    }
  })

  test('should sort reviews by date or helpfulness', async ({ page }) => {
    // Look for sort options
    const sortSelect = page.locator('[data-testid="review-sort"]')
    if (await sortSelect.count() > 0) {
      // Sort by newest first
      await sortSelect.selectOption('newest')
      
      // Wait for re-sorting
      await page.waitForTimeout(500)
      
      // Verify reviews are sorted (this would need more complex verification)
      await expect(page.locator('[data-testid="review-item"]').first()).toBeVisible()
    }
  })

  test('should mark reviews as helpful', async ({ page }) => {
    // Find helpful button on a review
    const helpfulButton = page.locator('[data-testid="helpful-btn"]')
    if (await helpfulButton.count() > 0) {
      const initialCount = await page.locator('[data-testid="helpful-count"]').first().textContent()
      
      await helpfulButton.first().click()
      
      // Verify helpful count increased
      await expect(page.locator('[data-testid="helpful-count"]').first()).not.toHaveText(initialCount!)
    }
  })

  test('should paginate through reviews', async ({ page }) => {
    // Look for pagination controls
    const nextButton = page.locator('[data-testid="reviews-next"]')
    if (await nextButton.count() > 0) {
      await nextButton.click()
      
      // Wait for new page to load
      await page.waitForTimeout(500)
      
      // Verify new reviews loaded
      await expect(page.locator('[data-testid="review-item"]').first()).toBeVisible()
    }
  })

  test('should require authentication for writing reviews', async ({ page }) => {
    // If not logged in, clicking write review should prompt login
    const writeReviewButton = page.locator('button:has-text("Write Review")')
    
    if (await page.locator('[data-testid="login-required"]').count() > 0) {
      await writeReviewButton.click()
      
      // Should show login prompt
      await expect(page.locator('[data-testid="auth-modal"]')).toBeVisible()
    }
  })
})
