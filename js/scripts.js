const favoritos = [];
let pokemonAtual = null;

const buscar = document.querySelector("#btnBuscar");
const campoBusca = document.querySelector("#campoBusca");

const imagemPokemon = document.querySelector("#sprite");
const nomePokemon = document.querySelector("#nome");
const numeroPokemon = document.querySelector("#numero");

const error = document.querySelector("#erro");
const cardPokemon = document.querySelector("#cardPokemon");

const coresTipos = {
  fire: "#f08030",
  water: "#6890f0",
  grass: "#78c850",
  electric: "#f8d030",
  psychic: "#f85888",
  ice: "#98d8d8",
  dragon: "#7038f8",
  dark: "#705848",
  fairy: "#ee99ac",
  normal: "#a8a878",
  fighting: "#c03028",
  flying: "#a890f0",
  poison: "#a040a0",
  ground: "#e0c068",
  rock: "#b8a038",
  bug: "#a8b820",
  ghost: "#705898",
  steel: "#b8b8d0",
};

async function buscarPokemon() {
  try {
    const resposta = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${campoBusca.value}`,
    );
    const dados = await resposta.json();

    preencherCard(dados);
  } catch {
    error.classList.remove("escondido");
    error.textContent = "Não encontramos o resultado.";
    cardPokemon.classList.add("escondido");
  }
}

function preencherCard(dados) {
  cardPokemon.classList.remove("escondido");
  error.classList.add("escondido");

  imagemPokemon.src = dados.sprites.front_default;
  imagemPokemon.alt = dados.name;
  nomePokemon.textContent = dados.name;
  numeroPokemon.textContent = `#${dados.id}`;

  const tipos = document.querySelector("#tipos");
  tipos.innerHTML = "";

  dados.types.forEach((item) => {
    const span = document.createElement("span");
    span.textContent = item.type.name;
    span.classList.add("tipo");
    span.style.background = coresTipos[item.type.name] || "#888";
    tipos.appendChild(span);
  });

  const divStats = document.querySelector(".stats");
  divStats.innerHTML = "";
  divStats.innerHTML += criarStat("HP", dados.stats[0].base_stat);
  divStats.innerHTML += criarStat("Ataque", dados.stats[1].base_stat);
  divStats.innerHTML += criarStat("Defesa", dados.stats[2].base_stat);
  divStats.innerHTML += criarStat("Velocidade", dados.stats[5].base_stat);

  pokemonAtual = dados;
}

function getCorStat(valor) {
  if (valor < 50) return "#e74c3c";
  if (valor < 100) return "#f1c40f";
  return "#2ecc71";
}

function criarStat(label, valor) {
  const largura = (valor / 255) * 100;
  const cor = getCorStat(valor);

  return `
    <div class="stat-linha">
      <span class="stat-label">${label}</span>
      <div class="stat-barra-fundo">
        <div class="stat-barra-preenchimento" 
             style="width: ${largura}%; background: ${cor};">
        </div>
      </div>
      <span class="stat-valor">${valor}</span>
    </div>
  `;
}

function favoritar() {
  if (!pokemonAtual) return;

  const jaFavoritado = favoritos.find((p) => p.id === pokemonAtual.id);

  if (jaFavoritado) {
    const index = favoritos.findIndex((p) => p.id === pokemonAtual.id);
    favoritos.splice(index, 1);
    document.querySelector("#btnFavoritar").textContent = "Favoritar ♡";
  } else {
    favoritos.push(pokemonAtual);
    document.querySelector("#btnFavoritar").textContent = "Favoritado ✓";
  }

  renderizarFavoritos();
}

function renderizarFavoritos() {
  const lista = document.querySelector("#listaFavoritos");
  const titulo = document.querySelector("#tituloFavoritos");

  lista.innerHTML = "";

  if (favoritos.length === 0) {
    titulo.classList.add("escondido");
    return;
  }

  titulo.classList.remove("escondido");

  favoritos.forEach((pokemon) => {
    lista.innerHTML += `
      <div class="favorito-item">
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
        <span>${pokemon.name}</span>
        <button onclick="removerFavorito(${pokemon.id})">✕</button>
      </div>
    `;
  });
}

function removerFavorito(id) {
  const index = favoritos.findIndex((p) => p.id === id);
  favoritos.splice(index, 1);

  if (pokemonAtual && pokemonAtual.id === id) {
    document.querySelector("#btnFavoritar").textContent = "Favoritar ♡";
  }

  renderizarFavoritos();
}

buscar.addEventListener("click", () => buscarPokemon());
campoBusca.addEventListener("keydown", (e) => {
  if (e.key === "Enter") buscarPokemon();
});
document
  .querySelector("#btnFavoritar")
  .addEventListener("click", () => favoritar());
