'use client';
import store from '@/store/store';
import React, {ReactNode ,useEffect,useState} from 'react'
import { Provider } from 'react-redux';
import { Persistor ,persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { SocketProvider } from '../components/Socket/SocketProvider'; 

const ClientProvider = ({children}:{children:ReactNode}) => {
  const [persistor , setPersistor] = useState<Persistor | null>(null);

  useEffect(() => {
    const clientPersistor = persistStore(store);
    setPersistor(clientPersistor);
  },[]);

  if(!persistor) return null;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketProvider>
        {children}
        </SocketProvider>
      </PersistGate>
    </Provider>
  )
};


export default ClientProvider;