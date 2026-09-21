const { test, expect } = require('@playwright/test');

test('LIS06 - exibir dados e ações da linha', async ({ page }) => {
  const identificador = Date.now();

  const titulo = `LIS06 ${identificador}`;
  const descricao = 'Tarefa criada para o teste de listagem.';
  const criadoPor = 'Teste Playwright';

  // Preparação da tarefa
  await page.goto('./');

  await page
    .getByRole('link', { name: '+ Nova tarefa' })
    .click();

  await page
    .locator('#titulo-tarefa')
    .fill(titulo);

  await page
    .locator('#descricao-tarefa')
    .fill(descricao);

  await page
    .locator('#criado-por')
    .fill(criadoPor);

  await page
    .locator('#salvar-tarefa')
    .click();

  await expect(page).toHaveURL(/index\.html/, {
    timeout: 15000
  });

  // Localiza a linha da tarefa criada
  const linha = page
    .locator('#lista-tarefas tr')
    .filter({ hasText: titulo });

  await expect(linha).toBeVisible({
    timeout: 10000
  });

  // Valida os dados da linha
  await expect(linha).toContainText(titulo);

  await expect(linha).toContainText('Pendente');

  await expect(linha).toContainText(criadoPor);

  // Valida se existe uma data
  await expect(
    linha.locator('td').nth(3)
  ).not.toHaveText('');

  // Valida as ações
  await expect(
    linha.getByRole('link', { name: 'Ver' })
  ).toBeVisible();

  await expect(
    linha.getByRole('link', { name: 'Editar' })
  ).toBeVisible();

  await expect(
    linha.getByRole('button', { name: 'Concluir' })
  ).toBeVisible();

  await expect(
    linha.getByRole('button', { name: 'Excluir' })
  ).toBeVisible();
});
test('CON01 - consultar detalhes de uma tarefa', async ({ page }) => {
  const identificador = Date.now();

  const titulo = `CON01 ${identificador}`;
  const descricao = `Descrição exclusiva CON01 ${identificador}`;
  const criadoPor = `Autor CON01 ${identificador}`;

  // Preparação da tarefa
  await page.goto('./');

  await page
    .getByRole('link', { name: '+ Nova tarefa' })
    .click();

  await page
    .locator('#titulo-tarefa')
    .fill(titulo);

  await page
    .locator('#descricao-tarefa')
    .fill(descricao);

  await page
    .locator('#criado-por')
    .fill(criadoPor);

  await page
    .locator('#salvar-tarefa')
    .click();

  await expect(page).toHaveURL(/index\.html/, {
    timeout: 15000
  });

  const linha = page
    .locator('#lista-tarefas tr')
    .filter({ hasText: titulo });

  await expect(linha).toBeVisible({
    timeout: 10000
  });

  // Guarda a data apresentada na listagem
  const dataCriacao = await linha
    .locator('td')
    .nth(3)
    .innerText();

  // Abre a consulta
  await linha
    .getByRole('link', { name: 'Ver' })
    .click();

  await expect(page).toHaveURL(
    /visualizar\.html\?id=/,
    { timeout: 10000 }
  );

  // Valida os dados da tarefa
  await expect(
    page.getByText(titulo, { exact: true })
  ).toBeVisible();

  await expect(
    page.getByText(descricao, { exact: true })
  ).toBeVisible();

  await expect(
    page.getByText(criadoPor, { exact: true })
  ).toBeVisible();

  await expect(
    page.getByText('Pendente', { exact: true })
  ).toBeVisible();

  await expect(
    page.getByText(dataCriacao.trim(), { exact: true })
  ).toBeVisible();
});