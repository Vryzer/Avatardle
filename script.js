const personagens = [
    { nome: "Aang", genero: "Masculino", corDoCabelo: "Nenhum", faixaEtaria: "Adolescente", estiloCombate: "Dobra de Ar", alinhamento: "Bom", afiliacao: "Nômade do Ar" },
    { nome: "Katara", genero: "Feminino", corDoCabelo: "Castanho", faixaEtaria: "Adolescente", estiloCombate: "Dobra de Água", alinhamento: "Bom", afiliacao: "Tribo da Água" },
    { nome: "Zuko", genero: "Masculino", corDoCabelo: "Preto", faixaEtaria: "Adolescente", estiloCombate: "Dobra de Fogo", alinhamento: "Moralmente Ambíguo", afiliacao: "Nação do Fogo" },
    { nome: "Toph", genero: "Feminino", corDoCabelo: "Preto", faixaEtaria: "Adolescente", estiloCombate: "Dobra de Terra", alinhamento: "Bom", afiliacao: "Reino da Terra" },
    { nome: "Sokka", genero: "Masculino", corDoCabelo: "Castanho", faixaEtaria: "Adolescente", estiloCombate: "Não-Dobrador", alinhamento: "Bom", afiliacao: "Tribo da Água" },
    { nome: "Azula", genero: "Feminino", corDoCabelo: "Preto", faixaEtaria: "Adolescente", estiloCombate: "Dobra de Fogo", alinhamento: "Mau", afiliacao: "Nação do Fogo" },
    { nome: "Iroh", genero: "Masculino", corDoCabelo: "Cinza", faixaEtaria: "Adulto", estiloCombate: "Dobra de Fogo", alinhamento: "Bom", afiliacao: "Nação do Fogo" },
    { nome: "Ty Lee", genero: "Feminino", corDoCabelo: "Castanho", faixaEtaria: "Adolescente", estiloCombate: "Bloqueio de Chi", alinhamento: "Neutro", afiliacao: "Nação do Fogo" },
    { nome: "Mai", genero: "Feminino", corDoCabelo: "Preto", faixaEtaria: "Adolescente", estiloCombate: "Armas de Arremesso", alinhamento: "Neutro", afiliacao: "Nação do Fogo" },
    { nome: "Rei Bumi", genero: "Masculino", corDoCabelo: "Branco", faixaEtaria: "Idoso", estiloCombate: "Dobra de Terra", alinhamento: "Bom", afiliacao: "Reino da Terra" }
];

// Variáveis do jogo
let personagemDoDia = personagens[Math.floor(Math.random() * personagens.length)];
let tentativas = 6;
let tentativasAnteriores = [];
let jogoIniciado = false;

// Função para iniciar o jogo
function iniciarJogo() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("classico-modo").style.display = "block";
    jogoIniciado = true;
    
    // Focar no input quando o jogo iniciar
    document.getElementById("input-palavra").focus();
}

// Função para verificar o palpite
function verificarPalpite(palpite) {
    const personagem = personagens.find(p => p.nome.toLowerCase() === palpite.toLowerCase());
    if (!personagem) {
        return { correto: false, dicas: { "Erro": "Personagem não encontrado." } };
    }

    let dicas = {};
    for (let chave in personagemDoDia) {
        if (chave !== "nome") {
            const estaCorreto = personagem[chave] === personagemDoDia[chave];
            dicas[chave] = { correto: estaCorreto, valor: personagem[chave] };
        }
    }
    return { correto: personagem.nome === personagemDoDia.nome, dicas };
}

// Função para obter o caminho da imagem do personagem
function obterImagemPersonagem(nomePersonagem) {
    // Mapear nomes para nomes de arquivo
    const mapaImagens = {
        "Aang": "Aang.png",
        "Katara": "Katara.png", 
        "Zuko": "Zuko.png",
        "Toph": "Toph.png",
        "Sokka": "Sokka.png",
        "Azula": "Azula.png",
        "Iroh": "Iroh.png",
        "Ty Lee": "Ty_Lee.png",
        "Mai": "Mai.png",
        "Rei Bumi": "King_Bumi.png"
    };
    
    return `img/${mapaImagens[nomePersonagem] || 'classico.png'}`;
}

// Função para criar caixas de características
function criarCaixasCaracteristicas(dicas) {
    return Object.keys(dicas).map(chave => {
        const info = dicas[chave];
        const estaCorreto = info.correto === true;
        const valorMostrado = info.valor;
        return `
            <div class="characteristic-box ${estaCorreto ? 'correct' : 'incorrect'}">
                <div class="characteristic-name">${chave}</div>
                <div class="characteristic-value">${valorMostrado}</div>
            </div>
        `;
    }).join('');
}

// Função para criar exibição de palpites anteriores
function criarHTMLPalpitesAnteriores() {
    // Inverter a ordem para mostrar o mais recente primeiro
    return tentativasAnteriores.slice().reverse().map(tentativa => {
        let caixasTentativa = criarCaixasCaracteristicas(tentativa.dicas);
        
        return `
            <div class="previous-attempt">
                <div class="attempt-name">${tentativa.nome}</div>
                <div class="attempt-boxes">${caixasTentativa}</div>
            </div>
        `;
    }).join('');
}

// Função para processar o palpite
function processarPalpite() {
    const inputPalavra = document.getElementById("input-palavra");
    const palpite = inputPalavra.value.trim();

    if (!palpite) {
        alert("Digite um nome antes de enviar!");
        return;
    }

    const resultado = verificarPalpite(palpite);
    let resultadoDiv = document.getElementById("resultado");

    tentativasAnteriores.push({ nome: palpite, dicas: resultado.dicas });

    if (resultado.correto) {
        const imagemPersonagem = obterImagemPersonagem(personagemDoDia.nome);
        resultadoDiv.innerHTML = `
            <div class="victory-message">
                <div class="victory-content">
                    <div class="victory-image">
                        <img src="${imagemPersonagem}" alt="${personagemDoDia.nome}" class="character-img large">
                    </div>
                    <div class="victory-text">
                        <h2>🎉 Parabéns! Você acertou!</h2>
                        <p>O personagem era: <strong>${personagemDoDia.nome}</strong></p>
                        <p>Tentativas usadas: ${7 - tentativas}</p>
                        <button onclick="reiniciarJogo()" class="restart-btn">Jogar Novamente</button>
                    </div>
                </div>
            </div>
        `;
        jogoIniciado = false;
    } else {
        tentativas--;

        let caixasHTML = criarCaixasCaracteristicas(resultado.dicas);
        let palpitesAnterioresHTML = criarHTMLPalpitesAnteriores();

        resultadoDiv.innerHTML = `
            <div class="current-attempt">
                <div class="attempt-status">
                    ❌ Personagem Errado! 
                    <br>🔄 Tentativas restantes: ${tentativas}
                </div>
            </div>
            <div class="previous-guesses">
                <strong>Palpites anteriores:</strong>
                ${palpitesAnterioresHTML}
            </div>
        `;

        if (tentativas === 0) {
            const imagemPersonagem = obterImagemPersonagem(personagemDoDia.nome);
            resultadoDiv.innerHTML = `
                <div class="game-over-message">
                    <div class="game-over-content">
                        <div class="game-over-image">
                            <img src="${imagemPersonagem}" alt="${personagemDoDia.nome}" class="character-img large">
                        </div>
                        <div class="game-over-text">
                            <h2>☠️ Fim de jogo!</h2>
                            <p>O personagem era: <strong>${personagemDoDia.nome}</strong></p>
                            <button onclick="reiniciarJogo()" class="restart-btn">Tentar Novamente</button>
                        </div>
                    </div>
                </div>
            `;
            jogoIniciado = false;
        }
    }

    inputPalavra.value = "";
    inputPalavra.focus();
}

// Função para reiniciar o jogo
function reiniciarJogo() {
    // Escolher novo personagem aleatório
    personagemDoDia = personagens[Math.floor(Math.random() * personagens.length)];
    tentativas = 6;
    tentativasAnteriores = [];
    jogoIniciado = true;
    
    // Limpar resultado
    document.getElementById("resultado").innerHTML = "";
    
    // Limpar input
    document.getElementById("input-palavra").value = "";
    document.getElementById("input-palavra").focus();
}

// Event listeners
document.addEventListener("DOMContentLoaded", function() {
    // Botão enviar
    document.getElementById("botao-enviar").addEventListener("click", processarPalpite);
    
    // Enter no input
    document.getElementById("input-palavra").addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            processarPalpite();
        }
    });
    
    // Dica: mostrar lista de personagens disponíveis
    document.getElementById("input-palavra").addEventListener("focus", function() {
        if (jogoIniciado && tentativasAnteriores.length === 0) {
            const nomesPersonagens = personagens.map(p => p.nome).join(", ");
            this.placeholder = `Digite um nome (ex: ${nomesPersonagens.split(", ")[0]})`;
        }
    });
});

// Função para mostrar dicas (opcional)
function mostrarDica() {
    if (tentativasAnteriores.length >= 2) {
        const dicasDisponiveis = Object.keys(personagemDoDia).filter(chave => chave !== "nome");
        const dicaAleatoria = dicasDisponiveis[Math.floor(Math.random() * dicasDisponiveis.length)];
        alert(`Dica: O personagem tem ${dicaAleatoria}: ${personagemDoDia[dicaAleatoria]}`);
    } else {
        alert("Faça pelo menos 2 tentativas para receber uma dica!");
    }
}