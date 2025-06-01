export class SearchResultPage {
    constructor(page) {
      this.page = page;
      this.productList = page.locator('.books-wrapper__item');
      this.productTitle = page.locator('.book-title');
      
    }

    async getTitle() {
        return await this.page.title();
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('load');
    }

    async isProductFound(expectedTitle) {
        try {
            await this.productList.first().waitFor({ state: 'visible' });
            const productCount = await this.productList.count();
            console.log(`✅ Total ${productCount} product found in search result.`);
            //await this.page.pause();
            if (productCount === 0) {
                return { found: false, product: null };
            }
            // const productTitles = await this.productTitle.allTextContents();
            // console.log(productTitles);
            // console.log(expectedTitle);
            // if(productTitles.includes(expectedTitle)) {
            //     console.log('Found');
            //     found = true;
            // }
            for (let i = 0; i < productCount; i++) {
                const product = this.productList.nth(i); // Get product at index i
                const titleElement = await product.locator(this.productTitle);
                const titleText = await titleElement.textContent();
        
                if (titleText === expectedTitle) {
                    console.log(`✅ Found product: "${titleText}" at index ${i}`);
                    return { found: true, product: product };
                    // Click on the product to go to the details page
                    console.log("product "+ product);
                    await product.click();
                    await this.page.pause();
                    return true;
                }
            }
            return { found: false, product: null };
        } catch (error) {
            console.log('No product found:', error.message);
            return { found: false, product: null };
        }
    }
    async goToProductDetails() {
        await this.page.goto("https://www.rokomari.com/book/195175/bela-furabar-age");
        await this.page.waitForTimeout(3000);
    }
}