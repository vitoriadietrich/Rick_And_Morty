let nextPageUrl = 'https://rickandmortyapi.com/api/character';
const grid = document.getElementById('characters-grid');
const loadMoreBtn = document.getElementById('load-more-btn');

// Função assíncrona principal para buscar dados da API
async function fetchCharacters(url) {
    if (!url) return;

    try {
        // Altera o estado do botão para feedback visual ao usuário
        loadMoreBtn.innerText = 'carregando...';
        loadMoreBtn.disabled = true;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro ao carregar dados do Multiverso.');

        const data = await response.json();
        
        // Atualiza o ponteiro para a próxima página da API
        nextPageUrl = data.info.next;

        // Renderiza os cards na tela
        renderCards(data.results);

        // Restaura o botão se houver mais páginas, senão esconde-o
        if (nextPageUrl) {
            loadMoreBtn.innerText = 'carregar mais';
            loadMoreBtn.disabled = false;
        } else {
            loadMoreBtn.style.display = 'none';
        }

    } catch (error) {
        console.error(error);
        loadMoreBtn.innerText = 'Erro ao carregar';
    }
}

// Mapeia o array recebido e injeta os novos elementos na grid existente
function renderCards(characters) {
    characters.forEach(char => {
        const card = document.createElement('div');
        card.className = 'character-card';

        // Tratamento de cor e ícone dinâmico baseado no Status
        let statusClass = 'status-unknown';
        let statusIcon = '⚙'; // Desconhecido
        if (char.status.toLowerCase() === 'alive') {
            statusClass = 'status-alive';
            statusIcon = '⚡';
        } else if (char.status.toLowerCase() === 'dead') {
            statusClass = 'status-dead';
            statusIcon = '💀';
        }

        card.innerHTML = `
            <div class="card-img-container">
                <img src="${char.image}" alt="${char.name}" loading="lazy">
            </div>
            <div class="card-info">
                <h3 class="char-name" title="${char.name}">${char.name}</h3>
                
                <div class="char-detail">
                    <span class="detail-icon ${statusClass}">${statusIcon}</span>
                    <span>${char.status}</span>
                </div>
                
                <div class="char-detail">
                    <span class="detail-icon">💀</span>
                    <span>${char.species}</span>
                </div>
                
                <div class="char-detail">
                    <span class="detail-icon">🪐</span>
                    <span title="${char.origin.name}">${char.origin.name}</span>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Event Listeners
loadMoreBtn.addEventListener('click', () => fetchCharacters(nextPageUrl));

// Execução inicial ao abrir a aplicação
fetchCharacters(nextPageUrl);