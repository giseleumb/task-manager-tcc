const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',

  // Os testes serão executados sequencialmente.
  fullyParallel: false,

  // Nenhuma repetição automática de teste com falha.
  retries: 0,

  // Um único processo para manter as execuções comparáveis.
  workers: 1,

  reporter: 'html',

  use: {
    baseURL: 'https://giseleumb.github.io/task-manager-tcc/',

    headless: true,

    screenshot: 'only-on-failure',

    video: 'off',

    // Desligado durante as medições para não acrescentar
    // custo adicional ao tempo de execução.
    trace: 'off',
  },

  projects: [
    {
      name: 'chromium',

      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});