import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/HomePage';
import { SignInPage } from '../page-objects/SignInPage';
import testData from '../data/testData';
require('dotenv').config();


test('Log in test', async ({ page }) => {
    // Initialize page objects
    const homePage = new HomePage(page);
    const signInPage = new SignInPage(page);

    // Page titles
    const homePageTitle = testData.titles.homePage;
    const signInPageTitle = testData.titles.signInPage;

    // User credentials
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    const username = process.env.USERNM;
    // Perform login once
    await test.step('Open homepage', async () => {
      await homePage.visit();
      await expect.soft(page).toHaveTitle(homePageTitle);
      console.log('✅ Home page loads successfully');
    });
  
    // Verify page title matches expected title
    await test.step('Go to sign in page', async () => {
      await homePage.gotoLogin();
      await expect.soft(page).toHaveTitle(signInPageTitle);
      console.log('✅ Sign-in page loaded successfully');
    });
    await test.step('Login using email and password and redirected to home page', async () => {
      await signInPage.login(email, password);
      await page.waitForLoadState('domcontentloaded');
      await expect.soft(page).toHaveTitle(homePageTitle);
      console.log('✅ Login successful and redirect to home page');
    });
    await test.step('User name testing', async () => {
      const currentUsername = await homePage.getUserName();
      expect.soft(currentUsername).toBe(username);
      console.log('✅ Username is showing correctly after login');
    });
});
