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
      getData();
    } catch (error) {
      console.error("Erro ao atualizar a venda:", error);
    }
  };

  const handleMarkExpenseAsPaid = async (expenseId) => {
    if (!window.confirm("Confirmar o pagamento desta despesa?")) return;
    try {
      await updateDoc(doc(db, "expenses", expenseId), { status: 'Pago', paymentDate: serverTimestamp() });
      getData();
    } catch (error) {
      console.error("Erro ao atualizar a despesa:", error);
    }
  };

  // Funções para formatar moeda e status, para deixar o código mais limpo
  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const getStatusClass = (status) => {
      if (status === 'Pago') return 'status-paid';
      return 'status-pending';
  }

  return (
    <MainLayout>
      <h1>Gestão Financeira</h1>
      
      {loading ? <p>Carregando lançamentos...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>
          
          {/* SEÇÃO CONTAS A RECEBER */}
          <div className="card">
            <h2>Contas a Receber</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Venda</th>
                    <th>Cliente</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale.id}>
                      <td>{sale.saleDate ? new Date(sale.saleDate.seconds * 1000).toLocaleDateString('pt-BR') : 'N/A'}</td>
                      <td>{sale.clientName}</td>
                      <td>{formatCurrency(sale.total)}</td>
                      <td>
                        <span className={getStatusClass(sale.status)}>
                          {sale.status || 'Pendente'}
                        </span>
                      </td>
                      <td>
                        {sale.status !== 'Pago' && (
                          <button onClick={() => handleMarkSaleAsPaid(sale.id)} style={{fontSize: '0.8rem', padding: '0.4rem 0.8rem'}}>
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
          <div className="card">
            <h2>Contas a Pagar</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Vencimento</th>
                    <th>Descrição</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td>{new Date(expense.dueDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                      <td>{expense.description}</td>
                      <td>{formatCurrency(expense.amount)}</td>
                      <td>
                        <span className={getStatusClass(expense.status)}>
                          {expense.status || 'Pendente'}
                        </span>
                      </td>
                      <td>
                        {expense.status !== 'Pago' && (
                          <button onClick={() => handleMarkExpenseAsPaid(expense.id)} style={{fontSize: '0.8rem', padding: '0.4rem 0.8rem'}}>
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