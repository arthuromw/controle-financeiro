// FILE: src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ revenueThisMonth: 0, expensesThisMonth: 0, accountsReceivable: 0 });

  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  useEffect(() => {
    // A lógica de busca de dados continua a mesma...
    const fetchFinancialData = async () => {
        setLoading(true);
        const userId = auth.currentUser.uid;
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const salesQuery = query(collection(db, "sales"), where("userId", "==", userId));
        const salesSnapshot = await getDocs(salesQuery);
        const allSales = salesSnapshot.docs.map(doc => doc.data());

        const expensesQuery = query(collection(db, "expenses"), where("userId", "==", userId));
        const expensesSnapshot = await getDocs(expensesQuery);
        const allExpenses = expensesSnapshot.docs.map(doc => doc.data());

        let revenueThisMonth = 0, accountsReceivable = 0, expensesThisMonth = 0;

        allSales.forEach(sale => {
            if (sale.status === 'Pendente') accountsReceivable += sale.total;
            const paymentDate = sale.paymentDate?.toDate();
            if (sale.status === 'Pago' && paymentDate >= startOfMonth && paymentDate <= endOfMonth) {
                revenueThisMonth += sale.total;
            }
        });

        allExpenses.forEach(expense => {
            const paymentDate = expense.paymentDate?.toDate();
            if (expense.status === 'Pago' && paymentDate >= startOfMonth && paymentDate <= endOfMonth) {
                expensesThisMonth += expense.amount;
            }
        });

        setStats({ revenueThisMonth, expensesThisMonth, accountsReceivable });
        setLoading(false);
    };
    fetchFinancialData();
  }, []);

  return (
    <MainLayout>
      <h1>Dashboard</h1>
      
      {loading ? <p>Calculando seus resultados...</p> : (
        <div className="dashboard-grid">
          <div className="card">
            <h3 className="card-title">Receitas Recebidas (Mês)</h3>
            <p className="card-value positive">{formatCurrency(stats.revenueThisMonth)}</p>
          </div>
          <div className="card">
            <h3 className="card-title">Despesas Pagas (Mês)</h3>
            <p className="card-value negative">{formatCurrency(stats.expensesThisMonth)}</p>
          </div>
          <div className="card">
            <h3 className="card-title">Contas a Receber (Total)</h3>
            <p className="card-value neutral">{formatCurrency(stats.accountsReceivable)}</p>
          </div>
        </div>
      )}
    </MainLayout>
  );
}