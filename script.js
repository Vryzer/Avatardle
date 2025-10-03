const characters = [
    { name: "Aang", gender: "Male", hairColor: "None", ageGroup: "Teenager", combatStyle: "Airbending", alignment: "Good", affiliation: "Air Nomad" },
    { name: "Katara", gender: "Female", hairColor: "Brown", ageGroup: "Teenager", combatStyle: "Waterbending", alignment: "Good", affiliation: "Water Tribe" },
    { name: "Zuko", gender: "Male", hairColor: "Black", ageGroup: "Teenager", combatStyle: "Firebending", alignment: "Morally Ambiguous", affiliation: "Fire Nation" },
    { name: "Toph", gender: "Female", hairColor: "Black", ageGroup: "Teenager", combatStyle: "Earthbending", alignment: "Good", affiliation: "Earth Kingdom" },
    { name: "Sokka", gender: "Male", hairColor: "Brown", ageGroup: "Teenager", combatStyle: "Non-Bender", alignment: "Good", affiliation: "Water Tribe" },
    { name: "Azula", gender: "Female", hairColor: "Black", ageGroup: "Teenager", combatStyle: "Firebending", alignment: "Evil", affiliation: "Fire Nation" },
    { name: "Iroh", gender: "Male", hairColor: "Gray", ageGroup: "Adult", combatStyle: "Firebending", alignment: "Good", affiliation: "Fire Nation" },
    { name: "Ty Lee", gender: "Female", hairColor: "Brown", ageGroup: "Teenager", combatStyle: "Chi Blocking", alignment: "Neutral", affiliation: "Fire Nation" },
    { name: "Mai", gender: "Female", hairColor: "Black", ageGroup: "Teenager", combatStyle: "Throwing Weapons", alignment: "Neutral", affiliation: "Fire Nation" },
    { name: "King Bumi", gender: "Male", hairColor: "White", ageGroup: "Elder", combatStyle: "Earthbending", alignment: "Good", affiliation: "Earth Kingdom" }
];

// Variáveis do jogo
let dailyCharacter = characters[Math.floor(Math.random() * characters.length)];
let attempts = 6;
let previousAttempts = [];
let gameStarted = false;

// Função para iniciar o jogo
function iniciarJogo() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("classico-modo").style.display = "block";
    gameStarted = true;
    
    // Focar no input quando o jogo iniciar
    document.getElementById("input-palavra").focus();
}

// Função para verificar o palpite
function checkGuess(guess) {
    const character = characters.find(c => c.name.toLowerCase() === guess.toLowerCase());
    if (!character) {
        return { correct: false, hints: { "Erro": "Personagem não encontrado." } };
    }

    let hints = {};
    for (let key in dailyCharacter) {
        if (key !== "name") {
            if (character[key] === dailyCharacter[key]) {
                hints[key] = "✅ Correto";
            } else {
                hints[key] = "❌ Errado";
            }
        }
    }
    return { correct: character.name === dailyCharacter.name, hints };
}

// Função para obter o caminho da imagem do personagem
function getCharacterImage(characterName) {
    // Mapear nomes para nomes de arquivo
    const imageMap = {
        "Aang": "Aang.png",
        "Katara": "Katara.png", 
        "Zuko": "Zuko.png",
        "Toph": "Toph.png",
        "Sokka": "Sokka.png",
        "Azula": "Azula.png",
        "Iroh": "Iroh.png",
        "Ty Lee": "Ty_Lee.png",
        "Mai": "Mai.png",
        "King Bumi": "King_Bumi.png"
    };
    
    return `img/${imageMap[characterName] || 'classico.png'}`;
}

// Função para criar caixas de características
function createCharacteristicBoxes(hints) {
    return Object.keys(hints).map(key => {
        const isCorrect = hints[key] === "✅ Correto";
        return `
            <div class="characteristic-box ${isCorrect ? 'correct' : 'incorrect'}">
                <div class="characteristic-name">${key}</div>
                <div class="characteristic-value">${isCorrect ? '✓' : '✗'}</div>
            </div>
        `;
    }).join('');
}

// Função para criar exibição de palpites anteriores
function createPreviousGuessesHTML() {
    // Inverter a ordem para mostrar o mais recente primeiro
    return previousAttempts.slice().reverse().map(attempt => {
        let attemptBoxes = createCharacteristicBoxes(attempt.hints);
        
        return `
            <div class="previous-attempt">
                <div class="attempt-name">${attempt.name}</div>
                <div class="attempt-boxes">${attemptBoxes}</div>
            </div>
        `;
    }).join('');
}

// Função para processar o palpite
function processGuess() {
    const guessInput = document.getElementById("input-palavra");
    const guess = guessInput.value.trim();

    if (!guess) {
        alert("Digite um nome antes de enviar!");
        return;
    }

    const result = checkGuess(guess);
    let resultadoDiv = document.getElementById("resultado");

    previousAttempts.push({ name: guess, hints: result.hints });

    if (result.correct) {
        const characterImage = getCharacterImage(dailyCharacter.name);
        resultadoDiv.innerHTML = `
            <div class="victory-message">
                <div class="victory-content">
                    <div class="victory-image">
                        <img src="${characterImage}" alt="${dailyCharacter.name}" class="character-img large">
                    </div>
                    <div class="victory-text">
                        <h2>🎉 Parabéns! Você acertou!</h2>
                        <p>O personagem era: <strong>${dailyCharacter.name}</strong></p>
                        <p>Tentativas usadas: ${7 - attempts}</p>
                        <button onclick="reiniciarJogo()" class="restart-btn">Jogar Novamente</button>
                    </div>
                </div>
            </div>
        `;
        gameStarted = false;
    } else {
        attempts--;

        let boxesHTML = createCharacteristicBoxes(result.hints);
        let previousGuessesHTML = createPreviousGuessesHTML();

        resultadoDiv.innerHTML = `
            <div class="current-attempt">
                <div class="attempt-status">
                    ❌ Personagem Errado! 
                    <br>🔄 Tentativas restantes: ${attempts}
                </div>
            </div>
            <div class="previous-guesses">
                <strong>Palpites anteriores:</strong>
                ${previousGuessesHTML}
            </div>
        `;

        if (attempts === 0) {
            const characterImage = getCharacterImage(dailyCharacter.name);
            resultadoDiv.innerHTML = `
                <div class="game-over-message">
                    <div class="game-over-content">
                        <div class="game-over-image">
                            <img src="${characterImage}" alt="${dailyCharacter.name}" class="character-img large">
                        </div>
                        <div class="game-over-text">
                            <h2>☠️ Fim de jogo!</h2>
                            <p>O personagem era: <strong>${dailyCharacter.name}</strong></p>
                            <button onclick="reiniciarJogo()" class="restart-btn">Tentar Novamente</button>
                        </div>
                    </div>
                </div>
            `;
            gameStarted = false;
        }
    }

    guessInput.value = "";
    guessInput.focus();
}

// Função para reiniciar o jogo
function reiniciarJogo() {
    // Escolher novo personagem aleatório
    dailyCharacter = characters[Math.floor(Math.random() * characters.length)];
    attempts = 6;
    previousAttempts = [];
    gameStarted = true;
    
    // Limpar resultado
    document.getElementById("resultado").innerHTML = "";
    
    // Limpar input
    document.getElementById("input-palavra").value = "";
    document.getElementById("input-palavra").focus();
}

// Event listeners
document.addEventListener("DOMContentLoaded", function() {
    // Botão enviar
    document.getElementById("botao-enviar").addEventListener("click", processGuess);
    
    // Enter no input
    document.getElementById("input-palavra").addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            processGuess();
        }
    });
    
    // Dica: mostrar lista de personagens disponíveis
    document.getElementById("input-palavra").addEventListener("focus", function() {
        if (gameStarted && previousAttempts.length === 0) {
            const characterNames = characters.map(c => c.name).join(", ");
            this.placeholder = `Digite um nome (ex: ${characterNames.split(", ")[0]})`;
        }
    });
});

// Função para mostrar dicas (opcional)
function mostrarDica() {
    if (previousAttempts.length >= 2) {
        const availableHints = Object.keys(dailyCharacter).filter(key => key !== "name");
        const randomHint = availableHints[Math.floor(Math.random() * availableHints.length)];
        alert(`Dica: O personagem tem ${randomHint}: ${dailyCharacter[randomHint]}`);
    } else {
        alert("Faça pelo menos 2 tentativas para receber uma dica!");
    }
}