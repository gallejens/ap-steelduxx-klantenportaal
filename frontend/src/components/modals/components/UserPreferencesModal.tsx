import { Checkbox, Grid, Text, Tooltip } from '@mantine/core';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { doApiAction } from '@/lib/api';
import { UserPreferences } from '@/types/userpreferences';
import { Modal } from '..';
import { IconMail, IconMessage } from '@tabler/icons-react';

const mapToPreferenceType = (key: keyof UserPreferences): number | null => {
  switch (key) {
    case 'systemNotificationOrderStatus':
      return 1;
    case 'emailNotificationOrderStatus':
      return 2;
    case 'systemNotificationOrderRequest':
      return 3;
    case 'emailNotificationOrderRequest':
      return 4;
    default:
      return null;
  }
};

export const UserPreferencesModal: FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: userpreferences } = useQuery({
    queryKey: ['preferences'],
    queryFn: () =>
      doApiAction<UserPreferences>({
        endpoint: `preferences/${user?.id}`,
        method: 'GET',
      }),
  });

  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  useEffect(() => {
    if (userpreferences) {
      setPreferences(userpreferences);
    }
  }, [userpreferences]);

  const handleCheckboxChange =
    (preferenceKey: keyof UserPreferences) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (preferences) {
        const newPreferences = {
          ...preferences,
          [preferenceKey]: event.currentTarget.checked,
        };
        setPreferences(newPreferences);

        const preferenceType = mapToPreferenceType(preferenceKey);
        if (preferenceType !== null) {
          doApiAction({
            endpoint: `/preferences/${user?.id}/${event.currentTarget.checked ? 'on' : 'off'}`,
            method: 'POST',
            body: JSON.stringify(preferenceType),
          });
        }
      }
    };

  if (!preferences) {
    return null;
  }

  return (
    <Modal title={t('preferences:title')}>
      <Grid align='center'>
        <Grid.Col span={6}>
          <Text fw={500}>{t('preferences:notificationTitle')}</Text>
        </Grid.Col>
        <Grid.Col span={3}>
          <Tooltip
            label={t(`preferences:systemNotification`)}
            position='right'
            transitionProps={{ transition: 'rotate-right', duration: 300 }}
          >
            <IconMessage size={20} />
          </Tooltip>
        </Grid.Col>
        <Grid.Col span={3}>
          <Tooltip
            label={t(`preferences:emailNotification`)}
            position='right'
            transitionProps={{ transition: 'rotate-right', duration: 300 }}
          >
            <IconMail size={20} />
          </Tooltip>
        </Grid.Col>
      </Grid>
      <Grid align='center'>
        <Grid.Col span={6}>
          <Text>{t('preferences:notificationOrderStatusTitle')}</Text>
        </Grid.Col>
        <Grid.Col span={3}>
          <Checkbox
            checked={preferences.systemNotificationOrderStatus}
            onChange={handleCheckboxChange('systemNotificationOrderStatus')}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <Checkbox
            checked={preferences.emailNotificationOrderStatus}
            onChange={handleCheckboxChange('emailNotificationOrderStatus')}
          />
        </Grid.Col>
      </Grid>
      <Grid align='center'>
        <Grid.Col span={6}>
          <Text>{t('preferences:notificationOrderRequestTitle')}</Text>
        </Grid.Col>
        <Grid.Col span={3}>
          <Checkbox
            checked={preferences.systemNotificationOrderRequest}
            onChange={handleCheckboxChange('systemNotificationOrderRequest')}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <Checkbox
            checked={preferences.emailNotificationOrderRequest}
            onChange={handleCheckboxChange('emailNotificationOrderRequest')}
          />
        </Grid.Col>
      </Grid>
    </Modal>
  );
};
