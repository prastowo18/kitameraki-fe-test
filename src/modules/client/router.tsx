import { RouteObject } from 'react-router-dom';

import Home from './views/Home';

const clientRoutes: RouteObject[] = [
  {
    path: '',
    element: <Home />,
  },
];

export default clientRoutes;
