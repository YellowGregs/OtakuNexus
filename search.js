document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('search-bar');
    const autocompleteList = document.getElementById('autocomplete-list');
    const searchResultsList = document.getElementById('search-results-list');

    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');

    document.title = `OtakuNexus - Searching "${query}"`;

    fetch(`https://api-anime-info.vercel.app/anime/gogoanime/${query}`)
        .then(response => response.json())
        .then(data => {
            data.results.forEach(anime => {
                const card = document.createElement('div');
                card.classList.add('anime-card');
                card.innerHTML = `
                    <img src="${anime.image}" alt="${anime.title}">
                    <p>${anime.title}</p>
                `;
                card.addEventListener('click', () => {
                    window.location.href = `anime.html?id=${anime.id}`;
                });
                searchResultsList.appendChild(card);
            });
        })
        .catch(error => console.error('Fetching search results failed:', error));

    searchBar.addEventListener('input', function() {
        const query = searchBar.value;
        if (query.length < 3) {
            autocompleteList.innerHTML = '';
            return;
        }
        fetch(`https://api-anime-info.vercel.app/anime/gogoanime/${query}`)
            .then(response => response.json())
            .then(data => {
                autocompleteList.innerHTML = '';
                data.results.forEach(anime => {
                    const item = document.createElement('div');
                    item.innerHTML = `<img src="${anime.image}" alt="Anime Image"><span>${anime.title}</span>`;
                    item.addEventListener('click', () => {
                        window.location.href = `anime.html?id=${anime.id}`;
                    });
                    autocompleteList.appendChild(item);
                });
            })
            .catch(error => console.error('Autocomplete search failed:', error));
    });

    searchBar.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const query = searchBar.value;
            window.location.href = `search.html?query=${query}`;
        }
    });
});
