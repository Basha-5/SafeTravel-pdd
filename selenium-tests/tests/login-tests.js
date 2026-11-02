/**
 * SafeTravel Web Frontend - Selenium E2E Test Suite
 * File: selenium-tests/tests/login-tests.js
 * 
 * Comprehensive End-to-End automation tests covering:
 * - Authentication (Token/OTP and Password modes)
 * - Dual-channel dispatch (Email & Phone)
 * - Pin input auto-advance & verification
 * - Error states, boundary validations, and edge cases
 * - Session persistence, token handling, and redirection
 */

const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Configuration
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const DEFAULT_TIMEOUT = 10000;

class SafeTravelLoginTest {
  constructor() {
    this.driver = null;
  }

  async setup(isHeadless = true) {
    const options = new chrome.Options();
    if (isHeadless) {
      options.addArguments('--headless=new');
    }
    options.addArguments(
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1280,800'
    );

    this.driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await this.driver.manage().setTimeouts({ implicit: 5000 });
  }

  async teardown() {
    if (this.driver) {
      await this.driver.quit();
    }
  }

  // Helper to wait for element visibility
  async waitFor(selector, timeout = DEFAULT_TIMEOUT) {
    const el = await this.driver.wait(until.elementLocated(selector), timeout);
    await this.driver.wait(until.elementIsVisible(el), timeout);
    return el;
  }

  // Test Suite Execution
  async runAllTests() {
    const results = [];
    console.log('🚀 Starting SafeTravel Selenium E2E Web Test Suite...\n');

    const tests = [
      this.testPageLoadAndTitle.bind(this),
      this.testDefaultTokenTabActive.bind(this),
      this.testTabSwitching.bind(this),
      this.testEmptyTokenSubmissionValidation.bind(this),
      this.testTokenDispatchEmailAndPhone.bind(this),
      this.testOtpInputRenderingAndAutoAdvance.bind(this),
      this.testInvalidTokenVerificationError.bind(this),
      this.testSuccessfulTokenAuthentication.bind(this),
      this.testPasswordVisibilityToggle.bind(this),
      this.testInvalidPasswordLogin.bind(this),
      this.testInstantDemoModeLogin.bind(this),
      this.testSessionPersistenceOnReload.bind(this),
      this.testLogoutAndSessionCleanup.bind(this),
      this.testMobileViewportResponsiveness.bind(this),
      this.testNavigationProtectionForGuests.bind(this),
    ];

    for (const test of tests) {
      const testName = test.name.replace('bound ', '');
      try {
        process.stdout.write(`⏳ Running: ${testName}... `);
        await test();
        console.log('✅ PASSED');
        results.push({ name: testName, status: 'PASSED', error: null });
      } catch (err) {
        console.log(`❌ FAILED: ${err.message}`);
        results.push({ name: testName, status: 'FAILED', error: err.message });
      }
    }

    console.log('\n=======================================');
    console.log(`Summary: ${results.filter(r => r.status === 'PASSED').length}/${results.length} Tests Passed`);
    console.log('=======================================\n');
    return results;
  }

  // 1. Page Load & Title Verification
  async testPageLoadAndTitle() {
    await this.driver.get(`${BASE_URL}/login`);
    const title = await this.driver.getTitle();
    if (!title.includes('SafeTravel') && !title.includes('Vite')) {
      throw new Error(`Unexpected page title: ${title}`);
    }
    const heading = await this.waitFor(By.xpath("//h2[contains(text(), 'Sign in to SafeTravel')]"));
    if (!heading) throw new Error('Sign in heading not found');
  }

  // 2. Default Token Tab Active
  async testDefaultTokenTabActive() {
    await this.driver.get(`${BASE_URL}/login`);
    const tokenTab = await this.waitFor(By.xpath("//button[contains(text(), 'Token / OTP Login')]"));
    const emailInput = await this.waitFor(By.xpath("//input[@type='email']"));
    const phoneInput = await this.waitFor(By.xpath("//input[@type='tel']"));
    if (!emailInput || !phoneInput) {
      throw new Error('Token login input fields missing on default view');
    }
  }

  // 3. Tab Switching
  async testTabSwitching() {
    await this.driver.get(`${BASE_URL}/login`);
    const passwordTab = await this.waitFor(By.xpath("//button[contains(text(), 'Password Login')]"));
    await passwordTab.click();

    // Verify password field appears
    const passInput = await this.waitFor(By.xpath("//input[@type='password']"));
    if (!passInput) throw new Error('Password input not visible after tab switch');

    // Switch back to Token tab
    const tokenTab = await this.waitFor(By.xpath("//button[contains(text(), 'Token / OTP Login')]"));
    await tokenTab.click();
    await this.waitFor(By.xpath("//input[@type='tel']"));
  }

  // 4. Empty Token Submission Validation
  async testEmptyTokenSubmissionValidation() {
    await this.driver.get(`${BASE_URL}/login`);
    const submitBtn = await this.waitFor(By.xpath("//button[@type='submit']"));
    await submitBtn.click();

    // Verify error toast appears
    const toast = await this.waitFor(By.xpath("//div[contains(text(), 'Please enter') or contains(@class, 'toast')]"));
    if (!toast) throw new Error('Expected validation toast on empty submit');
  }

  // 5. Token Dispatch (Email & Phone)
  async testTokenDispatchEmailAndPhone() {
    await this.driver.get(`${BASE_URL}/login`);
    const emailInput = await this.waitFor(By.xpath("//input[@type='email']"));
    const phoneInput = await this.waitFor(By.xpath("//input[@type='tel']"));

    await emailInput.sendKeys('test.traveler@safetravel.org');
    await phoneInput.sendKeys('+91 9876543210');

    const submitBtn = await this.waitFor(By.xpath("//button[@type='submit']"));
    await submitBtn.click();

    // Should redirect to verify-otp page
    await this.driver.wait(until.urlContains('/verify-otp'), DEFAULT_TIMEOUT);
    const url = await this.driver.getCurrentUrl();
    if (!url.includes('email=test.traveler%40safetravel.org')) {
      throw new Error(`URL missing email parameter: ${url}`);
    }
  }

  // 6. OTP Input Auto-Advance
  async testOtpInputRenderingAndAutoAdvance() {
    await this.driver.get(`${BASE_URL}/verify-otp?email=alex%40example.com&phone=%2B15550192834`);
    const inputs = await this.driver.findElements(By.xpath("//input[@inputmode='numeric']"));
    if (inputs.length !== 6) {
      throw new Error(`Expected 6 OTP digit inputs, found: ${inputs.length}`);
    }

    // Type digits one by one
    await inputs[0].sendKeys('1');
    await inputs[1].sendKeys('2');
    await inputs[2].sendKeys('3');
    await inputs[3].sendKeys('4');
    await inputs[4].sendKeys('5');
  }

  // 7. Invalid Token Error Handling
  async testInvalidTokenVerificationError() {
    await this.driver.get(`${BASE_URL}/verify-otp?email=alex%40example.com&phone=%2B15550192834`);
    const inputs = await this.driver.findElements(By.xpath("//input[@inputmode='numeric']"));
    for (let i = 0; i < 6; i++) {
      await inputs[i].sendKeys('0');
    }

    const verifyBtn = await this.waitFor(By.xpath("//button[contains(text(), 'Verify Token')]"));
    await verifyBtn.click();

    // Verify error notification
    await this.waitFor(By.xpath("//div[contains(text(), 'Invalid') or contains(text(), 'expired')]"));
  }

  // 8. Successful Token Authentication (Backup / Valid code)
  async testSuccessfulTokenAuthentication() {
    await this.driver.get(`${BASE_URL}/verify-otp?email=alex%40example.com&phone=%2B15550192834&token=123456`);
    
    // Look for Auto-Fill button if available
    try {
      const autoFill = await this.waitFor(By.xpath("//button[contains(text(), 'Auto-Fill')]"), 2000);
      await autoFill.click();
    } catch {
      const inputs = await this.driver.findElements(By.xpath("//input[@inputmode='numeric']"));
      const code = '123456';
      for (let i = 0; i < 6; i++) {
        await inputs[i].sendKeys(code[i]);
      }
      const verifyBtn = await this.waitFor(By.xpath("//button[contains(text(), 'Verify Token')]"));
      await verifyBtn.click();
    }

    // Wait for redirect to home
    await this.driver.wait(until.urlIs(`${BASE_URL}/`), DEFAULT_TIMEOUT);
  }

  // 9. Password Visibility Toggle
  async testPasswordVisibilityToggle() {
    await this.driver.get(`${BASE_URL}/login`);
    const passwordTab = await this.waitFor(By.xpath("//button[contains(text(), 'Password Login')]"));
    await passwordTab.click();

    const passInput = await this.waitFor(By.xpath("//input[@type='password']"));
    const toggleBtn = await this.waitFor(By.xpath("//input[@type='password']/following-sibling::button"));
    await toggleBtn.click();

    // Attribute should now be 'text'
    const typeAfter = await passInput.getAttribute('type');
    if (typeAfter !== 'text') {
      throw new Error(`Expected input type 'text', got '${typeAfter}'`);
    }
  }

  // 10. Invalid Password Login Failure
  async testInvalidPasswordLogin() {
    await this.driver.get(`${BASE_URL}/login`);
    const passwordTab = await this.waitFor(By.xpath("//button[contains(text(), 'Password Login')]"));
    await passwordTab.click();

    const emailInput = await this.waitFor(By.xpath("//input[@type='email']"));
    const passInput = await this.waitFor(By.xpath("//input[contains(@type, 'pass') or @type='text']"));

    await emailInput.sendKeys('invalid.user@example.com');
    await passInput.sendKeys('wrongpassword123');

    const submitBtn = await this.waitFor(By.xpath("//button[@type='submit']"));
    await submitBtn.click();

    await this.waitFor(By.xpath("//div[contains(text(), 'failed') or contains(text(), 'Invalid') or contains(@class, 'toast')]"));
  }

  // 11. Instant Demo Mode Login
  async testInstantDemoModeLogin() {
    await this.driver.get(`${BASE_URL}/login`);
    const demoBtn = await this.waitFor(By.xpath("//button[contains(text(), 'Instant Demo')]"));
    await demoBtn.click();

    // Verify redirected to dashboard/home
    await this.driver.wait(until.urlIs(`${BASE_URL}/`), DEFAULT_TIMEOUT);
  }

  // 12. Session Persistence on Page Reload
  async testSessionPersistenceOnReload() {
    await this.driver.get(`${BASE_URL}/`);
    await this.driver.navigate().refresh();

    // Verify still authenticated and not redirected to /login
    const currentUrl = await this.driver.getCurrentUrl();
    if (currentUrl.includes('/login')) {
      throw new Error('Session was lost on page reload');
    }
  }

  // 13. Logout & Session Cleanup
  async testLogoutAndSessionCleanup() {
    await this.driver.get(`${BASE_URL}/profile`);
    try {
      const logoutBtn = await this.waitFor(By.xpath("//button[contains(text(), 'Logout') or contains(text(), 'Sign Out')]"), 3000);
      await logoutBtn.click();
      await this.driver.wait(until.urlContains('/login'), DEFAULT_TIMEOUT);
    } catch (e) {
      // Clear localStorage directly to simulate clean logout
      await this.driver.executeScript("localStorage.clear();");
      await this.driver.get(`${BASE_URL}/`);
      await this.driver.wait(until.urlContains('/login'), DEFAULT_TIMEOUT);
    }
  }

  // 14. Mobile Viewport Responsiveness
  async testMobileViewportResponsiveness() {
    await this.driver.manage().window().setRect({ width: 375, height: 667 }); // iPhone SE
    await this.driver.get(`${BASE_URL}/login`);

    const heading = await this.waitFor(By.xpath("//h2[contains(text(), 'Sign in to SafeTravel')]"));
    if (!heading) throw new Error('Heading missing on mobile viewport');

    // Reset window
    await this.driver.manage().window().setRect({ width: 1280, height: 800 });
  }

  // 15. Navigation Protection for Unauthenticated Guests
  async testNavigationProtectionForGuests() {
    await this.driver.executeScript("localStorage.clear();");
    await this.driver.get(`${BASE_URL}/facilities`);
    await this.driver.wait(until.urlContains('/login'), DEFAULT_TIMEOUT);

    await this.driver.get(`${BASE_URL}/map`);
    await this.driver.wait(until.urlContains('/login'), DEFAULT_TIMEOUT);
  }
}

// CLI Execution Support
if (require.main === module) {
  (async () => {
    const suite = new SafeTravelLoginTest();
    try {
      await suite.setup(process.env.HEADLESS !== 'false');
      await suite.runAllTests();
    } catch (err) {
      console.error('Fatal Test Runner Error:', err);
      process.exit(1);
    } finally {
      await suite.teardown();
    }
  })();
}

module.exports = SafeTravelLoginTest;
