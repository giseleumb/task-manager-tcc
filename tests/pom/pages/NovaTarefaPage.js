class NovaTarefaPage {
  constructor(page) {
    this.page = page;
    this.formulario = page.locator('#form-tarefa');
    this.titulo = page.locator('#titulo-tarefa');
    this.descricao = page.locator('#descricao-tarefa');
    this.criadoPor = page.locator('#criado-por');
    this.botaoSalvar = page.locator('#salvar-tarefa');
    this.mensagem = page.locator('#mensagem');
  }

  async abrir() {
    await this.page.goto('./nova.html');
  }

  async preencherFormulario({ titulo, descricao, criadoPor } = {}) {
    if (titulo !== undefined) await this.titulo.fill(titulo);
    if (descricao !== undefined) await this.descricao.fill(descricao);
    if (criadoPor !== undefined) await this.criadoPor.fill(criadoPor);
  }

  async salvar() {
    await this.botaoSalvar.click();
  }

  async cadastrar(dados) {
    await this.preencherFormulario(dados);
    await this.salvar();
  }
}

module.exports = { NovaTarefaPage };
