import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { UserRequestTable } from './components/UserRequestTable';
import styles from './styles/userRequestList.module.scss';

export const userRequestListPage: FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.userrequest_table_page}>
      <div className={styles.header}></div>

      <div className={styles.body}>
        <div className={styles.userrequest_table}>
          <UserRequestTable />
        </div>
      </div>

      <div className={styles.footer}></div>
    </div>
  );
};
