
let currentPokemon;
let currentPokemonStatsNames = [];
let currentPokemonBaseStat = [];
let offset = 0;
let limit = 25;

let allPokemon = [];
let pokemon;

const colors = { normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C', grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1', ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A', rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746', steel: '#B7B7CE', fairy: '#D685AD' };

async function init() {
    await fetchPokemon();
    checkRenderList();
}

function errorFunction() {
    console.warn('error loading data');
}


async function fetchPokemon() {
    const limit = 25;
    for (let number = 1; number <= limit; number++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${number}/`;
        let response = await fetch(url).catch(errorFunction);
        let pokemon = await response.json();
        allPokemon.push(pokemon);
    }
}

function checkRenderList() {
    if (!Array.isArray(pokemon)) {
        renderList(allPokemon)
    } else {
        renderList(pokemon)
    }
}

async function renderList(arrayToRender) {
    let pokemonListContainer = document.getElementById('pokemonList');
    pokemonListContainer.innerHTML = '';
    for (let i = 0; i < arrayToRender.length; i++) {
        const list = arrayToRender[i];
        let name = list['name'];
        let id = list['id'];
        let imgUrl = list['sprites']['front_default'];
        let abilities = [];
        let type = list['types'][0]['type']['name'];
        for (let j = 0; j < list['abilities'].length; j++) {
            const ability = list['abilities'][j];
            abilities.push(ability['ability']['name']);
        }
        pokemonListContainer.innerHTML += printList(name, id, imgUrl, abilities, i);
        getTypeColor(`${type}`, `pokeCard${i}`);
    }
}

function printList(name, id, imgUrl, abilities, i) {
    return  /*html*/`
    <div id="pokeCard${i}" class="card">
        <div class="cardTitle"><h2>${name}</h2><p>${id}</p></div>
        <div class="abilities"><p>abilities: ${abilities} </p></div>
        <img src="${imgUrl}">
    </div>
        `;
}

function filterPokemon() {
    let input = document.getElementById('search').value.toLowerCase();
    let filteredPokemon = allPokemon.filter(pokemon => searchPokemon(pokemon.name.toLowerCase(), input));
    pokemon = filteredPokemon;
    checkRenderList();
}

function searchPokemon(name, input) {
    return name.includes(input);
}



async function loadPokemon(pokemonName) {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    let response = await fetch(url).catch(errorFunction);
    currentPokemon = await response.json();
    toggleContainer('detailView', 'detailBackground');
    renderPokemonDetailScreen();
    getStats();
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
}

function renderPokemonDetailScreen() {
    document.getElementById('pokemonName').innerHTML = currentPokemon['name'];
    document.getElementById('pokemonImg').src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    document.getElementById('pokeId').innerHTML = currentPokemon['id'];
    let abilityContainer = document.getElementById('abilities');
    let abilities = currentPokemon['abilities'];
    let type = currentPokemon['types'][0]['type']['name'];
    getTypeColor(`${type}`, 'imageView');
    abilityContainer.innerHTML = '';
    for (let i = 0; i < abilities.length; i++) {
        const ability = abilities[i]['ability']['name'];
        abilityContainer.innerHTML += `
            <p>${ability}</p>
            `;
    }
}

function getStats() {
    let names = currentPokemon['stats'];
    for (let i = 0; i < names.length; i++) {
        const name = names[i];
        currentPokemonStatsNames.push(name['stat']['name']);
        currentPokemonBaseStat.push(name['base_stat']);
    }
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