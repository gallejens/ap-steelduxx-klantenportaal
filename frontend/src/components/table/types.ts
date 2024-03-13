export namespace NTable {
  export type Column<T extends string> = {
    key: T;
    excludeFromSearch?: boolean; // if true, do not use this column for search
    disallowSorting?: boolean;
    defaultSort?: boolean; // if true, rows will be sorted on this column by default
    transform?: (value: any) => JSX.Element;
    width?: string; // width of the column in pixels
    minimumWidth?: string; // minimum width of the column in pixels
    maximumWidth?: string; // maximum width of the column in pixels
  };

  export type Row<T extends string> = Record<T, string | null | undefined>;

  export type Props<T extends string> = {
    columns: Column<T>[];
    data: Row<NoInfer<T>>[];
    storageKey?: string; // if provided, the column widths will be saved to local storage
    translationKey: string; // localizations will be gotten from that key using the column keys
    emptyCellPlaceholder?: string; // placeholder to place in empty cells (default: '-')
    searchValue?: string | null; // searchvalue to filter the table
  };

  export type Sort<T> = {
    column: T;
    direction: 'asc' | 'desc';
  };
}
