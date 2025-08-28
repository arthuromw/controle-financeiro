// FILE: src/components/suppliers/SupplierForm.jsx
import { useState, useEffect } from 'react';

export default function SupplierForm({ onSave, onCancel, initialData }) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setContact(initialData.contact || '');
      setPhone(initialData.phone || '');
    } else {
      setName('');
      setContact('');
      setPhone('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return alert("O nome do fornecedor é obrigatório.");
    onSave({ name, contact, phone });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{initialData ? 'Editar Fornecedor' : 'Novo Fornecedor'}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 border rounded-md px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Pessoa de Contato</label>
          <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} className="w-full mt-1 border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Telefone</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full mt-1 border rounded-md px-3 py-2" />
        </div>
        <div className="md:col-span-3 flex justify-end gap-4 mt-4">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-md">Cancelar</button>
          <button type="submit" className="px-4 py-2 text-white bg-indigo-600 rounded-md">Salvar</button>
        </div>
      </form>
    </div>
  );
}