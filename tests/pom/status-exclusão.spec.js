const { test, expect } = require('@playwright/test');
const { ListaPage } = require('./pages/ListaPage');
const { NovaTarefaPage } = require('./pages/NovaTarefaPage');

// STA01 a STA04 e EXC01 a EXC02.
// Mesmos dados, ações e verificações da suíte monolítica.
// Ações e locators da interface ficam nos Page Objects.

test('STA01 - concluir tarefa pendente', async ({ page }) => {
  const lista = new ListaPage(page);
  const novaTarefa = new NovaTarefaPage(page);

  const identificador = Date.now();
  const titulo = `STA01 ${identificador}`;
  const descricao = 'Tarefa criada para testar conclusão.';
  const autor = 'Teste Playwright';

  // Preparação da tarefa.
  await lista.abrir();
  await lista.abrirNovaTarefa();
  await novaTarefa.cadastrar({ titulo, descricao, criadoPor: autor });
  await expect(page).toHaveURL(/index\.html/, { timeout: 15000 });

  const linha = lista.linhaDaTarefa(titulo);
  await expect(linha).toBeVisible({ timeout: 10000 });
  await expect(linha).toContainText('Pendente');
  await expect(lista.botaoConcluir(titulo)).toBeVisible();

  await lista.solicitarConclusao(titulo);
  await expect(lista.modal).toBeVisible();
  await expect(lista.modal).toContainText('Deseja concluir esta tarefa?');
  await lista.confirmarModal();

  await expect(linha).toContainText('Concluída', { timeout: 10000 });
  await expect(lista.botaoReabrir(titulo)).toBeVisible();
  await expect(lista.mensagem).toContainText('Tarefa concluída com sucesso.');
});

test('STA02 - cancelar conclusão', async ({ page }) => {
  const lista = new ListaPage(page);
  const novaTarefa = new NovaTarefaPage(page);

  const identificador = Date.now();
  const titulo = `STA02 ${identificador}`;
  const descricao = 'Tarefa criada para testar cancelamento.';
  const autor = 'Teste Playwright';

  await lista.abrir();
  await lista.abrirNovaTarefa();
  await novaTarefa.cadastrar({ titulo, descricao, criadoPor: autor });
  await expect(page).toHaveURL(/index\.html/, { timeout: 15000 });

  const linha = lista.linhaDaTarefa(titulo);
  await expect(linha).toBeVisible({ timeout: 10000 });
  await expect(linha).toContainText('Pendente');

  await lista.solicitarConclusao(titulo);
  await expect(lista.modal).toBeVisible();
  await lista.cancelarModal();
  await expect(lista.modal).not.toBeVisible();

  await expect(linha).toContainText('Pendente');
  await expect(lista.botaoConcluir(titulo)).toBeVisible();

  // Confirma que o cancelamento não foi persistido.
  await lista.recarregar();
  const linhaRecarregada = lista.linhaDaTarefa(titulo);
  await expect(linhaRecarregada).toBeVisible({ timeout: 10000 });
  await expect(linhaRecarregada).toContainText('Pendente');
  await expect(lista.botaoConcluir(titulo)).toBeVisible();
});

test('STA03 - reabrir tarefa concluída', async ({ page }) => {
  const lista = new ListaPage(page);
  const novaTarefa = new NovaTarefaPage(page);

  const identificador = Date.now();
  const titulo = `STA03 ${identificador}`;
  const descricao = 'Tarefa criada para testar reabertura.';
  const autor = 'Teste Playwright';

  await lista.abrir();
  await lista.abrirNovaTarefa();
  await novaTarefa.cadastrar({ titulo, descricao, criadoPor: autor });
  await expect(page).toHaveURL(/index\.html/, { timeout: 15000 });

  const linha = lista.linhaDaTarefa(titulo);
  await expect(linha).toBeVisible({ timeout: 10000 });

  // Preparação: concluir a tarefa antes de reabri-la.
  await lista.solicitarConclusao(titulo);
  await expect(lista.modal).toBeVisible();
  await lista.confirmarModal();
  await expect(linha).toContainText('Concluída', { timeout: 10000 });

  await lista.solicitarReabertura(titulo);
  await expect(lista.modal).toBeVisible();
  await expect(lista.modal).toContainText('Deseja reabrir esta tarefa?');
  await lista.confirmarModal();

  await expect(linha).toContainText('Pendente', { timeout: 10000 });
  await expect(lista.botaoConcluir(titulo)).toBeVisible();
  await expect(lista.mensagem).toContainText('Tarefa reaberta com sucesso.');
});

test('STA04 - cancelar reabertura', async ({ page }) => {
  const lista = new ListaPage(page);
  const novaTarefa = new NovaTarefaPage(page);

  const identificador = Date.now();
  const titulo = `STA04 ${identificador}`;
  const descricao = 'Tarefa criada para testar cancelamento de reabertura.';
  const autor = 'Teste Playwright';

  await lista.abrir();
  await lista.abrirNovaTarefa();
  await novaTarefa.cadastrar({ titulo, descricao, criadoPor: autor });
  await expect(page).toHaveURL(/index\.html/, { timeout: 15000 });

  const linha = lista.linhaDaTarefa(titulo);
  await expect(linha).toBeVisible({ timeout: 10000 });

  // Preparação: concluir a tarefa.
  await lista.solicitarConclusao(titulo);
  await expect(lista.modal).toBeVisible();
  await lista.confirmarModal();
  await expect(linha).toContainText('Concluída', { timeout: 10000 });

  await lista.solicitarReabertura(titulo);
  await expect(lista.modal).toBeVisible();
  await lista.cancelarModal();
  await expect(lista.modal).not.toBeVisible();

  await expect(linha).toContainText('Concluída');
  await expect(lista.botaoReabrir(titulo)).toBeVisible();

  // Confirma a persistência do estado anterior após recarregar.
  await lista.recarregar();
  const linhaRecarregada = lista.linhaDaTarefa(titulo);
  await expect(linhaRecarregada).toBeVisible({ timeout: 10000 });
  await expect(linhaRecarregada).toContainText('Concluída');
  await expect(lista.botaoReabrir(titulo)).toBeVisible();
});

test('EXC01 - excluir tarefa e confirmar', async ({ page }) => {
  const lista = new ListaPage(page);
  const novaTarefa = new NovaTarefaPage(page);

  const identificador = Date.now();
  const titulo = `EXC01 ${identificador}`;
  const descricao = 'Tarefa criada para testar exclusão.';
  const autor = 'Teste Playwright';

  await lista.abrir();
  await lista.abrirNovaTarefa();
  await novaTarefa.cadastrar({ titulo, descricao, criadoPor: autor });
  await expect(page).toHaveURL(/index\.html/, { timeout: 15000 });

  const linha = lista.linhaDaTarefa(titulo);
  await expect(linha).toBeVisible({ timeout: 10000 });

  await lista.solicitarExclusao(titulo);
  await expect(lista.modal).toBeVisible();
  await expect(lista.modal).toContainText(titulo);
  await lista.confirmarModal();

  await expect(linha).toHaveCount(0, { timeout: 10000 });
  await expect(lista.mensagem).toContainText('Tarefa excluída com sucesso.');

  // Confirma que a exclusão foi persistida.
  await lista.recarregar();
  await expect(lista.linhaDaTarefa(titulo)).toHaveCount(0);
});

test('EXC02 - cancelar exclusão', async ({ page }) => {
  const lista = new ListaPage(page);
  const novaTarefa = new NovaTarefaPage(page);

  const identificador = Date.now();
  const titulo = `EXC02 ${identificador}`;
  const descricao = 'Tarefa criada para testar cancelamento da exclusão.';
  const autor = 'Teste Playwright';

  await lista.abrir();
  await lista.abrirNovaTarefa();
  await novaTarefa.cadastrar({ titulo, descricao, criadoPor: autor });
  await expect(page).toHaveURL(/index\.html/, { timeout: 15000 });

  const linha = lista.linhaDaTarefa(titulo);
  await expect(linha).toBeVisible({ timeout: 10000 });

  await lista.solicitarExclusao(titulo);
  await expect(lista.modal).toBeVisible();
  await lista.cancelarModal();
  await expect(lista.modal).not.toBeVisible();

  await expect(linha).toBeVisible();
  await expect(linha).toContainText(titulo);

  // Confirma que a tarefa permanece no banco.
  await lista.recarregar();
  const linhaRecarregada = lista.linhaDaTarefa(titulo);
  await expect(linhaRecarregada).toBeVisible({ timeout: 10000 });
  await expect(linhaRecarregada).toContainText(titulo);
});
