package com.julio.nexdom_java.service;

import com.julio.nexdom_java.dto.LucroProdutoDTO;
import com.julio.nexdom_java.dto.EstoqueProdutoDTO;
import com.julio.nexdom_java.exception.EstoqueInsuficienteException;
import com.julio.nexdom_java.model.MovimentoEstoque;
import com.julio.nexdom_java.model.Produto;
import com.julio.nexdom_java.model.TipoMovimentacao;
import com.julio.nexdom_java.model.TipoProduto;
import com.julio.nexdom_java.repository.MovimentoEstoqueRepository;
import com.julio.nexdom_java.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class MovimentoEstoqueService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private MovimentoEstoqueRepository movimentoEstoqueRepository;

    @Transactional
    public MovimentoEstoque realizarMovimentacao(Long produtoId, TipoMovimentacao tipo, Integer quantidade, Double valorVenda) {
        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com id: " + produtoId));

        if (tipo == TipoMovimentacao.SAIDA) {
            if (produto.getQuantidadeEstoque() < quantidade) {
                throw new EstoqueInsuficienteException("Estoque insuficiente para o produto " + produto.getDescricao());
            }
            produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - quantidade);
        } else if (tipo == TipoMovimentacao.ENTRADA) {
            produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + quantidade);
            valorVenda = null;
        }

        produtoRepository.save(produto);

        MovimentoEstoque movimento = new MovimentoEstoque();
        movimento.setProduto(produto);
        movimento.setTipoMovimentacao(tipo);
        movimento.setQuantidadeMovimentada(quantidade);
        movimento.setValorVenda(valorVenda);
        movimento.setDataMovimentacao(LocalDateTime.now());

        return movimentoEstoqueRepository.save(movimento);
    }

    @Transactional
    public List<EstoqueProdutoDTO> consultarProdutosPorTipo(TipoProduto tipo) {
        List<Produto> produtos = produtoRepository.findByTipo(tipo);

        return produtos.stream().map(produto -> {
            List<MovimentoEstoque> entradas = movimentoEstoqueRepository
                    .findByProduto_CodigoAndTipoMovimentacao(produto.getCodigo(), TipoMovimentacao.ENTRADA);

            List<MovimentoEstoque> saidas = movimentoEstoqueRepository
                    .findByProduto_CodigoAndTipoMovimentacao(produto.getCodigo(), TipoMovimentacao.SAIDA);

            int totalSaidas = saidas.stream()
                    .mapToInt(MovimentoEstoque::getQuantidadeMovimentada).sum();

            int quantidadeDisponivel = (produto.getQuantidadeEstoque() + totalSaidas) - totalSaidas;

            return new EstoqueProdutoDTO(
                    produto.getCodigo(),
                    produto.getDescricao(),
                    totalSaidas,
                    quantidadeDisponivel
            );
        }).filter(dto -> dto.getQuantidadeVendida() > 0)
                .collect(Collectors.toList());
    }


    @Transactional
    public List<LucroProdutoDTO> calcularLucroPorProduto() {
        List<Produto> produtos = produtoRepository.findAll();

        return produtos.stream()
                .map(produto -> {
                    List<MovimentoEstoque> saidas = movimentoEstoqueRepository
                            .findByProduto_CodigoAndTipoMovimentacao(produto.getCodigo(), TipoMovimentacao.SAIDA);

                    int quantidadeSaidaTotal = 0;
                    double lucroTotal = 0.0;

                    for (MovimentoEstoque movimento : saidas) {
                        int quantidade = movimento.getQuantidadeMovimentada();
                        double valorVenda = movimento.getValorVenda();
                        double valorFornecedor = produto.getValorFornecedor();

                        quantidadeSaidaTotal += quantidade;
                        lucroTotal += (valorVenda - valorFornecedor) * quantidade;
                    }

                    if (quantidadeSaidaTotal == 0) return null;

                    return new LucroProdutoDTO(
                            produto.getCodigo(),
                            produto.getDescricao(),
                            quantidadeSaidaTotal,
                            lucroTotal
                    );
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
}