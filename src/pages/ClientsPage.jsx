// FILE: src/pages/ClientsPage.jsx
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import MainLayout from '../components/layout/MainLayout';
import ClientList from '../components/clients/ClientList';
import ClientForm from '../components/clients/ClientForm';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);

  const clientsCollectionRef = collection(db, "clients");

  const getClients = async () => {
    setLoading(true);
    const q = query(clientsCollectionRef, where("userId", "==", auth.currentUser.uid));
    const data = await getDocs(q);
    setClients(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setLoading(false);
  };

  useEffect(() => {
    getClients();
  }, []);

  const handleSave = async (clientData) => {
    if (currentClient) {
      const clientDoc = doc(db, "clients", currentClient.id);
      await updateDoc(clientDoc, clientData);
    } else {
      await addDoc(clientsCollectionRef, { ...clientData, userId: auth.currentUser.uid });
    }
    await getClients();
    setIsFormVisible(false);
    setCurrentClient(null);
  };

  const handleEdit = (client) => {
    setCurrentClient(client);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      const clientDoc = doc(db, "clients", id);
      await deleteDoc(clientDoc);
      await getClients();
    }
  };

  const openForm = () => {
    setCurrentClient(null);
    setIsFormVisible(true);
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Clientes</h1>
        {!isFormVisible && (
          <button onClick={openForm} className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Adicionar Cliente
          </button>
        )}
      </div>

      {isFormVisible ? (
        <ClientForm 
          onSave={handleSave} 
          onCancel={() => { setIsFormVisible(false); setCurrentClient(null); }}
          initialData={currentClient}
        />
      ) : (
        loading ? <p>Carregando...</p> : <ClientList clients={clients} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </MainLayout>
  );
}