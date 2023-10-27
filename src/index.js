'use strict';

document.addEventListener("DOMContentLoaded", () => {
    // Define constants
    const BASE_URL = "http://localhost:3000";
    let availableTickets = 0;
    let filmData = null; // Store movie data globally

    // Function to fetch movie details and update the UI
    const fetchMovieDetails = async (filmsId) => {
        try {
            const response = await fetch(`${BASE_URL}/films/${filmsId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch movie details.");
            }
            filmData = await response.json();

            updateMovieDetailsUI(filmData);
        } catch (error) {
            console.error("Error fetching movie details:", error);
        }
    };

    // Function to update the DOM elements with movie details
    const updateMovieDetailsUI = (data) => {
        const {
            title,
            runtime,
            showtime,
            capacity,
            tickets_sold,
            description,
            poster,
        } = data;

        availableTickets = capacity - tickets_sold;

        document.getElementById("poster").src = poster;
        document.getElementById("title").textContent = title;
        document.getElementById("runtime").textContent = `${runtime} minutes`;
        document.getElementById("showtime").textContent = showtime;
        document.getElementById("ticket-num").textContent = availableTickets;
        document.getElementById("film-info").textContent = description;
        updateAvailableTicketsUI();
    };

    // Function to update available tickets and handle ticket purchase
    const updateAvailableTicketsUI = () => {
        const buyButton = document.getElementById("buy-ticket");
        const ticketNumElement = document.getElementById("ticket-num");

        ticketNumElement.textContent = availableTickets;
        buyButton.disabled = availableTickets === 0;
    };

    // Function to simulate a ticket purchase
    const buyTicket = async () => {
        try {
            if (availableTickets > 0) {
                availableTickets -= 1;
                updateAvailableTicketsUI();

                // Simulate updating the server (in reality, make an API call)
                const newTicketsSold = filmData.capacity - availableTickets;

                setTimeout(() => {
                    filmData.tickets_sold = newTicketsSold;
                    // Simulate updating the server (in reality, make an API call)
                }, 1000);
            }
        } catch (error) {
            console.error("Error purchasing ticket:", error);
        }
    };

    // Function to populate the movie list
    const populateMovieList = async () => {
        try {
            const filmsList = document.getElementById("films");
            const response = await fetch(`${BASE_URL}/films`);
            if (!response.ok) {
                throw new Error("Failed to fetch movie list.");
            }
            const films = await response.json();
            films.forEach((film) => {
                const li = document.createElement("li");
                li.textContent = film.title;
                li.classList.add("film-item");
                li.addEventListener("click", () => {
                    fetchMovieDetails(film.id);
                });
                filmsList.appendChild(li);
            });
        } catch (error) {
            console.error("Error fetching movie list:", error);
        }
    };

    // Remove the placeholder <li> element if it exists
    const placeholderLi = document.querySelector("#films > li");
    if (placeholderLi) {
        placeholderLi.remove();
    }

    // Call populateMovieList to fetch and display the list of movies
    populateMovieList();

    // Add a click event listener to the "Buy Ticket" button
    const buyButton = document.getElementById("buy-ticket");
    buyButton.addEventListener("click", buyTicket);

    // Fetch and display movie details for the first movie
    fetchMovieDetails(1);
});
