package com.julio.nexdom_java.repository;

import com.julio.nexdom_java.model.MovimentoEstoque;
import com.julio.nexdom_java.model.TipoMovimentacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MovimentoEstoqueRepository extends JpaRepository<MovimentoEstoque, Long> {
    List<MovimentoEstoque> findByProduto_CodigoAndTipoMovimentacao(Long codigo, TipoMovimentacao tipo);

}