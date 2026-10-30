export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizer' | 'main' | 'drink' | 'dessert';
  imageUrl: string;
  alt?: string;
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

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  locationLink?: string;
  coords?: { lat: number; lng: number } | null;
  food: string;
  orderType: 'delivery' | 'takeaway';
  paymentMethod: string;
  paymentStatus?: 'pay_now' | 'already_paid' | 'cash_on_delivery' | string;
  transactionId?: string;
  paymentUssd?: string;
  items?: any[];
  totalAmount: number;
  date?: string;
  time?: string;
  status?: string;
  orderCode: string;
  notes?: string;
  createdAt: string;
}

