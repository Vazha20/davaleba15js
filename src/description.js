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


const createPokemonCard = (pokemon, speciesData, typesData,) => {
  const pokemonEl = document.createElement("div");

  pokemonEl.classList.add("pokemonfordescr");
  console.log(pokemon.name);

  

  const pokemonInnerHtml = `
  <div class="center">
  <h3>${pokemon.name}</h3>
  <p>№${pokemon.id}</p>
  </div>

  <div class="page-flex">
    <div class="imgfordescr col-6">
      <img src="${pokemon.sprites.other['official-artwork'].front_default}">
    </div>
    <div class="col-6">
      <p>${getOverview(speciesData)}</p>
      <div class="page-flex">
      <div> <h3>Versions:</h3></div>
      <div class="bluecircle">
      </div>
      <div class="insideone clickOne">jk</div>
      <div class="redcircle"></div>
      <div class="insidetwo clickTwo">jk</div>
      </div>
      <div class="bluebox">
      <div>
      <h3>Height</h3>
      <p>0.${pokemon.height}m</p>
      <h3>Weight</h3>
      <p>${pokemon.weight}kg</p>
      <h3>Gender</h3>
      <img class="img_size" src="./male-and-female-signs.png">
      </div>
      <div>
      <h3>Category</h3>
      <p>${getCategory(speciesData)}</p>
      <h3>Abilities</h3>
      <p>${getAbilities(pokemon)}</p>
      </div>

      </div>
      <h3>Types</h3> 
      <div class="types_container">${getTypes(pokemon)}</div>
      <h3>Weaknesses</h3> 
      <div class="position_abs">
        ${getWeaknesses(typesData)}
      </div>
    </div>
  </div>
  <div>
  <h3>Stats</h3>
  <div> ${getStats(pokemon)}</div>
  </div>
  `;

  pokemonEl.innerHTML = pokemonInnerHtml;

  poke_container.appendChild(pokemonEl);

  

  const redcircle = pokemonEl.querySelector(".redcircle");
  const bluecircle = pokemonEl.querySelector(".bluecircle");
  const clickOne = pokemonEl.querySelector(".clickOne");
  const clickTwo = pokemonEl.querySelector(".clickTwo");
  redcircle.style.display="none"
  
  
  clickOne.addEventListener("click", () => {
    redcircle.style.display = "none";
    bluecircle.style.display =[]
  });
  
  clickTwo.addEventListener("click", () => {
    bluecircle.style.display = "none";
    redcircle.style.display=[]
  });
  
    
  };

  const getCategory = (speciesData) => {
    const category = speciesData.genera.find(
      (genus) => genus.language.name === "en"
    ).genus;
    return category;
  };
  
  const getAbilities = (pokemon) => {
    const abilities = pokemon.abilities
      .map((ability) => ability.ability.name)
      .join(", ");
    return abilities;
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
    flying: "type-flying",
    bug: "type-bug",
    ice: "type-ice",
    ground: "type-ground",
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
  return weaknesses
  .map(
    (weakness) => `
      <span class="${weakness.typeClass}">${weakness.name}</span>
    `
  )
  .join("")}

const getStats = (pokemon) => {
  return pokemon.stats.map((stat) => `${stat.stat.name}: ${stat.base_stat}`).join(" ");
};


