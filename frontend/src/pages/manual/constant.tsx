import { Title, Anchor, List, Text } from '@mantine/core';
import type { Components } from 'react-markdown';

export const MARKDOWN_COMPONENTS: Partial<Components> = {
  h1: ({ children }) => <Title>{children}</Title>,
  h2: ({ children }) => <Title order={2}>{children}</Title>,
  h3: ({ children }) => <Title order={4}>{children}</Title>,
  p: ({ children }) => <Text>{children}</Text>,
  strong: ({ children }) => (
    <Text
      fw={700}
      span
    >
      {children}
    </Text>
  ),
  em: ({ children }) => (
    <Text
      fs='italic'
      span
    >
      {children}
    </Text>
  ),
  a: ({ children, href }) => (
    <Anchor
      href={href}
      target='_blank'
      underline='always'
    >
      {children}
    </Anchor>
  ),
  ul: ({ children }) => <List>{children}</List>,
  ol: ({ children }) => <List type='ordered'>{children}</List>,
};
