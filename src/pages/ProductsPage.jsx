// FILE: src/pages/ProductsPage.jsx
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import MainLayout from '../components/layout/MainLayout';
import ProductList from '../components/products/ProductList';
import ProductForm from '../components/products/ProductForm';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null); // Para edição

  const productsCollectionRef = collection(db, "products");

  // Função para buscar produtos do usuário logado
  const getProducts = async () => {
    setLoading(true);
    const q = query(productsCollectionRef, where("userId", "==", auth.currentUser.uid));
    const data = await getDocs(q);
    setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setLoading(false);
  };

  useEffect(() => {
    getProducts();
  }, []);

  // Altere esta parte na função handleSave
const handleSave = async (productData) => {
  try {
    if (currentProduct) {
      const productDoc = doc(db, "products", currentProduct.id);
      await updateDoc(productDoc, productData);
    } else {
      await addDoc(productsCollectionRef, { ...productData, userId: auth.currentUser.uid });
    }
    await getProducts();
    setIsFormVisible(false);
    setCurrentProduct(null);
  } catch (error) {
    // Linha chave para depuração!
    console.error("Erro ao salvar produto: ", error); 
    alert("Ocorreu um erro ao salvar o produto. Verifique o console para mais detalhes.");
  }
};

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      const productDoc = doc(db, "products", id);
      await deleteDoc(productDoc);
      await getProducts(); // Recarrega a lista
    }
  };

  const openForm = () => {
    setCurrentProduct(null);
    setIsFormVisible(true);
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Produtos e Estoque</h1>
        {!isFormVisible && (
          <button onClick={openForm} className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Adicionar Produto
          </button>
        )}
      </div>

      {isFormVisible ? (
        <ProductForm 
          onSave={handleSave} 
          onCancel={() => { setIsFormVisible(false); setCurrentProduct(null); }}
          initialData={currentProduct}
        />
      ) : (
        loading ? <p>Carregando...</p> : <ProductList products={products} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </MainLayout>
  );
}