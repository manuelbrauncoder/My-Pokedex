let currentPokemonStatsNames = [];
let currentPokemonBaseStat = [];
let limit = 25;
let currentArray; // true = allPokemon, false = pokemonSearched
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
        currentArray = true;
    } else {
        renderList(pokemonSearched);
        currentArray = false;
    }
}

function checkDetailList(index) {
    let input = document.getElementById('search').value;
    if (input == null || input == "") {
        renderPokemonDetailScreen(allPokemon, index)
        getPokemonStats(allPokemon, index);
        openDetailView();
        currentArray = true;
    } else {
        renderPokemonDetailScreen(pokemonSearched, index)
        getPokemonStats(pokemonSearched, index);
        openDetailView();
        currentArray = false;
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
        for (let j = 0; j < pokemonData.abilities.length; j++) {
            const ability = pokemonData.abilities[j];
            document.getElementById(`abilities${i}`).innerHTML += /*html*/ `<p>${ability}</p>`;
        }
        getTypeColor(`${pokemonData.type}`, `pokeCard${i}`);
    }
}

function printList(pokemon, i) {
    return  /*html*/`
    <div onclick="checkDetailList(${i})" id="pokeCard${i}" class="card">
        <div class="cardTitle"><h2>${pokemon.name}</h2><p>${pokemon.id}</p></div>
        <div class="abilityAndImg">
            <div id="abilities${i}" class="abilities"></div>
            <img src="${pokemon.imgUrl}" alt="image of ${pokemon.name}">
        </div>
    </div>
        `;
}

function filterPokemon() {
    let filteredPokemon = allPokemon.filter(pokemon => searchPokemon(pokemon.name.toLowerCase()));
    pokemonSearched = filteredPokemon;                                         
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

function openDetailView() {
    document.getElementById('detailView').classList.remove('d-none');
    document.getElementById('detailBackground').classList.remove('d-none');
    document.getElementById('pokemonList').classList.add('doNotScroll');
}

function closeDetailView() {
    document.getElementById('detailView').classList.add('d-none');
    document.getElementById('detailBackground').classList.add('d-none');
    document.getElementById('pokemonList').classList.remove('doNotScroll');
}

function renderPokemonDetailScreen(arrayToRender, index) {
    let detailContainer = document.getElementById('detailView');
    detailContainer.innerHTML = '';
    const pokemon = arrayToRender[index];
    let pokemonDetailData = createPokemonData(pokemon);
    detailContainer.innerHTML += printPokemonDetailScreen(pokemonDetailData, index);
    for (let j = 0; j < pokemonDetailData.abilities.length; j++) {
        const ability = pokemonDetailData.abilities[j];
        document.getElementById(`abilitiesDetailScreen${index}`).innerHTML += /*html*/ `<p>${ability}</p>`;
    }
}

function nextPokemon(index) {
    let arrayToRender = currentArray == true ? allPokemon : pokemonSearched;
    index++;
    index == arrayToRender.length ? closeDetailView() : checkDetailList(index);
}

function previousPokemon(index) {
    index--;
    index < 0 ? closeDetailView() : checkDetailList(index);
}

function printPokemonDetailScreen(pokemon, index) {
    return /*html*/ `
    <div class="arrows">
        <svg onclick="previousPokemon(${index})" xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>
        <svg onclick="nextPokemon(${index})" xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/></svg>
    </div>
    <div class="detailCard">
        <div class="imageView">
            <div class="cardTitle"><h1>${pokemon.name}</h1><p>${pokemon.id}</p></div>
                <div class="abilityAndImgDetailView">
                    <div id="abilitiesDetailScreen${index}" class="abilities"></div>
                    <img class="pokemonImg" src="${pokemon.imgUrl}">
                </div>
            </div>
        <div class="statsContainer">
            <h1>Pokemon stats</h1>
            <div class="canvasContainer">
                    <canvas id="myChart"></canvas>
            </div>
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
            responsive: true,
            maintainAspectRatio: true,
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