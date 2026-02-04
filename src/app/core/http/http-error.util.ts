import { HttpErrorResponse } from '@angular/common/http';

export function extractApiMessage(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) return 'Falha de comunicação com o servidor. Verifique a conexão e tente novamente.';

    if (err.status === 401) return 'Credenciais inválidas.';
    if (err.status === 403) return 'Acesso negado ou usuário inativo.';
    if (err.status >= 500) return 'Erro interno no servidor. Tente novamente mais tarde.'

    return `Erro na requisição (${err.status}).`;
  }

  if (err instanceof Error) return err.message;

  return 'Erro inesperado.';
}

