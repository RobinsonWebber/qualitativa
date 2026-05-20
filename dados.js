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
      "Atividade 1 - Armazenamento e memória",
      "Atividade 2 - Editor de texto",
      "Atividade 3 - Arquivos e pastas"
    ],

    "32": [
      "Atividade 1 - Armazenamento e memória",
      "Atividade 2 - Editor de texto"
    ],

    "33": [
      "Atividade 1 - Armazenamento e memória",
      "Atividade 2 - Editor de texto",
      "Atividade 3 - Arquivos e pastas"
    ],

    "34": [
      "Atividade 1 - Armazenamento e memória",
      "Atividade 2 - Editor de texto"
    ],

    "41": [
      "Atividade 1 - Codificação binária",
      "Atividade 2 - Tabela ASCII",
      "Atividade 3 - Armazenamento de dados",
      "Atividade 4 - Revisão prática"
    ],

    "42": [
      "Atividade 1 - Codificação binária",
      "Atividade 2 - Tabela ASCII",
      "Atividade 3 - Armazenamento de dados"
    ],

    "43": [
      "Atividade 1 - Codificação binária",
      "Atividade 2 - Tabela ASCII",
      "Atividade 3 - Armazenamento de dados"
    ]
  }
};
