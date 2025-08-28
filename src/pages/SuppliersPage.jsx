// FILE: src/pages/SuppliersPage.jsx
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import MainLayout from '../components/layout/MainLayout';
import SupplierList from '../components/suppliers/SupplierList'; // Criaremos este
import SupplierForm from '../components/suppliers/SupplierForm'; // e este

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);

  const suppliersCollectionRef = collection(db, "suppliers");

  const getSuppliers = async () => {
    setLoading(true);
    const q = query(suppliersCollectionRef, where("userId", "==", auth.currentUser.uid));
    const data = await getDocs(q);
    setSuppliers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setLoading(false);
  };

  useEffect(() => {
    getSuppliers();
  }, []);

  const handleSave = async (supplierData) => {
    if (currentSupplier) {
      const supplierDoc = doc(db, "suppliers", currentSupplier.id);
      await updateDoc(supplierDoc, supplierData);
    } else {
      await addDoc(suppliersCollectionRef, { ...supplierData, userId: auth.currentUser.uid });
    }
    await getSuppliers();
    setIsFormVisible(false);
    setCurrentSupplier(null);
  };

  const handleEdit = (supplier) => {
    setCurrentSupplier(supplier);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este fornecedor?")) {
      const supplierDoc = doc(db, "suppliers", id);
      await deleteDoc(supplierDoc);
      await getSuppliers();
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Fornecedores</h1>
        {!isFormVisible && (
          <button onClick={() => setIsFormVisible(true)} className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Adicionar Fornecedor
          </button>
        )}
      </div>

      {isFormVisible ? (
        <SupplierForm 
          onSave={handleSave} 
          onCancel={() => { setIsFormVisible(false); setCurrentSupplier(null); }}
          initialData={currentSupplier}
        />
      ) : (
        loading ? <p>Carregando...</p> : <SupplierList suppliers={suppliers} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </MainLayout>
  );
}