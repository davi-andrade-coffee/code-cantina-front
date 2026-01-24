import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AdminClient, AdminClientService } from '../../../../core/admin/admin-client.service';
import { AuthService } from '../../../../core/auth/auth.service';

type StatusFilter = 'TODOS' | 'ATIVOS' | 'INATIVOS';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './selecionar-cliente.page.html',
})
export class SelecionarClientePage {
  private readonly allClients = this.clientService.listClients();

  searchTerm = signal('');
  statusFilter = signal<StatusFilter>('TODOS');
  selectedClient = signal<AdminClient | null>(this.clientService.getSelectedClient());

  filteredClients = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();

    return this.allClients.filter((client) => {
      const matchesTerm =
        term.length === 0 ||
        client.nome.toLowerCase().includes(term) ||
        client.nomeFantasia.toLowerCase().includes(term) ||
        client.cnpj.toLowerCase().includes(term) ||
        client.cidade.toLowerCase().includes(term);

      const matchesStatus =
        status === 'TODOS' ||
        (status === 'ATIVOS' && client.status === 'ATIVO') ||
        (status === 'INATIVOS' && client.status === 'INATIVO');

      return matchesTerm && matchesStatus;
    });
  });

  resumo = computed(() => {
    const ativos = this.allClients.filter((client) => client.status === 'ATIVO').length;
    const inativos = this.allClients.length - ativos;
    return {
      total: this.allClients.length,
      ativos,
      inativos,
    };
  });

  constructor(
    private readonly clientService: AdminClientService,
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  selectClient(client: AdminClient) {
    this.selectedClient.set(client);
  }

  confirmSelection() {
    const client = this.selectedClient();
    if (!client) return;

    this.clientService.setSelectedClient(client);
    this.router.navigateByUrl('/admin');
  }

  clearSelection() {
    this.selectedClient.set(null);
    this.clientService.clearSelectedClient();
  }

  logout() {
    this.clientService.clearSelectedClient();
    this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
