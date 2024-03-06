import { checkPasswordRequirements } from '@/lib/password';
import {
  Divider,
  PasswordInput,
  Popover,
  type PasswordInputProps,
} from '@mantine/core';
import { useState, type FC, type PropsWithChildren } from 'react';
import { PasswordRequirement } from './components/PasswordRequirement';
import { useTranslation } from 'react-i18next';
import styles from './styles/passwordinputwithrequirements.module.scss';

export const PasswordInputWithRequirements: FC<
  PropsWithChildren<PasswordInputProps>
> = ({ children, ...passwordInputProps }) => {
  const { t } = useTranslation();
  const [popoverOpened, setPopoverOpened] = useState(false);

  const handleInputFocus = () => {
    setPopoverOpened(true);
  };

  const handleInputBlur = () => {
    setPopoverOpened(false);
  };

  const requirements = checkPasswordRequirements(
    String(passwordInputProps.value) ?? ''
  );

  return (
    <Popover
      opened={popoverOpened}
      position='bottom'
      width={'target'}
      transitionProps={{ transition: 'pop' }}
    >
      <Popover.Target>
        <div
          onFocusCapture={handleInputFocus}
          onBlurCapture={handleInputBlur}
        >
          <PasswordInput {...passwordInputProps} />
        </div>
      </Popover.Target>
      <Popover.Dropdown>
        <div className={styles.popover}>
          {requirements.individual.map(r => (
            <PasswordRequirement
              key={`passwordrequirement_${r.labelKey}`}
              fulfilled={r.fulfilled}
              label={t(r.labelKey)}
            />
          ))}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};
