// FILE: src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage'; // <-- 1. ADICIONADO: A importação que faltava
import ClientsPage from './pages/ClientsPage'; // <-- Adicione esta importação
import SalesPage from './pages/SalesPage'; // <-- Adicione esta importação
import NewSalePage from './pages/NewSalePage'; // <-- Adicione esta importação
import FinancialPage from './pages/FinancialPage'
import SuppliersPage from './pages/SuppliersPage';
import ExpensesPage from './pages/ExpensesPage';
import ReportsPage from './pages/ReportsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota Pública */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rotas Protegidas */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          {/* 2. CORRIGIDO: Removidas as chaves extras */}
          <Route 
            path="/products" 
            element={
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            } 
          />

           {/* Rota para Clientes */}
          <Route 
            path="/clients" 
            element={
              <ProtectedRoute>
                <ClientsPage />
              </ProtectedRoute>
            } 
          />

          {/* Rota para Vendas */}
          <Route 
            path="/sales" 
            element={
              <ProtectedRoute>
                <SalesPage />
              </ProtectedRoute>
            } 
          />
            
                    {/* Rota para Nova Venda */}
          <Route
            path="/sales/new"
            element={
              <ProtectedRoute>
                <NewSalePage />
              </ProtectedRoute>
            }
          />
          {/* Rota para Fornecedores */}
          <Route 
            path="/suppliers" 
            element={
              <ProtectedRoute>
                <SuppliersPage />
              </ProtectedRoute>
            } 
          />
          {/* Rota para Despesas */}
          <Route 
            path="/expenses" 
            element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} 
          />

                    {/* Rota para Relatórios */}
          <Route 
            path="/reports" 
            element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} 
          />

                    {/* Rota para o Financeiro */}
          <Route 
            path="/financial" 
            element={
              <ProtectedRoute>
                <FinancialPage />
              </ProtectedRoute>
            } 
          />

          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;