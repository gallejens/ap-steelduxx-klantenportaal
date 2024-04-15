import { useEffect, useMemo, useRef, useState, type WheelEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles/table.module.scss';
import { Button, Pagination, Text } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { useRemToPx } from '@/hooks/useRemToPx';
import { DEFAULT_EMPTY_CELL_PLACEHOLDER, DEFAULT_WIDTHS } from './constants';
import { SortButton } from './components/SortButton';
import type { NTable } from './types';
import {
  applyResizeHandlerDraggingStyles,
  buildColumnSizeStorageKey,
} from './util';
import { ColumnSelector } from './components/ColumnSelector';
import { IconEyeOff } from '@tabler/icons-react';

export const Table = <T extends string>(props: NTable.Props<T>) => {
  const { t } = useTranslation();

  const [activePage, setActivePage] = useState<number>(1);
  const { ref: bodyRef, height: tableHeight } = useElementSize();
  const cellHeightInPx = useRemToPx(styles.cell_height);

  const [sort, setSort] = useState<NTable.Sort<T>>({
    column:
      props.columns.find(c => c.defaultSort)?.key ?? props.columns[0]?.key,
    direction: 'asc',
  });

  const columnRefs = useRef<Partial<Record<T, HTMLDivElement | null>>>({});
  const [resizingColumnKey, setResizingColumnKey] = useState<T | null>(null);

  const [columnSelectorOpen, setColumnSelectorOpen] = useState(false);
  const [disabledColumns, setDisabledColumns] = useState<T[]>([]);

  const tableRef = useRef<HTMLDivElement | null>(null);

  const columnKeyToIndex = props.columns.reduce(
    (acc, c, i) => {
      acc[c.key] = i;
      return acc;
    },
    {} as Record<T, number>
  );

  const handleSortIconClick = (column: T) => {
    setSort(s => ({
      column,
      direction: s.column === column && s.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // search & sort logic
  const processedRows = useMemo(() => {
    const searchValue = props.searchValue?.toLowerCase();
    let filteredRows = props.data;
    if (searchValue !== undefined && searchValue.length !== 0) {
      filteredRows = props.data.filter(row => {
        for (const columnKey of Object.keys(row) as T[]) {
          if (props.columns[columnKeyToIndex[columnKey]]?.excludeFromSearch) {
            continue;
          }
          if (row[columnKey]?.toString().toLowerCase().includes(searchValue)) {
            return true;
          }
        }
        return false;
      });
    }

    return [...filteredRows].sort((a, b) => {
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
  }, [props.data, props.searchValue, props.columns, sort]);

  // calculate amount of rows per page based on available space and amount of rows
  const pageSize = Math.floor(tableHeight / cellHeightInPx) - 1; // offset for header
  const totalPages = Math.ceil((processedRows ?? []).length / pageSize);

  // if active page is greater than total pages after resizing window, set it to last page
  useEffect(() => {
    if (activePage > totalPages && totalPages > 0) {
      setActivePage(totalPages);
    }
  }, [totalPages]);

  // placeholder for empty cells
  const emptyCellPlaceholder =
    props.emptyCellPlaceholder ?? DEFAULT_EMPTY_CELL_PLACEHOLDER;

  // get rows on current page
  const rows = processedRows.slice(
    (activePage - 1) * pageSize,
    activePage * pageSize
  );

  // Load all column sizes from storage
  useEffect(() => {
    if (!props.storageKey) return;

    const savedSizesJSON = localStorage.getItem(
      buildColumnSizeStorageKey(props.storageKey)
    );
    if (!savedSizesJSON) return;

    const savedSizes: Record<string, string> = JSON.parse(savedSizesJSON);

    for (const [key, ref] of Object.entries(columnRefs.current) as [
      T,
      HTMLDivElement | null,
    ][]) {
      if (ref === null) continue;
      const savedSize = savedSizes[key];
      if (!savedSize) continue;
      ref.style.width = savedSize;
    }
  }, []);

  useEffect(() => {
    if (resizingColumnKey === null || columnRefs.current === null) return;

    const columnRef = columnRefs.current[resizingColumnKey];
    const lastColumnRef =
      columnRefs.current[props.columns[props.columns.length - 1].key];
    if (!columnRef || !lastColumnRef) return;

    const mouseUpHandler = () => {
      setResizingColumnKey(null);
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      const originalWidth = columnRef.getBoundingClientRect().width;
      const newWidth = originalWidth + e.movementX;
      columnRef.style.width = `${newWidth}px`;
    };

    window.addEventListener('mouseup', mouseUpHandler);
    window.addEventListener('mousemove', mouseMoveHandler);

    return () => {
      window.removeEventListener('mouseup', mouseUpHandler);
      window.removeEventListener('mousemove', mouseMoveHandler);

      applyResizeHandlerDraggingStyles(false);

      // save column sizes to storage
      if (props.storageKey) {
        const sizes: Record<string, string> = {};
        for (const [key, ref] of Object.entries(columnRefs.current) as [
          T,
          HTMLDivElement | null,
        ][]) {
          if (ref === null) continue;
          sizes[key] = ref.style.width;
        }

        localStorage.setItem(
          buildColumnSizeStorageKey(props.storageKey),
          JSON.stringify(sizes)
        );
      }
    };
  }, [resizingColumnKey]);

  const toggleDisableColumn = (column: T) => {
    setDisabledColumns(s =>
      s.includes(column) ? [...s.filter(c => c !== column)] : [...s, column]
    );
  };

  const handleScrollEvent = (e: WheelEvent) => {
    if (e.deltaY === 0 || tableRef.current === null) return;
    e.preventDefault();

    tableRef.current.scrollLeft += e.deltaY;
  };

  return (
    <div className={styles.table_wrapper}>
      <div
        className={styles.body}
        ref={bodyRef}
      >
        <div
          className={styles.table}
          ref={tableRef}
          onWheel={handleScrollEvent}
        >
          {props.columns.map(column => {
            if (disabledColumns.includes(column.key)) return null;
            return (
              <div
                ref={ref => (columnRefs.current[column.key] = ref)}
                key={`column_${column.key}`}
                className={styles.column}
                style={
                  column.disableResizing
                    ? {
                        width: 'auto',
                      }
                    : {
                        width: column.initialWidth ?? DEFAULT_WIDTHS.initial,
                        minWidth: column.minimumWidth ?? DEFAULT_WIDTHS.min,
                      }
                }
              >
                <div className={styles.cell}>
                  <Text
                    truncate='end'
                    size='sm'
                    fw={700}
                  >
                    {column.emptyHeader
                      ? ''
                      : t(`${props.translationKey}:${column.key}`)}
                  </Text>
                  {!column.disallowSorting && (
                    <SortButton
                      onClick={handleSortIconClick}
                      columnKey={column.key}
                      sort={sort}
                    />
                  )}
                </div>
                {rows.map((row, idx) => (
                  <div
                    key={`cell_${column.key}_${idx}`}
                    className={`${styles.cell} ${props.onRowClick ? styles.cellPointer : ''}`}
                    onClick={() => props.onRowClick?.(row)}
                  >
                    {column.transform ? (
                      column.transform(row[column.key])
                    ) : (
                      <Text
                        truncate='end'
                        size='xs'
                      >
                        {row[column.key] ?? emptyCellPlaceholder}
                      </Text>
                    )}
                  </div>
                ))}
                {!column.disableResizing && (
                  <div
                    className={styles.resize_handle}
                    onMouseDown={() => {
                      setResizingColumnKey(column.key);
                      applyResizeHandlerDraggingStyles(true);
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.footer}>
        <Pagination
          total={totalPages}
          value={activePage}
          onChange={page => setActivePage(page)}
        />
        <div className={styles.right_side}>
          <Button
            onClick={() => {
              setColumnSelectorOpen(s => !s);
            }}
            leftSection={<IconEyeOff />}
            size='xs'
          >
            {t('table:columnSelectorButton')}
          </Button>
          {columnSelectorOpen && (
            <ColumnSelector
              columns={props.columns.map(c => ({
                label: t(`${props.translationKey}:${c.key}`),
                key: c.key,
                disabled: disabledColumns.includes(c.key),
              }))}
              onClick={toggleDisableColumn}
            />
          )}
        </div>
      </div>
    </div>
  );
};
