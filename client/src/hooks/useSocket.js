import { useEffect, useState, useCallback } from 'react';
import socket from '../api/socket';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      console.log('[Socket] Connected to server, ID:', socket.id);
      setIsConnected(true);
    }

    function onDisconnect(reason) {
      console.log('[Socket] Disconnected from server. Reason:', reason);
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  const emit = useCallback((eventName, data) => {
    if (!socket.connected) {
      console.warn('[Socket] Attempted to emit event while disconnected:', eventName);
      socket.connect();
    }
    socket.emit(eventName, data);
  }, []);

  const on = useCallback((eventName, callback) => {
    socket.on(eventName, callback);
    return () => socket.off(eventName, callback);
  }, []);

  return {
    socket,
    isConnected,
    emit,
    on
  };
};

export default useSocket;