import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Venda, VendaFiltro } from './models';

@Injectable({ providedIn: 'root' })
export class RelatorioVendasService {
  private readonly vendas = signal<Venda[]>([
    {
      id: 'v1',
      dataHora: '2024-09-01T08:45:00',
      terminal: 'Terminal 1',
      operador: 'Camila',
      cliente: 'Mariana Albuquerque',
      registroCliente: 'ALU-0231',
      total: 42,
      formaPagamento: 'CONVENIO',
      status: 'CONCLUIDA',
      caixaId: 'CX-01',
      itens: [
        { id: 'i1', vendaId: 'v1', produto: 'Sanduíche', quantidade: 2, valorUnitario: 8, total: 16 },
        { id: 'i2', vendaId: 'v1', produto: 'Suco natural', quantidade: 2, valorUnitario: 7, total: 14 },
        { id: 'i3', vendaId: 'v1', produto: 'Sobremesa', quantidade: 1, valorUnitario: 12, total: 12 },
      ],
    },
    {
      id: 'v2',
      dataHora: '2024-09-01T12:30:00',
      terminal: 'Terminal 2',
      operador: 'Rafael',
      cliente: 'Paulo Henrique',
      registroCliente: 'PRO-1802',
      total: 35,
      formaPagamento: 'SALDO',
      status: 'CONCLUIDA',
      caixaId: 'CX-02',
      itens: [
        { id: 'i4', vendaId: 'v2', produto: 'Prato executivo', quantidade: 1, valorUnitario: 28, total: 28 },
        { id: 'i5', vendaId: 'v2', produto: 'Café especial', quantidade: 1, valorUnitario: 7, total: 7 },
      ],
    },
    {
      id: 'v3',
      dataHora: '2024-09-02T10:05:00',
      terminal: 'Terminal 3',
      operador: 'Maria',
      cliente: 'Luciana Moraes',
      registroCliente: 'ALU-0491',
      total: 18,
      formaPagamento: 'DINHEIRO',
      status: 'CONCLUIDA',
      caixaId: 'CX-03',
      itens: [{ id: 'i6', vendaId: 'v3', produto: 'Pão de queijo', quantidade: 3, valorUnitario: 6, total: 18 }],
    },
    {
      id: 'v4',
      dataHora: '2024-09-03T13:20:00',
      terminal: 'Terminal 2',
      operador: 'Rafael',
      cliente: 'Beatriz Campos',
      registroCliente: 'ALU-0844',
      total: 52,
      formaPagamento: 'DINHEIRO',
      status: 'CONCLUIDA',
      caixaId: 'CX-02',
      itens: [
        { id: 'i7', vendaId: 'v4', produto: 'Prato executivo', quantidade: 1, valorUnitario: 28, total: 28 },
        { id: 'i8', vendaId: 'v4', produto: 'Salada', quantidade: 1, valorUnitario: 10, total: 10 },
        { id: 'i9', vendaId: 'v4', produto: 'Suco natural', quantidade: 2, valorUnitario: 7, total: 14 },
      ],
    },
    {
      id: 'v5',
      dataHora: '2024-09-04T09:50:00',
      terminal: 'Terminal 1',
      operador: 'Camila',
      cliente: 'Rafael Dias',
      registroCliente: 'OUT-0788',
      total: 28,
      formaPagamento: 'CONVENIO',
      status: 'ESTORNADA',
      caixaId: 'CX-01',
      itens: [
        { id: 'i10', vendaId: 'v5', produto: 'Sanduíche', quantidade: 1, valorUnitario: 8, total: 8 },
        { id: 'i11', vendaId: 'v5', produto: 'Suco natural', quantidade: 2, valorUnitario: 7, total: 14 },
        { id: 'i12', vendaId: 'v5', produto: 'Bolo', quantidade: 1, valorUnitario: 6, total: 6 },
      ],
    },
    {
      id: 'v6',
      dataHora: '2024-09-05T18:05:00',
      terminal: 'Terminal 3',
      operador: 'Maria',
      cliente: 'Natalia Freitas',
      registroCliente: 'ALU-0670',
      total: 40,
      formaPagamento: 'DINHEIRO',
      status: 'CONCLUIDA',
      caixaId: 'CX-03',
      itens: [
        { id: 'i13', vendaId: 'v6', produto: 'Lanche integral', quantidade: 2, valorUnitario: 12, total: 24 },
        { id: 'i14', vendaId: 'v6', produto: 'Suco natural', quantidade: 2, valorUnitario: 8, total: 16 },
      ],
    },
    {
      id: 'v7',
      dataHora: '2024-09-06T11:45:00',
      terminal: 'Terminal 1',
      operador: 'Camila',
      cliente: 'Henrique Lopes',
      registroCliente: 'OUT-0342',
      total: 30,
      formaPagamento: 'SALDO',
      status: 'CANCELADA',
      caixaId: 'CX-01',
      itens: [
        { id: 'i15', vendaId: 'v7', produto: 'Prato executivo', quantidade: 1, valorUnitario: 28, total: 28 },
        { id: 'i16', vendaId: 'v7', produto: 'Água', quantidade: 1, valorUnitario: 2, total: 2 },
      ],
    },
    {
      id: 'v8',
      dataHora: '2024-09-07T14:20:00',
      terminal: 'Terminal 2',
      operador: 'Rafael',
      cliente: 'Gabriel Santos',
      registroCliente: 'PRO-2220',
      total: 38,
      formaPagamento: 'CONVENIO',
      status: 'CONCLUIDA',
      caixaId: 'CX-02',
      itens: [
        { id: 'i17', vendaId: 'v8', produto: 'Prato executivo', quantidade: 1, valorUnitario: 28, total: 28 },
        { id: 'i18', vendaId: 'v8', produto: 'Suco natural', quantidade: 1, valorUnitario: 10, total: 10 },
      ],
    },
  ]);

  listVendas(filtro: VendaFiltro): Observable<Venda[]> {
    if (!filtro.dataInicio || !filtro.dataFim) return of([]);

    const inicio = new Date(filtro.dataInicio);
    const fim = new Date(filtro.dataFim);
    const produtoLower = filtro.produto.trim().toLowerCase();
    const clienteLower = filtro.cliente.trim().toLowerCase();

    const filtradas = this.vendas().filter((venda) => {
      const dataVenda = new Date(venda.dataHora);
      const dataOk = dataVenda >= inicio && dataVenda <= new Date(fim.getTime() + 86400000 - 1);
      const terminalOk = filtro.terminal === 'TODOS' || venda.terminal === filtro.terminal;
      const operadorOk = filtro.operador === 'TODOS' || venda.operador === filtro.operador;
      const statusOk = filtro.status === 'TODOS' || venda.status === filtro.status;
      const pagamentoOk = filtro.formaPagamento === 'TODOS' || venda.formaPagamento === filtro.formaPagamento;
      const produtoOk =
        produtoLower.length === 0 || venda.itens.some((item) => item.produto.toLowerCase().includes(produtoLower));
      const clienteOk =
        clienteLower.length === 0 ||
        venda.cliente?.toLowerCase().includes(clienteLower) ||
        venda.registroCliente?.toLowerCase().includes(clienteLower);

      return dataOk && terminalOk && operadorOk && statusOk && pagamentoOk && produtoOk && clienteOk;
    });

    return of(filtradas);
  }
}
