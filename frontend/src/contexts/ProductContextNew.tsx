import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { apiService } from '@/services/api';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  images: string[];
  stock: number;
  unit: string;
  status: string;
  isOrganic: boolean;
  harvestDate?: string;
  expiryDate?: string;
  location?: string;
  rating: number;
  reviewCount: number;
  minOrder: number;
  maxOrder?: number;
  tags: string[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  farmerId?: string;
  farmer?: {
    id: string;
    name: string;
    businessName?: string;
    location?: string;
    isVerified: boolean;
  };
}

interface ProductState {
  products: Product[];
  categories: string[];
  featuredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  filters: {
    category: string;
    search: string;
    minPrice: number;
    maxPrice: number;
    sortBy: string;
    sortOrder: string;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

type ProductQueryParams = Partial<ProductState['filters']> & {
  page?: number;
  limit?: number;
};

interface ProductContextType extends ProductState {
  fetchProducts: (params?: ProductQueryParams) => Promise<void>;
  fetchProductById: (id: string) => Promise<Product | null>;
  fetchCategories: () => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  createProduct: (productData: Partial<Product>) => Promise<Product | null>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  setFilters: (filters: Partial<ProductState['filters']>) => void;
  clearError: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [state, setState] = useState<ProductState>({
    products: [],
    categories: [],
    featuredProducts: [],
    isLoading: false,
    error: null,
    filters: {
      category: '',
      search: '',
      minPrice: 0,
      maxPrice: 10000,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 20,
    },
  });

  const { currentPage, itemsPerPage } = state.pagination;
  const filters = state.filters;

  const fetchProducts = useCallback(
    async (params?: ProductQueryParams) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const queryParams = {
          page: currentPage,
          limit: itemsPerPage,
          ...filters,
          ...params,
        };

        const response = await apiService.getProducts(queryParams);

        if (response.success && response.data) {
          setState((prev) => ({
            ...prev,
            products: response.data.products,
            pagination: response.data.pagination,
            isLoading: false,
          }));
        } else {
          throw new Error(response.message || 'Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to fetch products',
          isLoading: false,
        }));
      }
    },
    [currentPage, filters, itemsPerPage],
  );

  const fetchProductById = useCallback(async (id: string): Promise<Product | null> => {
    try {
      const response = await apiService.getProduct(id);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch product');
    } catch (error) {
      console.error('Error fetching product:', error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch product',
      }));
      return null;
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await apiService.getCategories();

      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          categories: response.data,
        }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  const fetchFeaturedProducts = useCallback(async () => {
    try {
      const response = await apiService.getFeaturedProducts();

      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          featuredProducts: response.data,
        }));
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  }, []);

  const createProduct = useCallback(
    async (productData: Partial<Product>): Promise<Product | null> => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const response = await apiService.createProduct(productData);

        if (response.success && response.data) {
          await fetchProducts();
          return response.data;
        }

        throw new Error(response.message || 'Failed to create product');
      } catch (error) {
        console.error('Error creating product:', error);
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to create product',
          isLoading: false,
        }));
        return null;
      }
    },
    [fetchProducts],
  );

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>): Promise<Product | null> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await apiService.updateProduct(id, updates);

      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          products: prev.products.map((p) => (p.id === id ? response.data : p)),
          isLoading: false,
        }));
        return response.data;
      }

      throw new Error(response.message || 'Failed to update product');
    } catch (error) {
      console.error('Error updating product:', error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update product',
        isLoading: false,
      }));
      return null;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await apiService.deleteProduct(id);

      if (response.success) {
        setState((prev) => ({
          ...prev,
          products: prev.products.filter((p) => p.id !== id),
          isLoading: false,
        }));
        return true;
      }

      throw new Error(response.message || 'Failed to delete product');
    } catch (error) {
      console.error('Error deleting product:', error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to delete product',
        isLoading: false,
      }));
      return false;
    }
  }, []);

  const setFilters = useCallback((filtersUpdate: Partial<ProductState['filters']>) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...filtersUpdate },
    }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Load initial data once (deps included to satisfy eslint; guarded to avoid reruns).
  const didInitRef = useRef(false);
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    const loadData = async () => {
      try {
        await fetchProducts();
        await fetchCategories();
        await fetchFeaturedProducts();
      } catch {
        console.warn('Backend not available, using fallback data');
        setState((prev) => ({
          ...prev,
          products: [],
          categories: ['vegetables', 'fruits', 'grains', 'tubers'],
          featuredProducts: [],
          isLoading: false,
          error: null,
        }));
      }
    };

    void loadData();
  }, [fetchCategories, fetchFeaturedProducts, fetchProducts]);

  // Refetch products when the query params change.
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    void fetchProducts();
  }, [fetchProducts]);

  const value: ProductContextType = {
    ...state,
    fetchProducts,
    fetchProductById,
    fetchCategories,
    fetchFeaturedProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    setFilters,
    clearError,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};
