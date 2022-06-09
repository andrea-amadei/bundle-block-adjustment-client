import { useSelector } from 'react-redux';
import { useState } from 'react';
import {
  addNewMessage,
  selectNextMessage,
  selectQueueLength
} from '../../core/model/slices/messages/messageQueueSlice';
import { store } from '../../core/model/store';

export function ResultsPage() {
  const lastMessage = useSelector(selectNextMessage);
  const length = useSelector(selectQueueLength);

  const [message, setMessage] = useState('No message');
  const [symbol, setSymbol] = useState('mood');
  const [status, setStatus] = useState('success');

  return (
    <div className="results-page">
      <h1>Notifications Testing Center</h1>
      <div>{`Last message: ${lastMessage?.status}, ${lastMessage?.symbol}, ${lastMessage?.message}`}</div>
      <div>{`Queue length: ${length}`}</div>
      <hr />
      <select name="status" style={{backgroundColor: 'black'}} onChange={(event) => setStatus(event.target.value)}>
        <option value="success">Success</option>
        <option value="error">Error</option>
        <option value="warning">Warning</option>
        <option value="info">Info</option>
      </select>
      <input type="text" style={{backgroundColor: 'black'}} onChange={(event) => setMessage(event.target.value)} value={message} />
      <input type="text" style={{backgroundColor: 'black'}} onChange={(event) => setSymbol(event.target.value)} value={symbol} />
      <br />
      <button onClick={() => store.dispatch(addNewMessage({message, status, symbol}))}>SEND NOTIFICATION</button>
    </div>
  );
}
