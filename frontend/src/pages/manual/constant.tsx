import { Title, Anchor, List, Text, Divider } from '@mantine/core';
import type { Components } from 'react-markdown';

export const MARKDOWN_COMPONENTS: Partial<Components> = {
  h1: ({ children }) => (
    <>
      <Title>{children}</Title>
      <Divider my='xs' />
    </>
  ),
  h2: ({ children }) => (
    <Title
      order={2}
      mt={'md'}
    >
      {children}
    </Title>
  ),
  h3: ({ children }) => (
    <Title
      order={4}
      mt={'sm'}
    >
      {children}
    </Title>
  ),
  p: ({ children }) => <Text ml={'xs'}>{children}</Text>,
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
  ul: ({ children }) => <List ml={'xs'}>{children}</List>,
  ol: ({ children }) => (
    <List
      ml={'xs'}
      type='ordered'
    >
      {children}
    </List>
  ),
};
