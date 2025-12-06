import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Command, ShieldCheck, ArrowRight, LogOut, AlertCircle } from 'lucide-react';
import { parseFileContent } from './utils/parser';
import { TaxNotice } from './types';
import { Sidebar } from './components/Sidebar';
import { DocumentView } from './components/DocumentView';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // App State
  const [notices, setNotices] = useState<TaxNotice[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState(true); // Default to dashboard
  const [searchTerm, setSearchTerm] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Auditoria Fiscal' && password === 'dte-sn') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Credenciais inválidas. Tente novamente.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setNotices([]);
    setFileName(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const result = parseFileContent(text);
      if (result.count > 0) {
        setNotices(result.notices);
        setFileName(file.name);
        setShowDashboard(true); // Show dashboard summary on load
        setSelectedId(null);
      } else {
        alert("Nenhum registro válido encontrado. Verifique se o arquivo está no formato DTE-SN V5.");
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center p-4 font-sans text-[#1D1D1F]">
        <div className="w-full max-w-sm">
           <div className="text-center mb-10">
              <div className="w-16 h-16 bg-[#e8e8ed] rounded-[18px] flex items-center justify-center mx-auto mb-6 shadow-sm">
                <ShieldCheck size={32} className="text-[#515154]" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">Acesso Restrito</h1>
              <p className="text-[#86868B] text-sm mt-2">Identificação de Auditoria Necessária</p>
           </div>
           
           <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8">
              <div className="space-y-5">
                <div>
                   <label className="block text-xs font-medium text-[#86868B] uppercase tracking-wide mb-2 pl-1">Identificação</label>
                   <input 
                     type="text" 
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     className="w-full h-10 bg-[#F5F5F7] rounded-lg px-3 text-[15px] border border-transparent focus:bg-white focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/10 transition-all outline-none"
                     placeholder="Auditoria Fiscal"
                   />
                </div>
                <div>
                   <label className="block text-xs font-medium text-[#86868B] uppercase tracking-wide mb-2 pl-1">Senha</label>
                   <input 
                     type="password" 
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="w-full h-10 bg-[#F5F5F7] rounded-lg px-3 text-[15px] border border-transparent focus:bg-white focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/10 transition-all outline-none"
                     placeholder="••••••"
                   />
                </div>
              </div>
              
              {loginError && (
                <div className="flex items-center gap-2 mt-4 text-[#D70015] text-xs font-medium bg-red-50 p-2 rounded-lg">
                   <AlertCircle size={14} />
                   {loginError}
                </div>
              )}

              <button 
                type="submit"
                className="w-full mt-8 h-10 bg-[#0071E3] hover:bg-[#0077ED] active:scale-[0.98] text-white rounded-lg text-[15px] font-medium transition-all duration-200 flex items-center justify-center gap-2"
              >
                Entrar <ArrowRight size={16} className="opacity-80" />
              </button>
           </form>

           <p className="text-center text-[#86868B] text-xs mt-8">
             Sistema de uso exclusivo da autoridade fazendária municipal.
           </p>
        </div>
      </div>
    );
  }

  const selectedNotice = notices.find(n => n.id === selectedId) || null;

  // --- UPLOAD SCREEN (Empty State) ---
  if (notices.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-4 font-sans text-[#1D1D1F] relative">
         {/* Header with Logout */}
         <div className="absolute top-0 w-full p-6 flex justify-between items-center">
             <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <ShieldCheck size={18} />
                <span>Logado como: {username}</span>
             </div>
             <button onClick={handleLogout} className="text-[#0071E3] text-sm hover:underline flex items-center gap-1">
                Sair <LogOut size={14} />
             </button>
         </div>

        <div 
            className={`max-w-xl w-full bg-white rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] p-12 text-center transition-all duration-300 border ${isDragging ? 'border-[#0071E3] ring-4 ring-[#0071E3]/10 scale-[1.02]' : 'border-gray-200'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files[0];
                if(file) processFile(file);
            }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[#0071E3] to-[#409CFF] text-white rounded-[22px] shadow-lg flex items-center justify-center mx-auto mb-8">
            <Command size={40} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-semibold text-[#1D1D1F] mb-3 tracking-tight">AuditViewer Pro</h1>
          <p className="text-[#86868B] mb-10 text-lg leading-relaxed font-light">
            Visualizador institucional padrão <span className="text-[#1D1D1F] font-medium">DTE-SN</span>.
            <br/>Arraste seu arquivo TXT para começar.
          </p>
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt"
            className="hidden"
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="group w-full bg-[#1D1D1F] hover:bg-black text-white text-[15px] font-medium py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-md hover:shadow-lg transform active:scale-[0.99]"
          >
            <UploadCloud size={20} className="text-gray-400 group-hover:text-white transition-colors" />
            Carregar Arquivo Lote (V5)
          </button>
          
          <p className="text-[11px] uppercase tracking-wider text-[#86868B] mt-8 font-medium">
            Ambiente Seguro • V5.0
          </p>
        </div>
      </div>
    );
  }

  // --- DASHBOARD / MAIN INTERFACE ---
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-white font-sans selection:bg-[#0071E3]/20 selection:text-[#0071E3]">
      {/* Navigation */}
      <Sidebar 
        notices={notices}
        selectedId={selectedId}
        onSelect={setSelectedId}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showDashboard={showDashboard}
        setShowDashboard={setShowDashboard}
      />

      {/* Main Content */}
      <main className="flex-1 h-full relative z-0 flex flex-col bg-[#F5F5F7]">
        
        {/* Render Dashboard OR Document View based on state */}
        {showDashboard ? (
           <Dashboard notices={notices} fileName={fileName} />
        ) : (
           <DocumentView notice={selectedNotice} />
        )}
        
        {/* Floating File Info (Bottom Right) */}
        {!showDashboard && (
          <div className="absolute bottom-4 right-6 pointer-events-none no-print">
              <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 shadow-sm rounded-lg px-3 py-1.5 text-[10px] font-medium text-gray-400 flex items-center gap-2 pointer-events-auto">
                  <FileText size={10} />
                  {fileName}
                  <div className="h-3 w-px bg-gray-300 mx-1"></div>
                  <button 
                      onClick={() => { setNotices([]); setFileName(null); setShowDashboard(true); }} 
                      className="text-[#1D1D1F] hover:text-[#D70015] transition-colors"
                  >
                      Fechar
                  </button>
              </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;