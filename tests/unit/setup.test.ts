/**
 * Smoke test to verify test setup is working correctly
 */

describe('Test Setup', () => {
  test('should run basic tests', () => {
    expect(1 + 1).toBe(2)
  })

  test('should have testing library available', () => {
    expect(typeof expect).toBe('function')
  })

  test('should have localStorage available', () => {
    expect(typeof localStorage).toBe('object')
  })

  test('should have fetch available', () => {
    expect(typeof fetch).toBe('function')
  })
})
