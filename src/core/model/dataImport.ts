import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { store } from './store';
import { addNewMessage } from './slices/messages/messageQueueSlice';

export default function importData<T>(data: T[], importer: ActionCreatorWithPayload<T[]>) {
  try {
    store.dispatch(importer(data));

    store.dispatch(
      addNewMessage({
        message: 'File imported successfully!',
        status: 'success',
        symbol: 'file_download',
      })
    );
  } catch (error: Error) {
    store.dispatch(
      addNewMessage({
        message: error.message,
        status: 'warning',
        symbol: 'file_download',
      })
    );
  }
}
