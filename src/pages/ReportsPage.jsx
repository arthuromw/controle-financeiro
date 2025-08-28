// FILE: src/pages/ReportsPage.jsx
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import MainLayout from '../components/layout/MainLayout';

// Imports necessários para o Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Registro dos componentes do Chart.js que vamos usar
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);

      const salesQuery = query(
        collection(db, "sales"),
        where("userId", "==", auth.currentUser.uid),
        where("status", "==", "Pago") // Buscamos apenas as vendas pagas
      );
      
      const querySnapshot = await getDocs(salesQuery);
      const paidSales = querySnapshot.docs.map(doc => doc.data());

      // Processar os dados para o gráfico
      const monthlyRevenue = {}; // Ex: { 'ago/2025': 5000, 'jul/2025': 3500 }

      paidSales.forEach(sale => {
        if (sale.paymentDate) {
          const paymentDate = sale.paymentDate.toDate();
          const monthYear = `${paymentDate.getMonth() + 1}/${paymentDate.getFullYear()}`;
          
          if (monthlyRevenue[monthYear]) {
            monthlyRevenue[monthYear] += sale.total;
          } else {
            monthlyRevenue[monthYear] = sale.total;
          }
        }
      });
      
      // Ordenar os dados por data para o gráfico
      const sortedLabels = Object.keys(monthlyRevenue).sort((a, b) => {
          const [monthA, yearA] = a.split('/');
          const [monthB, yearB] = b.split('/');
          return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
      });
      
      const sortedData = sortedLabels.map(label => monthlyRevenue[label]);

      // Formatar os dados para o componente de gráfico
      setChartData({
        labels: sortedLabels,
        datasets: [
          {
            label: 'Faturamento Mensal (R$)',
            data: sortedData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });

      setLoading(false);
    };

    fetchReportData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Receita Mensal (Vendas Pagas)' },
    },
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">Relatórios</h1>
      
      <div className="p-6 bg-white rounded-lg shadow-md">
        {loading ? (
          <p>Gerando relatório...</p>
        ) : (
          <Bar options={options} data={chartData} />
        )}
      </div>
    </MainLayout>
  );
}