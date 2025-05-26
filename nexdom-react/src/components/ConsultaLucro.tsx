import { useEffect, useState } from 'react';

import { type ProdutoLucro } from '../models/ProdutoLucro';

export function ConsultaLucro() {
    const [dados, setDados] = useState<ProdutoLucro[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:8080/movimentos/lucro-produtos')
            .then((res) => {
                if (!res.ok) throw new Error('Erro ao buscar dados');
                return res.json();
            })
            .then((data: ProdutoLucro[]) => {
                setDados(data);
                setError(null);
            })
            .catch((err) => {
                setError(err.message);
                setDados([]);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Consulta de Lucro por Produto</h2>

            {loading && <p>Carregando dados...</p>}
            {error && <p className="text-red-500">Erro: {error}</p>}

            {!loading && !error && dados.length === 0 && <p>Nenhum dado encontrado.</p>}

            {!loading && !error && dados.length > 0 && (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2 text-left">Código</th>
                            <th className="border border-gray-300 p-2 text-left">Descrição</th>
                            <th className="border border-gray-300 p-2 text-right">Quantidade Saída</th>
                            <th className="border border-gray-300 p-2 text-right">Lucro Total (R$)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dados.map((produto) => (
                            <tr key={produto.codigo} className="even:bg-gray-100">
                                <td className="border border-gray-300 p-2">{produto.codigo}</td>
                                <td className="border border-gray-300 p-2">{produto.descricao}</td>
                                <td className="border border-gray-300 p-2 text-right">{produto.quantidadeVendida}</td>
                                <td className="border border-gray-300 p-2 text-right">
                                    {produto.lucroTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
