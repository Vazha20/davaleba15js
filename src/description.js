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
  <div class="center">
  <h3>${pokemon.name}</h3>
  </div>

  <div class="page-flex">
    <div class="imgfordescr">
      <img src="${pokemon.sprites.other['official-artwork'].front_default}">
    </div>
       
    <div>
      <p>${getOverview(speciesData)}</p>
      <div><p>Versions</p></div>
      <div class="bluebox">kdslk</div>
      <h3>Types</h3> 
      <p>${getTypes(pokemon)}</p>
      <h3>Weaknesses</h3> 
      <div>
        ${getWeaknesses(typesData)
          .map(
            (weakness) => `
              <span class="${weakness.typeClass}">${weakness.name}</span>
            `
          )
          .join("")}
      </div>
    </div>
  </div>
  <div class="pokemon-stats-info">
  <h3>Stats</h3>
  <p> ${getStats(pokemon)}</p>
  </div>
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
  const typeClasses = {
    grass: "type-grass",
    fire: "type-fire",
    water: "type-water",
    poison: "type-poison",    
    psychic: "type-psychic",
  };

  return pokemon.types
    .map((type) => `<span class="${typeClasses[type.type.name]}">${type.type.name}</span>`)
    .join("");
};

const getWeaknesses = (typesData) => {
  const weaknesses = [];
  typesData.forEach((typeData) => {
    typeData.damage_relations.double_damage_from.forEach((weakness) => {
      weaknesses.push({
        name: weakness.name,
        typeClass: `type-${weakness.name}`,
      });
    });
  });
  return weaknesses;
};
const getStats = (pokemon) => {
  return pokemon.stats.map((stat) => `${stat.stat.name}: ${stat.base_stat}`).join(", ");
};
