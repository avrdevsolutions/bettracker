import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { matchKeys } from './useMatches';
import type { Match, OddsUpdateMessage } from '@/types/api';

const WS_URL = import.meta.env.VITE_WS_URL ?? `ws://${window.location.host}`;
const RECONNECT_DELAY = 3000;

/**
 * WebSocket hook for live odds updates.
 *
 * Connects to the WS server and updates the TanStack Query cache directly
 * when odds change. This means the UI updates instantly without a network request.
 *
 * Key patterns:
 * - `active` flag prevents zombie reconnections on unmount
 * - `wsRef` tracks the latest WebSocket instance across reconnections
 * - `qc` is a stable reference so the effect runs once (no stale closure risk)
 * - `setQueryData` mutates the cache without triggering a network refetch
 */
export function useOddsWebSocket() {
  const qc = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;

    function connect() {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onmessage = (event: MessageEvent) => {
        try {
          const message: OddsUpdateMessage = JSON.parse(event.data as string);

          if (message.type === 'odds_update') {
            // Update cache directly — no refetch needed
            qc.setQueryData<Match[]>(matchKeys.all, (old) =>
              old?.map((match) =>
                match.id === message.matchId
                  ? {
                      ...match,
                      odds_home: message.odds.home,
                      odds_draw: message.odds.draw,
                      odds_away: message.odds.away,
                    }
                  : match,
              ),
            );
          }
        } catch {
          // Ignore malformed messages
        }
      };

      ws.onclose = () => {
        // Only reconnect if the component is still mounted.
        // Without this guard, ws.close() in cleanup triggers onclose
        // which schedules a zombie reconnection on a dead component.
        if (active) {
          reconnectTimerRef.current = setTimeout(connect, RECONNECT_DELAY);
        }
      };

      ws.onerror = () => {
        ws.close(); // triggers onclose → reconnect (if active)
      };
    }

    connect();

    return () => {
      // Flip the guard BEFORE closing — so onclose won't schedule a reconnect
      active = false;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      wsRef.current?.close();
    };
  }, [qc]);
}
