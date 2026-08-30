const form = document.getElementById("form-tarefa");
const titulo = document.getElementById("titulo-tarefa");
const descricao = document.getElementById("descricao-tarefa");
const botaoSalvar = document.getElementById("salvar-tarefa");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const tituloNormalizado = titulo.value.trim();
  const descricaoNormalizada = descricao.value.trim();

  if (!tituloNormalizado) {
    mostrarMensagem("O título é obrigatório.", "error");
    titulo.focus();
    return;
  }

  botaoSalvar.disabled = true;
  botaoSalvar.textContent = "Salvando...";

  const { error } = await window.dbClient
    .from("tarefas")
    .insert({
      titulo: tituloNormalizado,
      descricao: descricaoNormalizada || null,
      status: "pendente"
    });

  botaoSalvar.disabled = false;
  botaoSalvar.textContent = "Salvar";

  if (error) {
    mostrarMensagem(`Erro ao cadastrar tarefa: ${error.message}`, "error");
    return;
  }

  window.location.href = "index.html?resultado=cadastro-sucesso";
});
