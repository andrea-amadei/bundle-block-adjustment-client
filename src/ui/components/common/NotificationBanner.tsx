import './NotificationBanner.scss';

import { useSelector } from 'react-redux';
import { useState } from 'react';
import {
  popMessage,
  selectNextMessage,
  selectQueueLength,
} from '../../../core/model/slices/messages/messageQueueSlice';
import { store } from '../../../core/model/store';

export function NotificationBanner() {
  const symbols = {
    success: 'check_circle',
    error: 'cancel',
    warning: 'warning',
    info: 'info',
  };

  // FIXME: check NotificationBanner.scss:15
  const showingTime = 5000;
  const fadingOutTime = 200 + 50;

  const [messageShowing, setMessageShowing] = useState(false);
  const [fading, setFading] = useState(false);
  const [fadeTimeout, setFadeTimeout] = useState<NodeJS.Timeout | null>(null);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

  function endFadeout() {
    store.dispatch(popMessage());
    setMessageShowing(false);
    setFading(false);

    if (fadeTimeout !== null) clearTimeout(fadeTimeout);
    if (closeTimeout !== null) clearTimeout(closeTimeout);

    setFadeTimeout(null);
    setCloseTimeout(null);
  }

  function startFadeout() {
    setFading(true);
    setCloseTimeout(setTimeout(() => endFadeout(), fadingOutTime));
  }

  const message = useSelector(selectNextMessage);
  const messagesInQueue = useSelector(selectQueueLength) - 1;
  let symbol;

  if (message !== undefined) {
    if (fadeTimeout === null) {
      setMessageShowing(true);
      setFadeTimeout(setTimeout(() => startFadeout(), showingTime));
    }

    if (message.symbol === null || message.symbol === '')
      symbol = symbols[message.status];
    else
      symbol = message.symbol;
  }

  return (
    <div className={`notification-banner ${message?.status} ${fading ? 'fading' : ''} ${!messageShowing ? 'hidden' : ''}`}>
      <div className="notification-symbol">
        <span className="material-symbols-outlined">{symbol}</span>
      </div>
      <div className="notification-area">
        <div className="notification-message">{message?.message}</div>
        <div className="notification-other">
          {messagesInQueue > 0 ? `${messagesInQueue} more left` : ''}
        </div>
      </div>
      <div className="notification-close material-symbols-outlined" onClick={() => startFadeout()}>close</div>
    </div>
  );
}
