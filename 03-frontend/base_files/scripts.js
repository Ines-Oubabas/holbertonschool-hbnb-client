document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication(); // Vérifie si l'utilisateur est authentifié

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Empêche le comportement par défaut du formulaire

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            await loginUser(email, password); // Appelle la fonction de connexion
        });
    }

    const countryFilter = document.getElementById('country-filter');
    if (countryFilter) {
        countryFilter.addEventListener('change', (event) => {
            const selectedCountry = event.target.value.toLowerCase();
            const placeCards = document.querySelectorAll('.place-card');

            placeCards.forEach(card => {
                const placeLocation = card.querySelector('p:nth-of-type(1)').innerText.toLowerCase();
                if (selectedCountry === 'all' || placeLocation.includes(selectedCountry)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });

        fetchCountries(); // Fetch and populate country filter options
    }

    fetchPlaces(); // Fetch and display places
});

async function fetchCountries() {
    try {
        const response = await fetch('http://localhost:5000/countries');
        if (response.ok) {
            const countries = await response.json();
            const countryFilter = document.getElementById('country-filter');

            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.code.toLowerCase();
                option.innerText = country.name;
                countryFilter.appendChild(option);
            });
        } else {
            console.error('Erreur lors de la récupération des pays :', response.statusText);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des pays :', error);
    }
}

async function fetchPlaces() {
    const token = getCookie('token');
    try {
        const response = await fetch('http://localhost:5000/places', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const places = await response.json();
            displayPlaces(places);
        } else {
            console.error('Erreur lors de la récupération des lieux :', response.statusText);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des lieux :', error);
    }
}

function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    if (!placesList) return;

    placesList.innerHTML = ''; // Vide la liste actuelle

    places.forEach(place => {
        const placeCard = document.createElement('div');
        placeCard.classList.add('place-card');

        placeCard.innerHTML = `
            <img src="place1.jpg" class="place-image" alt="${place.name}">
            <h3>${place.name}</h3>
            <p>${place.city_name}, ${place.country_name}</p>
            <p>Prix par nuit : $${place.price_per_night}</p>
            <button class="details-button" onclick="viewDetails('${place.id}')">Voir les détails</button>
        `;

        placesList.appendChild(placeCard);
    });
}

function viewDetails(placeId) {
    window.location.href = `place.html?id=${placeId}`;
}
