import React, { useMemo } from 'react';
import { TaxNotice } from '../types';
import { TrendingDown, TrendingUp, AlertCircle, FileText } from 'lucide-react';

interface DashboardProps {
  notices: TaxNotice[];
  fileName: string | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ notices, fileName }) => {
  const totals = useMemo(() => {
    let nfse = 0;
    let pgdas = 0;
    let diff = 0;

    notices.forEach(notice => {
      notice.divergences.forEach(div => {
        const valNF = parseFloat(div.declaredNFSe.replace(/\./g, '').replace(',', '.')) || 0;
        const valPGDAS = parseFloat(div.declaredPGDAS.replace(/\./g, '').replace(',', '.')) || 0;
        const valDiff = parseFloat(div.difference.replace(/\./g, '').replace(',', '.')) || 0;

        nfse += valNF;
        pgdas += valPGDAS;
        diff += valDiff;
      });
    });

    return { nfse, pgdas, diff };
  }, [notices]);

  const formatCurrency = (val: number) => 
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="h-full overflow-y-auto bg-[#F5F5F7] p-8 md:p-12">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-[#1D1D1F] tracking-tight">Visão Geral</h1>
            <p className="text-[#86868B] text-lg mt-1 font-light">Resumo do lote importado.</p>
          </div>
          {fileName && (
             <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-500 flex items-center gap-2 shadow-sm">
                <FileText size={12} />
                {fileName}
             </div>
          )}
        </div>

        {/* Cards Grid - Apple Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Card 1: NFS-e */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 transition hover:scale-[1.01] duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <TrendingUp size={16} className="text-[#0071E3]" />
              </div>
              <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide">Total NFS-e</span>
            </div>
            <div className="text-3xl font-semibold text-[#1D1D1F] tracking-tight">
              {formatCurrency(totals.nfse)}
            </div>
            <p className="text-xs text-gray-400 mt-2 font-medium">Valor total em notas emitidas</p>
          </div>

          {/* Card 2: PGDAS */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 transition hover:scale-[1.01] duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <TrendingDown size={16} className="text-gray-600" />
              </div>
              <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide">Total Declarado</span>
            </div>
            <div className="text-3xl font-semibold text-[#1D1D1F] tracking-tight">
              {formatCurrency(totals.pgdas)}
            </div>
            <p className="text-xs text-gray-400 mt-2 font-medium">Valor total declarado no PGDAS</p>
          </div>

          {/* Card 3: Difference (Red) */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 transition hover:scale-[1.01] duration-300 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 opacity-50 pointer-events-none"></div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle size={16} className="text-[#D70015]" />
              </div>
              <span className="text-[13px] font-semibold text-[#D70015] uppercase tracking-wide">Divergência Total</span>
            </div>
            <div className="text-3xl font-semibold text-[#1D1D1F] tracking-tight relative z-10">
              {formatCurrency(totals.diff)}
            </div>
            <p className="text-xs text-red-400 mt-2 font-medium relative z-10">Montante a ser regularizado</p>
          </div>
        </div>

        {/* Detailed Stats Section */}
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
           <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-[#1D1D1F]">Estatísticas do Processamento</h2>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                {notices.length} Registros
              </span>
           </div>
           <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                 <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Média de Divergência por Empresa</p>
                    <p className="text-xl font-medium text-[#1D1D1F]">
                       {formatCurrency(notices.length > 0 ? totals.diff / notices.length : 0)}
                    </p>
                 </div>
                 <div className="w-px bg-gray-100 hidden md:block"></div>
                 <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Status do Lote</p>
                    <p className="text-xl font-medium text-green-600 flex items-center gap-2">
                       Processado com sucesso
                       <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    </p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};