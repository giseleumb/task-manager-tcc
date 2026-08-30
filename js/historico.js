const listaHistorico =
  document.getElementById("lista-historico");

const tabelaHistorico =
  document.getElementById("tabela-historico");

const carregando =
  document.getElementById("carregando");

const historicoVazio =
  document.getElementById("historico-vazio");


function formatarAcao(acao) {

  const nomes = {
    CRIADA: "Criada",
    EDITADA: "Editada",
    CONCLUIDA: "Concluída",
    REABERTA: "Reaberta",
    EXCLUIDA: "Excluída"
  };

  return nomes[acao] ?? acao;
}


async function carregarHistorico() {

  carregando.classList.remove("hidden");

  tabelaHistorico.classList.add("hidden");

  historicoVazio.classList.add("hidden");


  const { data, error } = await window.dbClient
    .from("historico_tarefas")
    .select("*")
    .order("data_evento", {
      ascending: false
    });


  carregando.classList.add("hidden");


  if (error) {

    mostrarMensagem(
      `Erro ao carregar histórico: ${error.message}`,
      "error"
    );

    return;

  }


  if (!data || data.length === 0) {

    historicoVazio.classList.remove("hidden");

    return;

  }


  listaHistorico.innerHTML =
    data
      .map((registro) => {

        return `
          <tr>

            <td>
              ${formatarData(registro.data_evento)}
            </td>

            <td>
              ${escaparHtml(registro.titulo_tarefa)}
            </td>

            <td>
              <span
                class="history-badge history-${registro.acao.toLowerCase()}"
              >
                ${formatarAcao(registro.acao)}
              </span>
            </td>

            <td>
              ${escaparHtml(
                registro.autor_tarefa ?? "Não informado"
              )}
            </td>

            <td>
              ${escaparHtml(
                registro.detalhes ?? "-"
              )}
            </td>

          </tr>
        `;

      })
      .join("");


  tabelaHistorico.classList.remove("hidden");

}


carregarHistorico();