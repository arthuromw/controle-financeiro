// FILE: src/pages/FinancialPage.jsx
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, updateDoc, query, where, serverTimestamp } from 'firebase/firestore';
import MainLayout from '../components/layout/MainLayout';

export default function FinancialPage() {
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    setLoading(true);
    const userId = auth.currentUser.uid;

    // Buscar Vendas (Contas a Receber)
    const salesQuery = query(collection(db, "sales"), where("userId", "==", userId));
    const salesData = await getDocs(salesQuery);
    setSales(salesData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

    // Buscar Despesas (Contas a Pagar)
    const expensesQuery = query(collection(db, "expenses"), where("userId", "==", userId));
    const expensesData = await getDocs(expensesQuery);
    setExpenses(expensesData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleMarkSaleAsPaid = async (saleId) => {
    if (!window.confirm("Confirmar o recebimento desta venda?")) return;
    try {
      await updateDoc(doc(db, "sales", saleId), { status: 'Pago', paymentDate: serverTimestamp() });
      getData(); // Recarrega todos os dados
    } catch (error) {
      console.error("Erro ao atualizar a venda:", error);
    }
  };

  const handleMarkExpenseAsPaid = async (expenseId) => {
    if (!window.confirm("Confirmar o pagamento desta despesa?")) return;
    try {
      await updateDoc(doc(db, "expenses", expenseId), { status: 'Pago', paymentDate: serverTimestamp() });
      getData(); // Recarrega todos os dados
    } catch (error) {
      console.error("Erro ao atualizar a despesa:", error);
    }
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">Gestão Financeira</h1>
      
      {loading ? <p>Carregando lançamentos...</p> : (
        <div className="space-y-8">
          {/* SEÇÃO CONTAS A RECEBER */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Contas a Receber</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="min-w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Venda</th>
                    <th className="px-6 py-3">Cliente</th>
                    <th className="px-6 py-3">Valor</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Ação</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sales.map((sale) => (
                    <tr key={sale.id}>
                      <td className="px-6 py-4">{sale.saleDate ? new Date(sale.saleDate.seconds * 1000).toLocaleDateString('pt-BR') : 'N/A'}</td>
                      <td className="px-6 py-4">{sale.clientName}</td>
                      <td className="px-6 py-4 font-medium">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.total)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sale.status === 'Pago' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {sale.status || 'Pendente'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {sale.status !== 'Pago' && (
                          <button onClick={() => handleMarkSaleAsPaid(sale.id)} className="text-indigo-600 hover:text-indigo-900 text-sm font-semibold">
                            Marcar como Recebido
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SEÇÃO CONTAS A PAGAR */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Contas a Pagar</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="min-w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Vencimento</th>
                    <th className="px-6 py-3">Descrição</th>
                    <th className="px-6 py-3">Valor</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Ação</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td className="px-6 py-4">{new Date(expense.dueDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                      <td className="px-6 py-4">{expense.description}</td>
                      <td className="px-6 py-4 font-medium">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${expense.status === 'Pago' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {expense.status || 'Pendente'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {expense.status !== 'Pago' && (
                          <button onClick={() => handleMarkExpenseAsPaid(expense.id)} className="text-indigo-600 hover:text-indigo-900 text-sm font-semibold">
                            Marcar como Pago
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}