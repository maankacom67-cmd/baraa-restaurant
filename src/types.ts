export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizer' | 'main' | 'drink' | 'dessert';
  imageUrl: string;
  tags: string[];
  isFeatured?: boolean;
  isPopular?: boolean;
  rating?: number;
}

export interface Category {
  key: 'all' | 'appetizer' | 'main' | 'drink' | 'dessert';
  label: string;
  icon: string;
}

export interface Booking {
  id: string;
  name: string;
  guests: number;
  date: string;
  time: string;
  requests?: string;
  paymentMethod: 'evc_plus' | 'premier_wallet' | 'salaam_bank';
  paymentNumber: string;
  isConfirmed: boolean;
  bookingCode: string;
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  dishName?: string;
}

export interface Chef {
  id: string;
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
  signatureDish: string;
}
