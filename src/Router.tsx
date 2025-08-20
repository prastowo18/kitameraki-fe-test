import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import clientRoutes from './modules/client/router';

import { ClientRoute } from './components/ClientRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ClientRoute />,
    children: [...clientRoutes],
  },
]);

export default function Router() {
  return <RouterProvider router={router}></RouterProvider>;
}
