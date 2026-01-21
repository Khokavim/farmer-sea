export type MessageType = 'text' | 'image' | 'file' | 'order_update' | 'system';
export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'buyer' | 'farmer' | 'supplier' | 'admin';
  content: string;
  type: MessageType;
  status: MessageStatus;
  metadata?: {
    orderId?: string;
    productId?: string;
    fileName?: string;
    fileSize?: number;
    imageUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
  readAt?: string;
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    role: 'buyer' | 'farmer' | 'supplier' | 'admin';
    avatar?: string;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  isActive: boolean;
  orderId?: string;
  productId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageFilters {
  conversationId?: string;
  senderId?: string;
  type?: MessageType;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface ConversationFilters {
  participantId?: string;
  orderId?: string;
  productId?: string;
  isActive?: boolean;
  search?: string;
}

