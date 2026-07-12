import { useEffect, useRef, useCallback, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { tokenStore } from '../api/axiosInstance';

const WS_URL = import.meta.env.VITE_WS_URL || '/ws';

/**
 * Connects to the Spring Boot STOMP endpoint and subscribes to the given
 * topics. Returns connection status and a `publish` helper.
 *
 * Example:
 *   const { connected, publish } = useWebSocket(
 *     ['/topic/complaints', `/user/queue/notifications`],
 *     (destination, payload) => { ... }
 *   );
 */
export function useWebSocket(topics = [], onMessage) {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = tokenStore.getAccess();
    if (!token || topics.length === 0) return undefined;

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 4000,
      onConnect: () => {
        setConnected(true);
        topics.forEach((topic) => {
          client.subscribe(topic, (message) => {
            try {
              const payload = JSON.parse(message.body);
              onMessage?.(topic, payload);
            } catch {
              onMessage?.(topic, message.body);
            }
          });
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError: () => setConnected(false),
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(topics)]);

  const publish = useCallback((destination, body) => {
    clientRef.current?.publish({ destination, body: JSON.stringify(body) });
  }, []);

  return { connected, publish };
}
