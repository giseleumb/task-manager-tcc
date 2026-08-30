const id = obterParametroId();
const carregando = document.getElementById("carregando");
const detalhes = document.getElementById("detalhes-tarefa");

async function carregarTarefa() {
  if (!id) {
    carregando.classList.add("hidden");
    mostrarMensagem("Identificador da tarefa não informado.", "error");
    return;
  }

  const { data, error } = await window.dbClient
    .from("tarefas")
    .select("*")
    .eq("id", id)
    .single();

  carregando.classList.add("hidden");

  if (error) {
    mostrarMensagem(`Não foi possível carregar a tarefa: ${error.message}`, "error");
    return;
  }

  document.getElementById("detalhe-titulo").textContent = data.titulo;
  document.getElementById("detalhe-descricao").textContent = data.descricao;

  const status = document.getElementById("detalhe-status");
  status.textContent = data.status === "concluida" ? "Concluída" : "Pendente";
  if (data.status === "concluida") {
    status.classList.add("status-concluida");
  }

  document.getElementById("detalhe-criado-por").textContent =
    data.criado_por || "Não informado";

  document.getElementById("detalhe-data").textContent =
    formatarData(data.data_criacao);

  document.getElementById("editar-tarefa").href =
    `editar.html?id=${encodeURIComponent(id)}`;

  const params = new URLSearchParams(window.location.search);
  if (params.get("resultado") === "edicao-sucesso") {
    mostrarMensagem("Tarefa editada com sucesso.", "success");
  }

  detalhes.classList.remove("hidden");
}

carregarTarefa();
