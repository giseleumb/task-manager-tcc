class VisualizarTarefaPage {
  constructor(page) {
    this.page = page;
    this.detalhes = page.locator('#detalhes-tarefa');
    this.titulo = page.locator('#detalhe-titulo');
    this.descricao = page.locator('#detalhe-descricao');
    this.status = page.locator('#detalhe-status');
    this.criadoPor = page.locator('#detalhe-criado-por');
    this.dataCriacao = page.locator('#detalhe-data');
    this.botaoEditar = page.locator('#editar-tarefa');
    this.mensagem = page.locator('#mensagem');
  }

  async aguardarDetalhes() {
    await this.detalhes.waitFor({ state: 'visible' });
  }

  async abrirEdicao() {
    await this.botaoEditar.click();
  }
}

module.exports = { VisualizarTarefaPage };
