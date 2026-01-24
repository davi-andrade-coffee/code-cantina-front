import { Injectable, signal } from '@angular/core';

export type AdminClientStatus = 'ATIVO' | 'INATIVO';

export interface AdminClient {
  id: string;
  nome: string;
  nomeFantasia: string;
  cnpj: string;
  cidade: string;
  plano: string;
  status: AdminClientStatus;
  ultimaAtualizacao: string;
  responsavel: string;
}

@Injectable({ providedIn: 'root' })
export class AdminClientService {
  private readonly storageKey = 'cantina.admin.selected-client';

  private readonly mockClients: AdminClient[] = [
    {
      id: 'cliente-01',
      nome: 'Colégio Horizonte',
      nomeFantasia: 'Cantina Horizonte',
      cnpj: '12.345.678/0001-90',
      cidade: 'Fortaleza, CE',
      plano: 'Premium',
      status: 'ATIVO',
      ultimaAtualizacao: 'Hoje às 09:12',
      responsavel: 'Ana Paula Ribeiro',
    },
    {
      id: 'cliente-02',
      nome: 'Escola Nova Era',
      nomeFantasia: 'Cantina Nova Era',
      cnpj: '45.987.654/0001-10',
      cidade: 'Recife, PE',
      plano: 'Essencial',
      status: 'ATIVO',
      ultimaAtualizacao: 'Ontem às 17:40',
      responsavel: 'Bruno Castro',
    },
    {
      id: 'cliente-03',
      nome: 'Instituto Caminhos',
      nomeFantasia: 'Caminhos Food',
      cnpj: '98.765.432/0001-55',
      cidade: 'Natal, RN',
      plano: 'Enterprise',
      status: 'INATIVO',
      ultimaAtualizacao: '15/05/2024',
      responsavel: 'Camila Tavares',
    },
    {
      id: 'cliente-04',
      nome: 'Colégio Viver Bem',
      nomeFantasia: 'Cantina Viver Bem',
      cnpj: '23.456.789/0001-01',
      cidade: 'João Pessoa, PB',
      plano: 'Premium',
      status: 'ATIVO',
      ultimaAtualizacao: 'Hoje às 08:03',
      responsavel: 'Diego Fernandes',
    },
  ];

  private readonly selectedClientSignal = signal<AdminClient | null>(this.loadFromStorage());
  readonly selectedClient = this.selectedClientSignal.asReadonly();

  listClients(): AdminClient[] {
    return [...this.mockClients];
  }

  getSelectedClient(): AdminClient | null {
    return this.selectedClientSignal();
  }

  setSelectedClient(client: AdminClient): void {
    this.selectedClientSignal.set(client);
    localStorage.setItem(this.storageKey, JSON.stringify(client));
  }

  clearSelectedClient(): void {
    this.selectedClientSignal.set(null);
    localStorage.removeItem(this.storageKey);
  }

  private loadFromStorage(): AdminClient | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return null;
      return JSON.parse(raw) as AdminClient;
    } catch {
      return null;
    }
  }
}
