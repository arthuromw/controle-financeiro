// FILE: src/pages/ExpensesPage.jsx
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import MainLayout from '../components/layout/MainLayout';
import ExpenseList from '../components/expenses/ExpenseList';
import ExpenseForm from '../components/expenses/ExpenseForm';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);

  const expensesCollectionRef = collection(db, "expenses");

  const getData = async () => {
    setLoading(true);
    const userId = auth.currentUser.uid;
    // Buscar Despesas
    const expensesQuery = query(collection(db, "expenses"), where("userId", "==", userId));
    const expensesData = await getDocs(expensesQuery);
    setExpenses(expensesData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

    // Buscar Fornecedores para o formulário
    const suppliersQuery = query(collection(db, "suppliers"), where("userId", "==", userId));
    const suppliersData = await getDocs(suppliersQuery);
    setSuppliers(suppliersData.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSave = async (expenseData) => {
    if (currentExpense) {
      const expenseDoc = doc(db, "expenses", currentExpense.id);
      await updateDoc(expenseDoc, expenseData);
    } else {
      await addDoc(expensesCollectionRef, { ...expenseData, userId: auth.currentUser.uid, status: 'Pendente' });
    }
    await getData();
    setIsFormVisible(false);
    setCurrentExpense(null);
  };

  const handleEdit = (expense) => {
    setCurrentExpense(expense);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta despesa?")) {
      const expenseDoc = doc(db, "expenses", id);
      await deleteDoc(expenseDoc);
      await getData();
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Compras e Despesas</h1>
        {!isFormVisible && (
          <button onClick={() => { setCurrentExpense(null); setIsFormVisible(true); }} className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md">
            Adicionar Despesa
          </button>
        )}
      </div>

      {isFormVisible ? (
        <ExpenseForm 
          suppliers={suppliers}
          onSave={handleSave} 
          onCancel={() => setIsFormVisible(false)}
          initialData={currentExpense}
        />
      ) : (
        loading ? <p>Carregando...</p> : <ExpenseList expenses={expenses} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </MainLayout>
  );
}