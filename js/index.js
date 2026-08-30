const lista = document.getElementById("lista-tarefas");
const tabela = document.getElementById("tabela-tarefas");
const carregando = document.getElementById("carregando");
const estadoVazio = document.getElementById("estado-vazio");

async function carregarTarefas() {
  carregando.classList.remove("hidden");
  tabela.classList.add("hidden");
  estadoVazio.classList.add("hidden");

  const { data, error } = await window.dbClient
    .from("tarefas")
    .select("*")
    .order("data_criacao", { ascending: false });

  carregando.classList.add("hidden");

  if (error) {
    mostrarMensagem(`Erro ao carregar tarefas: ${error.message}`, "error");
    return;
  }

  if (!data || data.length === 0) {
    estadoVazio.classList.remove("hidden");
    return;
  }

  lista.innerHTML = data.map((tarefa) => {
    const proximoStatus = tarefa.status === "concluida" ? "pendente" : "concluida";
    const textoStatus = tarefa.status === "concluida" ? "Concluída" : "Pendente";
    const textoAcaoStatus = tarefa.status === "concluida" ? "Reabrir" : "Concluir";

    return `
      <tr data-task-id="${tarefa.id}">
        <td>${escaparHtml(tarefa.titulo)}</td>
        <td>
          <span class="status-badge ${tarefa.status === "concluida" ? "status-concluida" : ""}">
            ${textoStatus}
          </span>
        </td>
        <td>${formatarData(tarefa.data_criacao)}</td>
        <td>
          <div class="actions">
            <a class="button secondary small" data-action="visualizar"
               href="visualizar.html?id=${tarefa.id}">Ver</a>

            <a class="button secondary small" data-action="editar"
               href="editar.html?id=${tarefa.id}">Editar</a>

            <button class="button secondary small"
                    data-action="status"
                    data-id="${tarefa.id}"
                    data-status="${proximoStatus}">
              ${textoAcaoStatus}
            </button>

            <button class="button danger small"
                    data-action="excluir"
                    data-id="${tarefa.id}">
              Excluir
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  tabela.classList.remove("hidden");
}

async function alterarStatus(id, status) {
  const { error } = await window.dbClient
    .from("tarefas")
    .update({ status })
    .eq("id", id);

  if (error) {
    mostrarMensagem(`Erro ao alterar status: ${error.message}`, "error");
    return;
  }

  mostrarMensagem("Status atualizado com sucesso.", "success");
  await carregarTarefas();
}

async function excluirTarefa(id) {
  const confirmou = window.confirm("Deseja realmente excluir esta tarefa?");
  if (!confirmou) return;

  const { error } = await window.dbClient
    .from("tarefas")
    .delete()
    .eq("id", id);

  if (error) {
    mostrarMensagem(`Erro ao excluir tarefa: ${error.message}`, "error");
    return;
  }

  mostrarMensagem("Tarefa excluída com sucesso.", "success");
  await carregarTarefas();
}

document.addEventListener("click", async (event) => {
  const alvo = event.target.closest("[data-action]");
  if (!alvo) return;

  const acao = alvo.dataset.action;

  if (acao === "status") {
    await alterarStatus(alvo.dataset.id, alvo.dataset.status);
  }

  if (acao === "excluir") {
    await excluirTarefa(alvo.dataset.id);
  }
});

carregarTarefas();
