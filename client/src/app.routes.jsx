import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './app.layout';
import HomePage from './pages/HomePage';
import CallPage from './pages/CallPage';
import ReportPage from './pages/ReportPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'call',
        element: <CallPage />
      },
      {
        path: 'report',
        element: <ReportPage />
      }
    ]
  }
]);

export default router;


