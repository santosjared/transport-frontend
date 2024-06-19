import React, { ReactNode, createContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import io from 'socket.io-client';
import getConfig from '../configs/environment';

interface SocketContextType {
  socket: Socket | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isConnected: boolean;
  connect: () => void; // Agregamos 'connect' aquí
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  isConnected: false,
  connect: () => {}, // Proporcionamos una implementación vacía por defecto
});

type Props = {
  children: ReactNode;
};

export const SocketProvider = ({ children }: Props) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [Success, setSuccess] = useState(false);
  const [Error, setError] = useState(false);
  const [Connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const newSocket = io(getConfig().backendURI, { query: { key: 'nextjs' } });
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
      newSocket.on('connect', () => {
        setSuccess(true);
        setConnected(true);
        setError(false);
      });

      newSocket.on('connect_error', () => {
        setError(true);
        setSuccess(false);
        setConnected(false);
        newSocket.disconnect();
      });

      setSocket(newSocket);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setIsSuccess(Success);
      setIsConnected(Connected);
      setIsError(Error);
    }
  }, [isLoading, socket, Success, Connected, Error]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [socket]);

  const connect = () => {
    if (!isLoading) {
      const newSocket = io(getConfig().backendURI, { query: { key: 'nextjs' } });
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
      newSocket.on('connect', () => {
        setSuccess(true);
        setConnected(true);
        setError(false);
      });

      newSocket.on('connect_error', () => {
        setError(true);
        setSuccess(false);
        setConnected(false);
        newSocket.disconnect();
      });

      setSocket(newSocket);
    }
  };

  return (
    <SocketContext.Provider value={{ isLoading, isSuccess, isError, socket, isConnected, connect }}>
      {children}
    </SocketContext.Provider>
  );
};
