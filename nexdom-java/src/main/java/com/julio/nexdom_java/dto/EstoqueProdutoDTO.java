package com.julio.nexdom_java.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstoqueProdutoDTO {
    private Long codigo;
    private String descricao;
    private int quantidadeVendida;
    private int quantidadeDisponivel;
}
