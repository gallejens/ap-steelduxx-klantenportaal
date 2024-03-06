import { PublicPageWrapper } from '@/components/publicpagewrapper';
import { SteelLogo } from '@/components/steellogo';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginFooter } from './components/LoginFooter';
import { LoginForm } from './components/LoginForm';
import styles from './styles/login.module.scss';

export const LoginPage: FC = () => {
  const { t } = useTranslation();

  return (
    <PublicPageWrapper
      title={t('loginpage:title')}
      footer={<LoginFooter />}
      panelWidth='80vh'
    >
      <div className={styles.login_page}>
        <SteelLogo
          width='35%'
          className={styles.logo}
        />
        <LoginForm />
      </div>
    </PublicPageWrapper>
  );
};
