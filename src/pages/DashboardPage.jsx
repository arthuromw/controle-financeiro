// FILE: src/pages/DashboardPage.jsx
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  return (
    <MainLayout>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-4">Bem-vindo de volta, {currentUser?.email}!</p>
      <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-3">
         {/* Cards de Exemplo */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Saldo Atual</h3>
          <p className="text-2xl font-bold text-green-500">R$ 1.250,00</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Receitas do Mês</h3>
          <p className="text-2xl font-bold text-blue-500">R$ 5.800,00</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Despesas do Mês</h3>
          <p className="text-2xl font-bold text-red-500">R$ 4.550,00</p>
        </div>
      </div>
    </MainLayout>
  );
}