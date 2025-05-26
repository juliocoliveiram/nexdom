// src/components/EntradaSaida.tsx

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';


type Produto = {
  codigo: number;
  descricao: string;
  tipo: string;
  valorFornecedor: number;
  quantidadeEstoque: number;
}

const formSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  valorFornecedor: z.number().min(0, 'Valor deve ser positivo'),
  quantidadeEstoque: z.number().min(0, 'Quantidade deve ser positiva'),
});

const movimentoSchema = z.object({
  tipo: z.enum(['ENTRADA', 'SAIDA']),
  quantidade: z.number().min(1, 'Quantidade deve ser pelo menos 1'),
  valorVenda: z.number().min(0, 'Valor de venda deve ser positivo'),
});

export function EntradaSaida() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(
    null
  );
  const [mostraFormularioUpdate, setMostraFormularioUpdate] = useState(false);

  const formUpdate = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      descricao: '',
      tipo: '',
      valorFornecedor: 0,
      quantidadeEstoque: 0,
    },
  });

  const formMovimento = useForm<z.infer<typeof movimentoSchema>>({
    resolver: zodResolver(movimentoSchema),
    defaultValues: {
      tipo: 'ENTRADA',
      quantidade: 1,
      valorVenda: 0,
    },
  });

  useEffect(() => {
    fetchProdutos();
  }, []);

  function fetchProdutos() {
    fetch('http://localhost:8080/produtos')
      .then((res) => res.json())
      .then((data: Produto[]) => setProdutos(data))
      .catch((err) => console.error('Erro ao buscar produtos:', err));
  }

  function handleProdutoChange(produtoId: string) {
    if (!produtoId) {
      setProdutoSelecionado(null);
      formUpdate.reset();
      formMovimento.reset();
      setMostraFormularioUpdate(false);
      return;
    }

    fetch(`http://localhost:8080/produtos/${produtoId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Produto não encontrado');
        return res.json();
      })
      .then((data: Produto) => {
        setProdutoSelecionado(data);
        formUpdate.reset({
          descricao: data.descricao,
          tipo: data.tipo,
          valorFornecedor: data.valorFornecedor,
          quantidadeEstoque: data.quantidadeEstoque,
        });
        formMovimento.reset({
          tipo: 'ENTRADA',
          quantidade: 1,
          valorVenda: 0,
        });
        setMostraFormularioUpdate(false);
      })
      .catch((err) => {
        console.error(err);
        setProdutoSelecionado(null);
        setMostraFormularioUpdate(false);
      });
  }

  function onUpdate(data: z.infer<typeof formSchema>) {
    if (!produtoSelecionado) return;

    fetch(`http://localhost:8080/produtos/${produtoSelecionado.codigo}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao atualizar');
        alert('Produto atualizado com sucesso!');
        fetchProdutos();
        setMostraFormularioUpdate(false);
        handleProdutoChange(produtoSelecionado.codigo.toString());
      })
      .catch((err) => alert('Erro: ' + err.message));
  }

  function onDelete() {
    if (!produtoSelecionado) return;

    if (
      !confirm(
        `Tem certeza que deseja deletar o produto "${produtoSelecionado.descricao}"?`
      )
    )
      return;

    fetch(`http://localhost:8080/produtos/${produtoSelecionado.codigo}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao deletar');
        alert('Produto deletado com sucesso!');
        setProdutoSelecionado(null);
        fetchProdutos();
        formUpdate.reset();
        formMovimento.reset();
        setMostraFormularioUpdate(false);
      })
      .catch((err) => alert('Erro: ' + err.message));
  }

  function onMovimentar(data: z.infer<typeof movimentoSchema>) {
    if (!produtoSelecionado) return;

    const url = `http://localhost:8080/movimentos/${produtoSelecionado.codigo}?tipo=${data.tipo}&quantidade=${data.quantidade}&valorVenda=${data.valorVenda}`;

    fetch(url, {
      method: 'POST',
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorBody = await res.json();
          const errorMessage = errorBody.message || 'Erro ao registrar movimentação';
          throw new Error(errorMessage);
        }

        alert(`Movimentação de ${data.tipo} realizada com sucesso!`);
        fetchProdutos();
        handleProdutoChange(produtoSelecionado.codigo.toString());
        formMovimento.reset({ tipo: 'ENTRADA', quantidade: 1, valorVenda: 0 });
      })
      .catch((err) => {
        alert('Erro: ' + err.message);
      });
  }

  const tipoMovimentacao = formMovimento.watch("tipo");

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Gerenciar Produtos</h2>

      <div className="mb-6">
        <label htmlFor="produto-select" className="block font-medium mb-2">
          Selecione um produto
        </label>
        <select
          id="produto-select"
          className="border rounded p-2 w-full"
          onChange={(e) => handleProdutoChange(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            -- Selecione --
          </option>
          {produtos.map((p) => (
            <option key={p.codigo} value={p.codigo}>
              {p.descricao}
            </option>
          ))}
        </select>
      </div>

      {produtoSelecionado && (
        <div className="mb-6 border p-4 rounded bg-gray-50">
          <h3 className="font-semibold mb-2">Detalhes do Produto</h3>
          <p>
            <strong>Código:</strong> {produtoSelecionado.codigo}
          </p>
          <p>
            <strong>Descrição:</strong> {produtoSelecionado.descricao}
          </p>
          <p>
            <strong>Tipo:</strong> {produtoSelecionado.tipo}
          </p>
          <p>
            <strong>Valor Fornecedor:</strong> R${' '}
            {produtoSelecionado.valorFornecedor.toFixed(2)}
          </p>
          <p>
            <strong>Quantidade em Estoque:</strong>{' '}
            {produtoSelecionado.quantidadeEstoque}
          </p>

          <div className="flex gap-4 mt-4">
            <Button style={{ backgroundColor: 'blue', color: 'white' }} onClick={() => setMostraFormularioUpdate(!mostraFormularioUpdate)}>
              {mostraFormularioUpdate ? 'Cancelar' : 'Atualizar'}
            </Button>
            <Button
              style={{ backgroundColor: 'red', color: 'white' }}
              onClick={onDelete}
            >
              Deletar Produto
            </Button>
          </div>
        </div>
      )}

      {mostraFormularioUpdate && produtoSelecionado && (
        <>
          <h3 className="text-xl font-semibold mb-2">Atualizar Produto</h3>
          <Form {...formUpdate}>
            <form
              onSubmit={formUpdate.handleSubmit(onUpdate)}
              className="space-y-4"
            >
              <FormField
                control={formUpdate.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formUpdate.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formUpdate.control}
                name="valorFornecedor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Fornecedor</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formUpdate.control}
                name="quantidadeEstoque"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade em Estoque</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button style={{ backgroundColor: 'blue', color: 'white' }} type="submit" className="w-full">
                Salvar Atualização
              </Button>
            </form>
          </Form>
        </>
      )}

      {produtoSelecionado && (
        <>
          <h3 className="text-xl font-semibold mt-8 mb-2">Registrar Movimentação</h3>
          <Form {...formMovimento}>
            <form
              onSubmit={formMovimento.handleSubmit(onMovimentar)}
              className="space-y-4"
            >
              <FormField
                control={formMovimento.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <FormControl>
                      <select {...field} className="border rounded p-2 w-full">
                        <option value="ENTRADA">Entrada</option>
                        <option value="SAIDA">Saída</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formMovimento.control}
                name="quantidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {tipoMovimentacao === "SAIDA" && (
                <FormField
                  control={formMovimento.control}
                  name="valorVenda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor de Venda</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button style={{ backgroundColor: 'green', color: 'white' }} type="submit" className="w-full">
                Registrar Movimentação
              </Button>
            </form>
          </Form>
        </>
      )}
    </div>
  );
}