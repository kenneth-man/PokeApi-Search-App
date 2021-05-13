'use strict';

const searchInput = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-btn');
const searchBtnRandom = document.querySelector('#search-btn-random');
const spinner = document.querySelector('.spinner');

const pokemonName = document.querySelector('#name');
const frontDefault = document.querySelector('#front_default');
const backDefault = document.querySelector('#back_default');
const frontShiny = document.querySelector('#front_shiny');
const backShiny = document.querySelector('#back_shiny');
const stats = document.querySelector('#stats');
const abilities = document.querySelector('#abilities');
const moves = document.querySelector('#moves');

const fetchData = async (pokemonName, pokemonId) => {
    showSpinner(true);

    if(pokemonName){
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            const data = await response.json();

            updateUI(data);
            showSpinner(false);
        } catch(error){
            alert(`Could not find specified pokemon - ${error}`);
        }
        return;
    }

    if(pokemonId){
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
            const data = await response.json();

            updateUI(data);
            showSpinner(false);
        } catch(error){
            alert(`Could not find specified pokemon - ${error}`);
        }
    }
}

const resetUI = () => {
    stats.innerHTML = abilities.innerHTML = moves.innerHTML = '';
}

const updateUI = (dataObj) => {
    resetUI();

    //if a json property has a special character in it's name, have to use '[]' then string prop name inside
    pokemonName.textContent = `${dataObj.name} - #${dataObj.id}`;

    frontDefault.setAttribute('src', dataObj.sprites['front_default']);
    backDefault.setAttribute('src', dataObj.sprites['back_default']);
    frontShiny.setAttribute('src', dataObj.sprites['front_shiny']);
    backShiny.setAttribute('src', dataObj.sprites['back_shiny']);

    stats.insertAdjacentHTML('beforeend', 
        `
            <h4>Typing: ${dataObj.types.forEach(curr => curr.type.name)}</h4>
            <h4>HP: ${dataObj.stats[0]['base_stat']}</h4>
            <h4>Attack: ${dataObj.stats[1]['base_stat']}</h4>
            <h4>Defense: ${dataObj.stats[2]['base_stat']}</h4>
            <h4>Special Attack: ${dataObj.stats[3]['base_stat']}</h4>
            <h4>Special Defense: ${dataObj.stats[4]['base_stat']}</h4>
            <h4>Speed: ${dataObj.stats[5]['base_stat']}</h4>
            <h4>Base Experience: ${dataObj['base_experience']}</h4>
            <h4>Species: ${dataObj.species.name}</h4>
            <h4>Height: ${dataObj.height}cm</h4>
            <h4>Weight: ${dataObj.weight}kg</h4>
            <a href="${dataObj['location_area_encounters']}" class="transition rounded">Location Encounters</a>
        `
    );

    dataObj.abilities.forEach((curr, index) => abilities.insertAdjacentHTML('beforeend', 
        `
            <h4>${index}) ${curr.ability.name}</h4>
        `
    ));

    dataObj.moves.forEach((curr, index) => moves.insertAdjacentHTML('beforeend', 
        `
            <h4>${index}) ${curr.move.name}</h4>
        `
    ));
}

//898 total pokemon as of 2021
const generateRandomNumber = () => {
    const randomNum = Math.round(Math.random() * 898 + 1);
    return randomNum;
}

const showSpinner = (bool) => {
    bool ? spinner.classList.remove('spinner__hidden') : spinner.classList.add('spinner__hidden');
}

searchBtn.addEventListener('click', () => {
    if(searchInput.value){
        //api only accepts lowercase search parameters
        const lowerCaseString = searchInput.value.toLowerCase();
        fetchData(lowerCaseString, undefined);
        return;
    }

    alert('No input received');
})

searchBtnRandom.addEventListener('click', () => {
    const pokemonId = generateRandomNumber();
    
    fetchData(undefined, pokemonId);
})