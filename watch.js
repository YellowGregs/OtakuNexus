document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('search-bar');
    const autocompleteList = document.getElementById('autocomplete-list');
    const videoPlayer = document.getElementById('video-player');
    const serverList = document.getElementById('server-list');
    const episodeDropdown = document.getElementById('episode-dropdown');
    const prevEpisodeButton = document.getElementById('prev-episode');
    const nextEpisodeButton = document.getElementById('next-episode');

    const urlParams = new URLSearchParams(window.location.search);
    const episodeId = urlParams.get('episodeId');

    let currentEpisodeNumber;

    function loadEpisode(episodeId) {
        fetch(`https://api-anime-info.vercel.app/anime/gogoanime/servers/${episodeId}`)
            .then(response => response.json())
            .then(servers => {
                videoPlayer.innerHTML = '';
                const iframe = document.createElement('iframe');
                iframe.src = servers[0].url;
                iframe.width = '100%';
                iframe.height = '500px';
                iframe.allowFullscreen = true;
                videoPlayer.appendChild(iframe);

                serverList.innerHTML = '';
                servers.forEach(server => {
                    const button = document.createElement('button');
                    button.textContent = server.name;
                    button.addEventListener('click', () => {
                        iframe.src = server.url;
                    });
                    serverList.appendChild(button);
                });

                currentEpisodeNumber = parseInt(episodeId.split('-').pop(), 10);

                fetch(`https://api-anime-info.vercel.app/anime/gogoanime/info/${episodeId.split('-').slice(0, -2).join('-')}`)
                    .then(response => response.json())
                    .then(data => {
                        document.title = `OtakuNexus - Watching ${data.title}`;

                        const episodes = data.episodes;
                        episodeDropdown.innerHTML = '';

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
                            if (currentEpisodeNumber < start || currentEpisodeNumber > end) {
                                window.location.href = `watch.html?episodeId=${episodes[start - 1].id}`;
                            }
                        });

                        const currentRange = Math.floor((currentEpisodeNumber - 1) / 100) + 1;
                        episodeDropdown.value = `${(currentRange - 1) * 100 + 1}-${currentRange * 100}`;

                        const currentIndex = episodes.findIndex(ep => ep.id === episodeId);

                        prevEpisodeButton.addEventListener('click', () => {
                            if (currentIndex > 0) {
                                window.location.href = `watch.html?episodeId=${episodes[currentIndex - 1].id}`;
                            }
                        });

                        nextEpisodeButton.addEventListener('click', () => {
                            if (currentIndex < episodes.length - 1) {
                                window.location.href = `watch.html?episodeId=${episodes[currentIndex + 1].id}`;
                            }
                        });
                    })
                    .catch(error => console.error('Fetching anime details failed:', error));
            })
            .catch(error => console.error('Fetching streaming links failed:', error));
    }

    loadEpisode(episodeId);

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
