import { test, expect } from '@playwright/test';

test.describe('Purchase Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to shop page
    await page.goto('/shop');
    await page.waitForLoadState('networkidle');

    // Add an item to the cart
    await page.locator('button', { hasText: 'Add to Cart' }).first().click();
  });

  test('should proceed to checkout', async ({ page }) => {
    // Open cart
    await page.click('[data-testid="cart-drawer-toggle"]');

    // Proceed to checkout
    await page.click('button', { hasText: 'Checkout' });

    // Verify navigation to checkout page
    await expect(page).toHaveURL('/checkout');
    await expect(page.locator('[data-testid="checkout-page"]')).toBeVisible();

    // Check for item summary
    await expect(page.locator('[data-testid="item-summary"]')).toBeVisible();
  });

  test('should complete purchase', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    // Fill out shipping information
    await page.fill('input[name="shippingAddress"]', '123 Fictional St.');
    await page.fill('input[name="city"]', 'Imaginary City');
    await page.fill('input[name="postalCode"]', '12345');

    // Fill out payment information
    await page.fill('input[name="creditCardNumber"]', '4111111111111111');
    await page.fill('input[name="expiryDate"]', '12/25');
    await page.fill('input[name="cvv"]', '123');

    // Submit purchase
    await page.click('button', { hasText: 'Place Order' });

    // Verify confirmation
    await expect(page).toHaveURL('/order-confirmation');
    await expect(page.locator('[data-testid="order-confirmation-number"]')).toBeVisible();
  });

  test('should handle out-of-stock scenario', async ({ page }) => {
    // Simulate out-of-stock
    await page.click('[data-testid="cart-drawer-toggle"]');
    // Assuming UI updates with an out-of-stock message
    await expect(page.locator('[data-testid="out-of-stock-message"]')).toBeVisible();
  });
});

