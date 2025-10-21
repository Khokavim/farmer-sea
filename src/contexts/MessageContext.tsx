import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Message, Conversation, MessageFilters, ConversationFilters } from '@/types/message';

// Mock data for development - replace with actual API calls
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    participants: [
      {
        id: 'buyer-1',
        name: 'John Doe',
        role: 'buyer',
        avatar: '/placeholder.svg',
      },
      {
        id: 'farmer-1',
        name: 'Jane Smith',
        role: 'farmer',
        avatar: '/placeholder.svg',
      },
    ],
    lastMessage: {
      id: '1',
      conversationId: '1',
      senderId: 'farmer-1',
      senderName: 'Jane Smith',
      senderRole: 'farmer',
      content: 'Your order has been shipped and is on its way!',
      type: 'order_update',
      status: 'delivered',
      metadata: {
        orderId: 'ORD-001',
      },
      createdAt: '2025-01-15T14:30:00Z',
      updatedAt: '2025-01-15T14:30:00Z',
    },
    unreadCount: 0,
    isActive: true,
    orderId: 'ORD-001',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T14:30:00Z',
  },
  {
    id: '2',
    participants: [
      {
        id: 'buyer-2',
        name: 'Mike Johnson',
        role: 'buyer',
        avatar: '/placeholder.svg',
      },
      {
        id: 'supplier-1',
        name: 'Sarah Wilson',
        role: 'supplier',
        avatar: '/placeholder.svg',
      },
    ],
    lastMessage: {
      id: '2',
      conversationId: '2',
      senderId: 'buyer-2',
      senderName: 'Mike Johnson',
      senderRole: 'buyer',
      content: 'When will the tomatoes be available?',
      type: 'text',
      status: 'read',
      createdAt: '2025-01-14T16:45:00Z',
      updatedAt: '2025-01-14T16:45:00Z',
    },
    unreadCount: 1,
    isActive: true,
    productId: '2',
    createdAt: '2025-01-14T16:00:00Z',
    updatedAt: '2025-01-14T16:45:00Z',
  },
];

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    conversationId: '1',
    senderId: 'buyer-1',
    senderName: 'John Doe',
    senderRole: 'buyer',
    content: 'Hi, I\'m interested in your Jos Irish Potatoes. Are they available?',
    type: 'text',
    status: 'read',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    conversationId: '1',
    senderId: 'farmer-1',
    senderName: 'Jane Smith',
    senderRole: 'farmer',
    content: 'Yes, we have 50 tonnes available. Grade A quality, freshly harvested.',
    type: 'text',
    status: 'read',
    createdAt: '2025-01-15T10:15:00Z',
    updatedAt: '2025-01-15T10:15:00Z',
  },
  {
    id: '3',
    conversationId: '1',
    senderId: 'buyer-1',
    senderName: 'John Doe',
    senderRole: 'buyer',
    content: 'Perfect! I\'d like to order 5 tonnes. What\'s the best price?',
    type: 'text',
    status: 'read',
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
  },
  {
    id: '4',
    conversationId: '1',
    senderId: 'farmer-1',
    senderName: 'Jane Smith',
    senderRole: 'farmer',
    content: 'For 5 tonnes, I can offer ₦450/kg. This includes free shipping to Lagos.',
    type: 'text',
    status: 'read',
    createdAt: '2025-01-15T10:45:00Z',
    updatedAt: '2025-01-15T10:45:00Z',
  },
  {
    id: '5',
    conversationId: '1',
    senderId: 'buyer-1',
    senderName: 'John Doe',
    senderRole: 'buyer',
    content: 'That sounds good. I\'ll place the order now.',
    type: 'text',
    status: 'read',
    createdAt: '2025-01-15T11:00:00Z',
    updatedAt: '2025-01-15T11:00:00Z',
  },
  {
    id: '6',
    conversationId: '1',
    senderId: 'farmer-1',
    senderName: 'Jane Smith',
    senderRole: 'farmer',
    content: 'Your order has been shipped and is on its way!',
    type: 'order_update',
    status: 'delivered',
    metadata: {
      orderId: 'ORD-001',
    },
    createdAt: '2025-01-15T14:30:00Z',
    updatedAt: '2025-01-15T14:30:00Z',
  },
];

type MessageAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: Message }
  | { type: 'SET_ACTIVE_CONVERSATION'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: MessageFilters }
  | { type: 'SET_ERROR'; payload: string | null };

interface MessageState {
  conversations: Conversation[];
  messages: Message[];
  activeConversationId: string | null;
  filters: MessageFilters;
  isLoading: boolean;
  error: string | null;
}

const initialState: MessageState = {
  conversations: [],
  messages: [],
  activeConversationId: null,
  filters: {},
  isLoading: false,
  error: null,
};

const messageReducer = (state: MessageState, action: MessageAction): MessageState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload, isLoading: false };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload, isLoading: false };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id ? action.payload : msg
        ),
      };
    case 'SET_ACTIVE_CONVERSATION':
      return { ...state, activeConversationId: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

const MessageContext = createContext<{
  state: MessageState;
  getConversations: () => Promise<void>;
  getMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string, type?: string) => Promise<Message>;
  createConversation: (participantIds: string[], orderId?: string, productId?: string) => Promise<Conversation>;
  setActiveConversation: (conversationId: string | null) => void;
  markAsRead: (messageId: string) => Promise<void>;
  setFilters: (filters: MessageFilters) => void;
} | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, initialState);

  // Load conversations on mount
  useEffect(() => {
    getConversations();
  }, []);

  const getConversations = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      dispatch({ type: 'SET_CONVERSATIONS', payload: MOCK_CONVERSATIONS });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load conversations' });
    }
  };

  const getMessages = async (conversationId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      const conversationMessages = MOCK_MESSAGES.filter(
        msg => msg.conversationId === conversationId
      );
      dispatch({ type: 'SET_MESSAGES', payload: conversationMessages });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load messages' });
    }
  };

  const sendMessage = async (
    conversationId: string, 
    content: string, 
    type: string = 'text'
  ): Promise<Message> => {
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newMessage: Message = {
        id: Date.now().toString(),
        conversationId,
        senderId: 'current-user-id', // Get from auth context
        senderName: 'Current User', // Get from auth context
        senderRole: 'buyer', // Get from auth context
        content,
        type: type as any,
        status: 'sent',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
      return newMessage;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to send message' });
      throw error;
    }
  };

  const createConversation = async (
    participantIds: string[], 
    orderId?: string, 
    productId?: string
  ): Promise<Conversation> => {
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newConversation: Conversation = {
        id: Date.now().toString(),
        participants: participantIds.map(id => ({
          id,
          name: 'Participant', // Get from user data
          role: 'buyer', // Get from user data
        })),
        unreadCount: 0,
        isActive: true,
        orderId,
        productId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return newConversation;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create conversation' });
      throw error;
    }
  };

  const setActiveConversation = (conversationId: string | null) => {
    dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: conversationId });
    if (conversationId) {
      getMessages(conversationId);
    }
  };

  const markAsRead = async (messageId: string): Promise<void> => {
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const message = state.messages.find(msg => msg.id === messageId);
      if (message) {
        const updatedMessage = {
          ...message,
          status: 'read' as MessageStatus,
          readAt: new Date().toISOString(),
        };
        dispatch({ type: 'UPDATE_MESSAGE', payload: updatedMessage });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to mark message as read' });
    }
  };

  const setFilters = (filters: MessageFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const value = {
    state,
    getConversations,
    getMessages,
    sendMessage,
    createConversation,
    setActiveConversation,
    markAsRead,
    setFilters,
  };

  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>;
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};

