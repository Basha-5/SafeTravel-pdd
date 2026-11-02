/**
 * Appium E2E Automation Capabilities Configuration for SafeTravel
 */

module.exports = {
  host: process.env.APPIUM_HOST || '127.0.0.1',
  port: parseInt(process.env.APPIUM_PORT || '4723', 10),
  baseUrl: process.env.APP_BASE_URL || 'http://localhost:3000',

  androidCapabilities: {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': process.env.ANDROID_DEVICE || 'Android Emulator',
    'appium:platformVersion': process.env.ANDROID_VERSION || '13.0',
    'appium:browserName': 'Chrome',
    'appium:chromedriverAutodownload': true,
    'appium:newCommandTimeout': 300,
    'appium:autoGrantPermissions': true,
  },

  iosCapabilities: {
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:deviceName': process.env.IOS_DEVICE || 'iPhone 15 Pro',
    'appium:platformVersion': process.env.IOS_VERSION || '17.0',
    'appium:browserName': 'Safari',
    'appium:newCommandTimeout': 300,
    'appium:autoAcceptAlerts': true,
  },
};
