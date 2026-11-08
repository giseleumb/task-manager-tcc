const { test, expect } = require('@playwright/test');
const { ListaPage } = require('./pages/ListaPage');
const { NovaTarefaPage } = require('./pages/NovaTarefaPage');
const { VisualizarTarefaPage } = require('./pages/VisualizarTarefaPage');

test('LIS06 - exibir dados e ações da linha', async ({ page }) => {
  const lista = new ListaPage(page);
  const novaTarefa = new NovaTarefaPage(page);

  const identificador = Date.now();
  const titulo = `LIS06 ${identificador}`;
  const descricao = 'Tarefa criada para o teste de listagem.';
  const criadoPor = 'Teste Playwright';

  // Preparação: cria uma tarefa pela interface.
  await lista.abrir();
  await lista.abrirNovaTarefa();
  await novaTarefa.cadastrar({ titulo, descricao, criadoPor });

  await expect(page).toHaveURL(/index\.html/, { timeout: 15000 });

  // Mesmas verificações funcionais da suíte monolítica.
  const linha = lista.linhaDaTarefa(titulo);
  await expect(linha).toBeVisible({ timeout: 10000 });
  await expect(linha).toContainText(titulo);
  await expect(linha).toContainText('Pendente');
  await expect(linha).toContainText(criadoPor);
  await expect(lista.dataCriacaoDaTarefa(titulo)).not.toHaveText('');

  await expect(lista.linkVer(titulo)).toBeVisible();
  await expect(lista.linkEditar(titulo)).toBeVisible();
  await expect(lista.botaoConcluir(titulo)).toBeVisible();
  await expect(lista.botaoExcluir(titulo)).toBeVisible();
});

test('CON01 - consultar detalhes de uma tarefa', async ({ page }) => {
  const lista = new ListaPage(page);
  const novaTarefa = new NovaTarefaPage(page);
  const visualizar = new VisualizarTarefaPage(page);

  const identificador = Date.now();
  const titulo = `CON01 ${identificador}`;
  const descricao = `Descrição exclusiva CON01 ${identificador}`;
  const criadoPor = `Autor CON01 ${identificador}`;

  // Preparação: cria uma tarefa pela interface.
  await lista.abrir();
  await lista.abrirNovaTarefa();
  await novaTarefa.cadastrar({ titulo, descricao, criadoPor });

  await expect(page).toHaveURL(/index\.html/, { timeout: 15000 });

  const linha = lista.linhaDaTarefa(titulo);
  await expect(linha).toBeVisible({ timeout: 10000 });

  // Guarda a data exibida na listagem, como na suíte monolítica.
  const dataCriacao = (await lista.dataCriacaoDaTarefa(titulo).innerText()).trim();

  await lista.visualizarTarefa(titulo);
  await expect(page).toHaveURL(/visualizar\.html\?id=/, { timeout: 10000 });
  await visualizar.aguardarDetalhes();

  await expect(visualizar.titulo).toHaveText(titulo);
  await expect(visualizar.descricao).toHaveText(descricao);
  await expect(visualizar.criadoPor).toHaveText(criadoPor);
  await expect(visualizar.status).toHaveText('Pendente');
  await expect(visualizar.dataCriacao).toHaveText(dataCriacao);
});
