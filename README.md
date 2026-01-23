1. Visão Geral do Projeto
O projeto consiste em um sistema de gestão para cantinas em ambientes
educacionais, como escolas e faculdades.
O objetivo principal é controlar vendas, consumo e saldo, oferecendo
transparência financeira tanto para a cantina quanto para pais, responsáveis e
clientes finais.
O sistema permitirá:
Registro e controle de vendas realizadas no PDV.
Acompanhamento de consumo individual (alunos, professores ou outros).
Gestão de planos (saldo pré-pago ou convênio mensal).
Relatórios financeiros e operacionais.
Controle de acesso por perfil de usuário.
Integração com dispositivos físicos (balança, impressora e biometria).
O foco do projeto é ser enxuto, funcional e confiável, removendo
funcionalidades não essenciais ou incompletas herdadas de versões
anteriores.
2. Tipos de Usuários
O sistema contará com quatro perfis de usuário, cada um com
responsabilidades bem definidas.
2.1 SuperAdmin
Perfil responsável pela gestão do sistema como produto.
Principais responsabilidades:
Cadastro, edição e remoção de clientes (dono das cantinas).
Ativação, bloqueio ou suspensão de de clientes por questões
administrativas (ex.: inadimplência).
Gestão de licenças do sistema.
IntegraCantina
1Visualização geral do status de clientes (ativas/inativas).
O SuperAdmin não opera vendas nem interfere no dia a dia da cantina.
2.2 Admin (Dono da Cantina)
Perfil responsável pela operação e gestão da cantina.
Principais responsabilidades:
Cadastro e gestão de colaboradores.
Cadastro e gestão de clientes (alunos, professores, outros).
Cadastro e gestão de produtos.
Cadastro e configuração de lojas.
Configuração de terminais PDV.
Acompanhamento financeiro e relatórios.
Gestão de planos, cobranças e inadimplência.
Um mesmo Admin pode gerenciar mais de uma loja com o mesmo login,
mantendo:
Estoque independente por loja.
Terminais PDV independentes.
Relatórios separados por loja.
2.3 Colaboradores
Perfil operacional.
Principais responsabilidades:
Acesso exclusivo ao terminal PDV.
Registro de vendas.
Identificação do cliente (nome ou biometria).
Finalização de compras.
Não possuem acesso a cadastros, relatórios ou configurações.
IntegraCantina
22.4 Alunos / Professores / Outros
Perfil de cliente final.
Funcionalidades disponíveis:
Consulta de saldo.
Histórico de compras.
Relatório mensal de consumo.
Utilização de plano:
Saldo pré-pago (ex.: Pix).
Convênio mensal com limite definido.
Recebimento de notificações (email).
3. Funcionalidades do Admin
3.1 Cadastro de Colaboradores
Informações obrigatórias:
Nome
Email
Registro único (CPF, matrícula ou identificador interno)
Telefone
Informações opcionais:
Foto
Ações disponíveis:
Criar
Editar
Ativar / desativar
Excluir
Filtros
Envio automático de email com senha temporária no cadastro.
IntegraCantina
33.2 Cadastro de Alunos / Professores / Outros
Informações obrigatórias:
Nome
Email
Registro único
Tipo de plano (saldo ou convênio)
Informações opcionais:
Nome do responsável
Telefone
Data de nascimento
Endereço
Foto de perfil
Configurações:
Limite mensal (plano convênio)
Notificação por email das compras
Registro de biometria.
Ações:
Criar
Editar
Ativar / desativar
Excluir
Envio automático de email com senha temporária.
3.3 Cadastro de Produtos
Tipos de produto:
Unitário
Por peso (kg)
Informações:
IntegraCantina
4Nome
Descrição
Tipo
Ativo / inativo
Preço unitário ou preço por quilo
Controle de estoque:
Opcional (ativado por produto tipo unitário)
Ações:
Criar
Editar
Ativar / desativar
Excluir
3.4 Cadastro de Lojas
Dados da empresa:
Nome da loja
CNPJ
Endereço completo
Configuração de licença:
Ativa / inativa (controle do SuperAdmin)
Cada loja possui:
Estoque independente
Terminais PDV independentes
Relatórios próprios
3.5 Cadastro de Terminais (PDV)
Código do terminal
Nome do terminal
IntegraCantina
5Impressora não fiscal (opcional)
Opções:
Imprimir cupom automaticamente
Ativar / desativar terminal
3.6 Relatórios
Contas a Receber
Lista de clientes em plano convênio não pagos.
Ações:
Enviar cobrança por email
Desativar cliente temporariamente
Relatório de Vendas
Filtros:
Tipo de produto
Produto
Data
Cliente (nome ou registro)
Fechamento de Caixa
Por terminal PDV.
Valores de abertura, fechamento e diferenças.
Sessão de Caixa
Tabela com:
Data de abertura
Terminal
Operador
Valor de abertura
Valor de fechamento
IntegraCantina
6Status
Ações
Relatórios de Plano
Histórico completo por cliente:
Saldo
Entradas
Saídas
Consumo mensal
3.7 Logs do Sistema
Registro de todas as operações relevantes:
Vendas
Login/logout
Alterações de cadastro
Abertura/fechamento de caixa
Finalidade:
Auditoria
Suporte
Rastreabilidade
4. Terminal PDV – Funcionalidades
Busca de produtos por código ou nome.
Identificação do cliente por:
Nome
Biometria
Seleção da forma de pagamento:
Saldo
Convênio
IntegraCantina
7Dinheiro
Cálculo automático do valor.
Impressão do cupom de venda.
5. Páginas e Funcionalidades que Serão Removidas
ou Consolidadas
Removidas / Não implementadas nesta fase:
Página “Adicionais do dia”
Página “Notificações”
Página “Posição de estoque”
Página “Ajuste de estoque”
Página “Produtos por loja”
Funcionalidade de “cupom promocional”
Tipo de produto “adicional”
Consolidadas:
Página “Produtos por loja” será substituída pelo Cadastro de Produtos,
com filtro por loja.
Ajustes e posição de estoque integrados ao fluxo de produto.
