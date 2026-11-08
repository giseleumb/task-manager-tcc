class ListaPage {
  constructor(page) {
    this.page = page;
    this.botaoNovaTarefa = page.locator('#botao-nova-tarefa');
    this.botaoHistorico = page.getByRole('link', { name: 'Histórico', exact: true });
    this.tabelaTarefas = page.locator('#tabela-tarefas');
    this.listaTarefas = page.locator('#lista-tarefas');
    this.mensagem = page.locator('#mensagem');
    this.modal = page.getByRole('dialog');
  }

  async abrir() {
    await this.page.goto('./');
  }

  async abrirNovaTarefa() {
    await this.botaoNovaTarefa.click();
  }

  async abrirHistorico() {
    await this.botaoHistorico.click();
  }

  linhaDaTarefa(titulo) {
    return this.listaTarefas.locator('tr').filter({
      has: this.page.getByRole('cell', { name: titulo, exact: true })
    });
  }

  statusDaTarefa(titulo) {
    return this.linhaDaTarefa(titulo).locator('td').nth(1);
  }

  autorDaTarefa(titulo) {
    return this.linhaDaTarefa(titulo).locator('td').nth(2);
  }

  dataCriacaoDaTarefa(titulo) {
    return this.linhaDaTarefa(titulo).locator('td').nth(3);
  }

  botaoConcluir(titulo) {
    return this.linhaDaTarefa(titulo).getByRole('button', {
      name: 'Concluir', exact: true
    });
  }

  botaoReabrir(titulo) {
    return this.linhaDaTarefa(titulo).getByRole('button', {
      name: 'Reabrir', exact: true
    });
  }

  botaoExcluir(titulo) {
    return this.linhaDaTarefa(titulo).getByRole('button', {
      name: 'Excluir', exact: true
    });
  }

  linkVer(titulo) {
    return this.linhaDaTarefa(titulo).getByRole('link', {
      name: 'Ver', exact: true
    });
  }

  linkEditar(titulo) {
    return this.linhaDaTarefa(titulo).getByRole('link', {
      name: 'Editar', exact: true
    });
  }

  async visualizarTarefa(titulo) {
    await this.linkVer(titulo).click();
  }

  async editarTarefa(titulo) {
    await this.linkEditar(titulo).click();
  }

  async solicitarConclusao(titulo) {
    await this.botaoConcluir(titulo).click();
  }

  async solicitarReabertura(titulo) {
    await this.botaoReabrir(titulo).click();
  }

  async solicitarExclusao(titulo) {
    await this.botaoExcluir(titulo).click();
  }

  async confirmarModal() {
    await this.modal.locator('[data-modal-confirmar]').click();
  }

  async cancelarModal() {
    await this.modal.locator('[data-modal-cancelar]').click();
  }

  async recarregar() {
    await this.page.reload();
  }
}

module.exports = { ListaPage };
