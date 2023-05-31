// Get the element with the ID "poke_container"
const poke_container = document.getElementById("poke_container");

// Set the total number of Pokemon
const pokemon_count = 150;

// Define colors for different types of Pokemon
const colors = {
  fire: "#FDDFDF",
  grass: "#DEFDE0",
  electric: "#FCF7DE",
  water: "#DEF3FD",
  ground: "#f4e7da",
  rock: "#d5d5d4",
  fairy: "#fceaff",
  poison: "#98d7a5",
  bug: "#f8d5a3",
  dragon: "#97b3e6",
  psychic: "#eaeda1",
  flying: "#F5F5F5",
  fighting: "#E6E0D4",
  normal: "#F5F5F5",
};

// Get an array of all the different types of Pokemon
const main_types = Object.keys(colors);

// Fetch all the Pokemon data
const fetchPokemons = async () => {
  for (let i = 1; i <= pokemon_count; i++) {
    await getPokemons(i);
  }
};

// Fetch data for a specific Pokemon based on its ID
const getPokemons = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);
  createPokemonCard(data);
};

// Create a card for a Pokemon and add it to the container
const createPokemonCard = (pokemon) => {
  const pokemonEl = document.createElement("div");
  pokemonEl.classList.add("pokemon");
  console.log(pokemon.name);

  // Get all the types of the Pokemon
  const poke_type = pokemon.types.map((type) => type.type.name);
  console.log(poke_type);

  // Find the main type of the Pokemon (the first type that matches the main_types array)
  const type = main_types.find((type) => poke_type.indexOf(type) > -1);

  // Get the color associated with the main type
  const color = colors[type];
  console.log(color);

  // Set the background color of the Pokemon card
  pokemonEl.style.backgroundColor = color;

  // Create the HTML content for the Pokemon card
  const pokemonInnerHtml = `
        <div class="img-container">
            <img src="${pokemon.sprites.front_default}"> 
        </div>
       
        <div class="info">
            <h3>
                ${pokemon.name}
            </h3>
            <small>
                ${type}
            </small>
        </div>
  `;

  // Add a click event listener to the Pokemon card to redirect to a description page
  pokemonEl.addEventListener("click", () => {
    window.location.href = `description.html?name=${pokemon.name}&id=${pokemon.id}`;
  });

  // Set the HTML content for the Pokemon card
  pokemonEl.innerHTML = pokemonInnerHtml;

  // Add the Pokemon card to the container
  poke_container.appendChild(pokemonEl);
};

// Call the fetchPokemons function to start fetching and creating Pokemon cards
fetchPokemons();