import { expect } from '@playwright/test';
export class ConfirmedOrderPage {
    constructor(page) {
        this.page = page;
        this.popUp = page.getByRole('link', { name: 'Common offer banner' });
        this.popUpCloseButton = page.getByRole('button', { name: 'Close' });
        this.copyOrderNumberButton = page.locator('button.js--orderId-copy-code');
        //this.orderNumber = page.locator('p:has-text("অর্ডার নম্বর")');
        this.trackOrderButton = page.getByRole('link', { name: 'Track Order' });
    }

    async getUrlPath() {
        const fullUrl = this.page.url();  // Get the full URL of the page
        const url = new URL(fullUrl);  // Parse the full URL
        // Get the path excluding query parameters and fragments
        const exactPath = url.pathname.split('/')[1] ? `/${url.pathname.split('/')[1]}` : '/';
        console.log("Confirmed order page path: ", exactPath);
        return exactPath;
    }

    async getOrderNumber() {
        if (await this.popUp.isVisible()) {
            console.log('Closing pop-up...');
            await this.popUpCloseButton.click();
        }
        await this.page.pause(3000);
        const orderNumber = await this.copyOrderNumberButton.getAttribute('data-code');
        console.log('Order Number:', orderNumber);
        return orderNumber;
    }
    async clickTrackOrder() {
        await this.trackOrderButton.scrollIntoViewIfNeeded();
        await this.trackOrderButton.click();
        await this.page.waitForLoadState('load');
    }
}