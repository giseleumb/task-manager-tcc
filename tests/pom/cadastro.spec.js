
const { test, expect } = require('@playwright/test');
const { ListaPage } = require('./pages/ListaPage');
const { NovaTarefaPage } = require('./pages/NovaTarefaPage');

test('CAD01 - criar tarefa com dados válidos', async ({ page }) => {
  const lista = new ListaPage(page);
  const novaTarefa = new NovaTarefaPage(page);

  const identificador = Date.now();
  const titulo = `Tarefa Playwright ${identificador}`;
  const descricao = 'Tarefa criada automaticamente pelo teste CT01.';
  const criadoPor = 'Teste Playwright';

  await lista.abrir();
  await lista.abrirNovaTarefa();

  await novaTarefa.cadastrar({ titulo, descricao, criadoPor });

  const linhaTarefa = lista.linhaDaTarefa(titulo);

  await expect(linhaTarefa).toBeVisible();
  await expect(linhaTarefa).toContainText('Pendente');
  await expect(linhaTarefa).toContainText(criadoPor);
});

test('CAD02 - impedir cadastro sem título', async ({ page }) => {
  const lista = new ListaPage(page);
  const novaTarefa = new NovaTarefaPage(page);

  await lista.abrir();
  await lista.abrirNovaTarefa();

  await novaTarefa.cadastrar({
    descricao: 'Descrição válida para teste sem título.',
    criadoPor: 'Teste Playwright'
  });

  await expect(novaTarefa.mensagem)
    .toContainText('O título é obrigatório.');

  await expect(page).toHaveURL(/nova\.html/);
});

test('CAD03 - impedir cadastro sem descrição', async ({ page }) => {
  const lista = new ListaPage(page);
  const novaTarefa = new NovaTarefaPage(page);

  await lista.abrir();
  await lista.abrirNovaTarefa();

  await novaTarefa.cadastrar({
    titulo: 'Tarefa sem descrição',
    criadoPor: 'Teste Playwright'
  });

  await expect(novaTarefa.mensagem)
    .toContainText('A descrição é obrigatória.');

  await expect(page).toHaveURL(/nova\.html/);
});

test('CAD04 - impedir cadastro sem criado por', async ({ page }) => {
  const lista = new ListaPage(page);
  const novaTarefa = new NovaTarefaPage(page);

  await lista.abrir();
  await lista.abrirNovaTarefa();

  await novaTarefa.cadastrar({
    titulo: 'Tarefa sem autor',
    descricao: 'Descrição válida para testar o campo criado por.'
  });

  await expect(novaTarefa.mensagem)
    .toContainText("O campo 'Criado por' é obrigatório.");

  await expect(page).toHaveURL(/nova\.html/);
});
