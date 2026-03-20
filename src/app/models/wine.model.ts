/**
 * Wine Product - Specific purchasable wines with winery details
 */
export interface Wine {
  id: number;
  wineryName: string;
  wineName: string;
  varietal: string;
  year: number | null; // null for NV (non-vintage)
  estimatedPrice: number; // USD
  wineryCity: string;
  wineryState: string;
  wineryAddress: string;
  wineryUrl: string;
  imageUrl: string; // bottle image
  thumbnailUrl: string; // smaller image for list view
  description?: string; // optional tasting notes
}

/**
 * Wine Recommendation - Links wines to pairings
 * Maps pairing suggestion strings (e.g., "Pinot Noir") to specific wine products
 */
export interface WineRecommendation {
  varietalMatch: string; // matches pairingSuggestions in Pairing (e.g., "Pinot Noir")
  wineIds: number[]; // array of Wine IDs that match this varietal
  message: string; // e.g., "We suggest one of these wines"
}
