import { test, expect } from '@playwright/test';
import { WineryUrlScraper, WineryScrapedData } from './url-scraper';

/**
 * URL Scraper Tests
 *
 * These tests demonstrate how to use the URL scraper to extract wine data
 * from winery websites. You can run these tests to scrape data and use it
 * to populate your wine database.
 *
 * Usage:
 *   npx playwright test e2e/scraper.spec.ts
 *
 * To scrape a specific winery:
 *   1. Update the URL in the test below
 *   2. Run: npx playwright test e2e/scraper.spec.ts --grep "scrape winery"
 *   3. Check the console output for extracted data
 */

test.describe('URL Scraper', () => {
  test('should scrape page metadata from a URL', async ({ page }) => {
    const scraper = new WineryUrlScraper(page);

    // Example: Scrape metadata from a winery website
    // Replace with actual winery URLs you want to scrape
    // const testUrl = 'https://rocowinery.com/';
    const testUrl = 'https://rocowinery.com/';
    

    const metadata = await scraper.scrapePageMetadata(testUrl);

    console.log('\n--- Page Metadata ---');
    console.log('Title:', metadata.title);
    console.log('Description:', metadata.description);
    console.log('OG Image:', metadata.ogImage);
    console.log('Image count:', metadata.allImages.length);
    console.log('Link count:', metadata.links.length);

    // Basic assertions
    expect(metadata.title).toBeTruthy();
  });

  test('should scrape winery data', async ({ page }) => {
    const scraper = new WineryUrlScraper(page);

    // Example winery URL - replace with actual winery you want to scrape
    const wineryUrl = 'https://rocowinery.com/';

    const result = await scraper.scrapeWineryData(wineryUrl);

    console.log('\n--- Winery Data ---');
    console.log('Success:', result.success);
    if (result.success && result.data) {
      console.log('Winery Name:', result.data.wineryName);
      console.log('Address:', result.data.wineryAddress);
      console.log('City:', result.data.wineryCity);
      console.log('State:', result.data.wineryState);
      console.log('Image URL:', result.data.imageUrl);
      console.log('Description:', result.data.description?.substring(0, 200) + '...');
    } else {
      console.log('Error:', result.error);
    }

    expect(result.success).toBe(true);
  });

  test('should scrape wine product page', async ({ page }) => {
    const scraper = new WineryUrlScraper(page);

    // Example wine product page URL - replace with actual product page
    //const productUrl = 'https://shop.sokolblosser.com/product/2021-old-vineyard-block-estate-pinot-noir'
    // const productUrl = ''
    //const productUrl = 'https://shop.rocowinery.com/product/2021-Private-Stash--Pinot-Noir?pageID=2D12A3B7-BC5A-7065-F429-EF15B7142FD7&sortBy=DisplayOrder&maxRows=10&&productListName=Pinot%20Noir&position=3';
    //const productUrl = 'https://www.flaneurwines.com/product/2021-extra-brut-sparkling-wine'

    const result = await scraper.scrapeWineProductPage(productUrl);

    console.log('\n--- Wine Product Data ---');
    console.log('Success:', result.success);
    if (result.success && result.data) {
      console.log('Wine Name:', result.data.wineName);
      console.log('Varietal:', result.data.varietal);
      console.log('Year:', result.data.year);
      console.log('Price:', result.data.estimatedPrice);
      console.log('Image URL:', result.data.imageUrl);
      console.log('Description:', result.data.description?.substring(0, 200) + '...');
    } else {
      console.log('Error:', result.error);
    }
  });

  test('batch scrape multiple wineries', async ({ page }) => {
    const scraper = new WineryUrlScraper(page);

    // Add winery URLs you want to scrape
    const wineryUrls = [
      'https://teutonicwines.com/',
      'https://www.granvillewines.com/',
      'https://elkcove.com/',
      'https://www.coopermountainwine.com/',
      'https://dauntlesswine.co/',
      'https://www.ponzivineyards.com/',
      'https://www.davidhillwinery.com/',
      'https://vanduzervineyards.com/',
      'https://sokolblosser.com/',
      'https://www.reustlevineyards.com/',
      'https://www.bigtablefarm.com/',
      'https://www.sasswinery.com/',
      'https://www.adelsheim.com/',
      'https://www.archerysummit.com/',
      'https://bergstromwines.com/',
      'https://atthejoy.com/aubaine/',
      'https://www.chehalemwines.com/',
      'https://cristomvineyards.com/',
      'https://domainedrouhin.com/',
      'https://www.abundanciavineyardsllc.com/',
      'https://www.flaneurwines.com/'
      // Add more URLs here
    ];

    const results: { url: string; data: WineryScrapedData | undefined }[] = [];

    for (const url of wineryUrls) {
      console.log(`\nScraping: ${url}`);
      const result = await scraper.scrapeWineryData(url);

      if (result.success && result.data) {
        results.push({ url, data: result.data });
        console.log('✓ Success:', result.data.wineryName);
      } else {
        console.log('✗ Failed:', result.error);
      }
    }

    console.log('\n--- Summary ---');
    console.log(`Successfully scraped ${results.length}/${wineryUrls.length} wineries`);
    console.log('\nJSON output:');
    console.log(JSON.stringify(results, null, 2));
  });
});

/**
 * Helper test to scrape a specific URL provided via command line
 *
 * Usage: SCRAPE_URL="https://example-winery.com" npx playwright test e2e/scraper.spec.ts --grep "custom URL"
 */
test.skip('scrape custom URL from environment', async ({ page }) => {
  const url = process.env['SCRAPE_URL'];

  if (!url) {
    console.log('No SCRAPE_URL environment variable set. Skipping...');
    test.skip();
    return;
  }

  const scraper = new WineryUrlScraper(page);
  const result = await scraper.scrapeWineryData(url);

  console.log('\n--- Custom URL Scrape Result ---');
  console.log('URL:', url);
  console.log('Success:', result.success);

  if (result.success && result.data) {
    console.log('\nExtracted Data:');
    console.log(JSON.stringify(result.data, null, 2));
  } else {
    console.log('Error:', result.error);
  }

  expect(result.success).toBe(true);
});
