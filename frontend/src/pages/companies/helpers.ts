import { doApiAction } from '@/lib/api';
import type { CompanyInfo } from '@/types/api';

export const fetchCompanyInfoList = async () => {
  const companies = await doApiAction<CompanyInfo[]>({
    endpoint: '/company-info/all',
    method: 'GET',
  });

  if (!companies) return [];

  const adminCompanyIdx = companies.findIndex(c => c.company === null);
  if (adminCompanyIdx === -1) return companies;

  return [
    companies[adminCompanyIdx],
    ...companies.filter((_, i) => i !== adminCompanyIdx),
  ];
};
