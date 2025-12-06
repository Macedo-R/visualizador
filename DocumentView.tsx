import React from 'react';
import { TaxNotice } from '../types';

interface DocumentViewProps {
  notice: TaxNotice | null;
}

export const DocumentView: React.FC<DocumentViewProps> = ({ notice }) => {
  if (!notice) {
    return <div className="p-8 text-center">Selecione um item na lista para ver os detalhes.</div>;
  }

  // ... (conteúdo do DocumentView)
};