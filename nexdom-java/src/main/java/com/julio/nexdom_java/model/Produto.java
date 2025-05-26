package com.julio.nexdom_java.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.io.Serializable;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Produto implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    @Column(nullable = false)
    private String descricao;

    @Enumerated(EnumType.STRING)
    private TipoProduto tipo;

    @Column(nullable = false)
    private Double valorFornecedor;

    @Column(nullable = false)
    private Integer quantidadeEstoque;
}
