export type ProductStatus = 'active' | 'inactive' | 'pending' | 'out_of_stock';
export type ProductCategory = 'vegetables' | 'fruits' | 'grains' | 'tubers' | 'herbs' | 'other';
export type QualityGrade = 'A+' | 'A' | 'B' | 'C';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number; // Price per unit in Naira
  unit: string; // kg, tonnes, pieces, etc.
  quantity: number; // Available quantity
  quality: QualityGrade;
  status: ProductStatus;
  images: string[];
  location: string;
  harvestDate: string;
  expiryDate?: string;
  farmerId: string;
  farmerName: string;
  businessName: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  specifications?: {
    weight?: string;
    size?: string;
    color?: string;
    origin?: string;
  };
}

export interface ProductFilters {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  quality?: QualityGrade;
  location?: string;
  status?: ProductStatus;
  search?: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  unit: string;
  quantity: number;
  quality: QualityGrade;
  images: string[];
  location: string;
  harvestDate: string;
  expiryDate?: string;
  tags: string[];
  specifications?: {
    weight?: string;
    size?: string;
    color?: string;
    origin?: string;
  };
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

