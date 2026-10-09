import { test as base, expect } from '@playwright/test';
import { StorefrontPage } from './storefront.page';

export const test = base.extend<{ storefrontPage: StorefrontPage }>({
  storefrontPage: async ({ page }, use) => {
    await use(new StorefrontPage(page));
  },
});

export { expect };
