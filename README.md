# Gerenciador de Tarefas — Aplicação-alvo do TCC

Aplicação web CRUD simples para o experimento de comparação entre scripts
monolíticos e Page Object Model (POM) com Playwright.

## Escopo funcional

A versão base contempla:

- cadastro de tarefas;
- validação do campo obrigatório `título`;
- listagem de tarefas;
- consulta dos dados de uma tarefa;
- edição;
- alteração de status entre pendente e concluída;
- exclusão com confirmação;
- atualização da listagem após operações de CRUD.

## Tecnologias

- HTML
- CSS
- JavaScript
- Supabase (PostgreSQL + Data API)
- posteriormente: Playwright

## 1. Criar o projeto no Supabase

1. Crie um projeto no Supabase.
2. Abra o **SQL Editor**.
3. Copie e execute o conteúdo de `supabase/schema.sql`.
4. No painel do projeto, obtenha:
   - Project URL
   - Publishable key

## 2. Configurar a aplicação

Abra:

`js/supabaseClient.js`

Substitua:

```js
const SUPABASE_URL = "COLE_AQUI_A_URL_DO_PROJETO";
const SUPABASE_PUBLISHABLE_KEY = "COLE_AQUI_A_PUBLISHABLE_KEY";
```

pelos dados do seu projeto.

Nunca use a `secret key` ou `service_role` no frontend.

## 3. Executar

Como é uma aplicação estática, você pode:

- usar a extensão Live Server no VS Code;
- hospedar no GitHub Pages;
- hospedar no Netlify/Vercel;
- usar qualquer servidor HTTP estático.

Evite abrir apenas com `file://`, porque alguns navegadores impõem limitações que
podem atrapalhar as chamadas HTTP.

## 4. Casos de teste previstos no TCC

- CT01 — Criação de tarefa
- CT02 — Validação de formulário
- CT03 — Listagem
- CT04 — Consulta
- CT05 — Edição
- CT06 — Alteração de status
- CT07 — Exclusão
- CT08 — Verificação após exclusão

## 5. Relação com o experimento

Primeiro esta versão deverá ser validada manualmente e congelada no Git como a
**versão base**. Depois serão implementadas duas suítes Playwright equivalentes:

1. scripts monolíticos;
2. scripts usando Page Object Model.

Somente depois serão introduzidos os cenários controlados de manutenção.
