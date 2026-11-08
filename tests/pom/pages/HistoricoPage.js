class HistoricoPage {
  constructor(page) {
    this.page = page;
    this.tabelaHistorico = page.locator('#tabela-historico');
    this.listaHistorico = page.locator('#lista-historico');
    this.historicoVazio = page.locator('#historico-vazio');
    this.mensagem = page.locator('#mensagem');
  }

  async abrir() {
    await this.page.goto('./historico.html');
  }

  eventosDaTarefa(titulo) {
    return this.listaHistorico.locator('tr').filter({
      has: this.page.getByRole('cell', { name: titulo, exact: true })
    });
  }

  eventoDaTarefa(titulo, acao) {
    return this.eventosDaTarefa(titulo).filter({
      has: this.page.getByRole('cell', { name: acao, exact: true })
    });
  }

  dataDoEvento(titulo, acao) {
    return this.eventoDaTarefa(titulo, acao).locator('td').nth(0);
  }

  autorDoEvento(titulo, acao) {
    return this.eventoDaTarefa(titulo, acao).locator('td').nth(3);
  }

  detalhesDoEvento(titulo, acao) {
    return this.eventoDaTarefa(titulo, acao).locator('td').nth(4);
  }
}

module.exports = { HistoricoPage };
