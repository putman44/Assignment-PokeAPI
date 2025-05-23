const fetchPokemon = async () => {
  const pokemonContainer = document.getElementById("pokemon-container");
  pokemonContainer.classList.remove("d-none");
  pokemonContainer.innerHTML = `<div><p>Loading...</p></div>`;

  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
    if (!response.ok) throw new Error("Pokémon not found");
    const data = await response.json();

    // Second request to get flavor text description
    const speciesResponse = await fetch(
      "https://pokeapi.co/api/v2/pokemon-species/ditto"
    );
    const speciesData = await speciesResponse.json();

    // Find the English description
    const flavorEntry = speciesData.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    );

    const description = flavorEntry
      ? flavorEntry.flavor_text.replace(/\f|\n/g, " ")
      : "No description available.";

    pokemonContainer.innerHTML = `
      <div class="row border rounded-3 p-3">
        <img id="pokemon-img" src="${
          data.sprites.other["official-artwork"].front_default ||
          data.sprites.front_default
        }" class="col-4" alt="${data.name}" />
        <div id="pokemon-card" class="col-8 card-body">
          <h5 class="card-title">Name: ${
            data.name.charAt(0).toUpperCase() + data.name.slice(1)
          }</h5>
          <p class="card-text">${description}</p>
          <p class="card-text"><strong>Height:</strong> ${
            data.height
          } <strong>Weight:</strong> ${data.weight}</p>
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
