import { makeStyles, Text, typographyStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  title: {
    ...typographyStyles.title2,
  },
  nav: {
    display: 'flex',
    padding: '0px 35px',
    borderBottom: '1px solid black',
  },
});

export const Navbar = () => {
  const styles = useStyles();
  return (
    <nav className={styles.nav}>
      <Text as="h1" className={styles.title}>
        Kitameraki Test
      </Text>
    </nav>
  );
};
