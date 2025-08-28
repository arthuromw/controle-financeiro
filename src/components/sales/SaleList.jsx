// FILE: src/components/sales/SaleList.jsx

export default function SaleList({ sales, onDelete }) {
  if (sales.length === 0) {
    return <p className="text-center text-gray-500">Nenhuma venda registrada ainda.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Data</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Cliente</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Itens</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Valor Total</th>
            {/* <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Ações</th> */}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {/* O Firestore salva a data de uma forma complexa, precisamos converter */}
                {sale.saleDate ? new Date(sale.saleDate.seconds * 1000).toLocaleDateString('pt-BR') : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{sale.clientName || 'Cliente não informado'}</td>
              <td className="px-6 py-4 whitespace-nowrap">{sale.items?.length || 0}</td>
              <td className="px-6 py-4 whitespace-nowrap font-semibold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.total || 0)}
              </td>
              {/* <td className="px-6 py-4 whitespace-nowrap">
                <button onClick={() => onDelete(sale.id)} className="text-red-600 hover:text-red-900">
                    <FiTrash2 size={18} />
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}