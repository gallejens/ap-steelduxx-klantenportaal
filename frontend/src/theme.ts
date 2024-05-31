import {
  Autocomplete,
  Divider,
  FileInput,
  NumberInput,
  Paper,
  PasswordInput,
  Select,
  TextInput,
  createTheme,
} from '@mantine/core';
import styles from './styles/mantine.module.scss';
import { PASSWORD_PLACEHOLDER } from './constants';

const PRIMARY_COLORS = [
  '#f3f3f1',
  '#dcdad5',
  '#c5c2b9',
  '#aeaa9d',
  '#979181',
  '#7e7868',
  '#545045',
  '#46433a',
  '#2a2823',
  '#241f20',
] as const;

const CUSTOM_COLORS = [
  '#f8f9fa', // custom color for alternate rows in table
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
] as const;

export const theme = createTheme({
  defaultRadius: 'xs',
  colors: {
    primary: PRIMARY_COLORS,
    custom: CUSTOM_COLORS,
  },
  primaryColor: 'primary',
  primaryShade: 9,
  black: PRIMARY_COLORS[9],
  white: PRIMARY_COLORS[0],
  components: {
    TextInput: TextInput.extend({
      defaultProps: {
        classNames: {
          label: styles.input_label,
          error: styles.input_error,
        },
      },
    }),
    PasswordInput: PasswordInput.extend({
      defaultProps: {
        classNames: {
          label: styles.input_label,
          error: styles.input_error,
        },
        placeholder: PASSWORD_PLACEHOLDER,
      },
    }),
    NumberInput: NumberInput.extend({
      defaultProps: {
        classNames: {
          label: styles.input_label,
          error: styles.input_error,
        },
      },
    }),
    Select: Select.extend({
      defaultProps: {
        classNames: {
          label: styles.input_label,
          error: styles.input_error,
        },
      },
    }),
    FileInput: FileInput.extend({
      defaultProps: {
        classNames: {
          label: styles.input_label,
          error: styles.input_error,
        },
      },
    }),
    Autocomplete: Autocomplete.extend({
      defaultProps: {
        classNames: {
          label: styles.input_label,
          error: styles.input_error,
        },
      },
    }),
    Paper: Paper.extend({
      defaultProps: {
        classNames: {
          root: styles.paper,
        },
      },
    }),
    Divider: Divider.extend({
      defaultProps: {
        color: 'var(--mantine-color-default-border)',
      },
    }),
  },
});
