import { Outlet } from 'react-router-dom';

import { makeStyles } from '@fluentui/react-components';

import { Navbar } from './Navbar';

const useStyles = makeStyles({
  main: {
    padding: '30px 35px 40px 35px',
  },
});

export const ClientRoute = () => {
  const styles = useStyles();

  return (
    <main>
      <Navbar />
      <div className={styles.main}>
        <Outlet />
      </div>
    </main>
  );
};
