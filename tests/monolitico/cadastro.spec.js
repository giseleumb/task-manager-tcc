const { test, expect } = require('@playwright/test');

test('CT01 - criar tarefa com dados válidos', async ({ page }) => {

  const identificador = Date.now();

  const titulo =
    `Tarefa Playwright ${identificador}`;

  const descricao =
    'Tarefa criada automaticamente pelo teste CT01.';

  const criadoPor =
    'Teste Playwright';


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


  const linhaTarefa = page.locator('tr', {
    hasText: titulo
  });


  await expect(linhaTarefa).toBeVisible();

  await expect(linhaTarefa)
    .toContainText('Pendente');

  await expect(linhaTarefa)
    .toContainText(criadoPor);
});
test('CT02 - impedir cadastro sem título', async ({ page }) => {
  await page.goto('./');

  await page
    .getByRole('link', { name: '+ Nova tarefa' })
    .click();

  await page
    .locator('#descricao-tarefa')
    .fill('Descrição válida para teste sem título.');

  await page
    .locator('#criado-por')
    .fill('Teste Playwright');

  await page
    .locator('#salvar-tarefa')
    .click();

  await expect(
    page.locator('#mensagem')
  ).toContainText('O título é obrigatório.');

  await expect(page).toHaveURL(/nova\.html/);
});
test('CT03 - impedir cadastro sem descrição', async ({ page }) => {
  await page.goto('./');

  await page
    .getByRole('link', { name: '+ Nova tarefa' })
    .click();

  await page
    .locator('#titulo-tarefa')
    .fill('Tarefa sem descrição');

  await page
    .locator('#criado-por')
    .fill('Teste Playwright');

  await page
    .locator('#salvar-tarefa')
    .click();

  await expect(
    page.locator('#mensagem')
  ).toContainText('A descrição é obrigatória.');

  await expect(page).toHaveURL(/nova\.html/);
});
test('CT04 - impedir cadastro sem criado por', async ({ page }) => {
  await page.goto('./');

  await page
    .getByRole('link', { name: '+ Nova tarefa' })
    .click();

  await page
    .locator('#titulo-tarefa')
    .fill('Tarefa sem autor');

  await page
    .locator('#descricao-tarefa')
    .fill('Descrição válida para testar o campo criado por.');

  await page
    .locator('#salvar-tarefa')
    .click();

  await expect(
    page.locator('#mensagem')
  ).toContainText("O campo 'Criado por' é obrigatório.");

  await expect(page).toHaveURL(/nova\.html/);
});