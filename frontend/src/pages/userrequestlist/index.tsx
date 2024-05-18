import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Tabs } from '@mantine/core';
import styles from './styles/userRequestList.module.scss';
import { useNavigate } from '@tanstack/react-router';
import { IconArrowRight, IconTrash } from '@tabler/icons-react';
import { Table } from '@/components/table';
import { doApiAction, type GenericAPIResponse } from '@/lib/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { dateConverter } from '@/lib/util/dateConverter';
import { STATUSES } from './constants';
import { notifications } from '@/components/notifications';
import { ConfirmModal } from '@/components/modals';
import { useModalStore } from '@/stores/useModalStore';
import type { UserRequest } from '@/types/api';
import { MultiSearch } from '@/components/multisearch';

export const UserRequestListPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchValues, setSearchValues] = useState<string[]>([]);
  const { openModal, closeModal } = useModalStore();
  const client = useQueryClient();

  const { data: userRequests, status } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['userRequestListValues'],
    queryFn: () =>
      doApiAction<UserRequest[]>({
        endpoint: '/user-requests/all',
        method: 'GET',
      }),
  });

  if (status === 'pending' || status === 'error' || userRequests == null) {
    return (
      <div className={styles.table_handling}>
        {status === 'pending' && t('userRequestListPage:tableLoading')}
        {status === 'error' && t('userRequestListPage:tableError')}
        {userRequests === null && t('userRequestListPage:tableEmpty')}
      </div>
    );
  }

  const deleteUserRequest = async (userRequest: UserRequest) => {
    const result = await doApiAction<GenericAPIResponse<{ message: string }>>({
      endpoint: `/user-requests/${userRequest.followId}/delete`,
      method: 'POST',
    });

    notifications.add({
      message: t(result?.message ?? 'notifications:genericError'),
      autoClose: 10000,
    });

    client.invalidateQueries({ queryKey: ['userRequestListValues'] });
  };

  const handleDeleteClick = (userRequest: UserRequest) => {
    openModal(
      <ConfirmModal
        title={t('appshell:deleteRequestConfirmation:deleteConfirmTitle')}
        text={t('appshell:deleteRequestConfirmation:deleteConfirmText')}
        onConfirm={() => {
          closeModal();
          deleteUserRequest(userRequest);
        }}
      />
    );
  };

  const tableData = userRequests.reduce<
    Partial<
      Record<
        UserRequest['status'],
        {
          followId: string;
          companyName: string;
          createdOn: string;
          vatNr: string;
          contactPerson: string;
          denyMessage: string;
          buttons: JSX.Element;
        }[]
      >
    >
  >((acc, userRequest) => {
    const requestsForStatus = (acc[userRequest.status] ??= []);
    requestsForStatus.push({
      followId: `#${userRequest.followId}`,
      companyName: userRequest.companyName,
      createdOn: dateConverter(userRequest.createdOn),
      vatNr: userRequest.vatNr,
      contactPerson: `${userRequest.firstName} ${userRequest.lastName}`,
      denyMessage: `${userRequest.denyMessage}`,
      buttons:
        userRequest.status === 'PENDING' ? (
          <ActionIcon
            key={`value_${userRequest.followId}`}
            onClick={() => {
              navigate({
                to: '/app/requests/$request_id',
                params: {
                  request_id: userRequest.followId.toString(),
                },
              });
            }}
          >
            <IconArrowRight />
          </ActionIcon>
        ) : userRequest.status === 'DENIED' ? (
          <ActionIcon
            key={`denied_${userRequest.followId}`}
            onClick={() => {
              handleDeleteClick(userRequest);
            }}
          >
            <IconTrash />
          </ActionIcon>
        ) : (
          <></>
        ),
    });
    return acc;
  }, {});

  return (
    <div className={styles.userrequest_list_page}>
      <div className={styles.header}>
        <MultiSearch
          onChange={newValues => setSearchValues(newValues)}
          inputWidth='30rem'
        />
      </div>
      <Tabs
        defaultValue={STATUSES[0]}
        variant='outline'
        className={styles.body}
      >
        <Tabs.List>
          {STATUSES.map(status => (
            <Tabs.Tab
              key={status}
              value={status}
              leftSection={
                status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
              }
            />
          ))}
        </Tabs.List>
        {STATUSES.map(status => (
          <Tabs.Panel
            key={status}
            value={status}
            className={styles.userrequest_table}
          >
            <Table
              searchValue={searchValues}
              storageKey='userrequest_list'
              translationKey='userRequestListPage:table'
              columns={[
                { key: 'followId', defaultSort: true },
                { key: 'companyName', initialWidth: 300 },
                { key: 'createdOn', initialWidth: 300 },
                { key: 'vatNr' },
                { key: 'contactPerson', initialWidth: 200 },
                ...(status === 'DENIED'
                  ? [{ key: 'denyMessage', initialWidth: 300 }]
                  : []),
                ...(status !== 'APPROVED'
                  ? [
                      {
                        key: 'buttons',
                        emptyHeader: true,
                        disallowSorting: true,
                        disableResizing: true,
                      },
                    ]
                  : []),
              ]}
              data={tableData[status] ?? []}
            />
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  );
};
