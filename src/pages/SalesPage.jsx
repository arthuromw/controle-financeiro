// FILE: src/pages/SalesPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore'; // Importe o deleteDoc
import MainLayout from '../components/layout/MainLayout';
import SaleList from '../components/sales/SaleList';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getSales = async () => {
    setLoading(true);
    const salesCollectionRef = collection(db, "sales");
    if (!auth.currentUser) return;
    const q = query(salesCollectionRef, where("userId", "==", auth.currentUser.uid));
    const data = await getDocs(q);
    setSales(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setLoading(false);
  };

  useEffect(() => {
    getSales();
  }, []);

  const handleNewSale = () => {
    navigate('/sales/new');
  };
  
  const handleDeleteSale = async (id) => {
      if (window.confirm("Tem certeza que deseja excluir esta venda? Esta ação não pode ser desfeita e não reverterá o estoque.")) {
          try {
            const saleDoc = doc(db, "sales", id);
            await deleteDoc(saleDoc);
            await getSales(); // Recarrega a lista
          } catch (error) {
              console.error("Erro ao deletar venda:", error);
              alert("Não foi possível excluir a venda.");
          }
      }
  };

  return (
    <MainLayout>
      {/* AQUI ESTÁ A CORREÇÃO: Usando a classe page-header */}
      <div className="page-header">
        <h1>Vendas</h1>
        <button onClick={handleNewSale}>
          Registrar Nova Venda
        </button>
      </div>

      {loading ? <p>Carregando vendas...</p> : <SaleList sales={sales} onDelete={handleDeleteSale} />}
    </MainLayout>
  );
}