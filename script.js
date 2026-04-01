const dataPath = 'parsing_data/films.json';
const filmsContainer = document.getElementById('filmsContainer');
const sortSelect = document.getElementById('sortSelect');

let filmsData = [];

fetch(dataPath)
    .then(res => res.json())
    .then(data => {
        filmsData = data;
        displayFilms(filmsData);
        createCountryChart(filmsData);
    })
    .catch(err => console.error(err));

// Display films in horizontal slider with hover effect
function displayFilms(films) {
    filmsContainer.innerHTML = '';

    films.forEach(film => {
        const card = document.createElement('div');
        card.classList.add('film-card');

        card.innerHTML = `
            <h3>${film.title}</h3>
            <div class="details">
                <p><strong>Director:</strong> ${film.director}</p>
                <p><strong>Year:</strong> ${film.year}</p>
                <p><strong>Box Office:</strong> $${film.box_office.toLocaleString()}</p>
                ${film.country ? `<p><strong>Country:</strong> ${Array.isArray(film.country) ? film.country.join(', ') : film.country}</p>` : ''}
            </div>
        `;

        filmsContainer.appendChild(card);
    });
}

// Sort by year
sortSelect.addEventListener('change', () => {
    const sorted = [...filmsData].sort((a, b) => {
        return sortSelect.value === 'asc' ? a.year - b.year : b.year - a.year;
    });
    displayFilms(sorted);
});

// Create country chart
function createCountryChart(films) {
    const countryCounts = {};

    films.forEach(film => {
        if (film.country) {
            const countries = Array.isArray(film.country) ? film.country : [film.country];
            countries.forEach(c => {
                countryCounts[c] = (countryCounts[c] || 0) + 1;
            });
        }
    });

    const countries = Object.keys(countryCounts);
    const counts = Object.values(countryCounts);

    const ctx = document.getElementById('countryChart').getContext('2d');

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
