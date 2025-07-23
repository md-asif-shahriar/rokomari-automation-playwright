import { expect } from '@playwright/test';
export class ShippingPage {
    constructor(page){
        this.page = page;
        this.confirmOrderButton = page.locator('#js--confirm-order');
        this.cashOnDeliveryRadioButton = page.getByRole('img', { name: 'ক্যাশ অন ডেলিভারি' });
    }

    async getUrlPath() {
        const fullUrl = this.page.url();  // Get the full URL of the page
        const url = new URL(fullUrl);  // Parse the full URL
        // Get the path excluding query parameters and fragments
        const exactPath = url.pathname.split('/')[1] ? `/${url.pathname.split('/')[1]}` : '/';
        console.log("Shipping page path: ", exactPath);
        return exactPath;
    }

    async clickProceedToCheckout() {
        console.log('Proceeding to checkout...');
    }

    async selectCashOnDelivery() {
        await this.cashOnDeliveryRadioButton.scrollIntoViewIfNeeded();
        await this.cashOnDeliveryRadioButton.click();
    }

    async clickConfirmOrder() {
        await this.confirmOrderButton.scrollIntoViewIfNeeded();
        await this.confirmOrderButton.click();
        console.log('✅ Confirm order button is clicked');
        await this.page.waitForLoadState('load');
    }
}