import { expect, type Locator, type Page } from '@playwright/test';

const STORE_URL = 'https://sauce-demo.myshopify.com';

export class StorefrontPage {
  readonly storeHeading: Locator;
  readonly primaryNavigation: Locator;
  readonly footerNavigation: Locator;
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.storeHeading = page.getByRole('heading', { name: 'Sauce Demo', exact: true });
    this.primaryNavigation = page.getByRole('navigation').nth(1);
    this.footerNavigation = page.getByRole('contentinfo').getByRole('navigation').first();
  }

  async gotoHome(): Promise<void> {
    await this.page.goto(STORE_URL);
  }

  pageHeading(name: string): Locator {
    return this.page.getByRole('heading', { name, exact: true }).first();
  }

  async expectFeaturedProduct(name: string, price: string, handle: string): Promise<void> {
    const productLink = this.page.locator(`a[href*="/products/${handle}"]`).first();
    await expect(productLink).toBeVisible();
    await expect(productLink).toContainText(name);
    await expect(productLink).toContainText(`£${price}`);
    await expect(productLink).toHaveAttribute('href', new RegExp(`/products/${handle}`));
  }

  async openPrimaryPage(name: 'Catalog' | 'Blog' | 'About Us'): Promise<void> {
    await this.primaryNavigation.getByRole('link', { name, exact: true }).click();
  }

  async openFooterPage(name: 'Search' | 'About Us'): Promise<void> {
    await this.footerNavigation.getByRole('link', { name, exact: true }).click();
  }

  async returnHomeWithLogo(): Promise<void> {
    await this.page.getByRole('link', { name: 'Sauce Demo', exact: true }).click();
  }
}
