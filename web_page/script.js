fetch('parsing_data/films.json')
    .then(response => response.json())
    .then(data => {
        const filmList = document.getElementById('film-list');
        data.forEach(film => {
            const filmDiv = document.createElement('div');
            filmDiv.classList.add('film-card');
            filmDiv.innerHTML = `
                <h2>${film.title}</h2>
                <p>Year: ${film.year}</p>
                <p>Director: ${film.director}</p>
                <p>Box Office: ${film.box_office}</p>
            `;
            filmList.appendChild(filmDiv);
        });
    })
    .catch(err => console.error(err));
