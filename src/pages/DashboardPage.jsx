// FILE: src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenueThisMonth: 0,
    expensesThisMonth: 0,
    accountsReceivable: 0,
    accountsPayable: 0,
    profitThisMonth: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);

  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  useEffect(() => {
    const fetchFinancialData = async () => {
      setLoading(true);
      try {
        if (!auth.currentUser) return; // Proteção extra caso o usuário não esteja logado
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

        let revenueThisMonth = 0, accountsReceivable = 0, expensesThisMonth = 0, accountsPayable = 0;

        allSales.forEach(sale => {
            if (sale.status === 'Pendente') accountsReceivable += sale.total;
            const paymentDate = sale.paymentDate?.toDate();
            if (sale.status === 'Pago' && paymentDate >= startOfMonth && paymentDate <= endOfMonth) {
                revenueThisMonth += sale.total;
            }
        });

        allExpenses.forEach(expense => {
            if (expense.status === 'Pendente') accountsPayable += expense.amount;
            const paymentDate = expense.paymentDate?.toDate();
            if (expense.status === 'Pago' && paymentDate >= startOfMonth && paymentDate <= endOfMonth) {
                expensesThisMonth += expense.amount;
            }
        });

        const recentSalesQuery = query(collection(db, "sales"), where("userId", "==", userId), orderBy("saleDate", "desc"), limit(5));
        const recentExpensesQuery = query(collection(db, "expenses"), where("userId", "==", userId), orderBy("dueDate", "desc"), limit(5));
        
        const recentSalesSnap = await getDocs(recentSalesQuery);
        const recentSales = recentSalesSnap.docs.map(doc => ({ type: 'sale', ...doc.data() }));

        const recentExpensesSnap = await getDocs(recentExpensesQuery);
        const recentExpenses = recentExpensesSnap.docs.map(doc => ({ type: 'expense', ...doc.data() }));

        const combinedActivity = [...recentSales, ...recentExpenses].sort((a, b) => {
          const dateA = a.saleDate?.toDate() || new Date(a.dueDate);
          const dateB = b.saleDate?.toDate() || new Date(b.dueDate);
          return dateB - dateA;
        }).slice(0, 5);
        
        setRecentActivity(combinedActivity);
        setStats({
          revenueThisMonth,
          expensesThisMonth,
          accountsReceivable,
          accountsPayable,
          profitThisMonth: revenueThisMonth - expensesThisMonth,
        });

      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
        alert("Ocorreu um erro ao carregar os dados. Verifique o console para mais detalhes. (Pode ser necessário criar um índice no Firestore)");
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  return (
    <MainLayout>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>
      
      {loading ? <p>Calculando seus resultados...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="dashboard-grid" style={{gridTemplateColumns: 'repeat(4, 1fr)'}}>
            <div className="card">
              <h3 className="card-title">Receitas Recebidas (Mês)</h3>
              <p className="card-value positive">{formatCurrency(stats.revenueThisMonth)}</p>
            </div>
            <div className="card">
              <h3 className="card-title">Despesas Pagas (Mês)</h3>
              <p className="card-value negative">{formatCurrency(stats.expensesThisMonth)}</p>
            </div>
            <div className="card">
              <h3 className="card-title">Lucro Líquido (Mês)</h3>
              <p className="card-value" style={{color: stats.profitThisMonth >= 0 ? 'var(--cor-sucesso)' : 'var(--cor-erro)'}}>{formatCurrency(stats.profitThisMonth)}</p>
            </div>
            <div className="card">
              <h3 className="card-title">Contas a Pagar (Total)</h3>
              <p className="card-value neutral">{formatCurrency(stats.accountsPayable)}</p>
            </div>
          </div>

          <div className="card">
            <h2>Atividade Recente</h2>
            {recentActivity.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
                {recentActivity.map((activity, index) => (
                  <li key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--cor-borda)'}}>
                    {activity.type === 'sale' ? (
                      <>
                        <span>Venda para <strong>{activity.clientName}</strong></span>
                        <span style={{color: 'var(--cor-sucesso)', fontWeight: 'bold'}}>+ {formatCurrency(activity.total)}</span>
                      </>
                    ) : (
                      <>
                        <span>Despesa: <strong>{activity.description}</strong></span>
                        <span style={{color: 'var(--cor-erro)', fontWeight: 'bold'}}>- {formatCurrency(activity.amount)}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            ) : <p>Nenhuma atividade recente.</p>}
          </div>
        </div>
      )}
    </MainLayout>
  );
} 