export class SignInPage {
    constructor(page) {
        this.page = page;
        this.emailField = page.getByPlaceholder('Email or phone');
        this.passwordField = page.getByPlaceholder('Password');
        this.nextButton = page.getByRole('button', { name: 'Next' });
        this.loginButton = page.getByRole('button', { name: 'Login' });

        //this.emailField = page.locator('input[name="username"]');
        //this.loginButton = page.locator('//button[@type="submit" and @class="btn btn-block"]');
      }

   

    async waitForPageLoad() {
        await this.page.waitForLoadState('load');
    }

     async visit() {
        await this.page.goto('/login');
        await this.waitForPageLoad();
    }

    async getTitle() {
        return await this.page.title();
    }

    //Login together
    async login(email, password) {
        //wait for the page to fully loaded and stop loading
        await this.page.waitForLoadState('load')
        await this.emailField.fill(email);
        await this.page.waitForTimeout(1000);
        await this.nextButton.click();
        await this.passwordField.waitFor({ state: 'visible' });
        await this.passwordField.fill(password);
        await this.loginButton.click();
    }


    //Login individually
    /*async fillEmail(email) {
        await this.emailField.fill(this.emailField, email);
    }
    async clickNext() {
        await this.nextButton.click();
    }
    async fillPassword(password) {
        await this.passwordField.fill(this.passwordField, password);
    }
    async clickLogin() {
        await this.loginButton.click();
    }*/

}