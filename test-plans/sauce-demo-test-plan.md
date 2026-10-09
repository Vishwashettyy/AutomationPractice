# Sauce Demo Storefront Test Plan

## Application Overview

Comprehensive browser coverage for https://sauce-demo.myshopify.com/ based on live exploration. Tests cover navigation, product discovery, search, product availability, shopping cart, customer accounts, content, responsive layouts, accessibility, and robustness. Checkout cases stop before personal/payment entry or order submission; registration success is gated to an approved test store and disposable identity.

## Test Scenarios

### 1. Storefront navigation and home

**Seed:** `tests/seed.spec.ts`

#### 1.1. Home page loads with identity and featured products

**File:** `tests/storefront/home-and-navigation.spec.ts`

**Steps:**
  1. Navigate to the homepage.
    - expect: Sauce Demo title/heading is visible.
    - expect: Grey jacket (£55.00), Noir jacket (£60.00), and Striped top (£50.00) appear as product cards linking to product details.

#### 1.2. Primary and footer navigation

**File:** `tests/storefront/home-and-navigation.spec.ts`

**Steps:**
  1. Visit Catalog, Blog, and About Us through the primary navigation, and Search/About Us through the footer.
    - expect: Each link reaches the corresponding page without a 404.
    - expect: Home/logo and breadcrumbs, where present, return to the expected route.

#### 1.3. Wishlist and Refer a friend entry-point smoke

**File:** `tests/storefront/home-and-navigation.spec.ts`

**Steps:**
  1. Activate Wish list and Refer a friend navigation items separately.
    - expect: Each responds without a broken navigation or uncaught failure.
    - expect: If an overlay/widget appears, it is keyboard accessible and dismissible; document actual UI rather than assuming its design.

### 2. Catalog and product detail

**Seed:** `tests/seed.spec.ts`

#### 2.1. Catalog displays product names, prices, and availability

**File:** `tests/products/catalog.spec.ts`

**Steps:**
  1. Navigate to /collections/all.
    - expect: Products heading and all product cards are visible with names/prices.
    - expect: Brown Shades (£20.00) and White sandals (£25.00) are marked Sold Out.

#### 2.2. Available product detail and option control

**File:** `tests/products/product-detail.spec.ts`

**Steps:**
  1. Open Grey jacket from the catalog and inspect its product option and Add to Cart control.
    - expect: Product title, £55.00 price, product image, and selected Grey jacket option are visible.
    - expect: Option and Add to Cart controls have usable accessible names and keyboard focus.

#### 2.3. Sold-out products cannot be purchased

**File:** `tests/products/product-detail.spec.ts`

**Steps:**
  1. Open Brown Shades and White sandals product pages.
    - expect: Each product displays its title and price.
    - expect: Sold Out control is disabled and no enabled Add to Cart control is available.

### 3. Search

**Seed:** `tests/seed.spec.ts`

#### 3.1. Search returns matching products

**File:** `tests/search/search.spec.ts`

**Steps:**
  1. Submit grey using the header Search field.
    - expect: Search Results appears and submitted query is represented.
    - expect: Grey jacket is among matching results with price and a working product link.

#### 3.2. Search with no matches

**File:** `tests/search/search.spec.ts`

**Steps:**
  1. Search for a unique unmatched term such as zzzznonexistent.
    - expect: A clear No results found message includes the query.
    - expect: No unrelated product cards are shown; other navigation remains available.

#### 3.3. Search handles whitespace and punctuation safely

**File:** `tests/search/search.spec.ts`

**Steps:**
  1. Submit leading/trailing whitespace, punctuation, and a partial product name.
    - expect: No server/application error or broken page occurs.
    - expect: Results/query display remains coherent; record observed normalization without assuming a ranking rule.

### 4. Cart and checkout handoff

**Seed:** `tests/seed.spec.ts`

#### 4.1. Add available item and verify cart total

**File:** `tests/cart/cart.spec.ts`

**Steps:**
  1. Start with an empty cart, add one Grey jacket, and open the cart.
    - expect: Header cart count becomes 1.
    - expect: Cart row shows Grey jacket, quantity 1, £55.00 unit price and £55.00 line/cart total.

#### 4.2. Update quantity and total

**File:** `tests/cart/cart.spec.ts`

**Steps:**
  1. Change Grey jacket quantity to 2 and click Update.
    - expect: Quantity and header count show 2.
    - expect: Line/cart total recalculates to £110.00.
  2. Try a nonnumeric, zero, or negative quantity and update.
    - expect: Invalid quantity is rejected or normalized safely; totals do not falsely indicate success. Record supported behavior.

#### 4.3. Remove item and return from empty cart

**File:** `tests/cart/cart.spec.ts`

**Steps:**
  1. Remove the cart line, then use Continue Shopping.
    - expect: Empty-cart message appears and header count returns to 0.
    - expect: Continue Shopping navigates to the catalog.

#### 4.4. Order note update and checkout handoff

**File:** `tests/cart/checkout-handoff.spec.ts`

**Steps:**
  1. Add an item, enter a short order note, and click Update.
    - expect: Cart contents/totals remain correct and note is retained as supported.
  2. Click Check Out with a non-empty cart; stop before entering personal/payment details or submitting an order.
    - expect: Shopify checkout handoff begins without duplicating items or unexpectedly emptying the cart.

### 5. Customer account

**Seed:** `tests/seed.spec.ts`

#### 5.1. Login form and invalid input validation

**File:** `tests/account/login.spec.ts`

**Steps:**
  1. Open /account/login and inspect fields, then submit empty values and invalid credentials.
    - expect: Customer Login, labeled Email Address and Password inputs, and Sign In are present; password characters are masked.
    - expect: Required/format/authentication errors are clear; no invalid login is reported as successful.

#### 5.2. Registration form validates invalid data

**File:** `tests/account/register.spec.ts`

**Steps:**
  1. Open /account/register and submit empty fields, malformed email, and invalid/short password values as applicable.
    - expect: First Name, Last Name, Email Address, Password, and Create controls are present.
    - expect: Invalid values produce clear validation; no account is created from invalid input.

#### 5.3. Registration with isolated test identity (gated)

**File:** `tests/account/register.spec.ts`

**Steps:**
  1. Only in an approved test environment, create an account with a unique disposable email and valid values.
    - expect: Account creation/confirmation is visible.
    - expect: Test identity can be safely isolated and removed/reused; never use a real customer's credentials.

#### 5.4. Password recovery entry point

**File:** `tests/account/login.spec.ts`

**Steps:**
  1. Activate Forgot your password? and follow any displayed recovery form without sending to a real customer.
    - expect: Recovery responds without an error.
    - expect: If an email recovery form appears, it gives safe confirmation without account enumeration.

### 6. Content pages

**Seed:** `tests/seed.spec.ts`

#### 6.1. About Us content and external link

**File:** `tests/content/content-pages.spec.ts`

**Steps:**
  1. Open /pages/about-us.
    - expect: About Us heading and store description are visible.
    - expect: Sauce link points to the expected external destination.

#### 6.2. News blog article listing

**File:** `tests/content/content-pages.spec.ts`

**Steps:**
  1. Open /blogs/news.
    - expect: News page shows First Post and its author/date metadata.
    - expect: Page loads without a broken-content state.

#### 6.3. Direct routes and breadcrumbs

**File:** `tests/content/content-pages.spec.ts`

**Steps:**
  1. Load collection, product, search, cart, account, blog, and About Us URLs directly; follow Home/breadcrumb links where present.
    - expect: Each route shows its expected content/heading and remains navigable.
    - expect: Breadcrumbs navigate to the expected parent route.

### 7. Responsive, accessibility, and robustness

**Seed:** `tests/seed.spec.ts`

#### 7.1. Responsive layout across viewports

**File:** `tests/quality/responsive.spec.ts`

**Steps:**
  1. Inspect homepage, catalog, product, cart, and account pages at desktop, tablet, and narrow mobile widths.
    - expect: Primary content and controls remain visible, readable, and operable.
    - expect: No unintended horizontal overflow, clipped essential controls, or overlapping content occurs.

#### 7.2. Keyboard navigation and focus visibility

**File:** `tests/quality/accessibility.spec.ts`

**Steps:**
  1. Navigate main flows using Tab, Shift+Tab, Enter, and Space only.
    - expect: Meaningful controls are reachable in logical order with visible focus.
    - expect: No keyboard trap prevents leaving the page or dismissing an overlay.

#### 7.3. Accessible names, headings, images, and form errors

**File:** `tests/quality/accessibility.spec.ts`

**Steps:**
  1. Inspect accessibility semantics on home, catalog, product, cart, and account forms.
    - expect: Page titles and heading hierarchy are meaningful.
    - expect: Product/payment images have useful alt text (decorative images are not redundantly announced); form inputs and validation errors are programmatically associated.

#### 7.4. Console and failed-resource smoke check

**File:** `tests/quality/robustness.spec.ts`

**Steps:**
  1. Exercise main routes and search/add-to-cart/cart-update/remove while collecting console errors and failed first-party requests.
    - expect: No new uncaught application errors or failed first-party requests occur in the tested flow.
    - expect: Third-party/theme errors are recorded separately rather than suppressed.
