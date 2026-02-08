import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import { Conversation, Message, MessageFilters, MessageStatus } from '@/types/message';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContextNew';

type BackendParticipant = {
  id?: string;
  name?: string;
  role?: string;
  profileImage?: string;
};

type BackendMessage = {
  id?: string;
  conversationId?: string;
  senderId?: string;
  sender?: BackendParticipant;
  content?: string;
  messageType?: string;
  isRead?: boolean;
  createdAt?: string;
  updatedAt?: string;
  readAt?: string | null;
};

type BackendConversation = {
  id?: string;
  participants?: BackendParticipant[];
  messages?: BackendMessage[];
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  unreadCount?: number;
  isActive?: boolean;
  orderId?: string;
  productId?: string;
  createdAt?: string;
  updatedAt?: string;
};

const mapMessage = (message: BackendMessage): Message => {
  const sender = message?.sender;
  const status: MessageStatus = message?.isRead ? 'read' : 'delivered';

  return {
    id: message?.id || '',
    conversationId: message?.conversationId || '',
    senderId: message?.senderId || sender?.id || '',
    senderName: sender?.name || 'Unknown',
    senderRole: (sender?.role as Message['senderRole']) || 'buyer',
    content: message?.content || '',
    type: (message?.messageType as Message['type']) || 'text',
    status,
    createdAt: message?.createdAt || new Date().toISOString(),
    updatedAt: message?.updatedAt || new Date().toISOString(),
    readAt: message?.readAt || undefined,
  };
};

const mapConversation = (conversation: BackendConversation, currentUserId?: string | null): Conversation => {
  const participants = Array.isArray(conversation?.participants)
    ? conversation.participants.map((participant) => ({
        id: participant?.id || '',
        name: participant?.name || 'Unknown',
        role: (participant?.role as Conversation['participants'][number]['role']) || 'buyer',
        avatar: participant?.profileImage || undefined,
      }))
    : [];

  const sortedParticipants = currentUserId
    ? [...participants].sort((a) => (a.id === currentUserId ? 1 : -1))
    : participants;

  const lastMessage = Array.isArray(conversation?.messages) && conversation.messages.length > 0
    ? mapMessage(conversation.messages[0] as BackendMessage)
    : typeof conversation?.lastMessage === 'string' && conversation.lastMessage
      ? {
          id: `last-${conversation.id || ''}`,
          conversationId: conversation.id || '',
          senderId: '',
          senderName: '',
          senderRole: 'buyer',
          content: conversation.lastMessage,
          type: 'text',
          status: 'delivered',
          createdAt: conversation.lastMessageAt || conversation.updatedAt || new Date().toISOString(),
          updatedAt: conversation.lastMessageAt || conversation.updatedAt || new Date().toISOString(),
        }
      : undefined;

  return {
    id: conversation?.id || '',
    participants: sortedParticipants,
    lastMessage,
    unreadCount: conversation?.unreadCount || 0,
    isActive: Boolean(conversation?.isActive),
    orderId: conversation?.orderId || undefined,
    productId: conversation?.productId || undefined,
    createdAt: conversation?.createdAt || new Date().toISOString(),
    updatedAt: conversation?.updatedAt || new Date().toISOString(),
  };
};

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
        messages: state.messages.map((msg) => (msg.id === action.payload.id ? action.payload : msg)),
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
  const { user } = useAuth();
  const [state, dispatch] = useReducer(messageReducer, initialState);

  const getConversations = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await apiService.getConversations();
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to load conversations');
      }

      const raw = Array.isArray(response.data)
        ? response.data
        : (response.data as { data?: unknown })?.data;
      const conversations = Array.isArray(raw) ? raw : [];
      const mapped = conversations.map((conv) => mapConversation(conv as BackendConversation, user?.id));

      dispatch({ type: 'SET_CONVERSATIONS', payload: mapped });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to load conversations',
      });
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      getConversations();
    }
  }, [getConversations, user?.id]);

  const getMessages = async (conversationId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await apiService.getConversation(conversationId);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to load messages');
      }

      const payload = response.data as unknown;
      const data = (payload as { data?: unknown })?.data ?? payload;
      const rawMessages = (data as { messages?: unknown })?.messages;
      const messages = Array.isArray(rawMessages)
        ? rawMessages.map((msg) => mapMessage(msg as BackendMessage))
        : [];

      dispatch({ type: 'SET_MESSAGES', payload: messages });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load messages' });
    }
  };

  const sendMessage = async (conversationId: string, content: string, type: string = 'text'): Promise<Message> => {
    try {
      const response = await apiService.sendMessage({
        conversationId,
        content,
        messageType: type,
      });
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to send message');
      }

      const newMessage = mapMessage(response.data as BackendMessage);
      dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
      return newMessage;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to send message' });
      throw error;
    }
  };

  const createConversation = async (
    participantIds: string[],
    orderId?: string,
    productId?: string
  ): Promise<Conversation> => {
    try {
      const participantId = participantIds?.[0];
      if (!participantId) {
        throw new Error('participant_required');
      }

      const response = await apiService.createConversation(participantId);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to create conversation');
      }

      return mapConversation(response.data as BackendConversation, user?.id);
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to create conversation',
      });
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
      if (!state.activeConversationId) return;
      await apiService.markMessagesAsRead(state.activeConversationId);
      const message = state.messages.find((msg) => msg.id === messageId);
      if (message) {
        const updatedMessage = {
          ...message,
          status: 'read' as MessageStatus,
          readAt: new Date().toISOString(),
        };
        dispatch({ type: 'UPDATE_MESSAGE', payload: updatedMessage });
      }
    } catch {
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
