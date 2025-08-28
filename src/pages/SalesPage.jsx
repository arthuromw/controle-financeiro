// FILE: src/pages/SalesPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import MainLayout from '../components/layout/MainLayout';
import SaleList from '../components/sales/SaleList'; // Criaremos este componente

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Função para buscar as vendas do usuário logado
  const getSales = async () => {
    setLoading(true);
    const salesCollectionRef = collection(db, "sales");
    const q = query(salesCollectionRef, where("userId", "==", auth.currentUser.uid));
    const data = await getDocs(q);
    setSales(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setLoading(false);
  };

  useEffect(() => {
    getSales();
  }, []);

const handleNewSale = () => {
    navigate('/sales/new'); // <-- Altere esta linha
  };
  
  const handleDeleteSale = async (id) => {
      // Lógica para deletar venda (pode ser implementada depois)
      alert(`Funcionalidade de deletar venda ${id} a ser implementada.`);
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vendas</h1>
        <button onClick={handleNewSale} className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          Registrar Nova Venda
        </button>
      </div>

      {loading ? <p>Carregando vendas...</p> : <SaleList sales={sales} onDelete={handleDeleteSale} />}
    </MainLayout>
  );
}