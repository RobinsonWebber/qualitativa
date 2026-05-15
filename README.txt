AVALIAÇÃO QUALITATIVA - SUPABASE

Esta versão troca Apps Script/Sheets por Supabase.

A tabela alunos será reaproveitada:

alunos
- id
- nome
- turma
- ativo
- created_at

Nova tabela criada pelo SQL:

avaliacoes_qualitativas
- id
- aluno_id
- nome
- turma
- ano_letivo
- trimestre
- dados_json
- nota_final
- created_at
- updated_at

REGRA ANTI-DUPLICAÇÃO:

aluno_id + ano_letivo + trimestre

Se já existir, atualiza.
Se não existir, cria.

ARQUIVOS:

- index.html
- style.css
- dados.js
- supabase.js
- app.js
- supabase_avaliacao_qualitativa.sql

COMO CONFIGURAR:

1. No Supabase, abra SQL Editor.
2. Rode o arquivo:
   supabase_avaliacao_qualitativa.sql

3. Confira se a tabela alunos já tem dados.

4. Se estiver testando sem login, desative RLS nas tabelas:
   - alunos
   - avaliacoes_qualitativas

5. Abra supabase.js e configure:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY

6. Rode o projeto no navegador.

IMPORTANTE:

No dados.js, as chaves de atividadesPorTurma precisam ser iguais ao campo turma da tabela alunos.

Exemplo:
Se aluno.turma = 31, use:

atividadesPorTurma: {
  "31": [...]
}
