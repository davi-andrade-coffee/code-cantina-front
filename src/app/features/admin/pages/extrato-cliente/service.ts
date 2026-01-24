import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ExtratoFiltro, Movimentacao, PessoaExtrato } from './models';

@Injectable({ providedIn: 'root' })
export class ExtratoClienteService {
  private readonly pessoas = signal<PessoaExtrato[]>([
    {
      id: 'p1',
      nome: 'Mariana Albuquerque',
      tipo: 'ALUNO',
      responsavel: 'Carlos Albuquerque',
      documento: '123.456.789-00',
      plano: 'CONVENIO',
      saldoAtual: 180,
    },
    {
      id: 'p2',
      nome: 'Paulo Henrique',
      tipo: 'PROFESSOR',
      responsavel: '—',
      documento: '987.654.321-00',
      plano: 'SALDO',
      saldoAtual: 90,
    },
    {
      id: 'p3',
      nome: 'Beatriz Campos',
      tipo: 'ALUNO',
      responsavel: 'Rita Campos',
      documento: '234.567.890-11',
      plano: 'PRE_PAGO',
      saldoAtual: 40,
    },
    {
      id: 'p4',
      nome: 'Luciana Moraes',
      tipo: 'OUTRO',
      responsavel: '—',
      documento: '789.012.345-66',
      plano: 'CONVENIO',
      saldoAtual: 0,
    },
  ]);

  private readonly movimentacoes = signal<Movimentacao[]>([
    {
      id: 'm1',
      pessoaId: 'p1',
      dataHora: '2024-09-01T08:15:00',
      origem: 'PDV 01',
      descricao: 'Lanche manhã',
      valor: 12,
      saldoApos: 168,
      tipo: 'CONSUMO',
      terminal: 'Terminal 1',
      operador: 'Camila',
      produto: 'Sanduíche',
      formaPagamento: 'CONVENIO',
    },
    {
      id: 'm2',
      pessoaId: 'p1',
      dataHora: '2024-09-02T12:10:00',
      origem: 'Terminal 2',
      descricao: 'Almoço',
      valor: 25,
      saldoApos: 143,
      tipo: 'CONSUMO',
      terminal: 'Terminal 2',
      operador: 'Rafael',
      produto: 'Prato executivo',
      formaPagamento: 'CONVENIO',
    },
    {
      id: 'm3',
      pessoaId: 'p1',
      dataHora: '2024-09-03T16:45:00',
      origem: 'Terminal 1',
      descricao: 'Suco',
      valor: 8,
      saldoApos: 135,
      tipo: 'CONSUMO',
      terminal: 'Terminal 1',
      operador: 'Camila',
      produto: 'Suco natural',
      formaPagamento: 'DINHEIRO',
    },
    {
      id: 'm4',
      pessoaId: 'p2',
      dataHora: '2024-09-01T09:10:00',
      origem: 'PDV 02',
      descricao: 'Carga carteira',
      valor: 100,
      saldoApos: 190,
      tipo: 'CARGA',
      terminal: 'Terminal 2',
      operador: 'Luan',
      produto: 'Recarga',
      formaPagamento: 'DINHEIRO',
    },
    {
      id: 'm5',
      pessoaId: 'p2',
      dataHora: '2024-09-02T13:20:00',
      origem: 'Terminal 2',
      descricao: 'Almoço',
      valor: 32,
      saldoApos: 158,
      tipo: 'CONSUMO',
      terminal: 'Terminal 2',
      operador: 'Luan',
      produto: 'Prato executivo',
      formaPagamento: 'SALDO',
    },
    {
      id: 'm6',
      pessoaId: 'p2',
      dataHora: '2024-09-05T17:50:00',
      origem: 'Terminal 3',
      descricao: 'Café',
      valor: 9,
      saldoApos: 149,
      tipo: 'CONSUMO',
      terminal: 'Terminal 3',
      operador: 'Maria',
      produto: 'Café especial',
      formaPagamento: 'SALDO',
    },
    {
      id: 'm7',
      pessoaId: 'p3',
      dataHora: '2024-09-04T10:05:00',
      origem: 'Terminal 1',
      descricao: 'Carga pré-paga',
      valor: 60,
      saldoApos: 100,
      tipo: 'CARGA',
      terminal: 'Terminal 1',
      operador: 'Camila',
      produto: 'Recarga',
      formaPagamento: 'DINHEIRO',
    },
    {
      id: 'm8',
      pessoaId: 'p3',
      dataHora: '2024-09-07T12:30:00',
      origem: 'Terminal 1',
      descricao: 'Almoço',
      valor: 35,
      saldoApos: 65,
      tipo: 'CONSUMO',
      terminal: 'Terminal 1',
      operador: 'Camila',
      produto: 'Prato executivo',
      formaPagamento: 'SALDO',
    },
    {
      id: 'm9',
      pessoaId: 'p3',
      dataHora: '2024-09-09T15:00:00',
      origem: 'Terminal 2',
      descricao: 'Suco',
      valor: 7,
      saldoApos: 58,
      tipo: 'CONSUMO',
      terminal: 'Terminal 2',
      operador: 'Rafael',
      produto: 'Suco natural',
      formaPagamento: 'SALDO',
    },
    {
      id: 'm10',
      pessoaId: 'p4',
      dataHora: '2024-09-03T11:10:00',
      origem: 'PDV 01',
      descricao: 'Convênio almoço',
      valor: 28,
      saldoApos: 0,
      tipo: 'CONSUMO',
      terminal: 'Terminal 1',
      operador: 'Camila',
      produto: 'Prato executivo',
      formaPagamento: 'CONVENIO',
    },
  ]);

  listPessoas(): Observable<PessoaExtrato[]> {
    return of(this.pessoas());
  }

  listMovimentacoes(filtro: ExtratoFiltro): Observable<Movimentacao[]> {
    if (!filtro.pessoaId) return of([]);

    const textoLower = filtro.texto.trim().toLowerCase();
    const inicio = filtro.dataInicio ? new Date(filtro.dataInicio) : null;
    const fim = filtro.dataFim ? new Date(filtro.dataFim) : null;

    const filtradas = this.movimentacoes().filter((item) => {
      const pessoaOk = item.pessoaId === filtro.pessoaId;
      const tipoOk = filtro.tipoMovimento === 'TODOS' || item.tipo === filtro.tipoMovimento;
      const terminalOk = filtro.terminal === 'TODOS' || item.terminal === filtro.terminal;
      const textoOk =
        textoLower.length === 0 ||
        item.descricao.toLowerCase().includes(textoLower) ||
        item.produto.toLowerCase().includes(textoLower) ||
        item.observacao?.toLowerCase().includes(textoLower);
      const dataItem = new Date(item.dataHora);
      const inicioOk = !inicio || dataItem >= inicio;
      const fimOk = !fim || dataItem <= new Date(fim.getTime() + 86400000 - 1);

      return pessoaOk && tipoOk && terminalOk && textoOk && inicioOk && fimOk;
    });

    return of(filtradas);
  }
}
