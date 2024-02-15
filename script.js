
let currentPokemon;
let currentPokemonStatsNames = [];
let currentPokemonBaseStat = [];
let offset = 0;
let limit = 25;

let pokemonList = [];
let nameList = [];
const colors = { normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C', grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1', ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A', rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746', steel: '#B7B7CE', fairy: '#D685AD' };

async function init() {
    await loadList();
}

function searchNames() {
    let search = document.getElementById('search').value;
    search = search.toLowerCase();
    console.log(search);
    return search;
}

async function loadList() {
    let url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
    let response = await fetch(url).catch(errorFunction);;
    let responseAsJson = await response.json();
    let list = responseAsJson['results'];
    for (let i = 0; i < list.length; i++) {
        const names = list[i];
        let name = names['name'];
        let url = names['url']
        let newObject = {
            "name": name,
            "url": url
        }
        nameList.push(newObject);
    }
    await renderList();
    offset += 25;
}

async function renderList() {
    for (let i = offset; i < nameList.length; i++) {
        const list = nameList[i];
        let name = list['name'];
        let url = list['url'];
        let abilities = [];
        let response = await fetch(url).catch(errorFunction);
        let responseAsJson = await response.json();
        let type = responseAsJson['types'][0]['type']['name'];
        let imgUrl = responseAsJson['sprites']['front_default'];
        let abilitiesJson = responseAsJson['abilities'];
        for (let j = 0; j < abilitiesJson.length; j++) {
            const ability = abilitiesJson[j]['ability']['name'];
            abilities.push(ability);
        }
        let newObject = {
            "name": name,
            "url": imgUrl,
            "abilities": abilities,
            "type": type
        }
        pokemonList.push(newObject);
    }
    printList();
}

function errorFunction() {
    console.warn('error loading data');
}

function printList() {
    let pokemonListContainer = document.getElementById('pokemonList');
    pokemonListContainer.innerHTML = '';

    let search = document.getElementById('search').value;
    search = search.toLowerCase();

    for (let i = 0; i < pokemonList.length; i++) {
        const char = pokemonList[i];
        if (char['name'].toLowerCase().includes(search)) {
            let abilities = char['abilities'];
            let type = char['type'];
            pokemonListContainer.innerHTML += /*html*/ `
            <div onclick="loadPokemon('${char['name']}')" id="card${i}" class="card">
                <h3>${char['name']}</h3>
                <div id="abilities${i}"></div>
                <img src='${char['url']}'>
            </div>
        `;
            getTypeColor(`${type}`, `card${i}`);
            for (let j = 0; j < abilities.length; j++) {
                const ability = abilities[j];
                document.getElementById(`abilities${i}`).innerHTML += `<p>${ability}</p>`;
            }
        }
    }
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