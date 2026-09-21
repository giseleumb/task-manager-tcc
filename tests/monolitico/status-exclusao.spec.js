const { test, expect } = require('@playwright/test');
test('STA01 - concluir tarefa pendente', async ({ page }) => {
  const identificador = Date.now();

  const titulo = `STA01 ${identificador}`;
  const descricao = 'Tarefa criada para testar conclusão.';
  const autor = 'Teste Playwright';

  // Preparação da tarefa
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

  // Estado inicial
  await expect(linha).toContainText('Pendente');

  await expect(
    linha.getByRole('button', { name: 'Concluir' })
  ).toBeVisible();

  // Solicita conclusão
  await linha
    .getByRole('button', { name: 'Concluir' })
    .click();

  // Modal
  const modal = page.getByRole('dialog');

  await expect(modal).toBeVisible();

  await expect(modal)
    .toContainText('Deseja concluir esta tarefa?');

  await modal
    .getByRole('button', { name: 'Concluir' })
    .click();

  // Resultado
  await expect(linha).toContainText(
    'Concluída',
    {
      timeout: 10000
    }
  );

  await expect(
    linha.getByRole('button', { name: 'Reabrir' })
  ).toBeVisible();

  await expect(
    page.locator('#mensagem')
  ).toContainText('Tarefa concluída com sucesso.');
});
test('STA02 - cancelar conclusão', async ({ page }) => {
  const identificador = Date.now();

  const titulo = `STA02 ${identificador}`;
  const descricao = 'Tarefa criada para testar cancelamento.';
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

  const linha = page
    .locator('#lista-tarefas tr')
    .filter({ hasText: titulo });

  await expect(linha).toBeVisible({
    timeout: 10000
  });

  await expect(linha).toContainText('Pendente');

  // Solicita conclusão
  await linha
    .getByRole('button', { name: 'Concluir' })
    .click();

  const modal = page.getByRole('dialog');

  await expect(modal).toBeVisible();

  // Cancela
  await modal
    .getByRole('button', { name: 'Cancelar' })
    .click();

  // Modal deve desaparecer
  await expect(modal).not.toBeVisible();

  // Estado não pode mudar
  await expect(linha).toContainText('Pendente');

  await expect(
    linha.getByRole('button', { name: 'Concluir' })
  ).toBeVisible();

  // Recarrega a aplicação para verificar
  // que realmente não houve persistência no banco
  await page.reload();

  const linhaRecarregada = page
    .locator('#lista-tarefas tr')
    .filter({ hasText: titulo });

  await expect(linhaRecarregada).toBeVisible({
    timeout: 10000
  });

  await expect(
    linhaRecarregada
  ).toContainText('Pendente');

  await expect(
    linhaRecarregada.getByRole(
      'button',
      { name: 'Concluir' }
    )
  ).toBeVisible();
});
test('STA03 - reabrir tarefa concluída', async ({ page }) => {
  const identificador = Date.now();

  const titulo = `STA03 ${identificador}`;
  const descricao = 'Tarefa criada para testar reabertura.';
  const autor = 'Teste Playwright';

  // Preparação: criar tarefa
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

  // Primeiro conclui a tarefa
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
    { timeout: 10000 }
  );

  // Agora testa a reabertura
  await linha
    .getByRole('button', { name: 'Reabrir' })
    .click();

  modal = page.getByRole('dialog');

  await expect(modal).toBeVisible();

  await expect(modal)
    .toContainText('Deseja reabrir esta tarefa?');

  await modal
    .getByRole('button', { name: 'Reabrir' })
    .click();

  // Resultado esperado
  await expect(linha).toContainText(
    'Pendente',
    { timeout: 10000 }
  );

  await expect(
    linha.getByRole('button', { name: 'Concluir' })
  ).toBeVisible();

  await expect(
    page.locator('#mensagem')
  ).toContainText('Tarefa reaberta com sucesso.');
});

test('STA04 - cancelar reabertura', async ({ page }) => {
  const identificador = Date.now();

  const titulo = `STA04 ${identificador}`;
  const descricao = 'Tarefa criada para testar cancelamento de reabertura.';
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

  let linha = page
    .locator('#lista-tarefas tr')
    .filter({ hasText: titulo });

  await expect(linha).toBeVisible({
    timeout: 10000
  });

  // Primeiro conclui a tarefa
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
    { timeout: 10000 }
  );

  // Solicita reabertura
  await linha
    .getByRole('button', { name: 'Reabrir' })
    .click();

  modal = page.getByRole('dialog');

  await expect(modal).toBeVisible();

  // Cancela
  await modal
    .getByRole('button', { name: 'Cancelar' })
    .click();

  await expect(modal).not.toBeVisible();

  // Continua concluída
  await expect(linha)
    .toContainText('Concluída');

  await expect(
    linha.getByRole('button', { name: 'Reabrir' })
  ).toBeVisible();

  // Verifica persistência no banco
  await page.reload();

  linha = page
    .locator('#lista-tarefas tr')
    .filter({ hasText: titulo });

  await expect(linha).toBeVisible({
    timeout: 10000
  });

  await expect(linha)
    .toContainText('Concluída');

  await expect(
    linha.getByRole('button', { name: 'Reabrir' })
  ).toBeVisible();
});
test('EXC01 - excluir tarefa e confirmar', async ({ page }) => {
  const identificador = Date.now();

  const titulo = `EXC01 ${identificador}`;
  const descricao = 'Tarefa criada para testar exclusão.';
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

  const linha = page
    .locator('#lista-tarefas tr')
    .filter({ hasText: titulo });

  await expect(linha).toBeVisible({
    timeout: 10000
  });

  // Solicita exclusão
  await linha
    .getByRole('button', { name: 'Excluir' })
    .click();

  const modal = page.getByRole('dialog');

  await expect(modal).toBeVisible();

  await expect(modal)
    .toContainText(titulo);

  // Confirma
  await modal
    .getByRole('button', { name: 'Excluir tarefa' })
    .click();

  // A tarefa deve desaparecer da listagem
  await expect(linha).toHaveCount(0, {
    timeout: 10000
  });

  await expect(
    page.locator('#mensagem')
  ).toContainText('Tarefa excluída com sucesso.');

  // Recarrega para confirmar que a exclusão
  // foi realmente persistida no banco
  await page.reload();

  const linhaAposReload = page
    .locator('#lista-tarefas tr')
    .filter({ hasText: titulo });

  await expect(linhaAposReload)
    .toHaveCount(0);
});
test('EXC02 - cancelar exclusão', async ({ page }) => {
  const identificador = Date.now();

  const titulo = `EXC02 ${identificador}`;
  const descricao = 'Tarefa criada para testar cancelamento da exclusão.';
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

  let linha = page
    .locator('#lista-tarefas tr')
    .filter({ hasText: titulo });

  await expect(linha).toBeVisible({
    timeout: 10000
  });

  // Solicita exclusão
  await linha
    .getByRole('button', { name: 'Excluir' })
    .click();

  const modal = page.getByRole('dialog');

  await expect(modal).toBeVisible();

  // Cancela
  await modal
    .getByRole('button', { name: 'Cancelar' })
    .click();

  await expect(modal).not.toBeVisible();

  // A tarefa continua visível
  await expect(linha).toBeVisible();

  await expect(linha)
    .toContainText(titulo);

  // Recarrega para verificar persistência
  await page.reload();

  linha = page
    .locator('#lista-tarefas tr')
    .filter({ hasText: titulo });

  await expect(linha).toBeVisible({
    timeout: 10000
  });

  await expect(linha)
    .toContainText(titulo);
});