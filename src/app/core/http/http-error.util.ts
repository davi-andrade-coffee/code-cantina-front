import { HttpErrorResponse } from '@angular/common/http';

export function extractApiMessage(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    // API respondeu com JSON { message: "..." }
    const apiMsg =
      (typeof err.error === 'object' && err.error && 'message' in err.error && typeof err.error.message === 'string')
        ? err.error.message
        : null;

    if (apiMsg) return apiMsg;

    // Erro de rede / CORS / servidor off
    if (err.status === 0) return 'Falha de comunicação com o servidor. Verifique a conexão e tente novamente.';

    // Mensagens padrão por status
    if (err.status === 401) return 'Credenciais inválidas.';
    if (err.status === 403) return 'Acesso negado ou usuário inativo.';
    if (err.status >= 500) return 'Erro interno no servidor. Tente novamente mais tarde.';

    return `Erro na requisição (${err.status}).`;
  }

  // Qualquer outra exceção
  if (err instanceof Error) return err.message;

  return 'Erro inesperado.';
}

