# Steelduxx Klantenportaal

## Development

- Node version 20.11.1
- `npm install` to install packages
- `npm run dev` to start dev environment

## Stack

- [React](https://react.dev/) - Framework
- [Vite](https://vitejs.dev/guide/) - Buildtool
- [Mantine](https://mantine.dev/getting-started/) - Component library
- [Tanstack Query](https://tanstack.com/query/latest/docs/framework/react/overview) - Managing api requests
- [Tanstack Router](https://tanstack.com/router/latest/docs/framework/react/overview) - Clientside routing
- [i18n](https://react.i18next.com/getting-started) - Internationalization
- [TablerIcons](https://tabler.io/icons) - Icons
- [SASS](https://sass-lang.com/) - Stylesheets
- [Zustand](https://github.com/pmndrs/zustand) - Global state management

## Folder structure

- `src` - Rootfolder

  - `components` - Reusable components
  - `pages` - Pages
  - `styles` - Global styles
  - `lib` - Utils
  - `hooks` - Reusable custom hooks
  - `stores` Reusable global statestores

- `page folder` - Folder inside pages folder
  - Every page could contain the above folders but for that specific component, those files should not be used outside of that component
  - index.tsx should export the page component

By using this structure we can keep the codebase clean and easy to navigate.

## Styling

- Use scss modules for styling. By using modules we avoid applying global styles and limit it to a specific component.

  - Name the file xxx.module.scss to make it a module.

- Import a scss file like this:

  ```ts
  import styles from './Component.module.scss';
  ```

  then use it like this

  ```tsx
  <div className={styles.classname}>xxx</div>
  ```

- SCSS is basically CSS but has a few extra features, any plain css is also valid so no need to explicitly use scss features.

