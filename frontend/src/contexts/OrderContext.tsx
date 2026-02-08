import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import { Order, OrderUpdate, OrderFilters, OrderStats } from '@/types/order';
import { apiService } from '@/services/api';

type BackendUser = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  location?: string;
};

type BackendProduct = {
  id?: string;
  name?: string;
  images?: unknown;
  unit?: string;
  farmerId?: string;
  location?: string;
  farmer?: BackendUser;
};

type BackendOrderItem = {
  id?: string;
  productId?: string;
  quantity?: unknown;
  unitPrice?: unknown;
  totalPrice?: unknown;
  product?: BackendProduct;
};

type BackendOrder = {
  id?: string;
  orderNumber?: string;
  buyerId?: string;
  buyer?: BackendUser;
  items?: BackendOrderItem[];
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  subtotal?: unknown;
  totalAmount?: unknown;
  shippingCost?: unknown;
  tax?: unknown;
  status?: string;
  paymentStatus?: string;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  createdAt?: string;
  updatedAt?: string;
};

type CreateOrderPayload = {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: Record<string, unknown>;
  billingAddress?: Record<string, unknown>;
  notes?: string;
};

const toNumber = (value: unknown) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const mapOrderItem = (item: BackendOrderItem) => {
  const product = item?.product;
  const farmer = product?.farmer;
  const images = Array.isArray(product?.images) ? product.images : [];
  const firstImage = images[0];
  const productImage = typeof firstImage === 'string' ? firstImage : '/placeholder.svg';
  return {
    id: item?.id || `${item?.productId || product?.id || 'item'}-${Date.now()}`,
    productId: item?.productId || product?.id || '',
    productName: product?.name || 'Unknown product',
    productImage,
    quantity: toNumber(item?.quantity),
    unitPrice: toNumber(item?.unitPrice),
    totalPrice: toNumber(item?.totalPrice),
    unit: product?.unit || 'kg',
    farmerId: product?.farmerId || farmer?.id || '',
    farmerName: farmer?.name || 'Unknown',
    businessName: farmer?.businessName || '',
    location: farmer?.location || product?.location || ''
  };
};

const mapOrder = (order: BackendOrder): Order => {
  const buyer = order?.buyer;
  const shippingAddress = order?.shippingAddress;
  const items = Array.isArray(order?.items) ? order.items.map(mapOrderItem) : [];
  const status = (order?.status as Order['status']) || 'pending';
  const paymentStatus = (order?.paymentStatus as Order['paymentStatus']) || 'pending';
  return {
    id: order?.id || '',
    orderNumber: order?.orderNumber || '',
    buyerId: order?.buyerId || buyer?.id || '',
    buyerName: buyer?.name || '',
    buyerEmail: buyer?.email || '',
    buyerPhone: buyer?.phone || '',
    items,
    totalAmount: toNumber(order?.subtotal ?? order?.totalAmount),
    shippingCost: toNumber(order?.shippingCost),
    tax: toNumber(order?.tax),
    finalAmount: toNumber(order?.totalAmount),
    status,
    paymentStatus,
    shippingAddress: {
      fullName: buyer?.name || '',
      phone: buyer?.phone || '',
      email: buyer?.email || '',
      address: shippingAddress?.street || '',
      city: shippingAddress?.city || '',
      state: shippingAddress?.state || '',
      postalCode: shippingAddress?.zipCode || '',
      country: shippingAddress?.country || 'Nigeria'
    },
    deliveryInstructions: order?.notes || '',
    trackingNumber: order?.trackingNumber || undefined,
    estimatedDelivery: order?.estimatedDelivery || undefined,
    actualDelivery: order?.actualDelivery || undefined,
    createdAt: order?.createdAt || new Date().toISOString(),
    updatedAt: order?.updatedAt || new Date().toISOString()
  };
};

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
    case 'ADD_ORDER': {
      const newOrders = [...state.orders, action.payload];
      return {
        ...state,
        orders: newOrders,
        filteredOrders: applyFilters(newOrders, state.filters),
        stats: calculateStats(newOrders),
      };
    }
    case 'UPDATE_ORDER': {
      const updatedOrders = state.orders.map(order =>
        order.id === action.payload.id ? action.payload : order
      );
      return {
        ...state,
        orders: updatedOrders,
        filteredOrders: applyFilters(updatedOrders, state.filters),
        stats: calculateStats(updatedOrders),
      };
    }
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
  createOrder: (orderData: CreateOrderPayload) => Promise<Order>;
  updateOrder: (update: OrderUpdate) => Promise<Order>;
  setFilters: (filters: OrderFilters) => void;
  clearFilters: () => void;
} | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  const getOrders = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await apiService.getOrders(state.filters);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to load orders');
      }
      const orders = response.data?.orders || response.data?.data?.orders || response.data?.data || response.data || [];
      const mappedOrders = Array.isArray(orders) ? orders.map(mapOrder) : [];
      dispatch({ type: 'SET_ORDERS', payload: mappedOrders });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load orders' });
    }
  }, [state.filters]);

  // Load orders on mount (and refetch when filters change)
  useEffect(() => {
    getOrders();
  }, [getOrders]);

  const getOrder = (id: string): Order | undefined => {
    return state.orders.find(order => order.id === id);
  };

  const createOrder = async (orderData: CreateOrderPayload): Promise<Order> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await apiService.createOrder(orderData);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to create order');
      }
      const newOrder = mapOrder(response.data);
      dispatch({ type: 'ADD_ORDER', payload: newOrder });
      return newOrder;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create order' });
      throw error;
    }
  };

  const updateOrder = async (update: OrderUpdate): Promise<Order> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await apiService.updateOrderStatus(update.orderId, update.status, update.notes);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to update order');
      }
      const updatedOrder = mapOrder(response.data);
      dispatch({ type: 'UPDATE_ORDER', payload: updatedOrder });
      return updatedOrder;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update order' });
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
