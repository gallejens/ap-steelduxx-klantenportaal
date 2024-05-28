import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles/table.module.scss';
import { Pagination, Text } from '@mantine/core';
import { DEFAULT_EMPTY_CELL_PLACEHOLDER, DEFAULT_WIDTHS } from './constants';
import { SortButton } from './components/SortButton';
import type { NTable } from './types';
import { ColumnSelector } from './components/ColumnSelector';
import classNames from 'classnames';
import { useTableDisableColumns } from './hooks/useTableDisableColumns';
import { useTableDataTransformation } from './hooks/useTableDataTransformation';
import { useTablePagination } from './hooks/useTablePagination';
import { useTableColumnWidth } from './hooks/useTableColumnWidth';
import { useVerticalScrolling } from '@/hooks/useVerticalScrolling';

export const Table = <T extends string>(props: NTable.Props<T>) => {
  console.log('Starting table render');

  const { t } = useTranslation();

  const { disabledColumns, toggleDisableColumn } = useTableDisableColumns<T>({
    storageKey: props.storageKey,
  });

  const {
    rows: allRows,
    sortOnColumn,
    sort,
  } = useTableDataTransformation(props);

  const {
    ref: bodyRef,
    rows: rowsOnPage,
    amountOfPages,
    currentPage,
    setCurrentPage,
  } = useTablePagination<T>(allRows);

  const { columnRefs, startResizingColumn } = useTableColumnWidth<T>({
    storageKey: props.storageKey,
    lastColumnKey: props.columns[props.columns.length - 1].key,
  });

  const { ref: tableRef } = useVerticalScrolling();

  return (
    <div className={styles.table_wrapper}>
      <div
        className={styles.body}
        ref={bodyRef}
      >
        <div
          className={styles.table}
          ref={tableRef}
        >
          {props.columns.map(column => {
            if (disabledColumns.includes(column.key)) return null;
            if (column.emptyHeader && rowsOnPage.length === 0) return null;

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
                      onClick={sortOnColumn}
                      columnKey={column.key}
                      sort={sort}
                    />
                  )}
                </div>
                {rowsOnPage.length > 0 ? (
                  rowsOnPage.map((row, idx) => {
                    let value: ReactNode = row[column.key];
                    let showInTextElement = true;

                    if (column.transform) {
                      showInTextElement = false;
                      value = column.transform(value);
                    }

                    if (typeof value === 'boolean') {
                      showInTextElement = true;
                      if (value) {
                        value = t('table:trueValue');
                      } else {
                        value = t('table:falseValue');
                      }
                    } else if (typeof value === 'string') {
                      showInTextElement = true;
                    }

                    return (
                      <div
                        key={`cell_${column.key}_${idx}`}
                        className={classNames(
                          styles.cell,
                          props.onRowClick && styles.cellPointer
                        )}
                        onClick={() => props.onRowClick?.(row)}
                      >
                        {showInTextElement ? (
                          <Text
                            truncate='end'
                            size='xs'
                          >
                            {value ??
                              column.emptyCellPlaceholder ??
                              props.emptyCellPlaceholder ??
                              DEFAULT_EMPTY_CELL_PLACEHOLDER}
                          </Text>
                        ) : (
                          value
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div
                    key={`cell_${column.key}_empty`}
                    className={styles.cell}
                  >
                    -
                  </div>
                )}
                {!column.disableResizing && (
                  <div
                    className={styles.resize_handle}
                    onMouseDown={() => {
                      startResizingColumn(column.key);
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.left_side}>
          <Text
            fs='italic'
            c='dimmed'
          >
            {t('table:rowsAmount')}: {allRows.length}
          </Text>
        </div>
        <Pagination
          total={amountOfPages}
          value={currentPage}
          onChange={setCurrentPage}
        />
        <div className={styles.right_side}>
          <ColumnSelector
            columns={props.columns
              .filter(c => !c.emptyHeader)
              .map(c => ({
                label: t(`${props.translationKey}:${c.key}`),
                key: c.key,
                disabled: disabledColumns.includes(c.key),
              }))}
            onClick={toggleDisableColumn}
          />
        </div>
      </div>
    </div>
  );
};
