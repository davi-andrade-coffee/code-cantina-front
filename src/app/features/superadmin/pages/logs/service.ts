import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

import { LogFiltro, LogRegistro } from './models';

@Injectable({ providedIn: 'root' })
export class SuperadminLogsService {
  private readonly logs = signal<LogRegistro[]>([
    {
      id: 'SA-LOG-2041',
      dataHora: '2024-09-12T18:10:00',
      categoria: 'CADASTRO_LOJA',
      operador: 'Beatriz Lima',
      terminal: 'Superadmin-01',
      descricao: 'Nova loja cadastrada: Cantina Jardim Europa.',
      referencia: 'LOJA #2031',
      origem: 'Painel Superadmin',
      ip: '10.2.0.10',
    },
    {
      id: 'SA-LOG-2040',
      dataHora: '2024-09-12T17:42:00',
      categoria: 'CADASTRO_ADMIN',
      operador: 'Beatriz Lima',
      terminal: 'Superadmin-01',
      descricao: 'Admin cadastrado para loja Cantina Central: Lucas Dantas.',
      referencia: 'ADMIN #884',
      origem: 'Painel Superadmin',
      ip: '10.2.0.10',
    },
    {
      id: 'SA-LOG-2039',
      dataHora: '2024-09-12T17:10:00',
      categoria: 'BLOQUEIO_LOJA',
      operador: 'Time Compliance',
      terminal: 'Superadmin-02',
      descricao: 'Loja Cantina Norte bloqueada por pendência documental.',
      referencia: 'LOJA #1788',
      origem: 'Painel Superadmin',
      ip: '10.2.0.21',
    },
    {
      id: 'SA-LOG-2038',
      dataHora: '2024-09-12T16:55:00',
      categoria: 'DESBLOQUEIO_LOJA',
      operador: 'Time Compliance',
      terminal: 'Superadmin-02',
      descricao: 'Loja Cantina Norte desbloqueada após revisão documental.',
      referencia: 'LOJA #1788',
      origem: 'Painel Superadmin',
      ip: '10.2.0.21',
    },
    {
      id: 'SA-LOG-2037',
      dataHora: '2024-09-12T16:32:00',
      categoria: 'BLOQUEIO_ADMIN',
      operador: 'Beatriz Lima',
      terminal: 'Superadmin-01',
      descricao: 'Admin bloqueado por tentativa de acesso indevido.',
      referencia: 'ADMIN #771',
      origem: 'Painel Superadmin',
      ip: '10.2.0.10',
    },
    {
      id: 'SA-LOG-2036',
      dataHora: '2024-09-12T16:05:00',
      categoria: 'DESBLOQUEIO_ADMIN',
      operador: 'Equipe Suporte',
      terminal: 'Superadmin-03',
      descricao: 'Admin desbloqueado após validação de identidade.',
      referencia: 'ADMIN #771',
      origem: 'Painel Superadmin',
      ip: '10.2.0.33',
    },
    {
      id: 'SA-LOG-2035',
      dataHora: '2024-09-12T15:40:00',
      categoria: 'PAGAMENTO_BOLETO',
      operador: 'Financeiro',
      terminal: 'Finance-01',
      descricao: 'Pagamento de boleto recebido. Competência 09/2024.',
      referencia: 'BOLETO #5589',
      origem: 'Financeiro',
      ip: '10.2.0.55',
    },
    {
      id: 'SA-LOG-2034',
      dataHora: '2024-09-11T18:18:00',
      categoria: 'CADASTRO_LOJA',
      operador: 'Fernanda Moreira',
      terminal: 'Superadmin-04',
      descricao: 'Nova loja cadastrada: Cantina Santa Maria.',
      referencia: 'LOJA #2029',
      origem: 'Painel Superadmin',
      ip: '10.2.0.44',
    },
    {
      id: 'SA-LOG-2033',
      dataHora: '2024-09-11T17:55:00',
      categoria: 'CADASTRO_ADMIN',
      operador: 'Fernanda Moreira',
      terminal: 'Superadmin-04',
      descricao: 'Admin cadastrado para Cantina Santa Maria: Elisa Costa.',
      referencia: 'ADMIN #882',
      origem: 'Painel Superadmin',
      ip: '10.2.0.44',
    },
    {
      id: 'SA-LOG-2032',
      dataHora: '2024-09-11T16:20:00',
      categoria: 'BLOQUEIO_LOJA',
      operador: 'Time Compliance',
      terminal: 'Superadmin-02',
      descricao: 'Loja Cantina Estação bloqueada por divergência financeira.',
      referencia: 'LOJA #1660',
      origem: 'Painel Superadmin',
      ip: '10.2.0.21',
    },
    {
      id: 'SA-LOG-2031',
      dataHora: '2024-09-11T15:45:00',
      categoria: 'PAGAMENTO_BOLETO',
      operador: 'Financeiro',
      terminal: 'Finance-01',
      descricao: 'Pagamento de boleto confirmado para Cantina Central.',
      referencia: 'BOLETO #5581',
      origem: 'Financeiro',
      ip: '10.2.0.55',
    },
    {
      id: 'SA-LOG-2030',
      dataHora: '2024-09-11T14:10:00',
      categoria: 'DESBLOQUEIO_LOJA',
      operador: 'Equipe Suporte',
      terminal: 'Superadmin-03',
      descricao: 'Loja Cantina Estação desbloqueada após ajuste financeiro.',
      referencia: 'LOJA #1660',
      origem: 'Painel Superadmin',
      ip: '10.2.0.33',
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
        const termoOk =
          termo.length === 0 ||
          item.descricao.toLowerCase().includes(termo) ||
          item.referencia.toLowerCase().includes(termo) ||
          item.operador.toLowerCase().includes(termo) ||
          item.terminal.toLowerCase().includes(termo) ||
          item.origem.toLowerCase().includes(termo) ||
          item.ip.toLowerCase().includes(termo);

        return dentroInicio && dentroFim && categoriaOk && termoOk;
      })
      .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());

    return of(filtrados);
  }
}
