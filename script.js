// Dark mode

// function lightMode() {
//   const backgroundColor = document.querySelector("body");
//   const buttonTexto = document.querySelector(".light-mode");
//   const backgroundInfo1 = document.querySelector(".table");
//   const backgroundInfo2 = document.querySelector(".table2");
//   const backgroundInfo3 = document.querySelector(".inserir-dados");

//   backgroundColor.classList.add("light-body");
//   buttonTexto.innerHTML = "Dark mode";
//   backgroundInfo1.classList.add("light-mode-table");
//   backgroundInfo2.classList.add("light-mode-table2");
//   backgroundInfo3.classList.add("light-mode-inserir-dados");
// }

let contador = 0;

const transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
const dataMeses = JSON.parse(localStorage.getItem("transacoesData")) || {
  Janeiro: [],
  Fevereiro: [],
  Março: [],
  Abril: [],
  Maio: [],
  Junho: [],
  Julho: [],
  Agosto: [],
  Setembro: [],
  Outubro: [],
  Novembro: [],
  Dezembro: [],
};
const chaves = Object.keys(dataMeses);

function ordenarTransacoes(ordemTransacao) {
  const order = {
    Salário: 1,
    "Entrada-extra": 2,
    "Fatura-Kenzie": 3,
    "Fatura-externa": 4,
    "Fatura-interna-(PF)": 5,
    "Fatura-interna-(PJ)": 6,
    "Gastos-extras": 7,
  };

  return ordemTransacao.sort((a, b) => order[a.option] - order[b.option]);
}

// CRUD

// Create
let saldoTotal = 0;

function adicionarTransacao() {
  const tipoTransacao = document.getElementById("tipo-transacao").value;
  const valor = parseFloat(document.getElementById("valor").value);

  if (tipoTransacao === "entrada") {
    saldoTotal.entradas.push(valor);
  } else if (tipoTransacao === "despesa") {
    saldoTotal.saidas.push(valor);
  }

  atualizarSaldo();
}

// Read
function atualizarSaldo() {
  saldoTotal = 0;
  transacoes.forEach((it) => {
    if (it.tipo === "entrada") {
      saldoTotal = saldoTotal + it.valor;
    } else {
      saldoTotal = saldoTotal - it.valor;
    }
  });

  const somaTotal = document.querySelector(".saldo-dinamico");
  somaTotal.textContent = `${saldoTotal.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}`;

  if (saldoTotal >= 0.1) {
    somaTotal.classList.add("saldo-dinamico-verde");
    somaTotal.classList.remove("saldo-dinamico-vermelho");
  } else if (saldoTotal < 0) {
    somaTotal.classList.add("saldo-dinamico-vermelho");
    somaTotal.classList.remove("saldo-dinamico-verde");
  }
}

atualizarSaldo();

function Transacao(descricao, valor, tipo, opcao) {
  this.descricao = descricao;
  this.valor = valor;
  this.tipo = tipo;
  this.option = opcao;
}

function adicionarTransacaoComDescricao() {
  const descricaoInput = document.getElementById("descricao");
  const descricao = descricaoInput.value;
  const valorInput = document.getElementById("valor");
  const valor = parseFloat(valorInput.value);
  const tipoTransacao = document.getElementById("tipo-transacao");
  const categoriaTransacao = document.getElementById("categoria-transacao");

  if (valor < 0) {
    valorInput.value = 0;
    alert("Insira um número válido");
    return;
  }

  if (descricao.trim() === "") {
    alert("Por favor, insira uma descrição.");
    return;
  } else if (isNaN(valor)) {
    alert("Por favor, insira um número válido para o valor.");
    return;
  }

  if (categoriaTransacao.value === "") {
    alert("Por favor, selecione uma categoria.");
    return;
  }

  if (tipoTransacao.value === "") {
    alert("Por favor, selecione o tipo de transação (entrada ou saída).");
    return;
  }

  const transacao = new Transacao(
    descricao,
    valor,
    tipoTransacao.value,
    categoriaTransacao.value
  );
  transacoes.push(transacao);
  dataMeses[chaves[contador]].push(transacao);

  descricaoInput.value = "";
  valorInput.value = "";
  categoriaTransacao.value = "";
  tipoTransacao.value = "";

  ordenarTransacoes(dataMeses[chaves[contador]]);
  atualizarSaldo();
  exibirTransacoes();

  localStorage.setItem("transacoes", JSON.stringify(transacoes));
  localStorage.setItem("transacoesData", JSON.stringify(dataMeses));
}

function exibirTransacoes() {
  const infoTransacoes = document.querySelector(".gasto-detalhado");
  infoTransacoes.innerHTML = "";

  const ul = document.createElement("ul");
  ul.classList.add("vitrine");
  ul.innerHTML = "";
  dataMeses[chaves[contador]].forEach((transacao, index) => {
    const li = document.createElement("li");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "x";
    deleteButton.classList.add("botao-excluir");

    deleteButton.onclick = function () {
      deletarTransacao(index);
    };

    const content = document.createElement("span");
    content.textContent = `${transacao.option.replace(/-/g, " ")} - ${
      transacao.descricao
    }, ${transacao.valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}`;

    const iconeFlecha = document.createElement("span");
    iconeFlecha.textContent = "";
    iconeFlecha.classList.add("arrow");

    const iconesDisplay = document.createElement("div");
    iconesDisplay.classList.add("div-icones");

    iconesDisplay.appendChild(iconeFlecha);
    iconesDisplay.appendChild(content);
    li.appendChild(iconesDisplay);
    li.appendChild(deleteButton);
    ul.appendChild(li);

    changeBackgroundColor(iconeFlecha, transacao.option);

    if (transacao.tipo === "entrada") {
      li.classList.add("gasto-detalhado-entrada");
      li.classList.remove("gasto-detalhado-saida");
    } else {
      li.classList.add("gasto-detalhado-saida");
      li.classList.remove("gasto-detalhado-entrada");
    }
  });
  infoTransacoes.appendChild(ul);
  ordenarTransacoes(dataMeses[chaves[contador]]);
}

exibirTransacoes();

function changeBackgroundColor(lista, categoria) {
  if (categoria === "Salário") {
    lista.style.borderBottom = `12px solid #ffcc00`;
  } else if (categoria === "Entrada-extra") {
    lista.style.borderBottom = `12px solid #99ccff`;
  } else if (categoria === "Fatura-Kenzie") {
    lista.style.borderBottom = `12px solid #ff9999`;
  } else if (categoria === "Fatura-externa") {
    lista.style.borderBottom = `12px solid #66cc99`;
  } else if (categoria === "Fatura-interna-(PF)") {
    lista.style.borderBottom = `12px solid #ff66cc`;
  } else if (categoria === "Fatura-interna-(PJ)") {
    lista.style.borderBottom = `12px solid #9966cc`;
  } else if (categoria === "Gastos-extras") {
    lista.style.borderBottom = `12px solid #cc9966`;
  }
  console.log(transacoes);
}

const alterarMes1 = document.querySelector(".display-mes");
alterarMes1.innerText = "Janeiro";

function passarMes() {
  const alterarMes = document.querySelector(".display-mes");
  if (contador < 11) {
    contador++;
    alterarMes.innerText = chaves[contador];
    exibirTransacoes();
  }
}

const btnPassarMes = document.querySelector(".btn-alterar-mes");
btnPassarMes.addEventListener("click", passarMes);

function voltarMes() {
  const alterarMes = document.querySelector(".display-mes");
  if (contador > 0) {
    contador--;
    alterarMes.innerText = chaves[contador];
    exibirTransacoes();
  }
}

const btnVoltarMes = document.querySelector(".btn-voltar-mes");
btnVoltarMes.addEventListener("click", voltarMes);

// Delete
function deletarTransacao(index) {
  const transacaoExcluida = dataMeses[chaves[contador]][index];

  if (transacaoExcluida.tipo === "entrada") {
    saldoTotal -= transacaoExcluida.valor;
  } else {
    saldoTotal += transacaoExcluida.valor;
  }

  dataMeses[chaves[contador]].splice(index, 1);
  transacoes.splice(index, 1);

  atualizarSaldo();
  exibirTransacoes();

  localStorage.setItem("transacoesData", JSON.stringify(dataMeses));
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

// Gráficos
const ctx = document.getElementById("grafico-dinamico");

const cores = ["#ffcc00", "#99ccff", "#ff9999", "#66cc99"];

const data = {
  labels: ["Salário", "Entrada extra", "Contas", "Lazer"],
  datasets: [
    {
      label: "# of Votes",
      data: [22, 18, 12, 5],
      borderWidth: 4,
      backgroundColor: cores,
    },
  ],
};

const config = {
  type: "bar",
  data: data,
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
};

new Chart(ctx, config);

// let indiceGrafico = 0;

// const graficos = [];

// const ctx = document.getElementById("grafico-dinamico").getContext("2d");

// function exibirGrafico(indice) {
//   const graficoAtual = graficos[indice];
//   new Chart(ctx, {
//     type: "bar",
//     data: {
//       labels: graficoAtual.labels,
//       datasets: [
//         {
//           label: graficoAtual.label,
//           data: graficoAtual.data,
//         },
//       ],
//     },
// //   });
// }

// function voltarGrafico() {
//   if (indiceGrafico > 0) {
//     indiceGrafico--;
//     atualizarGrafico();
//   }
// }

// function passarGrafico() {
//   if (indiceGrafico < graficos.length - 1) {
//     indiceGrafico++;
//     atualizarGrafico();
//   }
// }

// function atualizarGrafico() {
//   if (Chart.instances.length > 0) {
//     Chart.instances[0].destroy();
//   }
//   exibirGrafico(indiceGrafico);
// }

// exibirGrafico(indiceGrafico);

// const btnVoltarGrafico = document.querySelector(".btn-voltar-grafico");
// btnVoltarGrafico.addEventListener("click", voltarGrafico);

// const btnAlterarGrafico = document.querySelector(".btn-alterar-grafico");
// btnAlterarGrafico.addEventListener("click", passarGrafico);
