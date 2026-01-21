const API_BASE_URL = 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
    businessName?: string;
    location?: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(updates: any) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }) {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Product endpoints
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    
    return this.request(endpoint);
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData: any) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, updates: any) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async getCategories() {
    return this.request('/products/categories');
  }

  async getFeaturedProducts() {
    return this.request('/products/featured');
  }

  // Order endpoints
  async createOrder(orderData: {
    items: Array<{
      productId: string;
      quantity: number;
    }>;
    shippingAddress: any;
    billingAddress?: any;
    notes?: string;
  }) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/orders?${queryString}` : '/orders';
    
    return this.request(endpoint);
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`);
  }

  async updateOrderStatus(id: string, status: string, notes?: string) {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  async cancelOrder(id: string) {
    return this.request(`/orders/${id}/cancel`, {
      method: 'PUT',
    });
  }

  // Message endpoints
  async createConversation(participantId: string, title?: string) {
    return this.request('/messages/conversations', {
      method: 'POST',
      body: JSON.stringify({ participantId, title }),
    });
  }

  async getConversations() {
    return this.request('/messages/conversations');
  }

  async getConversation(id: string, params?: {
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/messages/conversations/${id}?${queryString}` : `/messages/conversations/${id}`;
    
    return this.request(endpoint);
  }

  async sendMessage(messageData: {
    conversationId: string;
    content: string;
    messageType?: string;
    attachments?: any[];
  }) {
    return this.request('/messages/send', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async markMessagesAsRead(conversationId: string) {
    return this.request(`/messages/conversations/${conversationId}/read`, {
      method: 'PUT',
    });
  }

  async deleteMessage(id: string) {
    return this.request(`/messages/${id}`, {
      method: 'DELETE',
    });
  }

  async getUnreadCount() {
    return this.request('/messages/unread-count');
  }
}

export const apiService = new ApiService();
export default apiService;

