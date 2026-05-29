export type ProductCardType = {
  image: string;
  title: string;
  description: string;
  overlay?: boolean;
  align?: "center" | "left";
  discount?: string | number;
  id: string;
  price: number;
  rating: number;
  score?: number;
  reviewCount?: number;
  redirect?: string;
  imageSize?: "sm" | "md" | "lg";
};

export type ProductOverviewDataType = {
  id: string;
  title: string;
  description: string;
  images: string[];
  rating: number;
  score?: number;
  reviewCount?: number;
  price: number;
  oldPrice: number
  discount: number | string;
  offers: string
  badges: string[];
  duration: number;
  location: string;
  roomType: "shared" | "private" | string;
  map?: string;
  mapLink?: string;
};

export type TravelDetailsDataType = {
  id: number;
  title: string;
  image: string;
};

export type ProductAdType = {
  id: string | number;
  href: string;
  title: string;
  description: string;
  image: string;
};

export type ProductDetailsType = {
  id: string;
  title: string;
  description: string;
  rating: number;
  reviewCount?: number;
  fullDescription: string;
  features: { text: string }[][];
  text: string;

  activities: ProductCardType[];
  packages: ProductCardType[];

  relatedProducts: ProductCardType[];

  location: string;
  duration: number;

  roomType: "shared" | "private" | string;
  price: number;
  discount: number | string;

  store: string;

  state: string;
  city: string;
  country: string;
  image: string;
  images: string[];

  via: string;
  viaIcon: string;
  viaLocation: string;
};

type Data = {
  id: string;
  title: string;
  description: string;
  images: string[];
  rating: number;
  reviewCount?: number;
  price: number;
  discount: number | string;
  badges: string[];
  duration: number;
  location: string;
  roomType: "shared" | "private" | string;
  map?: string;
  mapLink?: string;
};

interface ProductCardTypeState {
  image: string;
  title: string;
  description: string;
  overlay?: boolean;
  align?: "center" | "left";
  discount?: string | number;
  id: string;
  price: number;
  rating: number;
  score?: number;
  reviewCount?: number;
  redirect?: string;
  imageSize?: "sm" | "md" | "lg";
}

interface ProductTType {
  image: string;
  title: string;
  description: string;
  overlay?: boolean;
  align?: "center" | "left";
  discount?: string | number;
  id: string;
  price: number;
  rating: number;
  score?: number;
  reviewCount?: number;
  redirect?: string;
  imageSize?: "sm" | "md" | "lg";
}
