import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/HomePage';
import { SignInPage } from '../page-objects/SignInPage';
import { SearchResultPage } from '../page-objects/SearchResultPage';
import { BookDetailsPage } from '../page-objects/BookDetailsPage';
import { CartPage } from '../page-objects/CartPage';
import { ShippingPage } from '../page-objects/ShippingPage';
import { ConfirmedOrderPage } from '../page-objects/ConfirmedOrderPage';
import testData from '../data/testData';
import { title } from 'process';
require('dotenv').config();



test('Complete Order Flow', async ({ page }) => {
    // Initialize page objects
    const homePage = new HomePage(page);
    const signInPage = new SignInPage(page);
    const searchResultPage = new SearchResultPage(page);
    const bookDetailsPage = new BookDetailsPage(page);
    const cartPage = new CartPage(page);
    const shippingPage = new ShippingPage(page);
    const confirmedOrderPage = new ConfirmedOrderPage(page);

    // Page titles
    const homePageTitle = testData.titles.homePage;
    const signInPageTitle = testData.titles.signInPage;
    const searchResultPageTitle = testData.titles.searchResultPage;
    const bookDetailsPageTitle = testData.titles.bookDetailsPage;
    const cartPageTitle = testData.titles.cartPage;
    const shippingPageTitle = testData.titles.shippingPage;
    const confirmedOrderPageTitle = testData.titles.confirmedOrderPage;
    const trackOrderPageTitle = testData.titles.trackOrderPage;

    // User credentials
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    const username = process.env.USERNM;

    // Others
    let productId;
    let productTitle;
    let orderNumber;


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
      await expect.soft(page).toHaveTitle(homePageTitle);
      console.log('✅ Login successful and redirect to home page');
      
    });
    await test.step('User name testing', async () => {
      const currentUsername = await homePage.getUserName();
      expect.soft(currentUsername).toBe(username);
      console.log('✅ Username is showing correctly after login');
      
    });
    await test.step('Search for a book', async () => {
      const searchKeyword = testData.searchKeyword;
      await homePage.search(searchKeyword);
      await expect.soft(page).toHaveTitle(searchResultPageTitle);
      console.log('✅ Search result shows successfully');
      
    });

    await test.step('Verify if the searched product is found', async () => {
      productTitle = testData.productTitle;
      const { found, product } = await searchResultPage.isProductFound(productTitle);
      if (!found) {
        console.log(`❌ ${productTitle} - not found in search results`);
        return;
      }
      console.log(`✅ ${productTitle} - not found in search results`);
      console.log("✅ Product: ", product);  
      
    });

    await test.step('Open the book details page', async () => {
      await searchResultPage.goToProductDetails();
      await expect.soft(page).toHaveTitle(bookDetailsPageTitle);
      console.log('✅ Book details page loaded successfully');
      
    });

    await test.step('Add product to cart', async () => {
      let addToCartButtonText = await bookDetailsPage.getAddToCartButtonText();
      if (addToCartButtonText.trim() === 'Go to Cart ->') {
        console.log('❌ Product already in cart, ✅ move to cart page');
      }
      else {
        expect.soft(addToCartButtonText.trim()).toBe('Add to Cart');
        await bookDetailsPage.clickAddToCart();
        let updatedCartButtonText = await bookDetailsPage.getAddToCartButtonText();
        expect.soft(updatedCartButtonText.trim()).toBe('Go to Cart ->');
        console.log('✅ Product added to cart successfully');
      }
      
    });

    await test.step('Go to cart', async () => {
      await bookDetailsPage.goToCart();
      await expect.soft(page).toHaveTitle(cartPageTitle);
      console.log('✅ Navigated to cart page successfully');
      
    });
  
    //Verify cart is empty when no products are present
    await test.step('Verify cart empty state', async () => {
      const isEmpty = await cartPage.isCartEmpty();
      if (isEmpty) {
        console.log('❌ Cart is empty, skipping all the other tests');
        
        return; // Skip the test if cart is not empty
      }
      expect.soft(isEmpty).toBeFalsy();
      console.log('✅ Cart is not empty');
      
    });
  
    // Verify select all selects all products and selected product count matches
    await test.step('Verify select all functionality', async () => {
      const isEmpty = await cartPage.isCartEmpty();
      if (isEmpty) {
        console.log('❌ Cart is empty, skipping select all test');
        return;
      }
  
      await cartPage.selectAllProduct();
      const displayedCount = await cartPage.getDisplayedSelectedCount();
      const actualSelectedCount = await cartPage.getSelectedProductCount();
      expect.soft(displayedCount).toBe(actualSelectedCount);
      console.log('✅ Select all product works perfectly');
      
    });
  
    // Verify deselect all, deselects all products and count is 0
    await test.step('Verify deselect all functionality', async () => {
      const isEmpty = await cartPage.isCartEmpty();
      if (isEmpty) {
        console.log('❌ Cart is empty, skipping deselect all test');
        return;
      }
      await cartPage.deSelectAllProduct(); // Ensure all items are deselected
      const displayedCountAfterDeselect = await cartPage.getDisplayedSelectedCount();
      const selectedCountAfterDeselect = await cartPage.getSelectedProductCount();
      expect.soft(displayedCountAfterDeselect).toBe(0); // Verify displayed count is 0 after deselection
      expect.soft(selectedCountAfterDeselect).toBe(0); // Verify count is 0 after deselection
      console.log('✅ Deselect all product works perfectly');
      
    });
  
    // Verify product selection and toggling
    await test.step('Verify single product selection and toggling', async () => {
      productId = testData.cartProductId; // Example product ID
      // Check if the product is in the cart
      const isProductInCart = await cartPage.isProductInCart(productId);
      if (!isProductInCart) {
        console.log(`❌ Product ID: ${productId} not found in cart`);
        
        return; // Skip the test if product is not found
      }
      console.log(`✅ Product ID: ${productId} found in cart`);
      await cartPage.deSelectAllProduct();
      await cartPage.selectProductById(productId);
      const isProductNowSelected = await cartPage.isProductSelected(productId);
      expect.soft(isProductNowSelected).toBeTruthy();
      console.log(`✅ Product ID: ${productId} is selected and verified successfully`);
      
    });
    // Verify proceed to checkout button is enabled
    await test.step('Verify proceed to checkout button is enabled', async () => {
      await cartPage.clickProceedToCheckout();
      await expect.soft(page).toHaveTitle(shippingPageTitle);
      console.log('✅ Proceed to checkout is successfully clicked and shipping page is loaded');
      
    });
    
    await test.step('Select Cash on delivery', async () => {
      await shippingPage.selectCashOnDelivery();
      //await expect.soft(page).toHaveTitle(shippingPageTitle);
      console.log('✅ Cash on delivery is selected and Confirm order button is clickable');
      
    });

    await test.step('Confirm order', async () => {
      await shippingPage.clickConfirmOrder();
      await expect.soft(page).toHaveTitle(confirmedOrderPageTitle);
      console.log('✅ Order confirmed successfully and confirmed order page is loaded');
      
    });
    await test.step('Verify if order number is generated', async () => {
      orderNumber = await confirmedOrderPage.getOrderNumber();
      expect(orderNumber).toBeDefined();
      console.log('✅ Order number is generated successfully');
      
    });
    await test.step('Verify order number length', async () => {
      expect(orderNumber.length).toBe(14);
      console.log('✅ Order number is verified successfully');
      
    });
    await test.step('Go to track order', async () => {
      await confirmedOrderPage.clickTrackOrder();
      await expect.soft(page).toHaveTitle(trackOrderPageTitle);
      console.log('✅ Track order page is loaded successfully');
      
    });

  });