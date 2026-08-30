alter table public.tarefas
  add column if not exists criado_por text;

update public.tarefas
set criado_por = 'Não informado'
where criado_por is null or trim(criado_por) = '';

update public.tarefas
set descricao = 'Sem descrição'
where descricao is null or trim(descricao) = '';

alter table public.tarefas
  alter column descricao set not null,
  alter column criado_por set not null;

alter table public.tarefas
  drop constraint if exists tarefas_descricao_nao_vazia;

alter table public.tarefas
  add constraint tarefas_descricao_nao_vazia
  check (char_length(trim(descricao)) > 0);

alter table public.tarefas
  drop constraint if exists tarefas_criado_por_nao_vazio;

alter table public.tarefas
  add constraint tarefas_criado_por_nao_vazio
  check (char_length(trim(criado_por)) > 0);
