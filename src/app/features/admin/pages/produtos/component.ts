import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ProdutoItem {
  id: number;
  nome: string;
  descricao: string;
  tipo: 'Unitário' | 'Por peso (kg)';
  ativo: boolean;
  preco: string;
  controleEstoque?: boolean;
}

@Component({
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  templateUrl: './page.html',
})
export class ProdutosPage {
  readonly produtos: ProdutoItem[] = [
    {
      id: 1,
      nome: 'Coxinha tradicional',
      descricao: 'Salgado assado com frango desfiado',
      tipo: 'Unitário',
      ativo: true,
      preco: 'R$ 6,50',
      controleEstoque: true,
    },
    {
      id: 2,
      nome: 'Suco natural de laranja',
      descricao: 'Bebida preparada diariamente',
      tipo: 'Por peso (kg)',
      ativo: true,
      preco: 'R$ 22,90/kg',
    },
    {
      id: 3,
      nome: 'Bolo de cenoura',
      descricao: 'Fatia individual com cobertura de chocolate',
      tipo: 'Unitário',
      ativo: false,
      preco: 'R$ 8,00',
      controleEstoque: false,
    },
  ];
}
