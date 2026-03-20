import { Injectable, signal, computed } from '@angular/core';
import { Pairing, FoodCategory } from '../models/pairing.model';

@Injectable({
  providedIn: 'root'
})
export class PairingService {
  // Static data - will be replaced with API calls when backend is ready
  private readonly pairingsData: Pairing[] = [
    {
      id: 1,
      category: 'fish',
      subCategory: 'delicate, lean fish',
      foodArray: ['Tilapia', 'Sole', 'Flounder', 'Sea Bass'],
      pairingStyle: 'Light, crisp whites that won\'t overpower subtle flavors',
      pairingSuggestions: ['Pinot Gris', 'Pinot Grigio', 'Sauvignon Blanc', 'Albariño', 'Vinho Verde']
    },
    {
      id: 2,
      category: 'fish',
      subCategory: 'rich, oily fish',
      foodArray: ['Salmon', 'Tuna', 'Mackerel', 'Arctic Char'],
      pairingStyle: 'Medium-bodied whites or light reds with good acidity',
      pairingSuggestions: ['Chardonnay', 'Viognier', 'Rosé', 'Pinot Noir', 'Gamay']
    },
    {
      id: 3,
      category: 'fish',
      subCategory: 'medium textured fish',
      foodArray: ['Cod', 'Haddock', 'Halibut'],
      pairingStyle: 'Medium bodied whites',
      pairingSuggestions: ['Unoaked Chardonnay', 'Pinot Gris', 'Pinot Grigio', 'Vermentino']
    },
    {
      id: 4,
      category: 'fish',
      subCategory: 'shellfish',
      foodArray: ['Lobster', 'Mussel', 'Oysters'],
      pairingStyle: 'Crisp whites or sparkling wines',
      pairingSuggestions: ['Sauvignon Blanc', 'Pinot Grigio', 'Chardonnay', 'Champagne', 'Prosecco']
    },
    {
      id: 5,
      category: 'chicken',
      subCategory: 'simply roasted or grilled chicken',
      foodArray: ['Roast Chicken', 'Grilled Chicken Breast'],
      pairingStyle: 'Medium-bodied whites or light reds that complement without dominating',
      pairingSuggestions: ['Chardonnay', 'Sauvignon Blanc', 'Pinot Noir', 'Gamay']
    },
    {
      id: 6,
      category: 'chicken',
      subCategory: 'rich or creamy chicken dishes',
      foodArray: ['Chicken Alfredo', 'Chicken Pot Pie', 'Chicken Fricassée'],
      pairingStyle: 'Round, fuller-bodied whites with texture',
      pairingSuggestions: ['Oaked Chardonnay', 'Viognier', 'Marsanne', 'White Rhône Blend']
    },
    {
      id: 7,
      category: 'beef',
      subCategory: 'rich, fatty beef',
      foodArray: ['Ribeye Steak', 'Prime Rib', 'Beef Short Ribs', 'Bone-on Strip Steak'],
      pairingStyle: 'Reds with strong tannins',
      pairingSuggestions: ['Cabernet Sauvignon', 'Malbec', 'Syrah/Shiraz', 'Bordeaux Blend']
    },
    {
      id: 8,
      category: 'beef',
      subCategory: 'lean beef',
      foodArray: ['Filet Mignon', 'Beef Tenderloin', 'Eye of Round'],
      pairingStyle: 'Delicate to medium bodied reds',
      pairingSuggestions: ['Pinot Noir', 'Merlot', 'Gamay (Beaujolais)', 'Grenache']
    },
    {
      id: 9,
      category: 'beef',
      subCategory: 'grilled or seared steaks',
      foodArray: ['Ribeye', 'New York Strip', 'Filet Mignon'],
      pairingStyle: 'Bold reds with firm tannins and depth',
      pairingSuggestions: ['Cabernet Sauvignon', 'Bordeaux Blend', 'Tempranillo', 'Zinfandel']
    },
    {
      id: 10,
      category: 'beef',
      subCategory: 'sauces with beef',
      foodArray: ['Steak au Poivre', 'Beef with Mushroom or red wine sauce', 'Pepper-crusted steak'],
      pairingStyle: 'Medium-bodied, complex flavored reds',
      pairingSuggestions: ['Syrah (peppery)', 'Zinfandel (spicy+jammy)', 'Tempranillo (savory+earthy)', 'Carmenère (herbal notes)']
    },
    {
      id: 11,
      category: 'beef',
      subCategory: 'slow-cooked and braised beef',
      foodArray: ['Osso Buco', 'Beef Shank', 'Beef Bourguignon', 'Pot Roast', 'Braised Short Ribs'],
      pairingStyle: 'Medium to heavy bodied, acidic reds',
      pairingSuggestions: ['Nebbiolo', 'Barolo', 'Barbaresco', 'Sangiovese', 'Cabernet Franc']
    },
    {
      id: 12,
      category: 'beef',
      subCategory: 'ground beef & casual dishes',
      foodArray: ['Burgers', 'Meatloaf', 'Tacos', 'Moco Loco', 'Sloppy Joes'],
      pairingStyle: 'Fun, festive, medium bodied reds',
      pairingSuggestions: ['Zinfandel', 'Malbec', 'Côtes du Rhône', 'Lambrusco (dry)']
    },
    {
      id: 13,
      category: 'beef',
      subCategory: 'spiced, asian, mediterranean beef dishes',
      foodArray: ['Bulgogi', 'Stir-fry', 'Kebabs', 'Shawarma', 'Chili con Carne', 'Curry'],
      pairingStyle: 'Flexible, medium bodied reds, off-dry reds, or rosé',
      pairingSuggestions: ['Zinfandel', 'Grenache Blend', 'Red Blend (off-dry)', 'Rosé']
    },
    {
      id: 14,
      category: 'pork',
      subCategory: 'roasted or grilled pork',
      foodArray: ['Pork Chop', 'Pork Tenderloin', 'Roast Pork'],
      pairingStyle: 'Medium-bodied wines with good acidity and balance',
      pairingSuggestions: ['Pinot Noir', 'Grenache', 'Chenin Blanc', 'Riesling']
    },
    {
      id: 15,
      category: 'lamb',
      subCategory: 'herb-roasted or grilled lamb',
      foodArray: ['Rack of Lamb', 'Lamb Chops', 'Leg of Lamb'],
      pairingStyle: 'Earthy, full-bodied reds that complement savory flavors',
      pairingSuggestions: ['Syrah', 'Cabernet Sauvignon', 'Bordeaux Blend', 'Tempranillo']
    },
    {
      id: 16,
      category: 'vegetarian',
      subCategory: 'roasted vegetables and hearty plant-based dishes',
      foodArray: ['Mushroom Risotto', 'Roasted Root Vegetables', 'Eggplant Parmesan'],
      pairingStyle: 'Wines with earthiness or brightness depending on preparation',
      pairingSuggestions: ['Pinot Noir', 'Gamay', 'Chardonnay', 'Sangiovese']
    },
    {
      id: 17,
      category: 'cheese',
      subCategory: 'soft and creamy cheeses',
      foodArray: ['Brie', 'Camembert', 'Triple-Crème Cheese'],
      pairingStyle: 'Acid-driven whites or sparkling wines to cut richness',
      pairingSuggestions: ['Champagne', 'Cava', 'Chenin Blanc', 'Sauvignon Blanc']
    },
    {
      id: 18,
      category: 'dessert',
      subCategory: 'chocolate-based desserts',
      foodArray: ['Chocolate Cake', 'Brownies', 'Chocolate Mousse'],
      pairingStyle: 'Rich, sweet wines with enough body to match chocolate intensity',
      pairingSuggestions: ['Port', 'Banyuls', 'Madeira', 'Late Harvest Zinfandel']
    },
    {
      id: 19,
      category: 'dessert',
      subCategory: 'fruit-based desserts',
      foodArray: ['Apple Tart', 'Berry Cobbler', 'Peach Galette'],
      pairingStyle: 'Sweet or off-dry wines with bright acidity',
      pairingSuggestions: ['Moscato d\'Asti', 'Late Harvest Riesling', 'Sauternes']
    },
    {
      id: 20,
      category: 'dessert',
      subCategory: 'cream and custard desserts',
      foodArray: ['Crème Brûlée', 'Panna Cotta', 'Flan'],
      pairingStyle: 'Silky, sweet wines that echo creamy textures',
      pairingSuggestions: ['Sauternes', 'Tokaji', 'Late Harvest Chenin Blanc']
    },
    {
      id: 21,
      category: 'dessert',
      subCategory: 'nut-based and caramel desserts',
      foodArray: ['Pecan Pie', 'Baklava', 'Caramel Tart'],
      pairingStyle: 'Oxidative or nutty sweet wines that mirror caramelized flavors',
      pairingSuggestions: ['Tawny Port', 'Pedro Ximénez Sherry', 'Madeira']
    },
    {
      id: 22,
      category: 'dessert',
      subCategory: 'light and fresh desserts',
      foodArray: ['Lemon Tart', 'Angel Food Cake', 'Sorbet'],
      pairingStyle: 'Light, aromatic, and refreshing sweet wines',
      pairingSuggestions: ['Moscato d\'Asti', 'Prosecco', 'Ice Wine']
    },
    {
      id: 23,
      category: 'sauce',
      subCategory: 'zesty/citrusy sauce',
      foodArray: [],
      pairingStyle: 'Bright, acidic whites',
      pairingSuggestions: ['Sauvignon Blanc', 'Muscadet', 'Grüner Veltliner']
    },
    {
      id: 24,
      category: 'sauce',
      subCategory: 'rich/creamy sauce',
      foodArray: [],
      pairingStyle: 'Medium-bodied white or sparkling',
      pairingSuggestions: ['Oaked Chardonnay', 'Viognier', 'Champagne']
    },
    {
      id: 25,
      category: 'sauce',
      subCategory: 'spicy/asian sauce',
      foodArray: [],
      pairingStyle: 'Off-dry whites or aromatic varieties',
      pairingSuggestions: ['Riesling (off-dry)', 'Gewürztraminer', 'Grüner Veltliner', 'Rosé']
    },
    {
      id: 26,
      category: 'sauce',
      subCategory: 'grilled/bbq',
      foodArray: [],
      pairingStyle: 'Light, chilled red wines or dry rosé',
      pairingSuggestions: ['Pinot Noir', 'Beaujolais', 'Rosé']
    }
  ];

  private readonly pairings = signal<Pairing[]>(this.pairingsData);

  readonly categories = computed(() => {
    const uniqueCategories = [...new Set(this.pairings().map(p => p.category))];
    return uniqueCategories.sort();
  });

  getSubCategories(category: string): string[] {
    return this.pairings()
      .filter(p => p.category === category)
      .map(p => p.subCategory);
  }

  getPairing(category: string, subCategory: string): Pairing | undefined {
    return this.pairings().find(
      p => p.category === category && p.subCategory === subCategory
    );
  }

  getAllPairings(): Pairing[] {
    return this.pairings();
  }
}
