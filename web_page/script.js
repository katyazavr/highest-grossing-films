// Path to JSON file
const dataPath = 'parsing_data/films.json';

let filmsData = [];

// DOM Elements
const filmsContainer = document.getElementById('filmsContainer');
const filterInput = document.getElementById('filterDirector');
const sortSelect = document.getElementById('sortSelect');

// Load JSON data
fetch(dataPath)
    .then(response => response.json())
    .then(data => {
        filmsData = data;
        displayFilms(filmsData);
    })
    .catch(error => console.error('Error loading JSON:', error));

// Display films in the container
function displayFilms(films) {
    filmsContainer.innerHTML = '';
    films.forEach(film => {
        const filmCard = document.createElement('div');
        filmCard.classList.add('film-card');

        filmCard.innerHTML = `
            <h3>${film.title}</h3>
            <p><strong>Director:</strong> ${film.director}</p>
            <p><strong>Year:</strong> ${film.year}</p>
            <p><strong>Box Office:</strong> $${film.box_office.toLocaleString()}</p>
        `;

        filmsContainer.appendChild(filmCard);
    });
}

// Filter by director
filterInput.addEventListener('input', () => {
    const query = filterInput.value.toLowerCase();
    const filtered = filmsData.filter(film => film.director.toLowerCase().includes(query));
    displayFilms(filtered);
});

// Sort films
sortSelect.addEventListener('change', () => {
    const sortBy = sortSelect.value;
    const sorted = [...filmsData].sort((a, b) => {
        if(sortBy === 'box_office' || sortBy === 'year') {
            return b[sortBy] - a[sortBy]; // Descending for numbers
        }
        return a[sortBy].localeCompare(b[sortBy]); // Alphabetical for strings
    });
    displayFilms(sorted);
});
