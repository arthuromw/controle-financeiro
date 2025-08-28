// FILE: src/pages/NewSalePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs, addDoc, query, where, serverTimestamp, runTransaction, doc } from 'firebase/firestore';
import MainLayout from '../components/layout/MainLayout';
import SaleForm from '../components/sales/SaleForm';

export default function NewSalePage() {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // ========================================================================
  // ## AQUI ESTÁ A FUNÇÃO fetchData QUE ESTAVA FALTANDO ##
  // ========================================================================
  const fetchData = async () => {
    setLoading(true);
    try {
      const userId = auth.currentUser.uid;

      // Buscar Clientes
      const clientsQuery = query(collection(db, "clients"), where("userId", "==", userId));
      const clientsData = await getDocs(clientsQuery);
      setClients(clientsData.docs.map(doc => ({ ...doc.data(), id: doc.id })));

      // Buscar Produtos
      const productsQuery = query(collection(db, "products"), where("userId", "==", userId));
      const productsData = await getDocs(productsQuery);
      setProducts(productsData.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Erro ao buscar dados para nova venda:", error);
      alert("Não foi possível carregar os dados de clientes e produtos.");
    } finally {
      setLoading(false);
    }
  };

  // O useEffect chama a função fetchData quando a página carrega
  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSale = async (saleData) => {
    setIsSaving(true);
    try {
      await runTransaction(db, async (transaction) => {
        // --- ETAPA 1: LEITURAS ---
        const productRefs = saleData.items.map(item => doc(db, "products", item.id));
        const productDocs = await Promise.all(productRefs.map(ref => transaction.get(ref)));

        // --- ETAPA 2: VALIDAÇÃO ---
        for (let i = 0; i < saleData.items.length; i++) {
          const productDoc = productDocs[i];
          const item = saleData.items[i];
          if (!productDoc.exists()) {
            throw new Error(`Produto "${item.name}" não encontrado.`);
          }
          const currentStock = productDoc.data().stock;
          if (currentStock < item.quantity) {
            throw new Error(`Estoque insuficiente para "${item.name}". Disponível: ${currentStock}, Pedido: ${item.quantity}.`);
          }
        }

        // --- ETAPA 3: ESCRITAS ---
        const salesCollectionRef = collection(db, "sales");
        const newSaleRef = doc(salesCollectionRef);
        transaction.set(newSaleRef, {
          ...saleData,
          userId: auth.currentUser.uid,
          saleDate: serverTimestamp(),
          status: 'Pendente',
        });

        for (let i = 0; i < productDocs.length; i++) {
          const productRef = productRefs[i];
          const currentStock = productDocs[i].data().stock;
          const itemQuantity = saleData.items[i].quantity;
          const newStock = currentStock - itemQuantity;
          transaction.update(productRef, { stock: newStock });
        }
      });

      alert('Venda registrada e estoque atualizado com sucesso!');
      navigate('/sales');

    } catch (error) {
      console.error("Erro ao registrar a venda: ", error);
      alert(`Não foi possível registrar a venda: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="page-header">
        <h1>Registrar Nova Venda</h1>
      </div>
      
      {loading ? (
        <p>Carregando dados...</p>
      ) : (
        <SaleForm
          clients={clients}
          products={products}
          onSave={handleSaveSale}
          onCancel={() => navigate('/sales')}
          isSaving={isSaving}
        />
      )}
    </MainLayout>
  );
}