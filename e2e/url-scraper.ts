import { Page } from '@playwright/test';

export interface WineryScrapedData {
  wineryName?: string;
  wineName?: string;
  varietal?: string;
  year?: number;
  estimatedPrice?: number;
  wineryAddress?: string;
  wineryCity?: string;
  wineryState?: string;
  ava?: string;
  wineryUrl: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  description?: string;
}

export interface ScraperResult {
  success: boolean;
  data?: WineryScrapedData;
  error?: string;
}

/**
 * URL Scraper utility for extracting wine and winery data from websites.
 * This can be used to help populate the wine database with data from winery websites.
 */
export class WineryUrlScraper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Scrape basic page metadata from any URL
   */
  async scrapePageMetadata(url: string): Promise<{
    title?: string;
    description?: string;
    ogImage?: string;
    allImages: string[];
    links: string[];
  }> {
    await this.page.goto(url, { waitUntil: 'networkidle' });

    const title = await this.page.title();

    const description = await this.page.$eval(
      'meta[name="description"]',
      (el) => el.getAttribute('content')
    ).catch(() => undefined);

    const ogImage = await this.page.$eval(
      'meta[property="og:image"]',
      (el) => el.getAttribute('content')
    ).catch(() => undefined);

    const allImages = await this.page.$$eval('img', (imgs) =>
      imgs
        .map((img) => img.src)
        .filter((src) => src && !src.startsWith('data:'))
    );

    const links = await this.page.$$eval('a[href]', (anchors) =>
      anchors
        .map((a) => a.href)
        .filter((href) => href && href.startsWith('http'))
    );

    return {
      title,
      description,
      ogImage,
      allImages: [...new Set(allImages)],
      links: [...new Set(links)],
    };
  }

  /**
   * Attempt to extract wine/winery data from a winery website
   */
  async scrapeWineryData(url: string): Promise<ScraperResult> {
    try {
      await this.page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });

      const pageContent = await this.page.content();
      const title = await this.page.title();

      // Try to extract winery name from common patterns
      const wineryName = await this.extractWineryName(title);

      // Try to find address information
      const addressInfo = await this.extractAddress();

      // Try to find wine images
      const images = await this.findWineImages();

      // Try to extract description
      const description = await this.extractDescription();

      return {
        success: true,
        data: {
          wineryName,
          wineryUrl: url,
          wineryAddress: addressInfo.address,
          wineryCity: addressInfo.city,
          wineryState: addressInfo.state,
          imageUrl: images[0],
          thumbnailUrl: images[0],
          description,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Scrape a specific wine product page
   */
  async scrapeWineProductPage(url: string): Promise<ScraperResult> {
    try {
      await this.page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

      // Look for common wine product page patterns
      const title = await this.page.title();

      // Try to find price
      const price = await this.extractPrice();

      // Try to find year/vintage
      const year = await this.extractYear();

      // Try to find varietal
      const varietal = await this.extractVarietal();

      // Try to find wine name
      const wineName = await this.extractWineName();

      // Try to find images
      const images = await this.findWineImages();

      // Try to extract description
      const description = await this.extractDescription();

      return {
        success: true,
        data: {
          wineName,
          varietal,
          year,
          estimatedPrice: price,
          wineryUrl: url,
          imageUrl: images[0],
          thumbnailUrl: images[0],
          description,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async extractWineryName(title: string): Promise<string | undefined> {
    // Clean up common title patterns
    const cleanedTitle = title
      .replace(/\s*[-|–]\s*.*(Home|Wine|Winery|Vineyards?).*$/i, '')
      .replace(/\s*[-|–]\s*$/,'')
      .trim();

    if (cleanedTitle.length > 0 && cleanedTitle.length < 100) {
      return cleanedTitle;
    }

    // Try to find h1 or logo text
    const h1 = await this.page.$eval('h1', (el) => el.textContent?.trim()).catch(() => undefined);
    if (h1 && h1.length < 100) {
      return h1;
    }

    return undefined;
  }

  private async extractAddress(): Promise<{ address?: string; city?: string; state?: string }> {
    // Common selectors for address information
    const addressSelectors = [
      '[itemprop="address"]',
      '.address',
      '.location',
      '[class*="address"]',
      'address',
    ];

    for (const selector of addressSelectors) {
      try {
        const text = await this.page.$eval(selector, (el) => el.textContent?.trim());
        if (text) {
          return this.parseAddressText(text);
        }
      } catch {
        continue;
      }
    }

    // Try to find address in page content using regex
    const content = await this.page.content();
    const addressMatch = content.match(/(\d+[^,]+),\s*([A-Za-z\s]+),\s*([A-Z]{2})\s*(\d{5})?/);
    if (addressMatch) {
      return {
        address: addressMatch[1]?.trim(),
        city: addressMatch[2]?.trim(),
        state: addressMatch[3]?.trim(),
      };
    }

    return {};
  }

  private parseAddressText(text: string): { address?: string; city?: string; state?: string } {
    // Try to parse address like "123 Main St, City, ST 12345"
    const parts = text.split(/,\s*/);
    if (parts.length >= 2) {
      const stateZipMatch = parts[parts.length - 1]?.match(/([A-Z]{2})\s*(\d{5})?/);
      return {
        address: parts[0]?.trim(),
        city: parts.length > 2 ? parts[1]?.trim() : undefined,
        state: stateZipMatch?.[1],
      };
    }
    return {};
  }

  private async findWineImages(): Promise<string[]> {
    // Look for product images with common patterns
    const selectors = [
      'img[class*="product"]',
      'img[class*="wine"]',
      'img[class*="bottle"]',
      '.product-image img',
      '.wine-image img',
      '[class*="gallery"] img',
      'main img',
    ];

    const images: string[] = [];

    for (const selector of selectors) {
      try {
        const srcs = await this.page.$$eval(selector, (imgs) =>
          imgs
            .map((img) => img.src)
            .filter((src) => src && !src.startsWith('data:') && !src.includes('icon') && !src.includes('logo'))
        );
        images.push(...srcs);
      } catch {
        continue;
      }
    }

    // Deduplicate and filter
    return [...new Set(images)].filter((url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    });
  }

  private async extractPrice(): Promise<number | undefined> {
    // Common price selectors
    const priceSelectors = [
      '[class*="price"]',
      '[itemprop="price"]',
      '.product-price',
      '[data-price]',
    ];

    for (const selector of priceSelectors) {
      try {
        const text = await this.page.$eval(selector, (el) => el.textContent?.trim());
        if (text) {
          const match = text.match(/\$?([\d,]+(?:\.\d{2})?)/);
          if (match) {
            return parseFloat(match[1].replace(',', ''));
          }
        }
      } catch {
        continue;
      }
    }

    return undefined;
  }

  private async extractYear(): Promise<number | undefined> {
    // Look for vintage/year patterns
    const content = await this.page.content();

    // Match 4-digit years between 1900 and current year
    const currentYear = new Date().getFullYear();
    const yearMatch = content.match(/(19|20)\d{2}/g);

    if (yearMatch) {
      // Find the most likely vintage year (usually 1-10 years old)
      const validYears = yearMatch
        .map((y) => parseInt(y))
        .filter((y) => y >= 1980 && y <= currentYear);

      if (validYears.length > 0) {
        // Return the most common or most recent reasonable vintage
        return validYears.sort((a, b) => b - a)[0];
      }
    }

    return undefined;
  }

  private async extractVarietal(): Promise<string | undefined> {
    const commonVarietals = [
      'Cabernet Sauvignon', 'Pinot Noir', 'Merlot', 'Chardonnay',
      'Sauvignon Blanc', 'Syrah', 'Shiraz', 'Zinfandel', 'Pinot Grigio',
      'Riesling', 'Malbec', 'Tempranillo', 'Sangiovese', 'Grenache',
      'Viognier', 'Gewürztraminer', 'Chenin Blanc', 'Moscato',
      'Cabernet Franc', 'Petit Verdot', 'Albariño', 'Grüner Veltliner'
    ];

    const content = await this.page.textContent('body') || '';

    for (const varietal of commonVarietals) {
      if (content.toLowerCase().includes(varietal.toLowerCase())) {
        return varietal;
      }
    }

    return undefined;
  }

  private async extractWineName(): Promise<string | undefined> {
    // Common product name selectors
    const selectors = [
      'h1[class*="product"]',
      'h1[class*="title"]',
      '.product-name',
      '.wine-name',
      '[itemprop="name"]',
      'h1',
    ];

    for (const selector of selectors) {
      try {
        const text = await this.page.$eval(selector, (el) => el.textContent?.trim());
        if (text && text.length > 0 && text.length < 200) {
          return text;
        }
      } catch {
        continue;
      }
    }

    return undefined;
  }

  private async extractDescription(): Promise<string | undefined> {
    const selectors = [
      '[itemprop="description"]',
      '.product-description',
      '.wine-description',
      '[class*="description"]',
      '.tasting-notes',
    ];

    for (const selector of selectors) {
      try {
        const text = await this.page.$eval(selector, (el) => el.textContent?.trim());
        if (text && text.length > 20 && text.length < 2000) {
          return text;
        }
      } catch {
        continue;
      }
    }

    return undefined;
  }
}
