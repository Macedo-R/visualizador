import React from 'react';
import { TaxNotice } from '../types';

interface SidebarProps {
  notices: TaxNotice[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  showDashboard: boolean;
  setShowDashboard: (show: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = (props) => {
  // ... (conteúdo do Sidebar)
  return <div>Sidebar</div>
};