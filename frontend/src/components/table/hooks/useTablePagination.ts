import { useRemToPx } from '@/hooks/useRemToPx';
import { useElementSize } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import styles from '../styles/table.module.scss';
import type { NTable } from '../types';

export const useTablePagination = <T extends string>(rows: NTable.Row<T>[]) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { ref, height: tableHeight } = useElementSize();
  const cellHeightInPx = useRemToPx(styles.cell_height);
  const pageSize = Math.floor(tableHeight / cellHeightInPx) - 1; // offset for header
  const amountOfPages = Math.ceil(rows.length / pageSize);

  useEffect(() => {
    if (currentPage > amountOfPages && amountOfPages > 0) {
      setCurrentPage(amountOfPages);
    }
  }, [amountOfPages]);

  // get rows on current page
  const pageRows = rows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return {
    ref,
    rows: pageRows,
    amountOfPages,
    currentPage,
    setCurrentPage,
  };
};
