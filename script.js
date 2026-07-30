document.addEventListener('DOMContentLoaded', () => {
    const homepageView = document.getElementById('homepage-view');
    const quizView = document.getElementById('quiz-view');
    const startButton = document.getElementById('start-game-btn');

    if (startButton) {
        startButton.addEventListener('click', () => {
            // homepage view
            homepageView.style.display = 'none';

            // Show the game
            quizView.style.display = 'flex';
        });
    }
});

const pokemonImg = document.getElementById('pokemon-img');
const pokemonName = document.getElementById('pokemon-name');
const optionsContainer = document.getElementById('options-container');
const scoreDisplay = document.getElementById('score');
const feedback = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');

let score = 0;
let correctType = '';

const allTypes = ['fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'normal', 'fighting', 'poison'];

async function fetchPokemon() {
    if (feedback) feedback.textContent = '';
    if (nextBtn) nextBtn.style.display = 'none';
    if (optionsContainer) optionsContainer.innerHTML = 'Loading...';

    const randomId = Math.floor(Math.random() * 150) + 1;

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        const data = await response.json();

        const imgUrl = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
        correctType = data.types[0].type.name;
        const name = data.name.toUpperCase();

        if (pokemonImg) pokemonImg.src = imgUrl;
        if (pokemonName) pokemonName.textContent = name;

        setupOptions(correctType);
    } catch (error) {
        if (optionsContainer) optionsContainer.innerHTML = 'Failed to load. Try refreshing!';
        console.error(error);
    }
}

function setupOptions(correct) {
    if (!optionsContainer) return;
    optionsContainer.innerHTML = '';
    
    let choices = [correct];
    while (choices.length < 4) {
        const randomType = allTypes[Math.floor(Math.random() * allTypes.length)];
        if (!choices.includes(randomType)) {
            choices.push(randomType);
        }
    }

    choices.sort(() => Math.random() - 0.5);

    choices.forEach(type => {
        const btn = document.createElement('button');
        btn.textContent = type.toUpperCase();
      

        btn.dataset.type = type;
        
        btn.addEventListener('click', () => checkAnswer(type, correct));
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selected, correct) {
    if (!optionsContainer) return;
    const buttons = optionsContainer.querySelectorAll('button');
    
    buttons.forEach(btn => {
        btn.disabled = true;
        

        if (btn.dataset.type === correct) {
            btn.style.backgroundColor = '#A7EBF2'; 
            btn.style.color = '#011C40';
        } else if (btn.dataset.type === selected) {
            btn.style.backgroundColor = '#26658C'; 
            btn.style.opacity = '0.5';
        }
    });

    if (selected === correct) {
        score++;
        if (scoreDisplay) scoreDisplay.textContent = score;
        if (feedback) {
            feedback.textContent = 'Correct! 🎉';
            feedback.style.color = '#A7EBF2';
        }
    } else {
        if (feedback) {
            feedback.textContent = `Wrong! It was ${correct.toUpperCase()} ❌`;
            feedback.style.color = '#54ACBF';
        }
    }

    if (nextBtn) nextBtn.style.display = 'block';
}

if (nextBtn) {
    nextBtn.addEventListener('click', fetchPokemon);
}


fetchPokemon();