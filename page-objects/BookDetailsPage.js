import { expect } from '@playwright/test';
export class BookDetailsPage {
    constructor(page) {
        this.page = page;
        this.bookTitle = page.locator('.detailsBookContainer_bookName__pLCtW');
        this.bookCoverImage = page.locator('.lookInside_bookImage__a4vPG');
        this.authorLink = page.locator('.detailsBookContainer_authorName__ZP0vX');
        this.categoryLink = page.locator('.detailsBookContainer_category___lQrb');
        this.originalPrice = page.locator('.original-price');
        this.sellPrice = page.locator('.sell-price');
        this.savingPrice = page.locator('.priceDetails_discountPrice__RyD3K');  
        this.ratingStars = page.locator('#ts--desktop-rating svg');
        this.reviewCount = page.locator('.detailsBookContainer_detailsContentRating__pBLi4 span >> text=/\\d+ Reviews/');
        this.summary = page.locator('.shortSummery_summeryText__vQDg2 p');
        this.readMoreButton = page.getByRole('button', { name: 'Read More' });
        this.bookShelfStatus = page.locator('#ts--mobile-button');
        //this.ektuPoreDekhun = page.locator('#ts--desktop-button');
        //this.addToCartButton = page.locator("//div[@class='col-span-2']//button[@id='ts--desktop-button']");
        this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
        this.goToCartButton = page.getByRole('button', { name: 'Go to cart ->' });

        this.addToCartButtonText = page.locator('#js--add-to-cart-button').first();
        this.addToCartButton2 = page.locator('#ts--desktop-button').first();

        this.wishlistButton = page.locator('button:has-text("পছন্দের তালিকায় রাখুন")');
        this.shareButton = page.locator('button:has-text("বন্ধুদের সাথে শেয়ার করুন")');

        this.relatedProductSection = page.locator('.verticalCarouse_rightContainer__L3WMc');
        this.relatedProductTitle = this.relatedProductSection.locator('.verticalCarouse_title__mqMvL');
        this.relatedProductItems = this.relatedProductSection.locator('.verticalCarouse_slide__dRJWM');
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('load');
    }

    async visit(bookId) {
        await this.page.goto(`/book/${bookId}`);
        await this.waitForPageLoad();
    }

    

    async getTitle() {
        return await this.page.title();
    }

    async getTest() {
        console.log('Test function called');
        console.log(await this.bookTitle.innerText());
        console.log(await this.authorLink.innerText());
        console.log(await this.categoryName?.innerText());
        console.log(await this.originalPrice.innerText());
        console.log(await this.sellPrice.innerText());
        console.log(await this.savingPrice.innerText());
        console.log(await this.bookShelfStatus.innerText());
        console.log(await this.relatedProductItems.count());
        console.log(await this.relatedProductTitle.innerText());
        console.log(await this.relatedProductSection.isVisible());
        console.log(await this.relatedProductItems.first().innerText());
        //console.log(await this.ektuPoreDekhun.innerText());
    }

    /******************************* Product Info Begin ********************************/

    async getBookTitle() {
        return await this.bookTitle?.innerText();
    }
    async getAuthorName() {
        return await this.authorLink?.innerText();
    }
    async getCategoryName() {
        return await this.categoryLink?.innerText();
    }
    async isBookImageVisible() {
        return await this.bookImage.isVisible();
    }
    async getBookImageSrc() {
        return await this.bookImage.getAttribute('src');
    }
    async getBookImageDimensions() {
        const box = await this.bookImage.boundingBox();
        return {
            width: box?.width || 0,
            height: box?.height || 0
        }; 
    }
    async getRatingCount() {
        const ratingCountText = await this.ratingStars.innerText();
        return parseFloat(ratingCountText.replace(/[^0-9.]/g, ''));
    }
    async getOriginalPrice(){

        return (await this.originalPrice.innerText() ? await this.originalPrice.innerText() : await this.sellPrice.innerText());
    }
    async getSellPrice(){
        return await this.sellPrice?.innerText();
    }
    async getSavingPrice(){
        return (await this.savingPrice.innerText() ? await this.savingPrice.innerText() : '0');
    }
    /************************************** */
    async getAddToCartButtonText() {
        return await this.addToCartButtonText.innerText();
    }
    // async getAddToCartButtonText() {
    //     return await this.addToCartButton.innerText();
    // }
    // async getGoToCartButtonText() {
    //     return await this.goToCartButton.innerText();
    // }
    async clickAddToCart() {
        console.log('Adding to cart...');
        await expect(this.addToCartButton).toBeVisible();
        await this.addToCartButton.scrollIntoViewIfNeeded();
        await this.addToCartButton.click();
        await this.page.waitForTimeout(3000);
        //await expect(this.addToCartButtonText).toHaveText('Go to Cart ->', { timeout: 3000 });
    }
    async goToCart(){
        console.log('Go to cart page...');
        await this.goToCartButton.click();
        await this.page.waitForURL(/cart/);
    }
    /******************************* Product Info End ********************************/

    async getRelatedProductsInfo() {
        const isSectionVisible =  await this.relatedProductSection.isVisible();
        const title = await this.relatedProductTitle.innerText();
        const itemsCount = await this.relatedProductItems.count();
        return {
            isSectionVisible,
            title,
            itemsCount,
        };
    }

    
}