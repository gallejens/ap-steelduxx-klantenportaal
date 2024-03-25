import type { ReactNode } from 'react';

export namespace NTable {
  export type Column<T extends string> = {
    key: T;
    excludeFromSearch?: boolean; // if true, do not use this column for search
    disallowSorting?: boolean;
    defaultSort?: boolean; // if true, rows will be sorted on this column by default
    transform?: (value: any) => ReactNode;
    initialWidth?: number; // width of the column in pixels
    minimumWidth?: number; // minimum width of the column in pixels
    emptyHeader?: boolean; // if true, the header will be empty
    disableResizing?: boolean; // if true, the column will not be resizable
  };

  export type Row<T extends string> = Record<
    T,
    string | number | JSX.Element | null | undefined
  >;

  export type Props<T extends string> = {
    columns: Column<T>[];
    data: Row<NoInfer<T>>[];
    storageKey?: string; // if provided, the column widths will be saved to local storage
    translationKey: string; // localizations will be gotten from that key using the column keys
    emptyCellPlaceholder?: string; // placeholder to place in empty cells (default: '-')
    searchValue?: string | null; // searchvalue to filter the table
    onRowClick?: (row: any) => void; // to something when row is clicked
  };

  export type Sort<T> = {
    column: T;
    direction: 'asc' | 'desc';
  };
}
