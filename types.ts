export interface FinancialDivergence {
  period: string;
  declaredNFSe: string;
  declaredPGDAS: string;
  difference: string;
}

export interface TaxNotice {
  id: string;
  rawLineIndex: number;
  cnpjRaw: string;
  entityName: string; // Ente
  department: string; // Setor
  companyName: string; // Razão Social
  cnpjFormatted: string;
  periodRange: string;
  rawContent: string;
  divergences: FinancialDivergence[];
  deadline: string;
  legalBasis: string; // Fundamentação
  auditorName: string;
  auditorRole: string;
  auditorId: string;
  isRead: boolean;
}

export interface ParseResult {
  notices: TaxNotice[];
  count: number;
  errors: string[];
}