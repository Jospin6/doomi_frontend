// store/messagingSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {store} from '../store';
import { baseUrl, webSocketUrl } from '@/helpers/constants';

const socket = new WebSocket(webSocketUrl);

interface Message {
  id: string;
  content: string;
  senderId: string;
  conversationId: string;
  sentAt: string;
}

interface Conversation {
  id: string;
  name?: string;
  isGroup: boolean;
  users: string[];
  messages: Message[];
}

interface MessagingState {
  conversations: Conversation[];
  selectedConversation?: Conversation;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: MessagingState = {
  conversations: [],
  status: 'idle',
};

export const fetchConversations = createAsyncThunk(
  'messaging/fetchConversations',
  async (userId: string) => {
    const response = await axios.get(`${baseUrl}/conversations/user/${userId}`);
    return response.data;
  }
);

const messagingSlice = createSlice({
  name: 'messaging',
  initialState,
  reducers: {
    sendMessage: (state, action) => {
      const { conversationId, message, senderId } = action.payload;
      socket.send(JSON.stringify({ event: 'sendMessage', data: { conversationId, message, senderId } }));
    },
    receiveMessage: (state, action) => {
      const message: Message = action.payload;
      const conversation = state.conversations.find(c => c.id === message.conversationId);
      if (conversation) {
        conversation.messages.push(message);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.status = 'idle';
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { sendMessage, receiveMessage } = messagingSlice.actions;
export default messagingSlice.reducer;

// Gestion de la réception des messages via WebSocket
socket.onmessage = (event) => {
  const messageData = JSON.parse(event.data);
  if (messageData.event === 'receiveMessage') {
    store.dispatch(receiveMessage(messageData.data));
  }
};
