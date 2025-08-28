// FILE: src/pages/ReportsPage.jsx
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import MainLayout from '../components/layout/MainLayout';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [topClients, setTopClients] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      const userId = auth.currentUser.uid;

      // Buscar todas as vendas e despesas pagas
      const salesQuery = query(collection(db, "sales"), where("userId", "==", userId), where("status", "==", "Pago"));
      const expensesQuery = query(collection(db, "expenses"), where("userId", "==", userId), where("status", "==", "Pago"));

      const [salesSnapshot, expensesSnapshot] = await Promise.all([getDocs(salesQuery), getDocs(expensesQuery)]);
      const paidSales = salesSnapshot.docs.map(doc => doc.data());
      const paidExpenses = expensesSnapshot.docs.map(doc => doc.data());

      // --- Processar dados para o Gráfico de Lucratividade Mensal ---
      const monthlyData = {};

      paidSales.forEach(sale => {
        const monthYear = sale.paymentDate ? `${sale.paymentDate.toDate().getMonth() + 1}/${sale.paymentDate.toDate().getFullYear()}` : 'N/A';
        if (!monthlyData[monthYear]) monthlyData[monthYear] = { revenue: 0, expense: 0 };
        monthlyData[monthYear].revenue += sale.total;
      });

      paidExpenses.forEach(expense => {
        const monthYear = expense.paymentDate ? `${expense.paymentDate.toDate().getMonth() + 1}/${expense.paymentDate.toDate().getFullYear()}` : 'N/A';
        if (!monthlyData[monthYear]) monthlyData[monthYear] = { revenue: 0, expense: 0 };
        monthlyData[monthYear].expense += expense.amount;
      });
      
      const sortedLabels = Object.keys(monthlyData).sort((a, b) => new Date(a.split('/')[1], a.split('/')[0] - 1) - new Date(b.split('/')[1], b.split('/')[0] - 1));
      
      setChartData({
        labels: sortedLabels,
        datasets: [
          { label: 'Receitas (R$)', data: sortedLabels.map(l => monthlyData[l].revenue), backgroundColor: 'rgba(54, 162, 235, 0.7)' },
          { label: 'Despesas (R$)', data: sortedLabels.map(l => monthlyData[l].expense), backgroundColor: 'rgba(255, 99, 132, 0.7)' },
        ],
      });

      // --- Processar dados para Top 5 Clientes ---
      const clientRevenue = {};
      paidSales.forEach(sale => {
          if(clientRevenue[sale.clientName]) {
              clientRevenue[sale.clientName] += sale.total;
          } else {
              clientRevenue[sale.clientName] = sale.total;
          }
      });
      const sortedClients = Object.entries(clientRevenue).sort(([,a],[,b]) => b-a).slice(0, 5);
      setTopClients(sortedClients);

      // --- Processar dados para Top 5 Produtos ---
      const productRevenue = {};
      paidSales.forEach(sale => {
          sale.items.forEach(item => {
              if(productRevenue[item.name]) {
                  productRevenue[item.name] += item.price * item.quantity;
              } else {
                  productRevenue[item.name] = item.price * item.quantity;
              }
          });
      });
      const sortedProducts = Object.entries(productRevenue).sort(([,a],[,b]) => b-a).slice(0, 5);
      setTopProducts(sortedProducts);

      setLoading(false);
    };

    fetchReportData();
  }, []);

  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <MainLayout>
      <div className="page-header">
        <h1>Relatórios</h1>
      </div>
      
      {loading ? <p>Gerando relatórios...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card">
            <h2>Lucratividade Mensal</h2>
            <Bar options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Receitas vs. Despesas (Valores Pagos)' } } }} data={chartData} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="card">
              <h2>Top 5 Clientes</h2>
              <ul style={{listStyle: 'none', padding: 0}}>
                {topClients.map(([name, total]) => (
                  <li key={name} style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--cor-borda)'}}>
                    <strong>{name}</strong>
                    <span>{formatCurrency(total)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h2>Top 5 Produtos</h2>
              <ul style={{listStyle: 'none', padding: 0}}>
                  {topProducts.map(([name, total]) => (
                      <li key={name} style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--cor-borda)'}}>
                          <strong>{name}</strong>
                          <span>{formatCurrency(total)}</span>
                      </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}