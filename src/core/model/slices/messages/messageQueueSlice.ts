import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export interface Message {
  message: string;
  status: 'success' | 'warning' | 'error' | 'info';
  symbol?: string;
}

export interface MessageQueue {
  messages: Message[];
}

const initialState = {
  messages: [] as Message[],
} as MessageQueue;

export const messageQueueSlice = createSlice({
  name: 'messageQueue',
  initialState,

  reducers: {
    addNewMessage: (state = initialState, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },

    popMessage: (state = initialState) => {
      state.messages.shift();
    },
  },
});

export const { addNewMessage, popMessage } = messageQueueSlice.actions;

export const selectNextMessage = (state: RootState) => {
  if (state.messageQueue.messages.length > 0)
    return state.messageQueue.messages[0];

  return undefined;
};

export const selectQueueLength = (state: RootState) =>
  state.messageQueue.messages.length;

export default messageQueueSlice.reducer;
