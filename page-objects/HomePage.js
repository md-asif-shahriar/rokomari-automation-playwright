export class HomePage {
  constructor(page) {
    this.page = page;
    this.overlay = page.locator('class="modal_overlay__4UXSq"');
    this.popUp = page.getByAltText('popup notification offer image');
    this.signInButton = page.locator('.navigation_SignIn__DAz0b').first();
    this.username = page.locator('.navigation_userContainer__FW8TZ span');
    //this.searchField = page.getByRole('input', { id: 'desktop_search_field' });
    this.searchField = page.getByPlaceholder('Search by');
    this.totalCartItem = page.locator('#js--cart-quantity');
  }

  async waitForPageLoad() {
        await this.page.waitForLoadState('load');
    }

  async visit() {
    console.log('Visiting Rokomari homepage...');
    await this.page.goto('/');
    await this.waitForPageLoad();
  }

  async getTitle() {
      return await this.page.title();
  }

  async gotoLogin() {
    try {
      await this.page.locator('.modal_modal__RCZrz > .absolute').click();
      await this.signInButton.click();
    } catch (error) {
      console.log("Using direct URL to login....");
      await this.page.goto('/login');
    }
    
  }

  async getUserName() {
        await this.username.waitFor({ state: 'visible' });
        const fullText =  await this.username.innerText();
        return await fullText.split(',')[1].trim();
    }

    async search(keyword) {
        await this.searchField.waitFor();
        await this.searchField.fill(keyword);
        await this.searchField.press('Enter');
        await this.page.waitForTimeout(3000);
    }

  async closePopUp() {
    try {
      await page.evaluate(() => {
        document.querySelector('.modal_overlay__4UXSq')?.remove();
    });
      
    } catch (error) {
      console.log('No pop-up detected or failed to close:', error.message);
      
    }
    
  }
}