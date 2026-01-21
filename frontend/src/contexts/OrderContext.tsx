import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Order, OrderUpdate, OrderFilters, OrderStats } from '@/types/order';

// Mock data for development - replace with actual API calls
const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'FS-ORD-001',
    buyerId: 'buyer-1',
    buyerName: 'John Doe',
    buyerEmail: 'john@example.com',
    buyerPhone: '+2348012345678',
    items: [
      {
        id: '1',
        productId: '1',
        productName: 'Jos Irish Potatoes',
        productImage: '/assets/jos-farmer-potatoes.jpg',
        quantity: 5,
        unitPrice: 450,
        totalPrice: 2250,
        unit: 'kg',
        farmerId: 'farmer-1',
        farmerName: 'John Doe',
        businessName: 'Plateau Farmers Cooperative',
        location: 'Jos North LGA, Plateau State',
      },
    ],
    totalAmount: 2250,
    shippingCost: 0,
    tax: 112.5,
    finalAmount: 2362.5,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingAddress: {
      fullName: 'John Doe',
      phone: '+2348012345678',
      email: 'john@example.com',
      address: '123 Main Street',
      city: 'Lagos',
      state: 'Lagos State',
      postalCode: '100001',
      country: 'Nigeria',
    },
    deliveryInstructions: 'Leave at front door if no one is home',
    preferredDeliveryDate: '2025-01-20',
    trackingNumber: 'FS-TRK-001',
    estimatedDelivery: '2025-01-20',
    actualDelivery: '2025-01-19',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-19T14:30:00Z',
    confirmedAt: '2025-01-15T10:30:00Z',
    shippedAt: '2025-01-16T09:00:00Z',
    deliveredAt: '2025-01-19T14:30:00Z',
    paymentDetails: {
      method: 'card',
      provider: 'flutterwave',
      reference: 'FS_1234567890',
      transactionId: 'FLW_1234567890',
    },
  },
  {
    id: '2',
    orderNumber: 'FS-ORD-002',
    buyerId: 'buyer-2',
    buyerName: 'Jane Smith',
    buyerEmail: 'jane@example.com',
    buyerPhone: '+2348012345679',
    items: [
      {
        id: '2',
        productId: '2',
        productName: 'Fresh Tomatoes',
        productImage: '/placeholder.svg',
        quantity: 2,
        unitPrice: 280,
        totalPrice: 560,
        unit: 'kg',
        farmerId: 'farmer-2',
        farmerName: 'Jane Smith',
        businessName: 'Northern Agro Suppliers',
        location: 'Kaduna State',
      },
    ],
    totalAmount: 560,
    shippingCost: 5000,
    tax: 28,
    finalAmount: 5588,
    status: 'shipped',
    paymentStatus: 'paid',
    shippingAddress: {
      fullName: 'Jane Smith',
      phone: '+2348012345679',
      email: 'jane@example.com',
      address: '456 Oak Avenue',
      city: 'Abuja',
      state: 'FCT',
      postalCode: '900001',
      country: 'Nigeria',
    },
    trackingNumber: 'FS-TRK-002',
    estimatedDelivery: '2025-01-22',
    createdAt: '2025-01-14T14:30:00Z',
    updatedAt: '2025-01-16T10:00:00Z',
    confirmedAt: '2025-01-14T15:00:00Z',
    shippedAt: '2025-01-16T10:00:00Z',
    paymentDetails: {
      method: 'bank_transfer',
      provider: 'paystack',
      reference: 'FS_0987654321',
      transactionId: 'PSK_0987654321',
    },
  },
];

type OrderAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: Order }
  | { type: 'SET_FILTERS'; payload: OrderFilters }
  | { type: 'SET_ERROR'; payload: string | null };

interface OrderState {
  orders: Order[];
  filteredOrders: Order[];
  filters: OrderFilters;
  isLoading: boolean;
  error: string | null;
  stats: OrderStats;
}

const initialState: OrderState = {
  orders: [],
  filteredOrders: [],
  filters: {},
  isLoading: false,
  error: null,
  stats: {
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
  },
};

const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ORDERS':
      return {
        ...state,
        orders: action.payload,
        filteredOrders: applyFilters(action.payload, state.filters),
        isLoading: false,
        stats: calculateStats(action.payload),
      };
    case 'ADD_ORDER':
      const newOrders = [...state.orders, action.payload];
      return {
        ...state,
        orders: newOrders,
        filteredOrders: applyFilters(newOrders, state.filters),
        stats: calculateStats(newOrders),
      };
    case 'UPDATE_ORDER':
      const updatedOrders = state.orders.map(order =>
        order.id === action.payload.id ? action.payload : order
      );
      return {
        ...state,
        orders: updatedOrders,
        filteredOrders: applyFilters(updatedOrders, state.filters),
        stats: calculateStats(updatedOrders),
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: action.payload,
        filteredOrders: applyFilters(state.orders, action.payload),
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

const applyFilters = (orders: Order[], filters: OrderFilters): Order[] => {
  return orders.filter(order => {
    if (filters.status && order.status !== filters.status) return false;
    if (filters.paymentStatus && order.paymentStatus !== filters.paymentStatus) return false;
    if (filters.dateFrom && new Date(order.createdAt) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(order.createdAt) > new Date(filters.dateTo)) return false;
    if (filters.search && !order.orderNumber.toLowerCase().includes(filters.search.toLowerCase()) &&
        !order.buyerName.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
};

const calculateStats = (orders: Order[]): OrderStats => {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const confirmedOrders = orders.filter(o => o.status === 'confirmed').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.finalAmount, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return {
    totalOrders,
    pendingOrders,
    confirmedOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    totalRevenue,
    averageOrderValue,
  };
};

const OrderContext = createContext<{
  state: OrderState;
  getOrders: () => Promise<void>;
  getOrder: (id: string) => Order | undefined;
  createOrder: (orderData: Partial<Order>) => Promise<Order>;
  updateOrder: (update: OrderUpdate) => Promise<Order>;
  setFilters: (filters: OrderFilters) => void;
  clearFilters: () => void;
} | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // Load orders on mount
  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      dispatch({ type: 'SET_ORDERS', payload: MOCK_ORDERS });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load orders' });
    }
  };

  const getOrder = (id: string): Order | undefined => {
    return state.orders.find(order => order.id === id);
  };

  const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newOrder: Order = {
        id: Date.now().toString(),
        orderNumber: `FS-ORD-${Date.now()}`,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...orderData,
      } as Order;
      
      dispatch({ type: 'ADD_ORDER', payload: newOrder });
      return newOrder;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create order' });
      throw error;
    }
  };

  const updateOrder = async (update: OrderUpdate): Promise<Order> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const existingOrder = state.orders.find(o => o.id === update.orderId);
      if (!existingOrder) {
        throw new Error('Order not found');
      }
      
      const updatedOrder: Order = {
        ...existingOrder,
        ...update,
        updatedAt: new Date().toISOString(),
      };
      
      dispatch({ type: 'UPDATE_ORDER', payload: updatedOrder });
      return updatedOrder;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update order' });
      throw error;
    }
  };

  const setFilters = (filters: OrderFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const clearFilters = () => {
    dispatch({ type: 'SET_FILTERS', payload: {} });
  };

  const value = {
    state,
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
    setFilters,
    clearFilters,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

