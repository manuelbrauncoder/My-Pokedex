function printList(pokemon, i) {
    return  /*html*/`
    <div onclick="checkDetailList(${i})" id="pokeCard${i}" class="card">
        <div class="cardTitle"><h2>${pokemon.name}</h2><p>#${pokemon.id}</p></div>
        <div class="typeAndImg">
            <div class="types" id="type${i}"></div>
            <img src="${pokemon.imgUrl}" alt="image of ${pokemon.name}">
        </div>
    </div>
        `;
}

function printPokemonDetailScreen(pokemon, index) {
    return /*html*/ `
    <div class="arrows">
        <svg onclick="previousPokemon(${index})" xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>
        <svg onclick="nextPokemon(${index})" xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/></svg>
    </div>
    <div class="detailCard">
        <div class="imageView" id="imageView${index}">
            <div class="cardTitle">
                <div class="dFlexCC"><h1>${pokemon.name}</h1><p>#${pokemon.id}</p></div>
                <svg class="closeIcon" onclick="closeDetailView()" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></div>
                <div class="typeAndImgDetailView">
                    <div id="detailType${index}" class="types"></div>
                    <img class="pokemonImg" src="${pokemon.imgUrl}">
                </div>
            </div>
        <div class="detailContainer">
            <nav class="detailsNav">
                <span id="aboutButton" onclick="changeInfoScreen('about', 'chart', 'aboutButton', 'statsButton')">About</span><span class="activeButton" id="statsButton" onclick="changeInfoScreen('chart', 'about', 'statsButton', 'aboutButton')">Stats</span>
            </nav>
            <div id="chart" class="canvasContainer">
                    <canvas id="myChart"></canvas>
            </div>
            <div id="about" class="d-none">
                <div class="about">
                    <div class="heightAndWeight">
                        <div><span class="aboutTitle">Height: </span><span>${pokemon.height}cm</span></div>
                        <div><span class="aboutTitle">Exp: </span><span>${pokemon.exp}</span></div>
                        <div><span class="aboutTitle">Weight: </span><span>${pokemon.weight}kg</span></div>
                    </div>
                    
                    <div>
                        <span class="aboutTitle">Abilities: </span>
                        <div class="abilities" id="abilities${index}"></div>
                    </div>
                </div>
            </div> 
        </div>
    </div>
    
    `;
}