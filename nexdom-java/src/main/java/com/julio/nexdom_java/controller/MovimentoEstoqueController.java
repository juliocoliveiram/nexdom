package com.julio.nexdom_java.controller;

import com.julio.nexdom_java.dto.EstoqueProdutoDTO;
import com.julio.nexdom_java.dto.LucroProdutoDTO;
import com.julio.nexdom_java.model.MovimentoEstoque;
import com.julio.nexdom_java.model.TipoMovimentacao;
import com.julio.nexdom_java.model.TipoProduto;
import com.julio.nexdom_java.service.MovimentoEstoqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movimentos")
@CrossOrigin(origins = "http://localhost:5173")
public class MovimentoEstoqueController {

    @Autowired
    private MovimentoEstoqueService movimentoEstoqueService;

    @PostMapping("/{produtoId}")
    public ResponseEntity<MovimentoEstoque> movimentarEstoque(
            @PathVariable Long produtoId,
            @RequestParam TipoMovimentacao tipo,
            @RequestParam Integer quantidade,
            @RequestParam Double valorVenda) {
        MovimentoEstoque movimento = movimentoEstoqueService.realizarMovimentacao(produtoId, tipo, quantidade, valorVenda);
        return new ResponseEntity<>(movimento, HttpStatus.CREATED);
    }

    @GetMapping("/lucro-produtos")
    public ResponseEntity<List<LucroProdutoDTO>> consultarLucroPorProduto() {
        List<LucroProdutoDTO> lucroProdutos = movimentoEstoqueService.calcularLucroPorProduto();
        return ResponseEntity.ok(lucroProdutos);
    }

    @GetMapping("/produtos-por-tipo")
    public ResponseEntity<List<EstoqueProdutoDTO>> consultarPorTipo(@RequestParam TipoProduto tipo) {
        List<EstoqueProdutoDTO> resultado = movimentoEstoqueService.consultarProdutosPorTipo(tipo);
        return ResponseEntity.ok(resultado);
    }
}