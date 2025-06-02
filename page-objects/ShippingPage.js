export class ShippingPage {
    constructor(page){
        this.page = page;
        this.confirmOrderButton = page.locator('#js--confirm-order');
        this.cashOnDeliveryRadioButton = page.getByRole('img', { name: 'ক্যাশ অন ডেলিভারি' });
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