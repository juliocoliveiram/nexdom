package com.julio.nexdom_java.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LucroProdutoDTO {
    private Long codigo;
    private String descricao;
    private int quantidadeVendida;
    private double lucroTotal;
}
