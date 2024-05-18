import type { OrderDocumentType } from '@/types/api';

export const transformDocumentsToFileNames = (
  documents: Record<OrderDocumentType, File | null>
): Record<OrderDocumentType, string | null> => {
  return Object.entries(documents).reduce(
    (acc, [type, file]) => {
      acc[type as OrderDocumentType] = file ? file.name : null;
      return acc;
    },
    {} as Record<OrderDocumentType, string | null>
  );
};
