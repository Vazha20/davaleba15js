const poke_container = document.getElementById("poke_container");

const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");

const getPokemons = async (id) => {
  console.log(id);
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);
  const speciesData = await getSpeciesData(data.species.url);
  const typesData = await getTypesData(data.types);
  createPokemonCard(data, speciesData, typesData);
};

const getSpeciesData = async (speciesUrl) => {
  const res = await fetch(speciesUrl);
  const speciesData = await res.json();
  return speciesData;
};

const getTypesData = async (types) => {
  const typePromises = types.map(async (type) => {
    const res = await fetch(type.type.url);
    const typeData = await res.json();
    return typeData;
  });
  return Promise.all(typePromises);
};

getPokemons(id);

const createPokemonCard = (pokemon, speciesData, typesData) => {
  const pokemonEl = document.createElement("div");

  pokemonEl.classList.add("pokemonfordescr");
  console.log(pokemon.name);

  const pokemonInnerHtml = `
  <h3>${pokemon.name}</h3>

  <div class="page-flex">
    <div class="imgfordescr">
      <img src="${pokemon.sprites.other['official-artwork'].front_default}">
    </div>
       
    <div class="info">
      <p>${getOverview(speciesData)}</p>
      <p class="typebox">Types: ${getTypes(pokemon)}</p>
      <p><span>Weaknesses:</span> ${getWeaknesses(typesData)}</p>
    </div>
  </div>
  <p><span>Stats:</span> ${getStats(pokemon)}</p>
  `;

  pokemonEl.innerHTML = pokemonInnerHtml;

  poke_container.appendChild(pokemonEl);
};

const getOverview = (speciesData) => {
  const overview = speciesData.flavor_text_entries.find(
    (entry) =>
      entry.version.name === "sword" &&
      entry.language.name === "en" 
  ).flavor_text;
  return overview;
};

const getTypes = (pokemon) => {
  return pokemon.types.map((type) => type.type.name).join(", ");
};

const getWeaknesses = (typesData) => {
  const weaknesses = [];
  typesData.forEach((typeData) => {
    typeData.damage_relations.double_damage_from.forEach((weakness) => {
      weaknesses.push(weakness.name);
    });
  });
  return weaknesses.join(", ");
};

const getStats = (pokemon) => {
  return pokemon.stats.map((stat) => `${stat.stat.name}: ${stat.base_stat}`).join(", ");
};
