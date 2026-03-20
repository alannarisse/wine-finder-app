export interface Pairing {
  id: number;
  category: string;
  subCategory: string;
  foodArray: string[];
  pairingStyle: string;
  pairingSuggestions: string[];
}

export type FoodCategory =
  | 'fish'
  | 'chicken'
  | 'beef'
  | 'pork'
  | 'lamb'
  | 'vegetarian'
  | 'cheese'
  | 'dessert'
  | 'sauce';
