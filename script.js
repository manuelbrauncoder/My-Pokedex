let currentPokemonStatsNames = [];
let currentPokemonBaseStat = [];
let limit = 25;
let currentArray; // true = allPokemon, false = pokemonSearched
let allPokemon = [];
let pokemonSearched;
let maxShownPokemonInSearch = 4;

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
        type: pokemon.types[0].type.name,
        height: pokemon.height,
        weight: pokemon.weight,
        exp: pokemon.base_experience
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
        <div class="cardTitle"><h2>${pokemon.name}</h2><p>#${pokemon.id}</p></div>
        <div class="abilityAndImg">
            <p class="type">${pokemon.type}</p>
            <img src="${pokemon.imgUrl}" alt="image of ${pokemon.name}">
        </div>
    </div>
        `;
}

function filterPokemon() {
    let filteredPokemon = allPokemon.filter(pokemon => searchPokemon(pokemon.name.toLowerCase()));
    let filteredlength = filteredPokemon.length;
    reduceToMaxShownPokemon(filteredPokemon, filteredlength);
}

function reduceToMaxShownPokemon(filteredPokemon, filteredlength) {
    if (filteredlength >= maxShownPokemonInSearch) {
        let difference = filteredPokemon.length - maxShownPokemonInSearch;
        filteredPokemon.splice(maxShownPokemonInSearch, difference);
        pokemonSearched = filteredPokemon;
        checkRenderList();
    } else {
        pokemonSearched = filteredPokemon;
        checkRenderList();
    }
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
    getTypeColor(`${pokemonDetailData.type}`, `imageView${index}`);
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
        <div class="imageView" id="imageView${index}">
            <div class="cardTitle"><h1>${pokemon.name}</h1><p>#${pokemon.id}</p></div>
                <div class="abilityAndImgDetailView">
                    <div class="type">${pokemon.type}</div>
                    <img class="pokemonImg" src="${pokemon.imgUrl}">
                </div>
            </div>
        <div class="detailContainer">
            <nav class="detailsNav">
                <span id="aboutButton" onclick="changeInfoScreen('about', 'chart', 'aboutButton', 'statsButton')">about</span><span class="activeButton" id="statsButton" onclick="changeInfoScreen('chart', 'about', 'statsButton', 'aboutButton')">stats</span>
            </nav>
            <div id="chart" class="canvasContainer">
                    <canvas id="myChart"></canvas>
            </div>
            <div id="about" class="d-none">
                <div class="about">
                    <div><span class="aboutTitle">abilities: </span><span> ${pokemon.abilities}</span></div>
                    <div><span class="aboutTitle">height: </span><span>${pokemon.height}</span></div>
                    <div><span class="aboutTitle">weight: </span><span>${pokemon.weight}</span></div>
                    <div><span class="aboutTitle">exp: </span><span>${pokemon.exp}</span></div>
                </div>

            </div>
            
        </div>
    </div>
    
    `;
}

function changeInfoScreen(show, hide, showButton, hideButton) {
    document.getElementById(show).classList.remove('d-none');
    document.getElementById(hide).classList.add('d-none');
    document.getElementById(showButton).classList.add('activeButton');
    document.getElementById(hideButton).classList.remove('activeButton');

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

function showImprintWindow() {
    document.getElementById('detailBackground').classList.remove('d-none');
    document.getElementById('imprint').classList.remove('d-none');
}

function hideImprintWindow() {
    document.getElementById('detailBackground').classList.add('d-none');
    document.getElementById('imprint').classList.add('d-none');
}

// style imprint window, implement functions onclick