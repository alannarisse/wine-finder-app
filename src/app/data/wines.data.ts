import { Wine } from '../models/wine.model';

/**
 * Sample wine product data
 * In production, this would come from the database/API
 * Images use placeholder - replace with actual bottle images
 */
export const WINES_DATA: Wine[] = [
  // ============================================
  // WHITE WINES
  // ============================================
  {
    id: 1,
    wineryName: 'Duckhorn Vineyards',
    wineName: 'Napa Valley Sauvignon Blanc',
    varietal: 'Sauvignon Blanc',
    year: 2022,
    estimatedPrice: 28,
    wineryCity: 'St. Helena',
    wineryState: 'CA',
    wineryAddress: '1000 Lodi Lane, St. Helena, CA 94574',
    wineryUrl: 'https://www.duckhorn.com',
    imageUrl: '/images/wines/duckhorn-sauvignon-blanc.jpg',
    thumbnailUrl: '/images/wines/thumbs/duckhorn-sauvignon-blanc.jpg',
    description: 'Bright citrus and tropical notes with crisp acidity. Perfect for seafood.'
  },
  {
    id: 2,
    wineryName: 'Kim Crawford',
    wineName: 'Marlborough Sauvignon Blanc',
    varietal: 'Sauvignon Blanc',
    year: 2023,
    estimatedPrice: 15,
    wineryCity: 'Blenheim',
    wineryState: 'New Zealand',
    wineryAddress: 'Marlborough, New Zealand',
    wineryUrl: 'https://www.kimcrawfordwines.com',
    imageUrl: '/images/wines/kim-crawford-sauvignon-blanc.jpg',
    thumbnailUrl: '/images/wines/thumbs/kim-crawford-sauvignon-blanc.jpg',
    description: 'Vibrant with passion fruit, grapefruit, and fresh herbs.'
  },
  {
    id: 3,
    wineryName: 'Rombauer Vineyards',
    wineName: 'Carneros Chardonnay',
    varietal: 'Chardonnay',
    year: 2022,
    estimatedPrice: 42,
    wineryCity: 'St. Helena',
    wineryState: 'CA',
    wineryAddress: '3522 Silverado Trail N, St. Helena, CA 94574',
    wineryUrl: 'https://www.rombauer.com',
    imageUrl: '/images/wines/rombauer-chardonnay.jpg',
    thumbnailUrl: '/images/wines/thumbs/rombauer-chardonnay.jpg',
    description: 'Rich and creamy with vanilla, peach, and mango flavors.'
  },
  {
    id: 4,
    wineryName: 'Mer Soleil',
    wineName: 'Reserve Chardonnay',
    varietal: 'Oaked Chardonnay',
    year: 2021,
    estimatedPrice: 35,
    wineryCity: 'Santa Lucia Highlands',
    wineryState: 'CA',
    wineryAddress: 'Santa Lucia Highlands, Monterey, CA',
    wineryUrl: 'https://www.mersoleilwinery.com',
    imageUrl: '/images/wines/mer-soleil-chardonnay.jpg',
    thumbnailUrl: '/images/wines/thumbs/mer-soleil-chardonnay.jpg',
    description: 'Barrel-fermented with notes of toasted oak, butter, and tropical fruit.'
  },
  {
    id: 5,
    wineryName: 'Trefethen Family Vineyards',
    wineName: 'Oak Knoll Riesling',
    varietal: 'Riesling',
    year: 2022,
    estimatedPrice: 25,
    wineryCity: 'Napa',
    wineryState: 'CA',
    wineryAddress: '1160 Oak Knoll Ave, Napa, CA 94558',
    wineryUrl: 'https://www.trefethen.com',
    imageUrl: '/images/wines/trefethen-riesling.jpg',
    thumbnailUrl: '/images/wines/thumbs/trefethen-riesling.jpg',
    description: 'Off-dry with apricot, honey, and lime zest. Great with spicy foods.'
  },
  {
    id: 6,
    wineryName: 'Conundrum',
    wineName: 'White Blend',
    varietal: 'Viognier',
    year: 2022,
    estimatedPrice: 22,
    wineryCity: 'Rutherford',
    wineryState: 'CA',
    wineryAddress: 'Rutherford, Napa Valley, CA',
    wineryUrl: 'https://www.conundrumwines.com',
    imageUrl: '/images/wines/conundrum-white.jpg',
    thumbnailUrl: '/images/wines/thumbs/conundrum-white.jpg',
    description: 'Aromatic blend with peach, apricot, and honeysuckle notes.'
  },
  {
    id: 7,
    wineryName: 'Trimbach',
    wineName: 'Gewürztraminer',
    varietal: 'Gewürztraminer',
    year: 2021,
    estimatedPrice: 24,
    wineryCity: 'Ribeauvillé',
    wineryState: 'France',
    wineryAddress: '15 Route de Bergheim, 68150 Ribeauvillé, France',
    wineryUrl: 'https://www.trimbach.com',
    imageUrl: '/images/wines/trimbach-gewurztraminer.jpg',
    thumbnailUrl: '/images/wines/thumbs/trimbach-gewurztraminer.jpg',
    description: 'Intensely aromatic with lychee, rose petal, and ginger spice.'
  },
  {
    id: 8,
    wineryName: 'Santa Margherita',
    wineName: 'Alto Adige Pinot Grigio',
    varietal: 'Pinot Grigio',
    year: 2023,
    estimatedPrice: 24,
    wineryCity: 'Fossalta di Portogruaro',
    wineryState: 'Italy',
    wineryAddress: 'Via Ita Marzotto 8, 30025 Fossalta di Portogruaro, Italy',
    wineryUrl: 'https://www.santamargherita.com',
    imageUrl: '/images/wines/santa-margherita-pinot-grigio.jpg',
    thumbnailUrl: '/images/wines/thumbs/santa-margherita-pinot-grigio.jpg',
    description: 'Crisp and clean with apple, citrus, and mineral notes.'
  },

  // ============================================
  // RED WINES
  // ============================================
  {
    id: 9,
    wineryName: 'Caymus Vineyards',
    wineName: 'Napa Valley Cabernet Sauvignon',
    varietal: 'Cabernet Sauvignon',
    year: 2021,
    estimatedPrice: 95,
    wineryCity: 'Rutherford',
    wineryState: 'CA',
    wineryAddress: '8700 Conn Creek Road, Rutherford, CA 94573',
    wineryUrl: 'https://www.caymus.com',
    imageUrl: '/images/wines/caymus-cabernet.jpg',
    thumbnailUrl: '/images/wines/thumbs/caymus-cabernet.jpg',
    description: 'Rich and layered with dark fruit, cocoa, and cassis. Silky tannins.'
  },
  {
    id: 10,
    wineryName: 'Jordan Vineyard & Winery',
    wineName: 'Alexander Valley Cabernet Sauvignon',
    varietal: 'Cabernet Sauvignon',
    year: 2019,
    estimatedPrice: 62,
    wineryCity: 'Healdsburg',
    wineryState: 'CA',
    wineryAddress: '1474 Alexander Valley Rd, Healdsburg, CA 95448',
    wineryUrl: 'https://www.jordanwinery.com',
    imageUrl: '/images/wines/jordan-cabernet.jpg',
    thumbnailUrl: '/images/wines/thumbs/jordan-cabernet.jpg',
    description: 'Elegant Bordeaux-style with black cherry, cassis, and subtle oak.'
  },
  {
    id: 11,
    wineryName: 'Belle Glos',
    wineName: 'Clark & Telephone Pinot Noir',
    varietal: 'Pinot Noir',
    year: 2022,
    estimatedPrice: 50,
    wineryCity: 'Santa Maria',
    wineryState: 'CA',
    wineryAddress: 'Santa Maria Valley, CA',
    wineryUrl: 'https://www.belleglos.com',
    imageUrl: '/images/wines/belle-glos-pinot.jpg',
    thumbnailUrl: '/images/wines/thumbs/belle-glos-pinot.jpg',
    description: 'Lush and velvety with cherry, raspberry, and baking spices.'
  },
  {
    id: 12,
    wineryName: 'Meiomi',
    wineName: 'California Pinot Noir',
    varietal: 'Pinot Noir',
    year: 2022,
    estimatedPrice: 22,
    wineryCity: 'Acampo',
    wineryState: 'CA',
    wineryAddress: 'Coastal California',
    wineryUrl: 'https://www.meiomi.com',
    imageUrl: '/images/wines/meiomi-pinot.jpg',
    thumbnailUrl: '/images/wines/thumbs/meiomi-pinot.jpg',
    description: 'Smooth with bright cherry, strawberry, and a touch of mocha.'
  },
  {
    id: 13,
    wineryName: 'Catena Zapata',
    wineName: 'Malbec High Mountain Vines',
    varietal: 'Malbec',
    year: 2021,
    estimatedPrice: 25,
    wineryCity: 'Mendoza',
    wineryState: 'Argentina',
    wineryAddress: 'Cobos S/N, Agrelo, Luján de Cuyo, Mendoza, Argentina',
    wineryUrl: 'https://www.catenawines.com',
    imageUrl: '/images/wines/catena-malbec.jpg',
    thumbnailUrl: '/images/wines/thumbs/catena-malbec.jpg',
    description: 'Bold with blackberry, plum, and violet aromas. Velvety finish.'
  },
  {
    id: 14,
    wineryName: 'Decoy',
    wineName: 'Sonoma County Merlot',
    varietal: 'Merlot',
    year: 2021,
    estimatedPrice: 22,
    wineryCity: 'St. Helena',
    wineryState: 'CA',
    wineryAddress: 'Sonoma County, CA',
    wineryUrl: 'https://www.decoywines.com',
    imageUrl: '/images/wines/decoy-merlot.jpg',
    thumbnailUrl: '/images/wines/thumbs/decoy-merlot.jpg',
    description: 'Soft and approachable with plum, cherry, and subtle herbs.'
  },
  {
    id: 15,
    wineryName: 'K Vintners',
    wineName: 'The Beautiful Syrah',
    varietal: 'Syrah',
    year: 2020,
    estimatedPrice: 45,
    wineryCity: 'Walla Walla',
    wineryState: 'WA',
    wineryAddress: 'Walla Walla Valley, WA',
    wineryUrl: 'https://www.kvintners.com',
    imageUrl: '/images/wines/k-vintners-syrah.jpg',
    thumbnailUrl: '/images/wines/thumbs/k-vintners-syrah.jpg',
    description: 'Powerful with dark fruit, pepper, and smoky bacon notes.'
  },
  {
    id: 16,
    wineryName: 'Seghesio Family Vineyards',
    wineName: 'Sonoma Zinfandel',
    varietal: 'Zinfandel',
    year: 2021,
    estimatedPrice: 28,
    wineryCity: 'Healdsburg',
    wineryState: 'CA',
    wineryAddress: '700 Grove Street, Healdsburg, CA 95448',
    wineryUrl: 'https://www.seghesio.com',
    imageUrl: '/images/wines/seghesio-zinfandel.jpg',
    thumbnailUrl: '/images/wines/thumbs/seghesio-zinfandel.jpg',
    description: 'Jammy and spicy with blackberry, pepper, and vanilla.'
  },
  {
    id: 17,
    wineryName: 'Louis Jadot',
    wineName: 'Beaujolais-Villages',
    varietal: 'Gamay',
    year: 2022,
    estimatedPrice: 16,
    wineryCity: 'Beaune',
    wineryState: 'France',
    wineryAddress: '21, Rue Eugène Spuller, 21200 Beaune, France',
    wineryUrl: 'https://www.louisjadot.com',
    imageUrl: '/images/wines/jadot-beaujolais.jpg',
    thumbnailUrl: '/images/wines/thumbs/jadot-beaujolais.jpg',
    description: 'Light and fruity with cherry, raspberry, and a hint of earth.'
  },

  // ============================================
  // ROSÉ WINES
  // ============================================
  {
    id: 18,
    wineryName: 'Whispering Angel',
    wineName: 'Côtes de Provence Rosé',
    varietal: 'Rosé',
    year: 2023,
    estimatedPrice: 24,
    wineryCity: 'La Motte',
    wineryState: 'France',
    wineryAddress: 'Château d\'Esclans, 4005 Route de Callas, 83920 La Motte, France',
    wineryUrl: 'https://www.esclans.com',
    imageUrl: '/images/wines/whispering-angel-rose.jpg',
    thumbnailUrl: '/images/wines/thumbs/whispering-angel-rose.jpg',
    description: 'Elegant and refreshing with peach, strawberry, and citrus.'
  },

  // ============================================
  // SPARKLING WINES
  // ============================================
  {
    id: 19,
    wineryName: 'Schramsberg Vineyards',
    wineName: 'Blanc de Blancs',
    varietal: 'Champagne',
    year: 2019,
    estimatedPrice: 42,
    wineryCity: 'Calistoga',
    wineryState: 'CA',
    wineryAddress: '1400 Schramsberg Rd, Calistoga, CA 94515',
    wineryUrl: 'https://www.schramsberg.com',
    imageUrl: '/images/wines/schramsberg-blanc.jpg',
    thumbnailUrl: '/images/wines/thumbs/schramsberg-blanc.jpg',
    description: 'Crisp and elegant with green apple, citrus, and brioche notes.'
  },
  {
    id: 20,
    wineryName: 'La Marca',
    wineName: 'Prosecco',
    varietal: 'Prosecco',
    year: null,
    estimatedPrice: 15,
    wineryCity: 'Treviso',
    wineryState: 'Italy',
    wineryAddress: 'Veneto, Italy',
    wineryUrl: 'https://www.lamarcaprosecco.com',
    imageUrl: '/images/wines/la-marca-prosecco.jpg',
    thumbnailUrl: '/images/wines/thumbs/la-marca-prosecco.jpg',
    description: 'Light and bubbly with pear, apple, and white flowers.'
  },

  // ============================================
  // DESSERT WINES
  // ============================================
  {
    id: 21,
    wineryName: 'Taylor Fladgate',
    wineName: '20 Year Old Tawny Port',
    varietal: 'Port',
    year: null,
    estimatedPrice: 55,
    wineryCity: 'Vila Nova de Gaia',
    wineryState: 'Portugal',
    wineryAddress: 'Rua do Choupelo, 250, 4400-088 Vila Nova de Gaia, Portugal',
    wineryUrl: 'https://www.taylor.pt',
    imageUrl: '/images/wines/taylor-tawny-port.jpg',
    thumbnailUrl: '/images/wines/thumbs/taylor-tawny-port.jpg',
    description: 'Rich and nutty with caramel, dried fruit, and warm spices.'
  },
  {
    id: 22,
    wineryName: 'Vietti',
    wineName: 'Moscato d\'Asti',
    varietal: 'Moscato d\'Asti',
    year: 2023,
    estimatedPrice: 20,
    wineryCity: 'Castiglione Falletto',
    wineryState: 'Italy',
    wineryAddress: 'Piazza Vittorio Veneto 5, 12060 Castiglione Falletto, Italy',
    wineryUrl: 'https://www.vietti.com',
    imageUrl: '/images/wines/vietti-moscato.jpg',
    thumbnailUrl: '/images/wines/thumbs/vietti-moscato.jpg',
    description: 'Sweet and fizzy with peach, apricot, and orange blossom.'
  },
  {
    id: 23,
    wineryName: 'Château d\'Yquem',
    wineName: 'Sauternes',
    varietal: 'Sauternes',
    year: 2018,
    estimatedPrice: 450,
    wineryCity: 'Sauternes',
    wineryState: 'France',
    wineryAddress: 'Château d\'Yquem, 33210 Sauternes, France',
    wineryUrl: 'https://www.yquem.fr',
    imageUrl: '/images/wines/yquem-sauternes.jpg',
    thumbnailUrl: '/images/wines/thumbs/yquem-sauternes.jpg',
    description: 'Legendary dessert wine with honey, apricot, and tropical fruits.'
  }
];

/**
 * Maps varietal suggestions to specific wine IDs
 * This allows pairings to recommend specific purchasable wines
 */
export const VARIETAL_TO_WINES: Record<string, number[]> = {
  'Sauvignon Blanc': [1, 2],
  'Chardonnay': [3, 4],
  'Oaked Chardonnay': [3, 4],
  'Unoaked Chardonnay': [3],
  'Riesling': [5],
  'Riesling (off-dry)': [5],
  'Viognier': [6],
  'Gewürztraminer': [7],
  'Gewurtztraminer': [7],
  'Pinot Grigio': [8],
  'Pinot Gris': [8],
  'Cabernet Sauvignon': [9, 10],
  'Pinot Noir': [11, 12],
  'Malbec': [13],
  'Merlot': [14],
  'Syrah': [15],
  'Syrah/Shiraz': [15],
  'Zinfandel': [16],
  'Gamay': [17],
  'Gamay (Beaujolais)': [17],
  'Beaujolais': [17],
  'Rosé': [18],
  'Champagne': [19],
  'Prosecco': [20],
  'Port': [21],
  'Tawny Port': [21],
  'Moscato d\'Asti': [22],
  'Sauternes': [23]
};

/**
 * Default recommendation message
 */
export const WINE_RECOMMENDATION_MESSAGE = 'We suggest one of these wines:';
