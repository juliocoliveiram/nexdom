package com.julio.nexdom_java.service;
import com.julio.nexdom_java.model.Produto;
import com.julio.nexdom_java.repository.MovimentoEstoqueRepository;
import com.julio.nexdom_java.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private MovimentoEstoqueRepository movimentoEstoqueRepository;

    public Produto create(Produto produto){
        System.out.println("Tipo Produto antes de salvar: " + produto.getTipo());
        return produtoRepository.save(produto);
    }

    public List<Produto> getAll(){
        return produtoRepository.findAll();
    }

    public Produto getId(Long id){
        Optional<Produto> produto = produtoRepository.findById(id);
        return produto.get();
    }

    public Produto update(Produto produto){
        Optional<Produto> produtoOptional = produtoRepository.findById(produto.getCodigo());
        updateProduto(produtoOptional, produto);
        return produtoRepository.save(produtoOptional.get());
    }

    private void updateProduto(Optional<Produto> produtoOptional, Produto produto) {
        produtoOptional.get().setDescricao(produto.getDescricao());
    }

    public void delete(Long id){
        produtoRepository.deleteById(id);
    }
}
