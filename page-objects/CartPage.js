import { expect } from '@playwright/test';
export class CartPage {
    constructor(page){
        this.page = page;
        this.selectAllCheckbox = page.locator('#js--number-of-cart-product');

        this.selectedProducts = page.locator('.cart-checked');
        this.cartItems = page.locator('.cart-item');

        this.emptyCartText = page.locator('text=Your Cart is Empty!');
        this.cartProductName = page.locator('.product-title');
        this.cartAuthorBrand = page.locator('.author-brand');
        this.cartOriginalPrice = page.locator('.js--mrp');
        this.cartSellPrice = page.locator('.js--prc');
        this.incrementButton = (productId) => page.locator(`js--btn-plus-${productId}`);
        this.decrementButton = (productId) => page.locator(`js--btn-minus-${productId}`);
        this.productCheckbox = (productId) => page.locator(`#select-${productId}`);

        this.shippingSection = page.locator('#shipping-address-cart-page');

        this.subTotal = page.locator('#js--sub-total');
        this.onlineFee = page.locator('#js--shipping-charge');
        this.total = page.locator('#js--grand-total');
        this.payableTotal = page.locator('#js--payable-total');
        this.earnPoints = page.locator('.js--update-earn-point-cart');
        this.earnPointsIcon = page.locator('img[alt="earn points icon"]');
        this.summarySection = page.locator('h4.title', { hasText: 'Checkout Summary' });
        //this.proceedToCheckoutButton = page.getByRole('link', { name: 'অর্ডার করতে এগিয়ে যান arrow' });
        this.proceedToCheckoutButton = page.locator('#js-continue-to-shipping');
    }

    async visit() {
        await this.page.goto('/cart');
        await this.page.waitForLoadState('load');
    }

    async getPageTitle() {
        return await this.page.title();
    }   

    async getUrlPath() {
      const fullUrl = this.page.url();  // Get the full URL of the page
        const url = new URL(fullUrl);  // Parse the full URL
        // Get the path excluding query parameters and fragments
        const exactPath = url.pathname.split('/')[1] ? `/${url.pathname.split('/')[1]}` : '/';
        console.log("Cart page path: ", exactPath);
        return exactPath;
    }

    /* **************************** Cart - all products section **************************** */
    async isCartEmpty() {
        return await this.emptyCartText.isVisible();
    }

    async selectAllProduct() {
        await this.selectAllCheckbox.check();
    }

    async getDisplayedSelectedCount() {
        const countText = await this.selectAllCheckbox.innerText();
        return parseInt(countText.trim(), 10);
      }
    
      async getSelectedProductCount() {
        return await this.selectedProducts.count();
      }
    
      async deSelectAllProduct() {
        await this.selectAllCheckbox.check();
        await this.selectAllCheckbox.uncheck();
      }

    async isProductInCart(productId) {
        const productLocator = this.page.locator(`#js--cart-product-item-${productId}`);
        const isVisible = await productLocator.isVisible();
        return isVisible;
    }

    async isProductSelected(productId) {
        const productLocator = this.page.locator(`#js--cart-product-item-${productId}.cart-item.cart-checked`);
        const isSelected = await productLocator.isVisible();  
        return isSelected;
    }
    
      async selectProductById(productId) {
        const productLocator = `#js--cart-product-item-${productId} .cart-item-checkbox`;
        await this.page.locator(productLocator).click();
    }
    
    /* **************************** Cart - single product details **************************** */
      async getAllProductsInfo() {
        const products = await this.page.$$('.item');
        const productInfoList = [];
    
        for (const product of products) {
          const title = await product.locator('.product-title').textContent();
          const authorBrand = await product.locator('.author-brand').textContent();
          const originalPrice = await product.locator('.js--mrp').textContent();
          const sellPrice = await product.locator('.js--prc').textContent();
    
          productInfoList.push({
            title: title?.trim(),
            authorBrand: authorBrand?.trim(),
            originalPrice: originalPrice?.trim(),
            sellPrice: sellPrice?.trim(),
          });
        }
        return productInfoList;
      }
    
      async incrementQuantity(productId) {
        await this.incrementButton(productId).click();
      }
    
      async decrementQuantity(productId) {
        await this.decrementButton(productId).click();
      }

    /* **************************** Cart - checkout summary section **************************** */
      async getCheckoutSummaryInfo() {
        const fields = await this.checkoutSummary.locator('div').allTextContents();
        return fields.map(f => f.trim()).filter(f => f !== '');
      }

      async isShippingSectionVisible() {
        return await this.shippingSection.isVisible();
      }

      //shipping address visibility test
      async isShippingAddressVisible() {
        //first child of shipping section is the address
        const shippingAddress = await this.shippingSection.locator(':first-child').locator('.address').allTextContents();
        console.log('Shipping Address: ', shippingAddress);
        return shippingAddress.length > 0;
      }

    /* **************************** Cart - checkout summary section enddddd **************************** */  
    async clickProceedToCheckout() {
        console.log('Proceeding to checkout...');
        await this.proceedToCheckoutButton.scrollIntoViewIfNeeded();
        // Get the inline style directly and check if pointer-events is set to 'auto'
        const pointerEvents = await this.proceedToCheckoutButton.evaluate((el) => {
          return el.style.pointerEvents;
        });

        // If pointer-events is auto, click the button, otherwise log and return
        if (pointerEvents === 'auto') {
          await this.proceedToCheckoutButton.click();
          console.log('✅ Proceed to checkout button is enabled and clicked');
          await this.page.waitForLoadState('load');
        } else {
          console.log('❌ Proceed to checkout button is disabled (pointer-events: none)');
          return;
        }
        
    }
}