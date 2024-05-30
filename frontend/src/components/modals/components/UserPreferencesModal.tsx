import { Checkbox, Grid, Text, Tooltip } from '@mantine/core';
import type { ChangeEvent, FC } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { doApiAction } from '@/lib/api';
import type { UserPreferences } from '@/types/userpreferences';
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
  const queryClient = useQueryClient();

  if (!user) throw new Error('No user for preferences modal');

  const { data: userPreferences } = useQuery({
    queryKey: ['preferences'],
    queryFn: () =>
      doApiAction<UserPreferences>({
        endpoint: `/preferences/${user.id}`,
        method: 'GET',
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      preferenceType,
      state,
    }: {
      preferenceType: number;
      state: boolean;
    }) =>
      doApiAction({
        endpoint: `/preferences/${user.id}/${state ? 'on' : 'off'}`,
        method: 'POST',
        body: JSON.stringify(preferenceType),
      }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
    },
  });

  const handleCheckboxChange = (preferenceKey: keyof UserPreferences) => {
    const preferenceType = mapToPreferenceType(preferenceKey);
    if (!preferenceType) throw new Error('Invalid preference type');

    return (event: ChangeEvent<HTMLInputElement>) => {
      updateMutation.mutate({
        preferenceType,
        state: event.currentTarget.checked,
      });
    };
  };

  return (
    <Modal title={t('preferences:title')}>
      <Grid align='center'>
        <Grid.Col span='auto'>
          <Text fw={700}>{t('preferences:notificationTitle')}</Text>
        </Grid.Col>
        <Grid.Col span='content'>
          <Tooltip
            label={t('preferences:systemNotification')}
            position='right'
            transitionProps={{ transition: 'rotate-right', duration: 300 }}
          >
            <IconMessage size={20} />
          </Tooltip>
        </Grid.Col>
        <Grid.Col
          span='content'
          offset={1}
        >
          <Tooltip
            label={t('preferences:emailNotification')}
            position='right'
            transitionProps={{ transition: 'rotate-right', duration: 300 }}
          >
            <IconMail size={20} />
          </Tooltip>
        </Grid.Col>
      </Grid>
      <Grid align='center'>
        <Grid.Col span='auto'>
          <Text>{t('preferences:notificationOrderStatusTitle')}</Text>
        </Grid.Col>
        <Grid.Col span='content'>
          <Checkbox
            checked={userPreferences?.systemNotificationOrderStatus}
            onChange={handleCheckboxChange('systemNotificationOrderStatus')}
          />
        </Grid.Col>
        <Grid.Col
          span='content'
          offset={1}
        >
          <Checkbox
            checked={userPreferences?.emailNotificationOrderStatus}
            onChange={handleCheckboxChange('emailNotificationOrderStatus')}
          />
        </Grid.Col>
      </Grid>
      <Grid align='center'>
        <Grid.Col span='auto'>
          <Text>{t('preferences:notificationOrderRequestTitle')}</Text>
        </Grid.Col>
        <Grid.Col span='content'>
          <Checkbox
            checked={userPreferences?.systemNotificationOrderRequest}
            onChange={handleCheckboxChange('systemNotificationOrderRequest')}
          />
        </Grid.Col>
        <Grid.Col
          span='content'
          offset={1}
        >
          <Checkbox
            checked={userPreferences?.emailNotificationOrderRequest}
            onChange={handleCheckboxChange('emailNotificationOrderRequest')}
          />
        </Grid.Col>
      </Grid>
    </Modal>
  );
};
