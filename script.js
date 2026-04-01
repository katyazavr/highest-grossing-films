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
        createCountryChart(filmsData);
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
            ${film.country ? `<p><strong>Country:</strong> ${film.country}</p>` : ''}
        `;

        filmsContainer.appendChild(filmCard);
    });
}

// Filter by director
filterInput.addEventListener('input', () => {
    const query = filterInput.value.toLowerCase();
    const filtered = filmsData.filter(film => film.director.toLowerCase().includes(query));
    displayFilms(filtered);
    createCountryChart(filtered); // обновляем график под фильтр
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

// Create Country Chart
function createCountryChart(films) {
    const countryCounts = {};
    films.forEach(film => {
        if (film.country) {
            countryCounts[film.country] = (countryCounts[film.country] || 0) + 1;
        }
    });

    const countries = Object.keys(countryCounts);
    const counts = Object.values(countryCounts);

    const ctx = document.getElementById('countryChart').getContext('2d');

    // Удаляем старый график, если он был
    if (window.countryChartInstance) window.countryChartInstance.destroy();

    window.countryChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: countries,
            datasets: [{
                label: 'Number of Films',
                data: counts,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Number of Films per Country' }
            },
            scales: { y: { beginAtZero: true } }
        }
    });
}
