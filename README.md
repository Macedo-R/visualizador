# AuditViewer Pro - Visualizador DTE-SN

Visualizador institucional de notificações fiscais (DTE-SN), desenvolvido com padrões de interface de alta fidelidade (estética Apple/macOS) e rigor técnico para conformidade com a Receita Federal.

## 🚀 Funcionalidades

- **Leitura de Arquivos Lote (V5)**: Processamento local de arquivos `.txt` contendo notificações fiscais.
- **Interface Institucional**: Design limpo, tipografia Inter/San Francisco, e foco na legibilidade.
- **Dashboard Financeiro**: Cards estilo Apple para visualização rápida de totais (NFS-e, PGDAS, Divergências).
- **Visualizador de Documentos**: Renderização fidedigna da notificação impressa (formato A4), com cálculo dinâmico de divergências.
- **Segurança**: Tela de login simulada para acesso restrito (Auditoria Fiscal).

## 🛠️ Tecnologias

- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (Ícones)

## 🔐 Acesso

Para acessar o ambiente de demonstração:
- **Usuário**: Auditoria Fiscal
- **Senha**: dte-sn

## 📋 Estrutura do Projeto

- `/components`: Componentes de UI (Sidebar, Dashboard, DocumentView).
- `/utils`: Lógica de parser para o arquivo de texto proprietário.
- `/types`: Definições de tipagem TypeScript.

---
Desenvolvido para auxiliar na auditoria e autorregularização fiscal municipal.