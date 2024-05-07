import { doApiAction } from '@/lib/api';
import type { CompanyInfo } from '@/types/api';

export const fetchCompanyInfoList = async (): Promise<{
  adminInfo: CompanyInfo | null;
  companies: CompanyInfo[];
}> => {
  const companies = await doApiAction<CompanyInfo[]>({
    endpoint: '/company-info/all',
    method: 'GET',
  });

  if (!companies) return { adminInfo: null, companies: [] };

  const adminCompanyIdx = companies.findIndex(c => c.company === null);
  if (adminCompanyIdx === -1) {
    return { adminInfo: null, companies };
  }

  return {
    adminInfo: companies[adminCompanyIdx],
    companies: companies.filter((_, i) => i !== adminCompanyIdx),
  };
};
