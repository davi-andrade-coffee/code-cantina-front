import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { Admin, AdminBillingResumo, AdminFilters, AdminInsights } from '../models/admin.model';
import { Store, StoreInsights } from '../models/store.model';

const ADMIN_DATA: Admin[] = [
  {
    id: 'adm-001',
    nome: 'Cantina Alfa',
    razaoSocial: 'Cantina Alfa LTDA',
    email: 'alfa@cantina.com',
    documento: '12.345.678/0001-90',
    lojasTotal: 4,
    lojasAtivas: 3,
    status: 'ATIVO',
    ultimoPagamento: '08/2024',
    plano: 'Base + por loja',
    inadimplente: false,
    criadoEm: '2023-10-12',
  },
  {
    id: 'adm-002',
    nome: 'Grupo Beta',
    razaoSocial: 'Grupo Beta Serviços',
    email: 'financeiro@betagroup.com',
    documento: '45.221.879/0001-12',
    lojasTotal: 8,
    lojasAtivas: 6,
    status: 'ATIVO',
    ultimoPagamento: '08/2024',
    plano: 'Base + por loja',
    inadimplente: true,
    criadoEm: '2024-02-03',
  },
  {
    id: 'adm-003',
    nome: 'Rede Gama',
    razaoSocial: 'Rede Gama Alimentos',
    email: 'contato@gama.com',
    documento: '11.775.990/0001-41',
    lojasTotal: 3,
    lojasAtivas: 1,
    status: 'BLOQUEADO',
    ultimoPagamento: '06/2024',
    plano: 'Base + por loja',
    inadimplente: true,
    criadoEm: '2023-06-22',
  },
  {
    id: 'adm-004',
    nome: 'Cantina Delta',
    razaoSocial: 'Delta Cantinas ME',
    email: 'delta@cantinas.com',
    documento: '83.449.220/0001-03',
    lojasTotal: 2,
    lojasAtivas: 2,
    status: 'ATIVO',
    ultimoPagamento: '08/2024',
    plano: 'Base + por loja',
    inadimplente: false,
    criadoEm: '2024-05-10',
  },
];

const STORE_DATA: Store[] = [
  {
    id: 'sto-100',
    adminId: 'adm-001',
    nome: 'Cantina Alfa - Centro',
    codigo: 'ALF-CTR',
    mensalidade: 120,
    status: 'ATIVA',
    criadoEm: '2023-10-20',
    ultimoAcesso: '2024-09-01',
  },
  {
    id: 'sto-101',
    adminId: 'adm-001',
    nome: 'Cantina Alfa - Norte',
    codigo: 'ALF-NOR',
    mensalidade: 120,
    status: 'BLOQUEADA',
    criadoEm: '2024-01-05',
    ultimoAcesso: '2024-08-18',
  },
  {
    id: 'sto-102',
    adminId: 'adm-001',
    nome: 'Cantina Alfa - Sul',
    codigo: 'ALF-SUL',
    mensalidade: 120,
    status: 'ATIVA',
    criadoEm: '2024-02-11',
  },
  {
    id: 'sto-200',
    adminId: 'adm-002',
    nome: 'Beta Unidade 01',
    codigo: 'BET-01',
    mensalidade: 150,
    status: 'ATIVA',
    criadoEm: '2024-02-20',
    ultimoAcesso: '2024-09-03',
  },
  {
    id: 'sto-201',
    adminId: 'adm-002',
    nome: 'Beta Unidade 02',
    codigo: 'BET-02',
    mensalidade: 150,
    status: 'ATIVA',
    criadoEm: '2024-03-10',
  },
  {
    id: 'sto-202',
    adminId: 'adm-002',
    nome: 'Beta Unidade 03',
    codigo: 'BET-03',
    mensalidade: 150,
    status: 'BLOQUEADA',
    criadoEm: '2024-03-18',
  },
  {
    id: 'sto-203',
    adminId: 'adm-002',
    nome: 'Beta Unidade 04',
    codigo: 'BET-04',
    mensalidade: 150,
    status: 'ATIVA',
    criadoEm: '2024-04-02',
  },
  {
    id: 'sto-300',
    adminId: 'adm-003',
    nome: 'Gama Campus',
    codigo: 'GAM-01',
    mensalidade: 110,
    status: 'BLOQUEADA',
    criadoEm: '2023-07-01',
  },
  {
    id: 'sto-400',
    adminId: 'adm-004',
    nome: 'Delta Kids',
    codigo: 'DEL-01',
    mensalidade: 130,
    status: 'ATIVA',
    criadoEm: '2024-05-15',
  },
  {
    id: 'sto-401',
    adminId: 'adm-004',
    nome: 'Delta Ensino Médio',
    codigo: 'DEL-02',
    mensalidade: 130,
    status: 'ATIVA',
    criadoEm: '2024-06-01',
  },
];

@Injectable({ providedIn: 'root' })
export class SuperAdminMockService {
  listAdmins(filters: AdminFilters): Observable<Admin[]> {
    return of(ADMIN_DATA).pipe(
      delay(300),
      map((admins) => {
        const termo = filters.termo.toLowerCase();
        return admins.filter((admin) => {
          const matchTermo =
            !termo ||
            admin.nome.toLowerCase().includes(termo) ||
            admin.email.toLowerCase().includes(termo) ||
            admin.documento.toLowerCase().includes(termo);
          const matchStatus = filters.status === 'TODOS' || admin.status === filters.status;
          return matchTermo && matchStatus;
        });
      })
    );
  }

  getAdminById(adminId: string): Observable<Admin | undefined> {
    return of(ADMIN_DATA.find((admin) => admin.id === adminId)).pipe(delay(200));
  }

  updateAdminStatus(adminId: string, status: Admin['status']): Observable<Admin | undefined> {
    const admin = ADMIN_DATA.find((item) => item.id === adminId);
    if (admin) {
      admin.status = status;
    }
    return of(admin).pipe(delay(200));
  }

  getAdminInsights(): Observable<AdminInsights> {
    return of(ADMIN_DATA).pipe(
      delay(300),
      map((admins) => {
        const ativos = admins.filter((admin) => admin.status === 'ATIVO').length;
        const bloqueados = admins.filter((admin) => admin.status === 'BLOQUEADO').length;
        const inadimplentes = admins.filter((admin) => admin.inadimplente).length;
        const receitaEstimadaMes = admins.reduce((acc, admin) => acc + admin.lojasAtivas * 120, 0);

        return {
          total: admins.length,
          ativos,
          bloqueados,
          receitaEstimadaMes,
          inadimplentes,
          inadimplenciaPercentual: admins.length ? (inadimplentes / admins.length) * 100 : 0,
          novosPorMes: [
            { mes: 'Mai', total: 2 },
            { mes: 'Jun', total: 3 },
            { mes: 'Jul', total: 1 },
            { mes: 'Ago', total: 4 },
          ],
        };
      })
    );
  }

  listStores(filters?: { termo?: string; status?: string; adminId?: string }): Observable<Store[]> {
    return of(STORE_DATA).pipe(
      delay(300),
      map((stores) => {
        const termo = (filters?.termo ?? '').toLowerCase();
        return stores.filter((store) => {
          const matchTermo =
            !termo ||
            store.nome.toLowerCase().includes(termo) ||
            store.codigo.toLowerCase().includes(termo);
          const matchStatus = !filters?.status || filters.status === 'TODOS' || store.status === filters.status;
          const matchAdmin = !filters?.adminId || store.adminId === filters.adminId;
          return matchTermo && matchStatus && matchAdmin;
        });
      })
    );
  }

  listAdminStores(adminId: string): Observable<Store[]> {
    return this.listStores({ adminId });
  }

  getStoreInsights(): Observable<StoreInsights> {
    return of(STORE_DATA).pipe(
      delay(300),
      map((stores) => {
        const totalAtivas = stores.filter((store) => store.status === 'ATIVA').length;
        const totalBloqueadas = stores.filter((store) => store.status === 'BLOQUEADA').length;
        const totalCanceladas = stores.filter((store) => store.status === 'CANCELADA').length;

        const topAdmins = ADMIN_DATA.map((admin) => ({
          admin: admin.nome,
          total: stores.filter((store) => store.adminId === admin.id).length,
        }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 3);

        return {
          totalAtivas,
          totalBloqueadas,
          totalCanceladas,
          topAdmins,
          bloqueadasPorInadimplencia: totalBloqueadas,
        };
      })
    );
  }

  getAdminBillingResumo(adminId: string): Observable<AdminBillingResumo> {
    return of(ADMIN_DATA.find((admin) => admin.id === adminId)).pipe(
      delay(200),
      map((admin) => {
        const lojasAtivasMes = admin?.lojasAtivas ?? 0;
        const valorCalculado = lojasAtivasMes * 120 + 199;
        return {
          lojasAtivasMes,
          valorCalculado,
          statusFaturaMes: admin?.inadimplente ? 'VENCIDA' : 'EM_ABERTO',
          competencia: '08/2024',
        };
      })
    );
  }
}
