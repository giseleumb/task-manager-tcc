const id = obterParametroId();
const carregando = document.getElementById("carregando");
const form = document.getElementById("form-tarefa");
const titulo = document.getElementById("titulo-tarefa");
const descricao = document.getElementById("descricao-tarefa");
const criadoPor = document.getElementById("criado-por");
const botaoSalvar = document.getElementById("salvar-edicao");

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

  titulo.value = data.titulo ?? "";
  descricao.value = data.descricao ?? "";
  criadoPor.value = data.criado_por ?? "Não informado";
  form.classList.remove("hidden");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const tituloNormalizado = titulo.value.trim();
  const descricaoNormalizada = descricao.value.trim();

  if (!tituloNormalizado) {
    mostrarMensagem("O título é obrigatório.", "error");
    titulo.focus();
    return;
  }

  if (!descricaoNormalizada) {
    mostrarMensagem("A descrição é obrigatória.", "error");
    descricao.focus();
    return;
  }

  const confirmou = await abrirModalConfirmacao({
    titulo: "Confirmar edição",
    mensagem: "Deseja salvar as alterações realizadas nesta tarefa?",
    confirmarTexto: "Salvar alterações"
  });

  if (!confirmou) return;

  botaoSalvar.disabled = true;
  botaoSalvar.textContent = "Salvando...";

  const { error } = await window.dbClient
    .from("tarefas")
    .update({
      titulo: tituloNormalizado,
      descricao: descricaoNormalizada
    })
    .eq("id", id);

  botaoSalvar.disabled = false;
  botaoSalvar.textContent = "Salvar alterações";

  if (error) {
    mostrarMensagem(`Erro ao editar tarefa: ${error.message}`, "error");
    return;
  }

  window.location.href = `visualizar.html?id=${encodeURIComponent(id)}&resultado=edicao-sucesso`;
});

carregarTarefa();
