import { useMemo, useState } from 'react';
import type { NTable } from '../types';

export const useTableDataTransformation = <T extends string>(
  props: NTable.Props<T>
) => {
  const [sort, setSort] = useState<NTable.Sort<T>>({
    column:
      props.columns.find(c => c.defaultSort)?.key ?? props.columns[0]?.key,
    direction: 'asc',
  });

  const excludedColumns = useMemo(() => {
    const excluded: Partial<Record<string, 1>> = {};
    for (const column of props.columns) {
      if (column.excludeFromSearch) {
        excluded[column.key] = 1;
      }
    }
    return excluded;
  }, [props.columns]);

  const rows = useMemo(() => {
    let searchValues: string[] = [];
    if (Array.isArray(props.searchValue)) {
      searchValues = props.searchValue
        .filter(v => v !== '')
        .map(v => v.toLowerCase());
    } else if (props.searchValue) {
      searchValues = [props.searchValue.toLowerCase()];
    }

    let filteredRows = props.data;
    for (const searchValue of searchValues) {
      filteredRows = filteredRows.filter(row => {
        for (const columnKey of Object.keys(row)) {
          if (excludedColumns[columnKey]) continue;
          if (
            row[columnKey as T]?.toString().toLowerCase().includes(searchValue)
          ) {
            return true;
          }
        }
        return false;
      });
    }

    const newRows = [...filteredRows].sort((a, b) => {
      const aValue = a[sort.column];
      const bValue = b[sort.column];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sort.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    return newRows;
  }, [props.data, props.searchValue, sort, excludedColumns]);

  const sortOnColumn = (column: T) => {
    setSort(s => ({
      column,
      direction: s.column === column && s.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return {
    rows: rows ?? [],
    sort,
    sortOnColumn,
  };
};
