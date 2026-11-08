const { test, expect } = require('@playwright/test');
const { ListaPage } = require('./pages/ListaPage');
const { NovaTarefaPage } = require('./pages/NovaTarefaPage');
const { EditarTarefaPage } = require('./pages/EditarTarefaPage');
const { VisualizarTarefaPage } = require('./pages/VisualizarTarefaPage');

test('EDI02 - editar tarefa e confirmar alteração', async ({ page }) => {
  const lista = new ListaPage(page);
  const novaTarefa = new NovaTarefaPage(page);
  const editar = new EditarTarefaPage(page);
  const visualizar = new VisualizarTarefaPage(page);

  const identificador = Date.now();
  const tituloOriginal = `EDI02 ${identificador}`;
  const descricaoOriginal = 'Descrição original do EDI02.';
  const autor = 'Teste Playwright';
  const novoTitulo = `EDI02 Editada ${identificador}`;
  const novaDescricao = 'Descrição alterada pelo EDI02.';

  // Preparação da tarefa: mesmo fluxo e dados da suíte monolítica.
  await lista.abrir();
  await lista.abrirNovaTarefa();
  await novaTarefa.cadastrar({
    titulo: tituloOriginal,
    descricao: descricaoOriginal,
    criadoPor: autor
  });
  await expect(page).toHaveURL(/index\.html/, { timeout: 15000 });

  const linha = lista.linhaDaTarefa(tituloOriginal);
  await expect(linha).toBeVisible({ timeout: 10000 });
  await lista.editarTarefa(tituloOriginal);
  await expect(page).toHaveURL(/editar\.html\?id=/);
  await editar.aguardarFormulario();

  // Verifica que a tarefa correta foi carregada.
  await expect(editar.titulo).toHaveValue(tituloOriginal);
  await expect(editar.descricao).toHaveValue(descricaoOriginal);

  // Edição e confirmação pela modal personalizada.
  await editar.preencherAlteracoes({
    titulo: novoTitulo,
    descricao: novaDescricao
  });
  await editar.solicitarSalvar();
  await expect(editar.modal).toBeVisible();
  await editar.confirmarEdicao();

  await expect(page).toHaveURL(/visualizar\.html\?id=/, { timeout: 15000 });
  await visualizar.aguardarDetalhes();
  await expect(visualizar.titulo).toHaveText(novoTitulo);
  await expect(visualizar.descricao).toHaveText(novaDescricao);
  await expect(visualizar.criadoPor).toHaveText(autor);
});

test('EDI03 - cancelar confirmação de edição', async ({ page }) => {
  const lista = new ListaPage(page);
  const novaTarefa = new NovaTarefaPage(page);
  const editar = new EditarTarefaPage(page);

  const identificador = Date.now();
  const tituloOriginal = `EDI03 ${identificador}`;
  const descricaoOriginal = 'Descrição original do EDI03.';
  const autor = 'Teste Playwright';
  const tituloNaoSalvo = `EDI03 Não Salvar ${identificador}`;

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

  await editar.preencherAlteracoes({ titulo: tituloNaoSalvo });
  await editar.solicitarSalvar();
  await expect(editar.modal).toBeVisible();
  await editar.cancelarEdicao();
  await expect(page).toHaveURL(/editar\.html\?id=/);

  // Recarrega para confirmar que o cancelamento não alterou o banco.
  await editar.recarregar();
  await expect(editar.titulo).toHaveValue(tituloOriginal);
  await expect(editar.descricao).toHaveValue(descricaoOriginal);
  await expect(editar.criadoPor).toHaveValue(autor);
});

test('EDI04 - impedir edição sem título', async ({ page }) => {
  const lista = new ListaPage(page);
  const novaTarefa = new NovaTarefaPage(page);
  const editar = new EditarTarefaPage(page);

  const identificador = Date.now();
  const titulo = `EDI04 ${identificador}`;
  const descricao = 'Descrição válida do EDI04.';
  const autor = 'Teste Playwright';

  await lista.abrir();
  await lista.abrirNovaTarefa();
  await novaTarefa.cadastrar({ titulo, descricao, criadoPor: autor });
  await expect(page).toHaveURL(/index\.html/, { timeout: 15000 });

  await expect(lista.linhaDaTarefa(titulo)).toBeVisible({ timeout: 10000 });
  await lista.editarTarefa(titulo);
  await editar.aguardarFormulario();

  await editar.preencherAlteracoes({ titulo: '' });
  await editar.solicitarSalvar();
  await expect(editar.mensagem).toContainText('O título é obrigatório.');
  await expect(page).toHaveURL(/editar\.html\?id=/);
});

test('EDI05 - impedir edição sem descrição', async ({ page }) => {
  const lista = new ListaPage(page);
  const novaTarefa = new NovaTarefaPage(page);
  const editar = new EditarTarefaPage(page);

  const identificador = Date.now();
  const titulo = `EDI05 ${identificador}`;
  const descricao = 'Descrição válida do EDI05.';
  const autor = 'Teste Playwright';

  await lista.abrir();
  await lista.abrirNovaTarefa();
  await novaTarefa.cadastrar({ titulo, descricao, criadoPor: autor });
  await expect(page).toHaveURL(/index\.html/, { timeout: 15000 });

  await expect(lista.linhaDaTarefa(titulo)).toBeVisible({ timeout: 10000 });
  await lista.editarTarefa(titulo);
  await editar.aguardarFormulario();

  await editar.preencherAlteracoes({ descricao: '' });
  await editar.solicitarSalvar();
  await expect(editar.mensagem).toContainText('A descrição é obrigatória.');
  await expect(page).toHaveURL(/editar\.html\?id=/);
});

test('EDI06 - preservar autor original na edição', async ({ page }) => {
  const lista = new ListaPage(page);
  const novaTarefa = new NovaTarefaPage(page);
  const editar = new EditarTarefaPage(page);

  const identificador = Date.now();
  const titulo = `EDI06 ${identificador}`;
  const descricao = 'Descrição válida do EDI06.';
  const autor = `Autor EDI06 ${identificador}`;

  await lista.abrir();
  await lista.abrirNovaTarefa();
  await novaTarefa.cadastrar({ titulo, descricao, criadoPor: autor });
  await expect(page).toHaveURL(/index\.html/, { timeout: 15000 });

  await expect(lista.linhaDaTarefa(titulo)).toBeVisible({ timeout: 10000 });
  await lista.editarTarefa(titulo);
  await editar.aguardarFormulario();

  await expect(editar.criadoPor).toHaveValue(autor);
  await expect(editar.criadoPor).not.toBeEditable();
});
