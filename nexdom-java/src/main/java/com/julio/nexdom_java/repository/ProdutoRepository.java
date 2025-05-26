package com.julio.nexdom_java.repository;

import com.julio.nexdom_java.model.Produto;
import com.julio.nexdom_java.model.TipoProduto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    List<Produto> findByTipo(TipoProduto tipo);
}
