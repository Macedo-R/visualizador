import { TaxNotice, FinancialDivergence, ParseResult } from '../types';

/**
 * Parses the raw content string to extract structured financial divergences.
 * Expected format segment: [MM/YYYY >> VAL_NFSE ; VAL_PGDAS ; Dif: VAL_DIF]
 */
const parseDivergences = (content: string): FinancialDivergence[] => {
  const regex = /\[(.*?)]/g;
  const matches = content.match(regex);
  const results: FinancialDivergence[] = [];

  if (!matches) return [];

  matches.forEach((match) => {
    // Remove brackets
    const clean = match.replace('[', '').replace(']', '');
    
    // Split by '>>' to separate Period from values
    const parts = clean.split('>>');
    if (parts.length !== 2) return;

    const period = parts[0].trim();
    const valuesPart = parts[1].trim();

    // Split values by ';'
    const valueParts = valuesPart.split(';');
    if (valueParts.length < 3) return;

    results.push({
      period,
      declaredNFSe: valueParts[0].trim(),
      declaredPGDAS: valueParts[1].trim(),
      difference: valueParts[2].replace('Dif:', '').trim()
    });
  });

  return results;
};

export const parseFileContent = (text: string): ParseResult => {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
  const notices: TaxNotice[] = [];
  const errors: string[] = [];

  // Validate Header (Basic check based on provided format)
  if (!lines[0].includes('DECLARAÇÃO')) {
    return { notices: [], count: 0, errors: ['Arquivo inválido: Cabeçalho não encontrado.'] };
  }

  // Iterate, skipping header and potential footer '999999'
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '999999' || !line) continue;

    const parts = line.split('|');
    
    // Basic validation of column count (approx 12 columns based on sample)
    if (parts.length < 10) {
      console.warn(`Line ${i + 1} ignored: insufficient columns.`);
      continue;
    }

    try {
      const divergences = parseDivergences(parts[6]);

      // Map columns to interface
      const notice: TaxNotice = {
        id: crypto.randomUUID(), // unique internal ID
        rawLineIndex: i + 1,
        cnpjRaw: parts[0],
        entityName: parts[1],
        department: parts[2],
        companyName: parts[3], // Sometimes name is combined with CNPJ in raw text, but usually separate column in V5
        cnpjFormatted: parts[4],
        periodRange: parts[5],
        rawContent: parts[6],
        divergences,
        deadline: parts[7],
        legalBasis: parts[8],
        auditorName: parts[9],
        auditorRole: parts[10],
        auditorId: parts[11] || '',
        isRead: false
      };

      notices.push(notice);
    } catch (e) {
      errors.push(`Erro na linha ${i + 1}: ${(e as Error).message}`);
    }
  }

  return {
    notices,
    count: notices.length,
    errors
  };
};