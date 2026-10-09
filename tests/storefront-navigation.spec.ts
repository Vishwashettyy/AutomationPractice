import { test, expect } from '../fixtures/storefront.fixture';

test.describe('Storefront navigation and home', () => {
  test('Home page, product cards, and navigation links', async ({ storefrontPage }) => {
    // Navigate to the storefront homepage.
    await storefrontPage.gotoHome();

    // Verify the store identity and homepage title.
    await expect(storefrontPage.storeHeading).toBeVisible();
    await expect(storefrontPage.page).toHaveTitle('Sauce Demo');

    // Verify the featured products, prices, and product detail destinations.
    await storefrontPage.expectFeaturedProduct('Grey jacket', '55.00', 'grey-jacket');
    await storefrontPage.expectFeaturedProduct('Noir jacket', '60.00', 'noir-jacket');
    await storefrontPage.expectFeaturedProduct('Striped top', '50.00', 'striped-top');

    // Navigate to Catalog through the primary navigation.
    await storefrontPage.openPrimaryPage('Catalog');
    await expect(storefrontPage.pageHeading('Products')).toBeVisible();
    await expect(storefrontPage.page).toHaveURL(/\/collections\/all$/);

    // Navigate to Blog through the primary navigation.
    await storefrontPage.openPrimaryPage('Blog');
    await expect(storefrontPage.pageHeading('First Post')).toBeVisible();
    await expect(storefrontPage.page).toHaveURL(/\/blogs\/news$/);

    // Navigate to About Us through the primary navigation.
    await storefrontPage.openPrimaryPage('About Us');
    await expect(storefrontPage.pageHeading('About Us')).toBeVisible();
    await expect(storefrontPage.page).toHaveURL(/\/pages\/about-us$/);

    // Open Search from the footer.
    await storefrontPage.openFooterPage('Search');
    await expect(storefrontPage.pageHeading('Search Results')).toBeVisible();
    await expect(storefrontPage.page.getByText('No search performed.', { exact: false })).toBeVisible();
    await expect(storefrontPage.page).toHaveURL(/\/search$/);

    // Open About Us from the footer.
    await storefrontPage.openFooterPage('About Us');
    await expect(storefrontPage.pageHeading('About Us')).toBeVisible();

    // Return to the homepage using the store logo.
    await storefrontPage.returnHomeWithLogo();
    await expect(storefrontPage.storeHeading).toBeVisible();
    await expect(storefrontPage.page).toHaveURL('https://sauce-demo.myshopify.com/');
  });
});
