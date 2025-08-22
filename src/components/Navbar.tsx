import {
  Button,
  makeStyles,
  Text,
  typographyStyles,
} from '@fluentui/react-components';
import { SettingsRegular } from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  title: {
    ...typographyStyles.title2,
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0px 35px',
    borderBottom: '1px solid black',
  },
});

export const Navbar = () => {
  const navigate = useNavigate();
  const styles = useStyles();
  return (
    <nav className={styles.nav}>
      <Text as="h1" className={styles.title}>
        Kitameraki Test
      </Text>
      <div className="">
        <Button
          onClick={() => navigate('/form-config')}
          appearance="subtle"
          icon={<SettingsRegular />}
        >
          Form Config
        </Button>
      </div>
    </nav>
  );
};
