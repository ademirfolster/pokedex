const favoritos = [];
let pokemonAtual = null;

const buscar = document.querySelector("#btnBuscar");
const campoBusca = document.querySelector("#campoBusca");

const imagemPokemon = document.querySelector("#sprite");
const nomePokemon = document.querySelector("#nome");
const numeroPokemon = document.querySelector("#numero");

const error = document.querySelector("#erro");

async function buscarPokemon() {
  try {
    const resposta = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${campoBusca.value}`,
    );
    const dados = await resposta.json();

    imagemPokemon.src = dados.sprites.front_default;
    imagemPokemon.alt = dados.name;
    nomePokemon.textContent = dados.name;
    numeroPokemon.textContent = `#${dados.id}`;

    const hp = document.querySelector("#hp");
    const ataque = document.querySelector("#ataque");
    const defesa = document.querySelector("#defesa");
    const velocidade = document.querySelector("#velocidade");

    hp.textContent = `${dados.stats[0].base_stat}`;
    ataque.textContent = `${dados.stats[1].base_stat}`;
    defesa.textContent = `${dados.stats[2].base_stat}`;
    velocidade.textContent = `${dados.stats[5].base_stat}`;
  } catch {
    error.textContent = "Não encontramos o resultado.";
  }
}

buscar.addEventListener("click", () => buscarPokemon());
