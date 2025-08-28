// FILE: src/components/products/ProductForm.jsx
import { useState, useEffect } from 'react';

export default function ProductForm({ onSave, onCancel, initialData }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setPrice(initialData.price || '');
      setStock(initialData.stock || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || price < 0 || stock < 0) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }
    onSave({ 
        name, 
        price: Number(price), 
        stock: Number(stock) 
    });
  };

  return (
    <div className="card p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{initialData ? 'Editar Produto' : 'Novo Produto'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Produto</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 mt-1 border rounded-md" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Preço (R$)</label>
            <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 mt-1 border rounded-md" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estoque (Unidades)</label>
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full px-3 py-2 mt-1 border rounded-md" required />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button type="button" onClick={onCancel} className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}