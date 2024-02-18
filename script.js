let currentPokemonStatsNames = [];
let currentPokemonBaseStat = [];
let limit = 25;

let allPokemon = [];
let pokemonSearched;

const colors = { normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C', grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1', ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A', rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746', steel: '#B7B7CE', fairy: '#D685AD' };

async function init() {
    await fetchPokemon(limit);
    checkRenderList();
}

function errorFunction() {
    console.warn('error loading data');
}

async function loadMorePokemon() {
    allPokemon = [];
    limit += 25;
    await fetchPokemon(limit);
    checkRenderList();
}

async function fetchPokemon(limit) {
    for (let number = 1; number <= limit; number++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${number}/`;
        let response = await fetch(url).catch(errorFunction);
        let pokemon = await response.json();
        allPokemon.push(pokemon);
    }
}

function checkRenderList() {
    let input = document.getElementById('search').value;
    if (input == null || input == "") {
        renderList(allPokemon);
    } else {
        renderList(pokemonSearched);
    }
}



function checkDetailList(index) {
    let input = document.getElementById('search').value;
    if (input == null || input == "") {
        renderPokemonDetailScreen(allPokemon, index)
        getPokemonStats(allPokemon, index);
        toggleContainer('detailView', 'detailBackground');
    } else {
        renderPokemonDetailScreen(pokemonSearched, index)
        getPokemonStats(pokemonSearched, index);
        toggleContainer('detailView', 'detailBackground');
    }
}

function createPokemonData(pokemon) {
    return {
        name: pokemon.name,
        id: pokemon.id,
        imgUrl: pokemon.sprites.other['official-artwork'].front_default,
        abilities: pokemon.abilities.map(ability => ability.ability.name),
        type: pokemon.types[0].type.name
    }
}

async function renderList(arrayToRender) {
    let pokemonListContainer = document.getElementById('pokemonList');
    pokemonListContainer.innerHTML = '';
    for (let i = 0; i < arrayToRender.length; i++) {
        const pokemon = arrayToRender[i];
        let pokemonData = createPokemonData(pokemon, i);
        pokemonListContainer.innerHTML += printList(pokemonData, i);
        getTypeColor(`${pokemonData.type}`, `pokeCard${i}`);
    }
}

function printList(pokemon, i) {
    return  /*html*/`
    <div onclick="checkDetailList(${i})" id="pokeCard${i}" class="card">
        <div class="cardTitle"><h2>${pokemon.name}</h2><p>${pokemon.id}</p></div>
        <div class="abilities"><p>abilities: ${pokemon.abilities} </p></div>
        <img src="${pokemon.imgUrl}" alt="image of ${pokemon.name}">
    </div>
        `;
}

function filterPokemon() {
    let filteredPokemon = allPokemon.filter(pokemon => searchPokemon(pokemon.name.toLowerCase())); // über jedes Element im Array wird die searchPokemon Funktion ausgeführt.  
    pokemonSearched = filteredPokemon;                                          // Wenn die Filter Bedingung erüllt ist, wird das entsprechende pokemon in das filteredPokemon Array kopiert.
    checkRenderList();
}

function searchPokemon(name) {
    let input = document.getElementById('search').value.toLowerCase();
    if (input.length >= 3) {
        return name.includes(input);
    }
}

async function openDetailView() {
    toggleContainer('detailView', 'detailBackground');
    getPokemonStats();
    loadChart();
}

function getTypeColor(type, id) {
    let container = document.getElementById(id);
    type = type.toLowerCase();
    if (colors.hasOwnProperty(type)) { // hasOwnProperty = gibt ein Bool zurück, true wenn das object den type hat, wird der Code ausgeführt.
        container.style.backgroundColor = colors[type];
    } else {
        container.style.backgroundColor = '#FFFFFF';    // bei false wird dieser Code ausgeführt.
    }
}

function toggleContainer(id1, id2) {
    document.getElementById(id1).classList.toggle('d-none');
    document.getElementById(id2).classList.toggle('d-none');
    document.getElementById('pokemonList').classList.toggle('doNotScroll');
}

function renderPokemonDetailScreen(arrayToRender, index) {
    let detailContainer = document.getElementById('detailView');
    detailContainer.innerHTML = '';
    const pokemon = arrayToRender[index];
    let pokemonDetailData = createPokemonData(pokemon);
    detailContainer.innerHTML += printPokemonDetailScreen(pokemonDetailData);
}

function printPokemonDetailScreen(pokemon) {
    return /*html*/ `
        <div class="imageView">
            <div class="cardTitle"><h1>${pokemon.name}</h1><p>${pokemon.id}</p></div>
            <div class="abilities">${pokemon.abilities}</div>
            <img class="pokemonImg" src="${pokemon.imgUrl}">
        </div>
        <div class="statsContainer">
            <h1>Pokemon stats</h1>
            <div class="canvasContainer">
                    <canvas id="myChart"></canvas>
            </div>
        </div>
    `;
}

function getPokemonStats(currentArray, index) {
    let names = currentArray[index]['stats'];
    for (let i = 0; i < names.length; i++) {
        const name = names[i];
        currentPokemonStatsNames.push(name['stat']['name']);
        currentPokemonBaseStat.push(name['base_stat']);
    }
    loadChart();
}

let myChart;

function loadChart() {
    const ctx = document.getElementById('myChart');
    if (myChart !== null && typeof myChart === 'object') { // wenn myChart NICHT gleich null ist, UND der Typ myChart ein object ist, dann ...
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: currentPokemonStatsNames,
            datasets: [{
                label: 'Pokemon stats',
                data: currentPokemonBaseStat,
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }

    });
    currentPokemonStatsNames = [];
    currentPokemonBaseStat = [];
}