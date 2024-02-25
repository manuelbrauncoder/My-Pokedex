let currentPokemonStatsNames = [];
let currentPokemonBaseStat = [];
let currentArray = true; // true = allPokemon, false = pokemonSearched
let allPokemon = [];
let pokemonSearched;
let pokemonSearchedRender = [];
let maxShownPokemonInSearch = 10;
let pokemonList;
let numberToShow = 25;
let offset = 0;

const colors = { normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C', grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1', ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A', rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746', steel: '#B7B7CE', fairy: '#D685AD' };

async function init() {
    showLoadScreen();
    await fetchPokemonList();
    await preparePokemonDetails()
    checkRenderList();
    hideLoadScreen();
    pokemonLoadedNumber();
}

function pokemonLoadedNumber() {
    document.getElementById('loadedPokemonNumber').innerHTML = `${allPokemon.length}`;
    document.getElementById('allPokemonNumber').innerHTML = `${pokemonList.length}`;
}

function showLoadedNumber() {
    currentArray === true ? document.getElementById('numberLoaded').classList.remove('d-none') : document.getElementById('numberLoaded').classList.add('d-none');
    pokemonLoadedNumber();
}

function errorFunction() {
    console.warn('error loading data');
}

async function loadMorePokemon() {
    numberToShow += 25;
    offset += 25;
    showLoadScreen();
    await preparePokemonDetails();
    checkRenderList();
    hideLoadScreen();
    showLoadedNumber();
}

function showLoadScreen() {
    document.getElementById('detailBackground').classList.remove('d-none');
    document.getElementById('loadAnimation').classList.remove('d-none');
}

function hideLoadScreen() {
    document.getElementById('detailBackground').classList.add('d-none');
    document.getElementById('loadAnimation').classList.add('d-none');
}

async function fetchPokemonList() {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`;
    let response = await fetch(url).catch(errorFunction);
    let responseAsJson = await response.json();
    let result = responseAsJson['results'];
    pokemonList = result;
    console.log(pokemonList);
}

async function preparePokemonDetails() {
    for (let i = offset; i < numberToShow; i++) {
        const pokemon = pokemonList[i];
        let url = pokemon['url'];
        await fetchPokemonDetails(url, allPokemon);
    }
}

async function prepareSearchedPokemonDetails() {
    for (let i = 0; i < pokemonSearched.length; i++) {
        const pokemon = pokemonSearched[i];
        let url = pokemon['url'];
        await fetchPokemonDetails(url, pokemonSearchedRender);
    }
}

async function fetchPokemonDetails(url, arrayToPush) {
    let response = await fetch(url).catch(errorFunction);
    let pokemon = await response.json();
    arrayToPush.push(pokemon);
}

function checkRenderList() {
    let input = document.getElementById('search').value;
    if (input == null || input == "" || input.length < 3) {
        renderList(allPokemon);
        currentArray = true;
        checkButton();
        showLoadedNumber();
    } else {
        renderList(pokemonSearchedRender);
        currentArray = false;
        checkButton();
        showLoadedNumber();
    }
}

function checkButton() {
    currentArray === true ? showLoadButton() : showBackButton();
}

function showLoadButton() {
    document.getElementById('backButton').classList.add('d-none');
    document.getElementById('loadButton').classList.remove('d-none');
}

function showBackButton() {
    document.getElementById('backButton').classList.remove('d-none');
    document.getElementById('loadButton').classList.add('d-none');
}

function backButton() {
    renderList(allPokemon);
    document.getElementById('search').value = '';
    currentArray = true;
    checkButton();
    showLoadedNumber();
}

function checkDetailList(index) {
    let input = document.getElementById('search').value;
    if (input == null || input == "" || input.length < 3) {
        renderPokemonDetailScreen(allPokemon, index)
        getPokemonStats(allPokemon, index);
        openDetailView();
        currentArray = true;
    } else {
        renderPokemonDetailScreen(pokemonSearchedRender, index)
        getPokemonStats(pokemonSearchedRender, index);
        openDetailView();
        currentArray = false;
    }
}

function createPokemonData(pokemon) {
    return {
        name: capitalizeFirstLetter(pokemon.name),
        id: pokemon.id.toString().padStart(4, '0'),
        imgUrl: pokemon.sprites.other['official-artwork'].front_default,
        abilities: pokemon.abilities.map(ability => ability.ability.name),
        type: pokemon.types.map(type => type.type.name),
        height: pokemon.height * 10,
        weight: pokemon.weight / 10,
        exp: pokemon.base_experience
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function renderList(arrayToRender) {
    let pokemonListContainer = document.getElementById('pokemonList');
    pokemonListContainer.innerHTML = '';
    for (let i = 0; i < arrayToRender.length; i++) {
        const pokemon = arrayToRender[i];
        let pokemonData = createPokemonData(pokemon, i);
        pokemonListContainer.innerHTML += printList(pokemonData, i);
        getTypeColor(`${pokemonData.type[0]}`, `pokeCard${i}`);
        for (let j = 0; j < pokemonData.type.length; j++) {
            const type = capitalizeFirstLetter(pokemonData.type[j]);
            document.getElementById(`type${i}`).innerHTML += `<p class="type">${type}</p>`;
        }
    }
}

async function filterPokemon() {
    pokemonSearched = [];
    pokemonSearchedRender = [];
    let filteredPokemon = pokemonList.filter(pokemon => searchPokemon(pokemon.name.toLowerCase()));
    pokemonSearched = filteredPokemon;
    await reduceToMaxShownPokemon();
}

function searchPokemon(name) {
    let input = document.getElementById('search').value.toLowerCase();
    if (input.length >= 3) {
        return name.includes(input);
    }
}

async function reduceToMaxShownPokemon() {
    if (pokemonSearched.length > maxShownPokemonInSearch) {
        let difference = pokemonSearched.length - maxShownPokemonInSearch;
        pokemonSearched.splice(maxShownPokemonInSearch, difference);
        await prepareSearchedPokemonDetails();
        checkRenderList();
    } else {
        await prepareSearchedPokemonDetails();
        checkRenderList();
    }
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
    document.getElementById('body').classList.add('doNotScroll');
}

function closeDetailView() {
    document.getElementById('detailView').classList.add('d-none');
    document.getElementById('detailBackground').classList.add('d-none');
    document.getElementById('body').classList.remove('doNotScroll');
}

function renderPokemonDetailScreen(arrayToRender, index) {
    let detailContainer = document.getElementById('detailView');
    detailContainer.innerHTML = '';
    const pokemon = arrayToRender[index];
    let pokemonDetailData = createPokemonData(pokemon);
    detailContainer.innerHTML += printPokemonDetailScreen(pokemonDetailData, index);
    for (let j = 0; j < pokemonDetailData.type.length; j++) {
        const type = capitalizeFirstLetter(pokemonDetailData.type[j]);
        document.getElementById(`detailType${index}`).innerHTML += `<p class="type">${type}</p>`;
    }
    getTypeColor(`${pokemonDetailData.type[0]}`, `imageView${index}`);
}


function nextPokemon(index) {
    let arrayToRender = currentArray == true ? allPokemon : pokemonSearchedRender;
    index++;
    index == arrayToRender.length ? checkDetailList(0) : checkDetailList(index);
}

function previousPokemon(index) {
    let arrayToRender = currentArray == true ? allPokemon : pokemonSearchedRender;
    let newIndex = arrayToRender.length - 1;
    index--;
    index < 0 ? checkDetailList(newIndex) : checkDetailList(index);
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
        currentPokemonStatsNames.push(capitalizeFirstLetter(name['stat']['name']));
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
