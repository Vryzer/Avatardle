const characters = [
    { name: "Aang", gender: "Male", hairColor: "None", ageGroup: "Teenager", combatStyle: "Airbending", alignment: "Good", affiliation: "Air Nomad", firstSeason: "Air" },
    { name: "Katara", gender: "Female", hairColor: "Brown", ageGroup: "Teenager", combatStyle: "Waterbending", alignment: "Good", affiliation: "Water Tribe", firstSeason: "Water" },
    { name: "Zuko", gender: "Male", hairColor: "Black", ageGroup: "Teenager", combatStyle: "Firebending", alignment: "Morally Ambiguous", affiliation: "Fire Nation", firstSeason: "Fire" }
];

const dailyCharacter = characters[Math.floor(Math.random() * characters.length)];
let attempts = 6;
let previousAttempts = []; // Para armazenar os palpites anteriores

document.getElementById("botao-enviar").addEventListener("click", () => {
    const guessInput = document.getElementById("input-palavra");
    const guess = guessInput.value.trim(); // Remove espaços extras

    if (!guess) {
        alert("Digite um nome antes de enviar!");
        return;
    }

    const result = checkGuess(guess);
    let resultadoDiv = document.getElementById("resultado");

    if (result.correct) {
        resultadoDiv.innerHTML = `<strong>🎉 Parabéns! Você acertou: ${dailyCharacter.name}</strong>`;
    } else {
        attempts--;
        previousAttempts.push({ name: guess, hints: result.hints });

        let hintsText = Object.keys(result.hints).map(key => 
            `<strong>${key}:</strong> ${result.hints[key]}`
        ).join("<br>");

        let previousGuessesText = previousAttempts.map(attempt =>
            `<li>${attempt.name} - Dicas: ${JSON.stringify(attempt.hints)}</li>`
        ).join("");

        resultadoDiv.innerHTML = `
            ❌ Errado! <br>
            <strong>Dicas:</strong> <br>${hintsText} <br>
            🔄 Tentativas restantes: ${attempts} <br>
            <strong>Palpites anteriores:</strong>
            <ul>${previousGuessesText}</ul>
        `;

        if (attempts === 0) {
            resultadoDiv.innerHTML = `☠️ Fim de jogo! O personagem era <strong>${dailyCharacter.name}</strong>`;
        }
    }

    guessInput.value = ""; // Limpa o campo após o envio
});

function checkGuess(guess) {
    const character = characters.find(c => c.name.toLowerCase() === guess.toLowerCase());
    if (!character) return { correct: false, hints: { "Erro": "Personagem não encontrado." } };

    let hints = {};
    for (let key in dailyCharacter) {
        if (key !== "name") {
            hints[key] = character[key] === dailyCharacter[key] ? "✅ Correto" : `❌ Errado, pista: ${dailyCharacter[key]}`;
        }
    }
    return { correct: character.name === dailyCharacter.name, hints };
}

function mostrarModo(modo) {
    // Ocultar todos os modos
    const modos = document.querySelectorAll(".modo");
    modos.forEach(modo => {
        modo.style.display = "none";
    });

    // Mostrar o modo selecionado
    const modoSelecionado = document.getElementById(modo + "-modo");
    if (modoSelecionado) {
        modoSelecionado.style.display = "block";
    }
}
