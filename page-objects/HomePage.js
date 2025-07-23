import { expect } from '@playwright/test';
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

    this.topMenuLinks = page.locator('#ts--desktop-menu > .menu_menuContainer__9GaZV');
    this.topMenuLink = page.locator('#ts--desktop-menu > li');
    this.topMenuLink1 = page.locator('#ts--desktop-menu > li:nth-child(1)');
    this.topMenuLink2 = page.locator('#ts--desktop-menu > li:nth-child(2)');
  }
  async visit() {
    console.log('Visiting Rokomari homepage...');
    await this.page.goto('/');
    await this.page.waitForLoadState('load');
  }

  async getTitle() {
      return await this.page.title();
  }

  async getUrlPath() {
    //await expect.soft(this.page).toHaveURL('/');
    const fullUrl = this.page.url();  // Get the full URL of the page
    const url = new URL(fullUrl);  // Parse the full URL
    // Get the path excluding query parameters and fragments
    const exactPath = url.pathname.split('/')[1] ? `/${url.pathname.split('/')[1]}` : '/';
    console.log("Homepage path: ", exactPath);
    return exactPath;
  }

  async gotoLogin() {
    try {
      //await this.page.locator('.modal_modal__RCZrz > .absolute').click();
      await this.signInButton.click();
      await this.page.waitForLoadState('load')
    } catch (error) {
      console.log("Using direct URL to login....");
      await this.page.goto('/login');
      await this.page.waitForLoadState('load')
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
        await this.page.waitForLoadState('load');
    }

    async topMenuLinkChecking(){
      await this.topMenuLinks.waitFor({ state: 'visible' });
      console.log(await this.topMenuLinks.isVisible());
      const links = await this.topMenuLinks.locator('a');
      const linkCount = await links.count();
      console.log('Number of <a> tags inside topMenuLinks: ', linkCount);
      for (let i = 0; i < 3; i++) {
        const span = await links.nth(i).locator('span');
        const text = await span.innerText();
        console.log(`Link ${i + 1}: ${text}`);

        const href = await links.nth(i).getAttribute('href');
        if (href) {
          let menuLink = `https://www.rokomari.com${href}`;
          console.log(`${text} href: ${menuLink}`);
          const response = await this.page.goto(menuLink);
          console.log(`Response status for ${text}: ${response.status()}`);
          
        } else {
          console.log(`${text} does not have an href attribute`);
        }
      }
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