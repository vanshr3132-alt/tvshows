const form = document.querySelector('#movies');
const input = document.querySelector('#good');
const results = document.querySelector('#results');

const modal = document.querySelector('#modal');
const closeModal = document.querySelector('#closeModal');
const modalImg = document.querySelector('#modalImg');
const modalTitle = document.querySelector('#modalTitle');
const modalRating = document.querySelector('#modalRating');
const modalGenres = document.querySelector('#modalGenres');
const modalSummary = document.querySelector('#modalSummary');
const trailerBtn = document.querySelector('#trailerBtn');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const query = input.value.trim();

    if (!query) {
        alert("Please enter something");
        return;
    }

    try {
        const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
        const data = response.data;
        results.innerHTML = "";

        if (data.length === 0) {
            results.innerHTML = "<p>No shows found 😶‍🌫️</p>";
            return;
        }

        for (let result of data) {
            const show = result.show;
            const imgUrl = show.image?.medium || "https://via.placeholder.com/210x295?text=No+Image";

            const card = document.createElement("div");
            card.classList.add("card");

            const img = document.createElement("img");
            img.src = imgUrl;
            img.alt = show.name;

            const title = document.createElement("p");
            title.innerText = show.name;

            const rating = document.createElement("p");
            rating.innerText = `⭐ ${show.rating?.average ?? "N/A"}`;

            card.append(img, title, rating);
            results.append(card);

            // Open Modal using existing 'show' data (no secondary API call needed)
            card.addEventListener("click", () => {
                modalImg.src = show.image?.original || show.image?.medium || imgUrl;
                modalTitle.innerText = show.name;
                modalRating.innerText = `Rating: ${show.rating?.average ?? "N/A"}`;
                modalGenres.innerText = `Genres: ${show.genres?.length ? show.genres.join(", ") : "N/A"}`;
                modalSummary.innerHTML = show.summary || "No summary available.";

                // Set YouTube search URL
                const trailerUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(show.name + " trailer")}`;
                
                if (trailerBtn.tagName === 'A') {
                    trailerBtn.href = trailerUrl;
                    trailerBtn.target = "_blank"; // Open trailer in a new tab
                } else {
                    trailerBtn.onclick = () => window.open(trailerUrl, "_blank");
                }

                modal.classList.remove("hidden");
            });
        }

        if (query.toLowerCase() === "dark") {
            const msgg = document.createElement("p");
            msgg.classList.add("msg");
            msgg.innerText = "You've got good taste😎";
            results.append(msgg);
        }

    } catch (err) {
        console.error(err);
        results.innerHTML = "<p>Something went wrong. Try again later.</p>";
    }

    input.value = "";
});

// Close modal handlers
closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
});
