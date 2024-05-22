import { Switch, Group, Title, Flex } from '@mantine/core';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Modal } from '..';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { doApiAction } from '@/lib/api';
import { UserPreferences } from '@/types/userpreferences';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useMantineTheme, rem } from '@mantine/core';

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
  const theme = useMantineTheme();

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

  const handleSwitchChange =
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
      <Flex
        direction='column'
        gap='md'
      >
        <Title order={3}>{t('preferences:notificationOrderStatusTitle')}</Title>
        <Group>
          <Switch
            checked={preferences.systemNotificationOrderStatus}
            onChange={handleSwitchChange('systemNotificationOrderStatus')}
            label={t('preferences:systemNotificationOrderStatus')}
            color='teal'
            size='md'
            thumbIcon={
              preferences.systemNotificationOrderStatus ? (
                <IconCheck
                  style={{ width: rem(12), height: rem(12) }}
                  color={theme.colors.teal[6]}
                  stroke={3}
                />
              ) : (
                <IconX
                  style={{ width: rem(12), height: rem(12) }}
                  color={theme.colors.red[6]}
                  stroke={3}
                />
              )
            }
          />
          <Switch
            checked={preferences.emailNotificationOrderStatus}
            onChange={handleSwitchChange('emailNotificationOrderStatus')}
            label={t('preferences:emailNotificationOrderStatus')}
            color='teal'
            size='md'
            thumbIcon={
              preferences.emailNotificationOrderStatus ? (
                <IconCheck
                  style={{ width: rem(12), height: rem(12) }}
                  color={theme.colors.teal[6]}
                  stroke={3}
                />
              ) : (
                <IconX
                  style={{ width: rem(12), height: rem(12) }}
                  color={theme.colors.red[6]}
                  stroke={3}
                />
              )
            }
          />
        </Group>
        <Title order={3}>
          {t('preferences:notificationOrderRequestTitle')}
        </Title>
        <Group>
          <Switch
            checked={preferences.systemNotificationOrderRequest}
            onChange={handleSwitchChange('systemNotificationOrderRequest')}
            label={t('preferences:systemNotificationOrderRequest')}
            color='teal'
            size='md'
            thumbIcon={
              preferences.systemNotificationOrderRequest ? (
                <IconCheck
                  style={{ width: rem(12), height: rem(12) }}
                  color={theme.colors.teal[6]}
                  stroke={3}
                />
              ) : (
                <IconX
                  style={{ width: rem(12), height: rem(12) }}
                  color={theme.colors.red[6]}
                  stroke={3}
                />
              )
            }
          />
          <Switch
            checked={preferences.emailNotificationOrderRequest}
            onChange={handleSwitchChange('emailNotificationOrderRequest')}
            label={t('preferences:emailNotificationOrderRequest')}
            color='teal'
            size='md'
            thumbIcon={
              preferences.emailNotificationOrderRequest ? (
                <IconCheck
                  style={{ width: rem(12), height: rem(12) }}
                  color={theme.colors.teal[6]}
                  stroke={3}
                />
              ) : (
                <IconX
                  style={{ width: rem(12), height: rem(12) }}
                  color={theme.colors.red[6]}
                  stroke={3}
                />
              )
            }
          />
        </Group>
      </Flex>
    </Modal>
  );
};
