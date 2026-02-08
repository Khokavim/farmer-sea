import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem } from '@/types/cart';
import { Product } from '@/types/product';

// Cart actions
type CartAction =
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

// Initial state
interface CartState {
  items: CartItem[];
  isLoading: boolean;
}

const initialState: CartState = {
  items: [],
  isLoading: true,
};

// Cart reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'LOAD_CART':
      return { ...state, items: action.payload, isLoading: false };
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        const nextQty = existingItem.quantity + action.payload.quantity;
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: nextQty, totalPrice: item.product.price * nextQty }
              : item
          )
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity, totalPrice: item.product.price * action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
}

// Create context
const CartContext = createContext<{
  state: CartState;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
  getItemById: (id: string) => CartItem | undefined;
} | undefined>(undefined);

// Cart provider component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          const items = Array.isArray(parsed) ? parsed : [];
          const normalized = items
            .map((item) => {
              const price = Number(item?.product?.price ?? 0);
              const quantity = Number(item?.quantity ?? 0);
              const totalPrice = Number(item?.totalPrice);
              return {
                ...item,
                product: {
                  ...item?.product,
                  price: Number.isFinite(price) ? price : 0,
                },
                quantity: Number.isFinite(quantity) ? quantity : 0,
                totalPrice: Number.isFinite(totalPrice) ? totalPrice : (Number.isFinite(price) ? price : 0) * (Number.isFinite(quantity) ? quantity : 0),
              };
            })
            .filter((item) => item?.id && item?.product?.id && item.quantity > 0);

          dispatch({ type: 'LOAD_CART', payload: normalized });
        } else {
          dispatch({ type: 'LOAD_CART', payload: [] });
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        dispatch({ type: 'LOAD_CART', payload: [] });
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('cart', JSON.stringify(state.items));
    }
  }, [state.items, state.isLoading]);

  // Add item to cart
  const addItem = (product: Product, quantity: number = 1): void => {
    const cartItem: CartItem = {
      id: product.id,
      productId: product.id,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit || 'kg',
        images: product.images || [],
        farmerName: product.farmerName || 'Unknown Farmer',
        businessName: product.businessName || 'Unknown Business',
        location: product.location || 'Unknown Location'
      },
      quantity,
      totalPrice: product.price * quantity,
      addedAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_ITEM', payload: cartItem });
  };

  // Remove item from cart
  const removeItem = (productId: string): void => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  // Update item quantity
  const updateQuantity = (productId: string, quantity: number): void => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  // Clear entire cart
  const clearCart = (): void => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Get total item count
  const getItemCount = (): number => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  // Get total price
  const getTotalPrice = (): number => {
    return state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  // Get item by ID
  const getItemById = (id: string): CartItem | undefined => {
    return state.items.find(item => item.id === id);
  };

  const value = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemCount,
    getTotalPrice,
    getItemById,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
