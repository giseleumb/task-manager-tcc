const { test, expect } = require('@playwright/test');
const { ListaPage } = require('./pages/ListaPage');
const { NovaTarefaPage } = require('./pages/NovaTarefaPage');
const { EditarTarefaPage } = require('./pages/EditarTarefaPage');
const { VisualizarTarefaPage } = require('./pages/VisualizarTarefaPage');
const { HistoricoPage } = require('./pages/HistoricoPage');

// HIS01 a HIS06: mesmos cenários, dados e verificações da suíte monolítica.
// Interações com as páginas são realizadas pelos Page Objects.

test('HIS01 - registrar evento de criação', async ({ page }) => {
  const lista = new ListaPage(page);
  const novaTarefa = new NovaTarefaPage(page);
  const historico = new HistoricoPage(page);

  const identificador = Date.now();
  const titulo = `HIS01 ${identificador}`;
  const descricao = 'Tarefa criada para testar histórico.';
  const autor = `Autor HIS01 ${identificador}`;

  await lista.abrir();
  await lista.abrirNovaTarefa();
  await novaTarefa.cadastrar({ titulo, descricao, criadoPor: autor });
  await expect(page).toHaveURL(/index\.html/, { timeout: 15000 });

  await lista.abrirHistorico();
  await expect(page).toHaveURL(/historico\.html/);

  const evento = historico.eventoDaTarefa(titulo, 'Criada');
  await expect(evento).toBeVisible({ timeout: 10000 });
  await expect(evento).toContainText('Criada');
  await expect(evento).toContainText(autor);
  await expect(historico.dataDoEvento(titulo, 'Criada')).not.toHaveText('');
});

test('HIS02 - registrar evento de edição', async ({ page }) => {
  const lista = new ListaPage(page);
  const novaTarefa = new NovaTarefaPage(page);
  const editar = new EditarTarefaPage(page);
  const visualizar = new VisualizarTarefaPage(page);
  const historico = new HistoricoPage(page);

  const identificador = Date.now();
  const tituloOriginal = `HIS02 ${identificador}`;
  const descricaoOriginal = 'Descrição original do HIS02.';
  const autor = `Autor HIS02 ${identificador}`;
  const novoTitulo = `HIS02 Editada ${identificador}`;

  await lista.abrir();
  await lista.abrirNovaTarefa();
  await novaTarefa.cadastrar({
    titulo: tituloOriginal,
    descricao: descricaoOriginal,
    criadoPor: autor
  });
  await expect(page).toHaveURL(/index\.html/, { timeout: 15000 });

  await expect(lista.linhaDaTarefa(tituloOriginal)).toBeVisible({ timeout: 10000 });
  await lista.editarTarefa(tituloOriginal);
  await editar.aguardarFormulario();
  await editar.preencherAlteracoes({ titulo: novoTitulo });
  await editar.solicitarSalvar();
  await expect(editar.modal).toBeVisible();
  await editar.confirmarEdicao();

  await expect(page).toHaveURL(/visualizar\.html\?id=/, { timeout: 15000 });
  await visualizar.aguardarDetalhes();
  await expect(visualizar.titulo).toHaveText(novoTitulo);

  await historico.abrir();
  const evento = historico.eventoDaTarefa(novoTitulo, 'Editada');
  await expect(evento).toBeVisible({ timeout: 10000 });
  await expect(evento).toContainText('Editada');
  await expect(evento).toContainText(autor);
});

test('HIS03 - registrar evento de conclusão', async ({ page }) => {
  const lista = new ListaPage(page);
  const novaTarefa = new NovaTarefaPage(page);
  const historico = new HistoricoPage(page);

  const identificador = Date.now();
  const titulo = `HIS03 ${identificador}`;
  const descricao = 'Tarefa criada para testar histórico de conclusão.';
  const autor = `Autor HIS03 ${identificador}`;

  await lista.abrir();
  await lista.abrirNovaTarefa();
  await novaTarefa.cadastrar({ titulo, descricao, criadoPor: autor });
  await expect(page).toHaveURL(/index\.html/, { timeout: 15000 });

  const linha = lista.linhaDaTarefa(titulo);
  await expect(linha).toBeVisible({ timeout: 10000 });
  await lista.solicitarConclusao(titulo);
  await expect(lista.modal).toBeVisible();
  await lista.confirmarModal();
  await expect(linha).toContainText('Concluída', { timeout: 10000 });

  await historico.abrir();
  const evento = historico.eventoDaTarefa(titulo, 'Concluída');
  await expect(evento).toBeVisible({ timeout: 10000 });
  await expect(evento).toContainText('Concluída');
  await expect(evento).toContainText(autor);
});

test('HIS04 - registrar evento de reabertura', async ({ page }) => {
  const lista = new ListaPage(page);
  const novaTarefa = new NovaTarefaPage(page);
  const historico = new HistoricoPage(page);

  const identificador = Date.now();
  const titulo = `HIS04 ${identificador}`;
  const descricao = 'Tarefa criada para testar histórico de reabertura.';
  const autor = `Autor HIS04 ${identificador}`;

  await lista.abrir();
  await lista.abrirNovaTarefa();
  await novaTarefa.cadastrar({ titulo, descricao, criadoPor: autor });
  await expect(page).toHaveURL(/index\.html/, { timeout: 15000 });

  const linha = lista.linhaDaTarefa(titulo);
  await expect(linha).toBeVisible({ timeout: 10000 });

  // Precondição: a tarefa precisa estar concluída para ser reaberta.
  await lista.solicitarConclusao(titulo);
  await expect(lista.modal).toBeVisible();
  await lista.confirmarModal();
  await expect(linha).toContainText('Concluída', { timeout: 10000 });

  await lista.solicitarReabertura(titulo);
  await expect(lista.modal).toBeVisible();
  await lista.confirmarModal();
  await expect(linha).toContainText('Pendente', { timeout: 10000 });

  await historico.abrir();
  const evento = historico.eventoDaTarefa(titulo, 'Reaberta');
  await expect(evento).toBeVisible({ timeout: 10000 });
  await expect(evento).toContainText('Reaberta');
  await expect(evento).toContainText(autor);
});

test('HIS05 - registrar evento de exclusão', async ({ page }) => {
  const lista = new ListaPage(page);
  const novaTarefa = new NovaTarefaPage(page);
  const historico = new HistoricoPage(page);

  const identificador = Date.now();
  const titulo = `HIS05 ${identificador}`;
  const descricao = 'Tarefa criada para testar histórico de exclusão.';
  const autor = `Autor HIS05 ${identificador}`;

  await lista.abrir();
  await lista.abrirNovaTarefa();
  await novaTarefa.cadastrar({ titulo, descricao, criadoPor: autor });
  await expect(page).toHaveURL(/index\.html/, { timeout: 15000 });

  const linha = lista.linhaDaTarefa(titulo);
  await expect(linha).toBeVisible({ timeout: 10000 });
  await lista.solicitarExclusao(titulo);
  await expect(lista.modal).toBeVisible();
  await lista.confirmarModal();
  await expect(linha).toHaveCount(0, { timeout: 10000 });

  await historico.abrir();
  const evento = historico.eventoDaTarefa(titulo, 'Excluída');
  await expect(evento).toBeVisible({ timeout: 10000 });
  await expect(evento).toContainText('Excluída');
  await expect(evento).toContainText(autor);
});

test('HIS06 - preservar histórico após exclusão', async ({ page }) => {
  const lista = new ListaPage(page);
  const novaTarefa = new NovaTarefaPage(page);
  const historico = new HistoricoPage(page);

  const identificador = Date.now();
  const titulo = `HIS06 ${identificador}`;
  const descricao = 'Tarefa criada para testar preservação do histórico.';
  const autor = `Autor HIS06 ${identificador}`;

  await lista.abrir();
  await lista.abrirNovaTarefa();
  await novaTarefa.cadastrar({ titulo, descricao, criadoPor: autor });
  await expect(page).toHaveURL(/index\.html/, { timeout: 15000 });

  const linha = lista.linhaDaTarefa(titulo);
  await expect(linha).toBeVisible({ timeout: 10000 });
  await lista.solicitarExclusao(titulo);
  await expect(lista.modal).toBeVisible();
  await lista.confirmarModal();
  await expect(linha).toHaveCount(0, { timeout: 10000 });

  // Verifica que a tarefa foi efetivamente removida da listagem persistida.
  await lista.recarregar();
  await expect(lista.linhaDaTarefa(titulo)).toHaveCount(0);

  // A exclusão não deve apagar o histórico já registrado.
  await historico.abrir();
  const eventoCriacao = historico.eventoDaTarefa(titulo, 'Criada');
  const eventoExclusao = historico.eventoDaTarefa(titulo, 'Excluída');

  await expect(eventoCriacao).toBeVisible({ timeout: 10000 });
  await expect(eventoExclusao).toBeVisible({ timeout: 10000 });
  await expect(eventoCriacao).toContainText(autor);
  await expect(eventoExclusao).toContainText(autor);
});
