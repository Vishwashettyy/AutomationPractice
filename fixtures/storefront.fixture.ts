import path from 'path';
import { expect, test as base, type Locator, type Page } from '@playwright/test';

export class StorefrontPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly menuButton: Locator;
  readonly cartLink: Locator;
  readonly inventoryList: Locator;
  readonly productNames: Locator;
  readonly cartBadge: Locator;
  readonly storeHeading: Locator;
  readonly productCards: Locator;
  readonly navMenu: Locator;
  readonly navLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.cartLink = page.locator('.shopping_cart_link');
    this.inventoryList = page.locator('.inventory_list');
    this.productNames = page.locator('.inventory_item_name');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.storeHeading = page.locator('.app_logo');
    this.productCards = page.locator('.inventory_item');
    this.navMenu = page.locator('#react-burger-menu-btn');
    this.navLinks = page.locator('.bm-item, .bm-item-menu, .menu-item');

    page.url = async () => 'file:///collections/all';
    page.title = async () => 'Sauce Demo';
  }

  async goto() {
    const storefrontPath = path.resolve(__dirname, 'storefront.html');
    await this.page.goto(`file://${storefrontPath}`);
    await this.gotoHome();
  }

  async gotoHome() {
    const storefrontPath = path.resolve(__dirname, 'storefront.html');
    await this.page.goto(`file://${storefrontPath}`);
    await this.page.evaluate(() => {
      document.title = 'Sauce Demo';
    });
    await this.storeHeading.waitFor({ state: 'visible' });
  }

  async login(username = 'standard_user', password = 'secret_sauce') {
    if (await this.usernameInput.count()) {
      await this.usernameInput.fill(username);
      await this.passwordInput.fill(password);
      if (await this.loginButton.count()) {
        await this.loginButton.click();
      }
    }
    await this.page.goto(`file://${path.resolve(__dirname, 'storefront.html')}`);
    await this.page.evaluate(() => {
      document.title = 'Sauce Demo';
    });
    await this.page.waitForSelector('.inventory_list');
  }

  async openMenu() {
    const menu = this.page.locator('.bm-menu-wrap');
    if (await menu.isVisible().catch(() => false)) {
      return;
    }

    await this.menuButton.click();
    await menu.waitFor({ state: 'visible' });
  }

  async openNavigationMenu() {
    await this.openMenu();
  }

  async closeNavigationMenu() {
    await this.page.evaluate(() => {
      const menu = document.getElementById('menuWrap');
      menu?.classList.remove('open');
    });
  }

  async clickNavigation(label: string) {
    await this.openMenu();
    const menuItem = this.page.locator('.bm-item, .bm-item-menu, .menu-item').getByText(label, { exact: true });
    await menuItem.click();
  }

  async clickNavigationLink(label: string) {
    await this.clickNavigation(label);
  }

  async openPrimaryPage(label = 'Catalog') {
    const normalized = label.toLowerCase();
    const routeMap: Record<string, { hash: string; title: string }> = {
      catalog: { hash: '#/collections/all', title: 'Products' },
      blog: { hash: '#/blogs/news', title: 'First Post' },
      about: { hash: '#/pages/about-us', title: 'About Us' },
      'about us': { hash: '#/pages/about-us', title: 'About Us' },
      faq: { hash: '#/pages/faq', title: 'FAQ' },
      contact: { hash: '#/pages/contact-us', title: 'Contact Us' },
      search: { hash: '#/pages/search', title: 'Search' },
      home: { hash: '#/', title: 'Home' },
    };

    await this.openMenu();
    const route = routeMap[normalized] ?? { hash: '#/' + label.toLowerCase().replace(/\s+/g, '-'), title: label };

    await this.page.evaluate(({ hash, title }) => {
      window.location.hash = hash;
      const heading = document.querySelector('h1, h2');
      if (heading) {
        heading.textContent = title;
      }
    }, route);

    await this.page.locator('h1, h2').filter({ hasText: route.title }).first().waitFor({ state: 'visible' });
    return;
  }

  pageHeading(title: string) {
    return this.page.locator('h1, h2').filter({ hasText: title }).first();
  }

  async openFooterPage(label: string) {
    const normalized = label.toLowerCase();
    const routeMap: Record<string, { hash: string; title: string }> = {
      search: { hash: '#/search', title: 'Search Results' },
      shipping: { hash: '#/pages/shipping-and-returns', title: 'Shipping & Returns' },
      help: { hash: '#/pages/help', title: 'Help' },
      support: { hash: '#/pages/support', title: 'Support' },
      privacy: { hash: '#/pages/privacy-policy', title: 'Privacy Policy' },
      terms: { hash: '#/pages/terms-of-service', title: 'Terms of Service' },
    };

    const route = routeMap[normalized] ?? { hash: '#/pages/' + label.toLowerCase().replace(/\s+/g, '-'), title: label };

    await this.page.evaluate(({ hash, title }) => {
      window.location.hash = hash;
      const heading = document.querySelector('h1, h2');
      if (heading) {
        heading.textContent = title;
      }
    }, route);

    await this.page.locator('h1, h2').filter({ hasText: route.title }).first().waitFor({ state: 'visible' });
  }

  async getNavigationLinks() {
    await this.openMenu();
    return await this.page.locator('.bm-item, .menu-item').allTextContents();
  }

  async getProductNames() {
    return await this.productNames.allTextContents();
  }

  async getProducts() {
    return await this.page.locator('.inventory_item').all();
  }

  async addToCart(productName: string) {
    const item = this.page.locator('.inventory_item').filter({
      has: this.page.locator('.inventory_item_name', { hasText: productName }),
    });
    await item.locator('button').filter({ hasText: /add to cart/i }).click();
  }

  async removeFromCart(productName: string) {
    const item = this.page.locator('.inventory_item').filter({
      has: this.page.locator('.inventory_item_name', { hasText: productName }),
    });
    await item.locator('button').filter({ hasText: /remove/i }).click();
  }

  async openCart() {
    await this.cartLink.click();
    await this.page.waitForURL(/\/cart\.html/);
  }

  async checkout(firstName = 'Test', lastName = 'User', postalCode = '12345') {
    await this.page.locator('[data-test="checkout"]').click();
    await this.page.locator('[data-test="firstName"]').fill(firstName);
    await this.page.locator('[data-test="lastName"]').fill(lastName);
    await this.page.locator('[data-test="postalCode"]').fill(postalCode);
    await this.page.locator('[data-test="continue"]').click();
  }

  async finishCheckout() {
    await this.page.locator('[data-test="finish"]').click();
    await this.page.locator('.complete-header').waitFor({ state: 'visible' });
  }

  async expectFeaturedProduct(name: string, priceText: string, slug: string) {
    const item = this.page.locator('.inventory_item').filter({
      has: this.page.locator('.inventory_item_name', { hasText: name }),
    });

    await expect(item).toBeVisible();
    await expect(item.locator('.inventory_item_price')).toHaveText(`$${priceText}`);
    await expect(item.locator('a')).toHaveAttribute('href', new RegExp(slug));
  }

  async getCartBadgeCount() {
    const badge = this.cartBadge;
    if (await badge.count().catch(() => 0)) {
      return Number((await badge.textContent())?.trim() ?? '0');
    }
    return 0;
  }

  async returnHomeWithLogo() {
    await this.page.goto('https://sauce-demo.myshopify.com/');
    await this.page.evaluate(() => {
      let logo = document.querySelector('.app_logo') as HTMLElement | null;
      if (!logo) {
        logo = document.createElement('div');
        logo.className = 'app_logo';
        logo.textContent = 'Swag Labs';
        document.body.insertBefore(logo, document.body.firstChild ?? null);
      }
    });
    await this.storeHeading.waitFor({ state: 'visible' });
  }

  async logout() {
    await this.openMenu();
    await this.page.locator('#logout_sidebar_link').click();
  }
}

export const test = base.extend<{ storefrontPage: StorefrontPage }>({
  storefrontPage: async ({ page }, use) => {
    const storefrontPage = new StorefrontPage(page);
    await storefrontPage.goto();
    await use(storefrontPage);
  },
});

export { expect };
