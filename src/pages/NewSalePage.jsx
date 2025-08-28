// FILE: src/pages/NewSalePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs, addDoc, query, where, serverTimestamp } from 'firebase/firestore';
import MainLayout from '../components/layout/MainLayout';
import SaleForm from '../components/sales/SaleForm'; // Criaremos este componente

export default function NewSalePage() {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Função para buscar clientes e produtos
  const fetchData = async () => {
    setLoading(true);
    const userId = auth.currentUser.uid;

    // Buscar Clientes
    const clientsQuery = query(collection(db, "clients"), where("userId", "==", userId));
    const clientsData = await getDocs(clientsQuery);
    setClients(clientsData.docs.map(doc => ({ ...doc.data(), id: doc.id })));

    // Buscar Produtos
    const productsQuery = query(collection(db, "products"), where("userId", "==", userId));
    const productsData = await getDocs(productsQuery);
    setProducts(productsData.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSale = async (saleData) => {
    try {
      const salesCollectionRef = collection(db, "sales");
      await addDoc(salesCollectionRef, {
        ...saleData,
        userId: auth.currentUser.uid,
        saleDate: serverTimestamp() // Usa a data/hora do servidor
      });
      alert('Venda registrada com sucesso!');
      navigate('/sales');
    } catch (error) {
      console.error("Erro ao salvar a venda: ", error);
      alert('Ocorreu um erro ao salvar a venda.');
    }
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Registrar Nova Venda</h1>
      </div>
      
      {loading ? (
        <p>Carregando dados...</p>
      ) : (
        <SaleForm
          clients={clients}
          products={products}
          onSave={handleSaveSale}
          onCancel={() => navigate('/sales')}
        />
      )}
    </MainLayout>
  );
}