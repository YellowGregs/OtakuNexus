document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('search-bar');
    const autocompleteList = document.getElementById('autocomplete-list');
    const animeImage = document.getElementById('anime-image');
    const animeTitle = document.getElementById('anime-title');
    const animeGenres = document.getElementById('anime-genres');
    const animeDescription = document.getElementById('anime-description');
    const episodeDropdown = document.getElementById('episode-dropdown');
    const episodeList = document.getElementById('episode-list');

    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');

    fetch(`https://api-anime-info.vercel.app/anime/gogoanime/info/${animeId}`)
        .then(response => response.json())
        .then(data => {
            document.title = `OtakuNexus - ${data.title} Detail`;

            animeImage.src = data.image;
            animeTitle.textContent = data.title;
            animeDescription.textContent = data.description;

            data.genres.forEach(genre => {
                const genreElement = document.createElement('span');
                genreElement.textContent = genre;
                genreElement.classList.add('genre');
                animeGenres.appendChild(genreElement);
            });

            const episodes = data.episodes;
            let currentRangeStart = 1;
            while (currentRangeStart <= episodes.length) {
                const option = document.createElement('option');
                const currentRangeEnd = Math.min(currentRangeStart + 99, episodes.length);
                option.value = `${currentRangeStart}-${currentRangeEnd}`;
                option.textContent = `${currentRangeStart}-${currentRangeEnd}`;
                episodeDropdown.appendChild(option);
                currentRangeStart = currentRangeEnd + 1;
            }

            episodeDropdown.addEventListener('change', () => {
                const [start, end] = episodeDropdown.value.split('-').map(Number);
                episodeList.innerHTML = '';
                for (let i = start - 1; i < end; i++) {
                    const episode = episodes[i];
                    const episodeCard = document.createElement('div');
                    episodeCard.classList.add('anime-card');
                    episodeCard.innerHTML = `
                        <p>Episode ${episode.number}</p>
                    `;
                    episodeCard.addEventListener('click', () => {
                        window.location.href = `watch.html?episodeId=${episode.id}`;
                    });
                    episodeList.appendChild(episodeCard);
                }
            });

            episodeDropdown.dispatchEvent(new Event('change'));
        })
        .catch(error => console.error('Fetching anime details failed:', error));

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
