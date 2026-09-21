const { test, expect } = require('@playwright/test');

test('EDI02 - editar tarefa e confirmar alteração', async ({ page }) => {
  const identificador = Date.now();

  const tituloOriginal = `EDI02 ${identificador}`;
  const descricaoOriginal = 'Descrição original do EDI02.';
  const autor = 'Teste Playwright';
  const novoTitulo = `EDI02 Editada ${identificador}`;
  const novaDescricao = 'Descrição alterada pelo EDI02.';

  // =========================
  // PREPARAÇÃO DA TAREFA
  // =========================

  await page.goto('./');

  await page
    .getByRole('link', { name: '+ Nova tarefa' })
    .click();

  await page
    .locator('#titulo-tarefa')
    .fill(tituloOriginal);

  await page
    .locator('#descricao-tarefa')
    .fill(descricaoOriginal);

  await page
    .locator('#criado-por')
    .fill(autor);

  await page
    .locator('#salvar-tarefa')
    .click();

  await expect(page).toHaveURL(/index\.html/, {
    timeout: 15000
  });

  // =========================
  // EDIÇÃO
  // =========================

  const linha = page
    .locator('#lista-tarefas tr')
    .filter({ hasText: tituloOriginal });

  await expect(linha).toBeVisible({
    timeout: 10000
  });

  await linha
    .getByRole('link', { name: 'Editar' })
    .click();

  await expect(page).toHaveURL(/editar\.html\?id=/);

  // Espera os dados da tarefa carregarem
  await expect(
    page.locator('#form-tarefa')
  ).toBeVisible({
    timeout: 10000
  });

  // Primeiro verificamos que a tarefa correta foi carregada
  await expect(
    page.locator('#titulo-tarefa')
  ).toHaveValue(tituloOriginal);

  await expect(
    page.locator('#descricao-tarefa')
  ).toHaveValue(descricaoOriginal);

  // Altera os dados
  await page
    .locator('#titulo-tarefa')
    .fill(novoTitulo);

  await page
    .locator('#descricao-tarefa')
    .fill(novaDescricao);

  await page
    .locator('#salvar-edicao')
    .click();

  // =========================
  // CONFIRMAÇÃO DA MODAL
  // =========================

  const modal = page.getByRole('dialog');

  await expect(modal).toBeVisible();

  await modal
    .getByRole('button', { name: /Salvar|Confirmar/i })
    .click();

  // =========================
  // VALIDAÇÃO
  // =========================

  await expect(page).toHaveURL(
    /visualizar\.html\?id=/,
    {
      timeout: 15000
    }
  );

  await expect(
    page.getByText(novoTitulo, { exact: true })
  ).toBeVisible();

  await expect(
    page.getByText(novaDescricao, { exact: true })
  ).toBeVisible();

  await expect(
    page.getByText(autor, { exact: true })
  ).toBeVisible();
});
test('EDI03 - cancelar confirmação de edição', async ({ page }) => {
  const identificador = Date.now();

  const tituloOriginal = `EDI03 ${identificador}`;
  const descricaoOriginal = 'Descrição original do EDI03.';
  const autor = 'Teste Playwright';

  const tituloNaoSalvo =
    `EDI03 Não Salvar ${identificador}`;

  // =========================
  // PREPARAÇÃO DA TAREFA
  // =========================

  await page.goto('./');

  await page
    .getByRole('link', { name: '+ Nova tarefa' })
    .click();

  await page
    .locator('#titulo-tarefa')
    .fill(tituloOriginal);

  await page
    .locator('#descricao-tarefa')
    .fill(descricaoOriginal);

  await page
    .locator('#criado-por')
    .fill(autor);

  await page
    .locator('#salvar-tarefa')
    .click();

  await expect(page).toHaveURL(/index\.html/, {
    timeout: 15000
  });

  // =========================
  // ABRIR EDIÇÃO
  // =========================

  const linha = page
    .locator('#lista-tarefas tr')
    .filter({ hasText: tituloOriginal });

  await expect(linha).toBeVisible({
    timeout: 10000
  });

  await linha
    .getByRole('link', { name: 'Editar' })
    .click();

  await expect(
    page.locator('#form-tarefa')
  ).toBeVisible({
    timeout: 10000
  });

  // Altera o título
  await page
    .locator('#titulo-tarefa')
    .fill(tituloNaoSalvo);

  await page
    .locator('#salvar-edicao')
    .click();

  // =========================
  // CANCELAR MODAL
  // =========================

  const modal = page.getByRole('dialog');

  await expect(modal).toBeVisible();

  await modal
    .getByRole('button', { name: /Cancelar/i })
    .click();

  // Continua na página de edição
  await expect(page).toHaveURL(
    /editar\.html\?id=/
  );

  // =========================
  // VERIFICAR PERSISTÊNCIA
  // =========================

  // Recarrega para buscar novamente
  // os valores gravados no banco
  await page.reload();

  await expect(
    page.locator('#form-tarefa')
  ).toBeVisible({
    timeout: 10000
  });

  // O título original deve continuar salvo
  await expect(
    page.locator('#titulo-tarefa')
  ).toHaveValue(tituloOriginal);

  await expect(
    page.locator('#descricao-tarefa')
  ).toHaveValue(descricaoOriginal);

  await expect(
    page.locator('#criado-por')
  ).toHaveValue(autor);
});
test('EDI04 - impedir edição sem título', async ({ page }) => {
  const identificador = Date.now();

  const titulo = `EDI04 ${identificador}`;
  const descricao = 'Descrição válida do EDI04.';
  const autor = 'Teste Playwright';

  // Preparação
  await page.goto('./');

  await page
    .getByRole('link', { name: '+ Nova tarefa' })
    .click();

  await page.locator('#titulo-tarefa').fill(titulo);
  await page.locator('#descricao-tarefa').fill(descricao);
  await page.locator('#criado-por').fill(autor);

  await page.locator('#salvar-tarefa').click();

  await expect(page).toHaveURL(/index\.html/, {
    timeout: 15000
  });

  // Abrir edição
  const linha = page
    .locator('#lista-tarefas tr')
    .filter({ hasText: titulo });

  await expect(linha).toBeVisible({
    timeout: 10000
  });

  await linha
    .getByRole('link', { name: 'Editar' })
    .click();

  await expect(
    page.locator('#form-tarefa')
  ).toBeVisible({
    timeout: 10000
  });

  // Remove o título
  await page
    .locator('#titulo-tarefa')
    .fill('');

  await page
    .locator('#salvar-edicao')
    .click();

  // Validação
  await expect(
    page.locator('#mensagem')
  ).toContainText('O título é obrigatório.');

  await expect(page).toHaveURL(
    /editar\.html\?id=/
  );
});


test('EDI05 - impedir edição sem descrição', async ({ page }) => {
  const identificador = Date.now();

  const titulo = `EDI05 ${identificador}`;
  const descricao = 'Descrição válida do EDI05.';
  const autor = 'Teste Playwright';

  // Preparação
  await page.goto('./');

  await page
    .getByRole('link', { name: '+ Nova tarefa' })
    .click();

  await page.locator('#titulo-tarefa').fill(titulo);
  await page.locator('#descricao-tarefa').fill(descricao);
  await page.locator('#criado-por').fill(autor);

  await page.locator('#salvar-tarefa').click();

  await expect(page).toHaveURL(/index\.html/, {
    timeout: 15000
  });

  // Abrir edição
  const linha = page
    .locator('#lista-tarefas tr')
    .filter({ hasText: titulo });

  await expect(linha).toBeVisible({
    timeout: 10000
  });

  await linha
    .getByRole('link', { name: 'Editar' })
    .click();

  await expect(
    page.locator('#form-tarefa')
  ).toBeVisible({
    timeout: 10000
  });

  // Remove a descrição
  await page
    .locator('#descricao-tarefa')
    .fill('');

  await page
    .locator('#salvar-edicao')
    .click();

  // Validação
  await expect(
    page.locator('#mensagem')
  ).toContainText('A descrição é obrigatória.');

  await expect(page).toHaveURL(
    /editar\.html\?id=/
  );
});


test('EDI06 - preservar autor original na edição', async ({ page }) => {
  const identificador = Date.now();

  const titulo = `EDI06 ${identificador}`;
  const descricao = 'Descrição válida do EDI06.';
  const autor = `Autor EDI06 ${identificador}`;

  // Preparação
  await page.goto('./');

  await page
    .getByRole('link', { name: '+ Nova tarefa' })
    .click();

  await page.locator('#titulo-tarefa').fill(titulo);
  await page.locator('#descricao-tarefa').fill(descricao);
  await page.locator('#criado-por').fill(autor);

  await page.locator('#salvar-tarefa').click();

  await expect(page).toHaveURL(/index\.html/, {
    timeout: 15000
  });

  // Abrir edição
  const linha = page
    .locator('#lista-tarefas tr')
    .filter({ hasText: titulo });

  await expect(linha).toBeVisible({
    timeout: 10000
  });

  await linha
    .getByRole('link', { name: 'Editar' })
    .click();

  await expect(
    page.locator('#form-tarefa')
  ).toBeVisible({
    timeout: 10000
  });

  const campoAutor = page.locator('#criado-por');

  // Autor original continua carregado
  await expect(campoAutor)
    .toHaveValue(autor);

  // Campo não pode ser editado
  await expect(campoAutor)
    .not.toBeEditable();
});