import { useEffect, useState } from 'react';

import { type ProdutoPorTipo } from '../models/ProdutoPorTipo';

const tipos = ['ELETRONICO', 'ELETRODOMESTICO', 'MOVEL'] as const;
type TipoProduto = typeof tipos[number];

export function ConsultaTipo() {
    const [tipoSelecionado, setTipoSelecionado] = useState<TipoProduto>('ELETRONICO');
    const [dados, setDados] = useState<ProdutoPorTipo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:8080/movimentos/produtos-por-tipo?tipo=${tipoSelecionado}`)
            .then((res) => {
                if (!res.ok) throw new Error('Erro ao buscar dados');
                return res.json();
            })
            .then((data: ProdutoPorTipo[]) => {
                setDados(data);
                setError(null);
            })
            .catch((err) => {
                setError(err.message);
                setDados([]);
            })
            .finally(() => setLoading(false));
    }, [tipoSelecionado]);

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Consulta de Produtos por Tipo</h2>

            <label htmlFor="tipo" className="block mb-2 font-medium">
                Selecione o tipo:
            </label>
            <select
                id="tipo"
                value={tipoSelecionado}
                onChange={(e) => setTipoSelecionado(e.target.value as TipoProduto)}
                className="border border-gray-300 rounded px-2 py-1 mb-4"
            >
                {tipos.map((tipo) => (
                    <option key={tipo} value={tipo}>
                        {tipo}
                    </option>
                ))}
            </select>

            {loading && <p>Carregando dados...</p>}
            {error && <p className="text-red-500">Erro: {error}</p>}

            {!loading && !error && dados.length === 0 && <p>Nenhum dado encontrado para esse tipo.</p>}

            {!loading && !error && dados.length > 0 && (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2 text-left">Código</th>
                            <th className="border border-gray-300 p-2 text-left">Descrição</th>
                            <th className="border border-gray-300 p-2 text-right">Quantidade Saída</th>
                            <th className="border border-gray-300 p-2 text-right">Quantidade Disponível</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dados.map((produto) => (
                            <tr key={produto.codigo} className="even:bg-gray-100">
                                <td className="border border-gray-300 p-2">{produto.codigo}</td>
                                <td className="border border-gray-300 p-2">{produto.descricao}</td>
                                <td className="border border-gray-300 p-2 text-right">{produto.quantidadeVendida}</td>
                                <td className="border border-gray-300 p-2 text-right">{produto.quantidadeDisponivel}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
