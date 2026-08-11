import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { CallProvider } from './context/CallContext';
import router from './app.routes';

function App() {
  return (
    <CallProvider>
      <RouterProvider router={router} />
    </CallProvider>
  );
}

export default App;
