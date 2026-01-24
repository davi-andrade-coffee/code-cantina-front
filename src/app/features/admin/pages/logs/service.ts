import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

import { LogFiltro, LogRegistro } from './models';

@Injectable({ providedIn: 'root' })
export class LogsSistemaService {
  private readonly logs = signal<LogRegistro[]>([
    {
      id: 'LOG-1021',
      dataHora: '2024-09-12T17:42:00',
      categoria: 'VENDA_FINALIZADA',
      operador: 'Administrador',
      terminal: 'PDV-01',
      descricao: 'Venda finalizada. Total R$ 35,10. Pagamento: Convênio.',
      referencia: 'VENDA #1021',
      origem: 'PDV',
      ip: '10.1.0.12',
    },
    {
      id: 'LOG-1020',
      dataHora: '2024-09-12T17:15:00',
      categoria: 'ABERTURA_CAIXA',
      operador: 'Rafael Nunes',
      terminal: 'PDV-02',
      descricao: 'Abertura de caixa com valor inicial de R$ 150,00.',
      referencia: 'CAIXA #223',
      origem: 'PDV',
      ip: '10.1.0.15',
    },
    {
      id: 'LOG-1019',
      dataHora: '2024-09-12T16:58:00',
      categoria: 'CADASTRO_COLABORADOR',
      operador: 'Camila Souza',
      terminal: 'Admin-01',
      descricao: 'Cadastro de colaborador: Juliana Ribeiro.',
      referencia: 'COLAB #884',
      origem: 'Painel Admin',
      ip: '10.1.0.42',
    },
    {
      id: 'LOG-1018',
      dataHora: '2024-09-12T16:40:00',
      categoria: 'CADASTRO_PESSOA',
      operador: 'Camila Souza',
      terminal: 'Admin-01',
      descricao: 'Cadastro de pessoa: João Moreno.',
      referencia: 'PESSOA #5512',
      origem: 'Painel Admin',
      ip: '10.1.0.42',
    },
    {
      id: 'LOG-1017',
      dataHora: '2024-09-12T16:22:00',
      categoria: 'CADASTRO_TERMINAL',
      operador: 'Ricardo Lima',
      terminal: 'Admin-02',
      descricao: 'Terminal PDV-04 cadastrado para loja Central.',
      referencia: 'TERMINAL #04',
      origem: 'Painel Admin',
      ip: '10.1.0.38',
    },
    {
      id: 'LOG-1016',
      dataHora: '2024-09-12T15:54:00',
      categoria: 'CADASTRO_PRODUTO',
      operador: 'Fernanda Silva',
      terminal: 'Admin-03',
      descricao: 'Produto cadastrado: Sanduíche natural.',
      referencia: 'PRODUTO #310',
      origem: 'Painel Admin',
      ip: '10.1.0.29',
    },
    {
      id: 'LOG-1015',
      dataHora: '2024-09-12T15:25:00',
      categoria: 'AJUDA_COLABORADOR',
      operador: 'Equipe Suporte',
      terminal: 'Admin-Help',
      descricao: 'Solicitação de ajuda: terminal não imprime recibo.',
      referencia: 'CHAMADO #991',
      origem: 'Painel Admin',
      ip: '10.1.0.80',
    },
    {
      id: 'LOG-1014',
      dataHora: '2024-09-12T15:10:00',
      categoria: 'AJUSTE_PESSOA',
      operador: 'Camila Souza',
      terminal: 'Admin-01',
      descricao: 'Ajuste cadastral: atualização de telefone.',
      referencia: 'PESSOA #5512',
      origem: 'Painel Admin',
      ip: '10.1.0.42',
    },
    {
      id: 'LOG-1013',
      dataHora: '2024-09-12T14:50:00',
      categoria: 'AJUSTE_TERMINAL',
      operador: 'Ricardo Lima',
      terminal: 'Admin-02',
      descricao: 'Ajuste de terminal: atualização do endpoint fiscal.',
      referencia: 'TERMINAL #02',
      origem: 'Painel Admin',
      ip: '10.1.0.38',
    },
    {
      id: 'LOG-1012',
      dataHora: '2024-09-12T14:30:00',
      categoria: 'AJUSTE_PRODUTO',
      operador: 'Fernanda Silva',
      terminal: 'Admin-03',
      descricao: 'Ajuste de produto: atualização de preço para R$ 12,90.',
      referencia: 'PRODUTO #310',
      origem: 'Painel Admin',
      ip: '10.1.0.29',
    },
    {
      id: 'LOG-1011',
      dataHora: '2024-09-12T14:05:00',
      categoria: 'PAGAMENTO_CONVENIO',
      operador: 'Financeiro',
      terminal: 'Finance-01',
      descricao: 'Pagamento de convênio recebido. NF 2024/0912.',
      referencia: 'CONVÊNIO #778',
      origem: 'Painel Admin',
      ip: '10.1.0.55',
    },
    {
      id: 'LOG-1010',
      dataHora: '2024-09-12T13:40:00',
      categoria: 'ADICAO_SALDO',
      operador: 'Atendimento',
      terminal: 'PDV-03',
      descricao: 'Adição de saldo: R$ 50,00 para Maria Campos.',
      referencia: 'SALDO #553',
      origem: 'PDV',
      ip: '10.1.0.19',
    },
    {
      id: 'LOG-1009',
      dataHora: '2024-09-11T18:02:00',
      categoria: 'FECHAMENTO_CAIXA',
      operador: 'Rafael Nunes',
      terminal: 'PDV-02',
      descricao: 'Fechamento de caixa com valor final de R$ 1.240,30.',
      referencia: 'CAIXA #222',
      origem: 'PDV',
      ip: '10.1.0.15',
    },
    {
      id: 'LOG-1008',
      dataHora: '2024-09-11T17:32:00',
      categoria: 'VENDA_FINALIZADA',
      operador: 'Administrador',
      terminal: 'PDV-01',
      descricao: 'Venda finalizada. Total R$ 23,40. Pagamento: Dinheiro.',
      referencia: 'VENDA #1020',
      origem: 'PDV',
      ip: '10.1.0.12',
    },
    {
      id: 'LOG-1007',
      dataHora: '2024-09-11T16:15:00',
      categoria: 'VENDA_FINALIZADA',
      operador: 'Administrador',
      terminal: 'PDV-01',
      descricao: 'Venda finalizada. Total R$ 19,80. Pagamento: Saldo.',
      referencia: 'VENDA #1019',
      origem: 'PDV',
      ip: '10.1.0.12',
    },
    {
      id: 'LOG-1006',
      dataHora: '2024-09-11T15:48:00',
      categoria: 'ADICAO_SALDO',
      operador: 'Atendimento',
      terminal: 'PDV-03',
      descricao: 'Adição de saldo: R$ 120,00 para Lucas Barros.',
      referencia: 'SALDO #552',
      origem: 'PDV',
      ip: '10.1.0.19',
    },
    {
      id: 'LOG-1005',
      dataHora: '2024-09-11T15:05:00',
      categoria: 'PAGAMENTO_CONVENIO',
      operador: 'Financeiro',
      terminal: 'Finance-01',
      descricao: 'Pagamento de convênio confirmado para colégio Horizonte.',
      referencia: 'CONVÊNIO #777',
      origem: 'Painel Admin',
      ip: '10.1.0.55',
    },
    {
      id: 'LOG-1004',
      dataHora: '2024-09-11T14:22:00',
      categoria: 'AJUSTE_PESSOA',
      operador: 'Camila Souza',
      terminal: 'Admin-01',
      descricao: 'Ajuste cadastral: plano alterado para Convênio.',
      referencia: 'PESSOA #4450',
      origem: 'Painel Admin',
      ip: '10.1.0.42',
    },
    {
      id: 'LOG-1003',
      dataHora: '2024-09-11T13:40:00',
      categoria: 'AJUSTE_PRODUTO',
      operador: 'Fernanda Silva',
      terminal: 'Admin-03',
      descricao: 'Ajuste de estoque: reposição de 25 unidades.',
      referencia: 'PRODUTO #278',
      origem: 'Painel Admin',
      ip: '10.1.0.29',
    },
    {
      id: 'LOG-1002',
      dataHora: '2024-09-11T12:50:00',
      categoria: 'CADASTRO_COLABORADOR',
      operador: 'Ricardo Lima',
      terminal: 'Admin-02',
      descricao: 'Cadastro de colaborador: Pedro Reis.',
      referencia: 'COLAB #883',
      origem: 'Painel Admin',
      ip: '10.1.0.38',
    },
    {
      id: 'LOG-1001',
      dataHora: '2024-09-11T12:20:00',
      categoria: 'CADASTRO_PESSOA',
      operador: 'Camila Souza',
      terminal: 'Admin-01',
      descricao: 'Cadastro de pessoa: Guilherme Souza.',
      referencia: 'PESSOA #4451',
      origem: 'Painel Admin',
      ip: '10.1.0.42',
    },
    {
      id: 'LOG-1000',
      dataHora: '2024-09-11T10:15:00',
      categoria: 'ABERTURA_CAIXA',
      operador: 'Rafael Nunes',
      terminal: 'PDV-02',
      descricao: 'Abertura de caixa com valor inicial de R$ 200,00.',
      referencia: 'CAIXA #222',
      origem: 'PDV',
      ip: '10.1.0.15',
    },
  ]);

  listLogs(filtro: LogFiltro): Observable<LogRegistro[]> {
    const termo = filtro.termo.trim().toLowerCase();
    const dataInicio = filtro.dataInicio ? new Date(`${filtro.dataInicio}T00:00:00`) : null;
    const dataFim = filtro.dataFim ? new Date(`${filtro.dataFim}T23:59:59`) : null;

    const filtrados = this.logs()
      .filter((item) => {
        const dataItem = new Date(item.dataHora);
        const dentroInicio = dataInicio ? dataItem >= dataInicio : true;
        const dentroFim = dataFim ? dataItem <= dataFim : true;
        const categoriaOk = filtro.categoria === 'TODOS' || item.categoria === filtro.categoria;
        const operadorOk = filtro.operador === 'TODOS' || item.operador === filtro.operador;
        const terminalOk = filtro.terminal === 'TODOS' || item.terminal === filtro.terminal;
        const termoOk =
          termo.length === 0 ||
          item.descricao.toLowerCase().includes(termo) ||
          item.referencia.toLowerCase().includes(termo) ||
          item.operador.toLowerCase().includes(termo) ||
          item.terminal.toLowerCase().includes(termo) ||
          item.origem.toLowerCase().includes(termo) ||
          item.ip.toLowerCase().includes(termo);

        return dentroInicio && dentroFim && categoriaOk && operadorOk && terminalOk && termoOk;
      })
      .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());

    return of(filtrados);
  }
}
