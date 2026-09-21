const { test, expect } = require('@playwright/test');
test('HIS01 - registrar evento de criação', async ({ page }) => {
  const identificador = Date.now();

  const titulo = `HIS01 ${identificador}`;
  const descricao = 'Tarefa criada para testar histórico.';
  const autor = `Autor HIS01 ${identificador}`;

  // Criar tarefa
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
    .fill(autor);

  await page
    .locator('#salvar-tarefa')
    .click();

  await expect(page).toHaveURL(/index\.html/, {
    timeout: 15000
  });

  // Abrir histórico
  await page
    .getByRole('link', { name: 'Histórico' })
    .click();

  await expect(page).toHaveURL(
    /historico\.html/
  );

  // Procurar evento da tarefa
  const evento = page
    .locator('#lista-historico tr')
    .filter({ hasText: titulo })
    .filter({ hasText: 'Criada' });

  await expect(evento).toBeVisible({
    timeout: 10000
  });

  // Valida ação
  await expect(evento)
    .toContainText('Criada');

  // Valida autor
  await expect(evento)
    .toContainText(autor);

  // Valida que existe uma data registrada
  await expect(
    evento.locator('td').nth(0)
  ).not.toHaveText('');
});
test('HIS02 - registrar evento de edição', async ({ page }) => {
  const identificador = Date.now();

  const tituloOriginal = `HIS02 ${identificador}`;
  const descricaoOriginal = 'Descrição original do HIS02.';
  const autor = `Autor HIS02 ${identificador}`;

  const novoTitulo = `HIS02 Editada ${identificador}`;

  // =========================
  // CRIAR TAREFA
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
  // EDITAR
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

  await page
    .locator('#titulo-tarefa')
    .fill(novoTitulo);

  await page
    .locator('#salvar-edicao')
    .click();

  const modal = page.getByRole('dialog');

  await expect(modal).toBeVisible();

  await modal
    .getByRole('button', {
      name: /Salvar|Confirmar/i
    })
    .click();

  // Espera edição ser persistida
  await expect(page).toHaveURL(
    /visualizar\.html\?id=/,
    {
      timeout: 15000
    }
  );

  await expect(
    page.getByText(novoTitulo, { exact: true })
  ).toBeVisible();

  // =========================
  // HISTÓRICO
  // =========================

  await page.goto('./historico.html');

  const evento = page
    .locator('#lista-historico tr')
    .filter({ hasText: novoTitulo })
    .filter({ hasText: 'Editada' });

  await expect(evento).toBeVisible({
    timeout: 10000
  });

  await expect(evento)
    .toContainText('Editada');

  await expect(evento)
    .toContainText(autor);
});
test('HIS03 - registrar evento de conclusão', async ({ page }) => {
  const identificador = Date.now();

  const titulo = `HIS03 ${identificador}`;
  const descricao = 'Tarefa criada para testar histórico de conclusão.';
  const autor = `Autor HIS03 ${identificador}`;

  // Criar tarefa
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

  // Localizar tarefa
  const linha = page
    .locator('#lista-tarefas tr')
    .filter({ hasText: titulo });

  await expect(linha).toBeVisible({
    timeout: 10000
  });

  // Concluir tarefa
  await linha
    .getByRole('button', { name: 'Concluir' })
    .click();

  const modal = page.getByRole('dialog');

  await expect(modal).toBeVisible();

  await modal
    .getByRole('button', { name: 'Concluir' })
    .click();

  await expect(linha).toContainText(
    'Concluída',
    {
      timeout: 10000
    }
  );

  // Abrir histórico
  await page.goto('./historico.html');

  const evento = page
    .locator('#lista-historico tr')
    .filter({ hasText: titulo })
    .filter({ hasText: 'Concluída' });

  await expect(evento).toBeVisible({
    timeout: 10000
  });

  await expect(evento)
    .toContainText('Concluída');

  await expect(evento)
    .toContainText(autor);
});
test('HIS04 - registrar evento de reabertura', async ({ page }) => {
  const identificador = Date.now();

  const titulo = `HIS04 ${identificador}`;
  const descricao = 'Tarefa criada para testar histórico de reabertura.';
  const autor = `Autor HIS04 ${identificador}`;

  // Criar tarefa
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

  const linha = page
    .locator('#lista-tarefas tr')
    .filter({ hasText: titulo });

  await expect(linha).toBeVisible({
    timeout: 10000
  });

  // Primeiro conclui
  await linha
    .getByRole('button', { name: 'Concluir' })
    .click();

  let modal = page.getByRole('dialog');

  await expect(modal).toBeVisible();

  await modal
    .getByRole('button', { name: 'Concluir' })
    .click();

  await expect(linha).toContainText(
    'Concluída',
    {
      timeout: 10000
    }
  );

  // Agora reabre
  await linha
    .getByRole('button', { name: 'Reabrir' })
    .click();

  modal = page.getByRole('dialog');

  await expect(modal).toBeVisible();

  await modal
    .getByRole('button', { name: 'Reabrir' })
    .click();

  await expect(linha).toContainText(
    'Pendente',
    {
      timeout: 10000
    }
  );

  // Abrir histórico
  await page.goto('./historico.html');

  const evento = page
    .locator('#lista-historico tr')
    .filter({ hasText: titulo })
    .filter({ hasText: 'Reaberta' });

  await expect(evento).toBeVisible({
    timeout: 10000
  });

  await expect(evento)
    .toContainText('Reaberta');

  await expect(evento)
    .toContainText(autor);
});
test('HIS05 - registrar evento de exclusão', async ({ page }) => {
  const identificador = Date.now();

  const titulo = `HIS05 ${identificador}`;
  const descricao = 'Tarefa criada para testar histórico de exclusão.';
  const autor = `Autor HIS05 ${identificador}`;

  // Criar tarefa
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

  const linha = page
    .locator('#lista-tarefas tr')
    .filter({ hasText: titulo });

  await expect(linha).toBeVisible({
    timeout: 10000
  });

  // Excluir tarefa
  await linha
    .getByRole('button', { name: 'Excluir' })
    .click();

  const modal = page.getByRole('dialog');

  await expect(modal).toBeVisible();

  await modal
    .getByRole('button', { name: 'Excluir tarefa' })
    .click();

  await expect(linha).toHaveCount(0, {
    timeout: 10000
  });

  // Abrir histórico
  await page.goto('./historico.html');

  const evento = page
    .locator('#lista-historico tr')
    .filter({ hasText: titulo })
    .filter({ hasText: 'Excluída' });

  await expect(evento).toBeVisible({
    timeout: 10000
  });

  await expect(evento)
    .toContainText('Excluída');

  await expect(evento)
    .toContainText(autor);
});
test('HIS06 - preservar histórico após exclusão', async ({ page }) => {
  const identificador = Date.now();

  const titulo = `HIS06 ${identificador}`;
  const descricao = 'Tarefa criada para testar preservação do histórico.';
  const autor = `Autor HIS06 ${identificador}`;

  // Criar tarefa
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

  let linha = page
    .locator('#lista-tarefas tr')
    .filter({ hasText: titulo });

  await expect(linha).toBeVisible({
    timeout: 10000
  });

  // Excluir tarefa
  await linha
    .getByRole('button', { name: 'Excluir' })
    .click();

  const modal = page.getByRole('dialog');

  await expect(modal).toBeVisible();

  await modal
    .getByRole('button', { name: 'Excluir tarefa' })
    .click();

  await expect(linha).toHaveCount(0, {
    timeout: 10000
  });

  // Confirma que a tarefa realmente não existe mais na listagem
  await page.reload();

  linha = page
    .locator('#lista-tarefas tr')
    .filter({ hasText: titulo });

  await expect(linha).toHaveCount(0);

  // Abrir histórico
  await page.goto('./historico.html');

  const eventosDaTarefa = page
    .locator('#lista-historico tr')
    .filter({ hasText: titulo });

  // O evento de criação anterior continua existindo
  const eventoCriacao = eventosDaTarefa
    .filter({ hasText: 'Criada' });

  await expect(eventoCriacao).toBeVisible({
    timeout: 10000
  });

  // O evento de exclusão também existe
  const eventoExclusao = eventosDaTarefa
    .filter({ hasText: 'Excluída' });

  await expect(eventoExclusao).toBeVisible({
    timeout: 10000
  });

  await expect(eventoCriacao)
    .toContainText(autor);

  await expect(eventoExclusao)
    .toContainText(autor);
});