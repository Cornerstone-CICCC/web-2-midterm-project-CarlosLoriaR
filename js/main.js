$(function () {
    const movieInput = $("#movieInput");
    const searchResults = $("#search-results-list");
    const trendingMoviesContainer = $("#container-movies");
    const trendingTVContainer = $("#container-tv");
    let debounceTimeout = null;

    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YmQxZjAwYjE2ODExMjM1NDVkODM0ZjAxOTMwMjU1ZSIsIm5iZiI6MTc2NDY0MjMxNS4xNzcsInN1YiI6IjY5MmU0ZTBiNzNhYzUxMDE5MjY0YWRkZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0pAbPxUKkIk-KcTzZGEYUsZtl9Fu-fgmvccGHHe0iSw'
        }
    };

    /* RENDER FUNCTIONS  */

    function renderSearch(results) {
        searchResults.html("");

        if (results.length === 0) {
            searchResults.html("<p>No results found.</p>");
            return;
        }

        results.forEach(item => {

            /* FOR PERSONS */
            if (item.media_type === "person") {

                if (!item.profile_path) return;

                const personPoster = `https://image.tmdb.org/t/p/w300${item.profile_path}`;

                searchResults.append(`
                <a href="title.html?q=${item.id}" class="search-card">
                    <img src="${personPoster}">
                    <p class="media-title">${item.name}</p>
                </a>
            `);

                item.known_for?.forEach(media => {
                    if (!media.poster_path) return;

                    const mediaPoster = `https://image.tmdb.org/t/p/w300${media.poster_path}`;
                    const mediaTitle = media.title || media.name;

                    searchResults.append(`
                    <a href="title.html?q=${media.id}" class="search-card">
                        <img src="${mediaPoster}">
                        <p class="media-title">${mediaTitle}</p>
                        <p>Media type: ${media.media_type.toUpperCase()}</p>
                        <p class="media-overview">${media.overview}</p>
                    </a>
                `);
                });

                return;
            }

            /* FOR MOVIES AND TV SHOWS */
            if (!item.poster_path) return;

            const title = item.title || item.name;
            const poster = `https://image.tmdb.org/t/p/w300${item.poster_path}`;

            searchResults.append(`
            <a href="title.html?q=${item.id}" class="search-card">
                <img src="${poster}">
                <p class="media-title">${title}</p>
                <p>Media type: ${item.media_type.toUpperCase()}</p>
                <p class="media-overview">${item.overview}</p>
            </a>
        `);
        });
    }



    function renderMovies(movies) {
        trendingMoviesContainer.html("");

        movies.forEach(movie => {
            trendingMoviesContainer.append(`
                <a href="title.html?q=${movie.id}" class="movie-card">
                    <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}">
                    <div class="movie-details">
                    <p class="media-title"">${movie.title}</p>
                    <p>Release date: ${movie.release_date.slice(0, 4)}</p>
                    <p>Rating: ${Math.ceil(movie.vote_average)}/10</p>
                    </div>
                </a>
            `);
        });
    }

    function renderTV(tvShows) {
        trendingTVContainer.html("");

        tvShows.forEach(show => {
            trendingTVContainer.append(`
                <a href="title.html?q=${show.id}" class="tv-card">
                        <img src="https://image.tmdb.org/t/p/w300${show.poster_path}">
                        <div class="tv-details">
                        <p class="media-title">${show.name}</p>
                        <p>Release date: ${show.first_air_date.slice(0, 4)}</p>
                        <p>Rating: ${Math.ceil(show.vote_average)}/10</p>
                        </div>
                </a>
                
            `);
        });
    }



    /* API CALLS */

    function trendingMovies() {
        fetch("https://api.themoviedb.org/3/trending/movie/day?language=en-US", options)
            .then(r => r.json())
            .then(data => renderMovies(data.results))
            .catch(console.error);
    }

    function trendingTV() {
        fetch("https://api.themoviedb.org/3/trending/tv/day?language=en-US", options)
            .then(r => r.json())
            .then(data => renderTV(data.results))
            .catch(console.error);
    }

    function multi() {
        const movie = movieInput.val().trim();
        if (!movie) return;

        fetch(`https://api.themoviedb.org/3/search/multi?query=${movie}&include_adult=false&language=en-US&page=1`, options)
            .then(r => r.json())
            // .then(res => console.log(res))
            .then(data => renderSearch(data.results))
            .catch(console.error);
    }

    /* INPUT EVENT */

    movieInput.on("keyup", function () {
        if (debounceTimeout) clearTimeout(debounceTimeout);

        debounceTimeout = setTimeout(() => {
            const value = movieInput.val().trim();
            if (value.length > 1) {
                multi();
            } else {
                searchResults.html("");
            }
        }, 350);
    });

    trendingMovies();
    trendingTV();
});
