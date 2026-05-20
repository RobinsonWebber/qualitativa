/*
  DADOS FIXOS DO SISTEMA

  Aqui você configura:
  - anos e trimestres
  - conceitos
  - avaliações fixas para todas as turmas
  - atividades variáveis por turma

  Os alunos NÃO ficam mais aqui.
  Eles serão carregados da tabela "alunos" do Supabase.
*/

const DADOS = {
  anos: ["2026"],

  trimestres: ["1º trimestre", "2º trimestre", "3º trimestre"],

  conceitos: {
    A: 10,
    B: 5,
    C: 0
  },

  avaliacoesFixas: [
    "Responsabilidade/Comprometimento",
    "Participação",
    "Pontualidade",
    "Assiduidade"
  ],

  /*
    Atividades variáveis por turma.
    A chave precisa ser igual ao valor da turma na tabela alunos.

    Exemplo:
    Se na tabela alunos a turma estiver como "31", use "31".
  */
  atividadesPorTurma: {
    "31": [
      "Atividade 1 - Editor de texto",
      "Atividade 2 - internet e navegadores",
      "Atividade 3 - Segurança digital"
    ],

    "32": [
      "Atividade 1 - Editor de texto",
      "Atividade 2 - internet e navegadores",
      "Atividade 3 - Segurança digital"
    ],

    "33": [
      "Atividade 1 - Editor de texto",
      "Atividade 2 - internet e navegadores",
      "Atividade 3 - Segurança digital"
    ],

    "34": [
      "Atividade 1 - Editor de texto",
      "Atividade 2 - internet e navegadores",
      "Atividade 3 - Segurança digital"
    ],

    "41": [
      "Atividade 1 - Editor de texto",
      "Atividade 2 - Planilhas",
      "Atividade 3 - Pesquisa na internet"
    ],

    "42": [
      "Atividade 1 - Editor de texto",
      "Atividade 2 - Planilhas",
      "Atividade 3 - Pesquisa na internet"
    ],

    "43": [
      "Atividade 1 - Editor de texto",
      "Atividade 2 - Planilhas",
      "Atividade 3 - Pesquisa na internet"
    ]
  }
};
