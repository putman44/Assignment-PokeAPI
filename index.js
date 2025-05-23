const fetchPokemon = async () => {
  const pokemonContainer = document.getElementById("pokemon-container");
  pokemonContainer.classList.remove("d-none");
  pokemonContainer.innerHTML = `<div><p>Loading...</p></div>`;

  let pokemonInput = document.getElementById("basic-url").value.trim();
  if (!pokemonInput) {
    pokemonInput = Math.floor(Math.random() * 898) + 1;
  }

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonInput}`
    );

    const data = await response.json();

    // Second request to get flavor text description
    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonInput}`
    );
    const speciesData = await speciesResponse.json();

    // Find the English description
    const flavorEntry = speciesData.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    );

    const description = speciesData.flavor_text_entries
      ? flavorEntry.flavor_text.replace(/\f|\n/g, " ")
      : "No description available.";

    pokemonContainer.innerHTML = `
  <div class="row border rounded-3 p-3">
  <div class="col-4 d-flex align-items-center justify-content-center">
    <img id="pokemon-img" src="${
      data.sprites.other["official-artwork"].front_default ||
      data.sprites.front_default
    }" style="width:100%" alt="${data.name}" />
    </div>
    <div id="pokemon-card" class="col-8 card-body">
      <h5 class="card-title">Name: ${
        data.name.charAt(0).toUpperCase() + data.name.slice(1)
      }</h5>
      <p class="card-text">${description}</p>
      <p class="card-text"><strong>Height:</strong> ${
        data.height
      } <strong>Weight:</strong> ${data.weight}</p>
      <span class="card-text"><strong>Moves:</strong></span>
      <ul>${data.moves
        .slice(0, 5)
        .map((move) => `<li>${move.move.name}</li>`)
        .join("")}</ul>
    </div>
  </div>`;
  } catch (error) {
    console.error("Error fetching Pokemon:", error.message);

    pokemonContainer.innerHTML = `
      <div class="alert alert-danger" role="alert">
        There was an error fetching your Pokémon. Please try again.
      </div>`;

    const button = document.querySelector("button");
    button.textContent = "Try Again";
  }
};
