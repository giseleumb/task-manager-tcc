class EditarTarefaPage {
  constructor(page) {
    this.page = page;
    this.formulario = page.locator('#form-tarefa');
    this.titulo = page.locator('#titulo-tarefa');
    this.descricao = page.locator('#descricao-tarefa');
    this.criadoPor = page.locator('#criado-por');
    this.botaoSalvar = page.locator('#salvar-edicao');
    this.mensagem = page.locator('#mensagem');
    this.modal = page.getByRole('dialog');
  }

  async aguardarFormulario() {
    await this.formulario.waitFor({ state: 'visible' });
  }

  async preencherAlteracoes({ titulo, descricao } = {}) {
    if (titulo !== undefined) await this.titulo.fill(titulo);
    if (descricao !== undefined) await this.descricao.fill(descricao);
  }

  async solicitarSalvar() {
    await this.botaoSalvar.click();
  }

  async confirmarEdicao() {
    await this.modal.locator('[data-modal-confirmar]').click();
  }

  async cancelarEdicao() {
    await this.modal.locator('[data-modal-cancelar]').click();
  }

  // Usar somente nos cenários de edição válida e confirmada.
  async salvarAlteracoes(dados) {
    await this.preencherAlteracoes(dados);
    await this.solicitarSalvar();
    await this.confirmarEdicao();
  }

  async recarregar() {
    await this.page.reload();
    await this.aguardarFormulario();
  }
}

module.exports = { EditarTarefaPage };
