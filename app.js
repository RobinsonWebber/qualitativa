const turmaSelect = document.getElementById("turmaSelect");
const alunoSelect = document.getElementById("alunoSelect");
const filtroTurma = document.getElementById("filtroTurma");
const pesquisaAluno = document.getElementById("pesquisaAluno");
const anoSelect = document.getElementById("anoSelect");
const trimestreSelect = document.getElementById("trimestreSelect");
const itensContainer = document.getElementById("itensContainer");
const notaFinalEl = document.getElementById("notaFinal");
const mensagemEl = document.getElementById("mensagem");
const statusAlunoEl = document.getElementById("statusAluno");
const contadorRegistrosEl = document.getElementById("contadorRegistros");
const btnExcluir = document.getElementById("btnExcluir");

let alunos = [];
let alunosFiltrados = [];
let indiceAtual = 0;
let avaliacao = {};

function conferirSupabase() {
  if (typeof supabaseClient === "undefined") {
    throw new Error("supabaseClient não encontrado. Confira se supabase.js foi carregado antes do app.js.");
  }
}

function iniciar() {
  carregarAnosETrimestres();
  configurarEventos();
  carregarAlunosSupabase();
}

function configurarEventos() {
  btnExcluir.addEventListener("click", excluirAvaliacao);    
  filtroTurma.addEventListener("change", aplicarFiltros);
  pesquisaAluno.addEventListener("input", aplicarFiltros);

  turmaSelect.addEventListener("change", () => {
    filtroTurma.value = turmaSelect.value;
    aplicarFiltros();
  });

  alunoSelect.addEventListener("change", () => {
    const idSelecionado = alunoSelect.value;
    const novoIndice = alunosFiltrados.findIndex(aluno => String(aluno.id) === String(idSelecionado));
    if (novoIndice >= 0) indiceAtual = novoIndice;
    selecionarAlunoAtual();
  });

  anoSelect.addEventListener("change", () => {
    atualizarStatusAluno();
    selecionarAlunoAtual();
  });

  trimestreSelect.addEventListener("change", () => {
    atualizarStatusAluno();
    selecionarAlunoAtual();
  });

  document.getElementById("btnSalvar").addEventListener("click", salvarAvaliacao);
  document.getElementById("btnLimpar").addEventListener("click", limparConceitos);
  document.getElementById("btnAnterior").addEventListener("click", alunoAnterior);
  document.getElementById("btnProximo").addEventListener("click", proximoAluno);
  document.getElementById("btnLimparPesquisa").addEventListener("click", limparPesquisa);
  document.getElementById("btnRecarregarAlunos").addEventListener("click", carregarAlunosSupabase);
}

function carregarAnosETrimestres() {
  DADOS.anos.forEach(ano => {
    const option = document.createElement("option");
    option.value = ano;
    option.textContent = ano;
    anoSelect.appendChild(option);
  });

  DADOS.trimestres.forEach(trimestre => {
    const option = document.createElement("option");
    option.value = trimestre;
    option.textContent = trimestre;
    trimestreSelect.appendChild(option);
  });
}

async function carregarAlunosSupabase() {
  try {
    conferirSupabase();

    mensagemEl.textContent = "Carregando alunos do Supabase...";
    statusAlunoEl.textContent = "Carregando alunos...";

    const { data, error } = await supabaseClient
      .from("alunos")
      .select("id, nome, turma, ativo")
      .eq("ativo", true)
      .order("turma", { ascending: true })
      .order("nome", { ascending: true });

    if (error) throw error;

    alunos = (data || []).map(aluno => ({
      id: String(aluno.id),
      nome: String(aluno.nome),
      turma: String(aluno.turma)
    }));

    carregarTurmasNosSelects();
    aplicarFiltros();

    mensagemEl.textContent = "Alunos carregados com sucesso.";
  } catch (erro) {
    console.error("Erro ao carregar alunos:", erro);
    mensagemEl.textContent = "Erro ao carregar alunos. Confira supabase.js, RLS e a tabela alunos.";
    statusAlunoEl.textContent = "Erro ao carregar alunos";
  }
}

function carregarTurmasNosSelects() {
  const turmas = [...new Set(alunos.map(aluno => aluno.turma))].sort();

  turmaSelect.innerHTML = "";
  filtroTurma.innerHTML = '<option value="">Todas as turmas</option>';

  turmas.forEach(turma => {
    const option1 = document.createElement("option");
    option1.value = turma;
    option1.textContent = turma;
    turmaSelect.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = turma;
    option2.textContent = turma;
    filtroTurma.appendChild(option2);
  });

  if (turmas.length > 0) {
    turmaSelect.value = turmas[0];
    filtroTurma.value = turmas[0];
  }
}

function aplicarFiltros() {
  const termo = removerAcentos(pesquisaAluno.value.trim().toLowerCase());
  const turma = filtroTurma.value;

  alunosFiltrados = alunos.filter(aluno => {
    const nomeNormalizado = removerAcentos(aluno.nome.toLowerCase());
    const idNormalizado = String(aluno.id).toLowerCase();

    const passaNome = !termo || nomeNormalizado.includes(termo) || idNormalizado === termo;
    const passaTurma = !turma || aluno.turma === turma;

    return passaNome && passaTurma;
  });

  indiceAtual = 0;
  preencherSelectAlunos();
  selecionarAlunoAtual();
}

function preencherSelectAlunos() {
  alunoSelect.innerHTML = "";

  alunosFiltrados.forEach(aluno => {
    const option = document.createElement("option");
    option.value = aluno.id;
    option.textContent = aluno.nome;
    alunoSelect.appendChild(option);
  });

  contadorRegistrosEl.textContent = `${alunosFiltrados.length} aluno(s)`;
}

async function selecionarAlunoAtual() {
  if (alunosFiltrados.length === 0) {
    alunoSelect.innerHTML = "";
    statusAlunoEl.textContent = "Nenhum aluno encontrado";
    itensContainer.innerHTML = "";
    notaFinalEl.textContent = "-";
    atualizarBotoesNavegacao();
    return;
  }

  const aluno = alunosFiltrados[indiceAtual];

  alunoSelect.value = aluno.id;
  turmaSelect.value = aluno.turma;

  avaliacao = {};
  montarItens();
  atualizarStatusAluno();
  atualizarBotoesNavegacao();

  await carregarAvaliacaoSalvaSupabase();
}

function getAlunoAtual() {
  return alunosFiltrados[indiceAtual] || null;
}

function getItensAvaliativos() {
  const aluno = getAlunoAtual();
  const turma = aluno ? aluno.turma : "";
  const atividades = DADOS.atividadesPorTurma[turma] || [];

  return [
    ...DADOS.avaliacoesFixas.map(nome => ({ nome, tipo: "Avaliação fixa" })),
    ...atividades.map(nome => ({ nome, tipo: "Atividade da turma" }))
  ];
}

function montarItens() {
  itensContainer.innerHTML = "";

  getItensAvaliativos().forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "item";

    const nome = document.createElement("div");
    nome.className = "item-nome";
    nome.innerHTML = `${item.nome}<br><span class="item-tipo">${item.tipo}</span>`;

    const botoes = document.createElement("div");
    botoes.className = "conceitos";

    Object.keys(DADOS.conceitos).forEach(conceito => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "conceito-btn";
      btn.textContent = conceito;
      btn.dataset.item = item.nome;
      btn.dataset.conceito = conceito;

      btn.addEventListener("click", () => selecionarConceito(item.nome, conceito, itemDiv));

      botoes.appendChild(btn);
    });

    itemDiv.appendChild(nome);
    itemDiv.appendChild(botoes);
    itensContainer.appendChild(itemDiv);
  });

  calcularNota();
}

function selecionarConceito(item, conceito, itemDiv) {
  avaliacao[item] = conceito;

  itemDiv.querySelectorAll(".conceito-btn").forEach(btn => {
    btn.classList.toggle("ativo", btn.dataset.conceito === conceito);
  });

  calcularNota();
}

function aplicarAvaliacaoNaTela() {
  document.querySelectorAll(".conceito-btn").forEach(btn => {
    const item = btn.dataset.item;
    const conceito = btn.dataset.conceito;
    btn.classList.toggle("ativo", avaliacao[item] === conceito);
  });

  calcularNota();
}

function calcularNota() {
  const conceitosMarcados = Object.values(avaliacao);

  if (conceitosMarcados.length === 0) {
    notaFinalEl.textContent = "-";
    return null;
  }

  const soma = conceitosMarcados.reduce((total, conceito) => {
    return total + Number(DADOS.conceitos[conceito]);
  }, 0);

  const media = soma / conceitosMarcados.length;
  notaFinalEl.textContent = media.toFixed(2).replace(".", ",");

  return Number(media.toFixed(2));
}

async function carregarAvaliacaoSalvaSupabase() {
  const aluno = getAlunoAtual();

  if (!aluno) return;

  try {
    conferirSupabase();

    const { data, error } = await supabaseClient
      .from("avaliacoes_qualitativas")
      .select("id, aluno_id, turma, ano_letivo, trimestre, dados_json, nota_final, updated_at")
      .eq("aluno_id", Number(aluno.id))
      .eq("ano_letivo", anoSelect.value)
      .eq("trimestre", trimestreSelect.value)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      avaliacao = {};
      aplicarAvaliacaoNaTela();
      return;
    }

    avaliacao = data.dados_json || {};
    aplicarAvaliacaoNaTela();

    mensagemEl.textContent = "Avaliação carregada.";
  } catch (erro) {
    console.error("Erro ao carregar avaliação salva:", erro);
    mensagemEl.textContent = "Erro ao carregar avaliação salva.";
  }
}

function atualizarStatusAluno() {
  const aluno = getAlunoAtual();

  if (!aluno) {
    statusAlunoEl.textContent = "Selecione um aluno";
    return;
  }

  statusAlunoEl.textContent = `${indiceAtual + 1}/${alunosFiltrados.length} - ${aluno.nome} | Turma ${aluno.turma} | ${anoSelect.value} | ${trimestreSelect.value}`;
}

function atualizarBotoesNavegacao() {
  document.getElementById("btnAnterior").disabled = indiceAtual <= 0;
  document.getElementById("btnProximo").disabled =
    indiceAtual >= alunosFiltrados.length - 1 || alunosFiltrados.length === 0;
}

function alunoAnterior() {
  if (indiceAtual > 0) {
    indiceAtual--;
    selecionarAlunoAtual();
  }
}

function proximoAluno() {
  if (indiceAtual < alunosFiltrados.length - 1) {
    indiceAtual++;
    selecionarAlunoAtual();
  }
}

function limparPesquisa() {
  pesquisaAluno.value = "";
  filtroTurma.value = turmaSelect.value || "";
  aplicarFiltros();
}

function limparConceitos() {
  avaliacao = {};
  document.querySelectorAll(".conceito-btn").forEach(btn => btn.classList.remove("ativo"));
  calcularNota();
  mensagemEl.textContent = "Conceitos limpos na tela. Clique em salvar para atualizar o Supabase.";
}
async function excluirAvaliacao() {

  const aluno = getAlunoAtual();

  if (!aluno) {
    mensagemEl.textContent =
      "Selecione um aluno.";
    return;
  }

  const confirmar = confirm(
    `Excluir avaliação de ${aluno.nome}?`
  );

  if (!confirmar) return;

  try {

    conferirSupabase();

    mensagemEl.textContent =
      "Excluindo avaliação...";

    const { error } = await supabaseClient
      .from("avaliacoes_qualitativas")
      .delete()
      .eq("aluno_id", Number(aluno.id))
      .eq("ano_letivo", anoSelect.value)
      .eq("trimestre", trimestreSelect.value);

    if (error) throw error;

    avaliacao = {};

    document
      .querySelectorAll(".conceito-btn")
      .forEach(btn => {
        btn.classList.remove("ativo");
      });

    calcularNota();

    mensagemEl.textContent =
      "Avaliação excluída com sucesso.";

  } catch (erro) {

    console.error(
      "Erro ao excluir:",
      erro
    );

    mensagemEl.textContent =
      "Erro ao excluir avaliação.";
  }
}

async function salvarAvaliacao() {
  const aluno = getAlunoAtual();
  const notaFinal = calcularNota();

  if (!aluno) {
    mensagemEl.textContent = "Selecione um aluno.";
    return;
  }

  if (Object.keys(avaliacao).length === 0) {
    mensagemEl.textContent = "Marque pelo menos um conceito.";
    return;
  }

  const payload = {
    aluno_id: Number(aluno.id),
    nome: aluno.nome,
    turma: aluno.turma,
    ano_letivo: anoSelect.value,
    trimestre: trimestreSelect.value,
    dados_json: avaliacao,
    nota_final: notaFinal
  };

  try {
    conferirSupabase();
    mensagemEl.textContent = "Salvando no Supabase...";

    const { data, error } = await supabaseClient
      .from("avaliacoes_qualitativas")
      .upsert(payload, {
        onConflict: "aluno_id,ano_letivo,trimestre"
      })
      .select("id")
      .single();

    if (error) throw error;

    mensagemEl.textContent = data?.id
      ? "Avaliação salva/atualizada com sucesso."
      : "Avaliação salva com sucesso.";

    await carregarAvaliacaoSalvaSupabase();

  } catch (erro) {
    console.error("Erro ao salvar no Supabase:", erro);
    mensagemEl.textContent = "Erro ao salvar no Supabase: " + (erro.message || "erro desconhecido");
  }
}

function removerAcentos(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

iniciar();
