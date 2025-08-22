import { RouteObject } from 'react-router-dom';

import Home from './views/Home';
import FormConfig from './views/FormConfig';

const clientRoutes: RouteObject[] = [
  {
    path: '',
    element: <Home />,
  },
  {
    path: '/form-config',
    element: <FormConfig />,
  },
];

export default clientRoutes;
