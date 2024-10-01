async function fetchPokemonData() {
    const url = 'https://pokeapi.co/api/v2/pokemon?limit=50';
    try {
        const response = await fetch(url);
        const data = await response.json();
        const pokemonList = data.results;

        for (const pokemon of pokemonList) {
            const pokemonData = await fetch(pokemon.url);
            const pokemonDetails = await pokemonData.json();

            // Create the Pokémon card
            const pokemonCard = document.createElement('div');
            pokemonCard.classList.add('pokemon-card');

            // Create the image element
            const img = document.createElement('img');
            img.src = pokemonDetails.sprites.front_default;
            pokemonCard.appendChild(img);

            // Create the Pokémon number element
            const pokemonNumber = document.createElement('div');
            pokemonNumber.classList.add('pokemon-number');
            pokemonNumber.textContent = `#${String(pokemonDetails.id).padStart(4, '0')}`;
            pokemonCard.appendChild(pokemonNumber);

            // Create the Pokémon name link
            const pokemonName = document.createElement('a');
            pokemonName.classList.add('pokemon-name');
            pokemonName.textContent = pokemonDetails.name.charAt(0).toUpperCase() + pokemonDetails.name.slice(1);

            // Correct the link syntax
            pokemonName.href = `index1.html?id=${pokemonDetails.id}`; // Updated to use id
            pokemonCard.appendChild(pokemonName);

            // Append the Pokémon card to the grid
            document.getElementById('pokemonGrid').appendChild(pokemonCard);
        }
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
    }
}

// Call fetchPokemonData when the window loads
window.onload = fetchPokemonData;

function getQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function fetchPokemonDetails() {
    const id = getQueryParams();

    if (!id) return;

    try {
        let api = `https://pokeapi.co/api/v2/pokemon/${id}`;
        const response = await fetch(api);

        if (!response.ok) throw new Error("Pokémon not found");

        const data = await response.json();
        const pokemonDetails = document.getElementById('pokemonDetails');

        const types = data.types.map(type => type.type.name).join(', ');
        const abilities = data.abilities.map(ability => ability.ability.name).join(', ');

        let speciesResponse = await fetch(data.species.url);
        let speciesData = await speciesResponse.json();
        const speciesName = speciesData.genera.find(g => g.language.name === 'en').genus;
        const nationalNumber = speciesData.id;
        const localNumber = speciesData.pokedex_numbers.find(p => p.pokedex.name === 'national').entry_number;

        pokemonDetails.innerHTML = `
            <h2>${data.name.toUpperCase()} Details</h2>
            <img src="${data.sprites.front_default}" alt="${data.name}" style="width:200px;height:200px;">
            <p><strong>National Number:</strong> ${nationalNumber}</p>
            <p><strong>Local Number:</strong> ${localNumber ? localNumber : 'N/A'}</p>
            <p><strong>Species:</strong> ${speciesName}</p>
            <p><strong>Type:</strong> ${types}</p>
            <p><strong>Height:</strong> ${data.height / 10} meters</p>
            <p><strong>Weight:</strong> ${data.weight / 10} kg</p>
            <p><strong>Abilities:</strong> ${abilities}</p>
        `;
    } catch (error) {
        console.error("Error fetching Pokémon details:", error);
        document.getElementById('pokemonDetails').innerHTML = "Error fetching Pokémon details.";
    }
}

// Call fetchPokemonDetails only on the details page
if (document.title === "Pokémon Details") {
    fetchPokemonDetails();
}
