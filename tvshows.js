// --- Element Selectors ---
const form = document.querySelector('#movies');
const input = document.querySelector('#good');
const results = document.querySelector('#results');
const loader = document.querySelector('#loader');

const modal = document.querySelector('#modal');
const closeModal = document.querySelector('#closeModal');
const modalImg = document.querySelector('#modalImg');
const modalTitle = document.querySelector('#modalTitle');
const modalRating = document.querySelector('#modalRating');
const modalGenres = document.querySelector('#modalGenres');
const modalSummary = document.querySelector('#modalSummary');
const trailerBtn = document.querySelector('#trailerBtn');

// --- Helper: Render Skeleton Loading Cards ---
function showSkeletons(count = 8) {
    results.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const skeletonCard = document.createElement("div");
        skeletonCard.classList.add("card", "skeleton");
        skeletonCard.innerHTML = `
            <div class="skeleton-img"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text short"></div>
        `;
        results.append(skeletonCard);
    }
}

// --- Search Form Submit Listener ---
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const query = input.value.trim();

    if (!query) {
        alert("Please enter something");
        return;
    }

    // 1. Show spinner & skeleton card placeholders
    if (loader) loader.classList.remove('hidden');
    showSkeletons(8);

    try {
        const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
        const data = response.data;

        // Clear skeletons
        results.innerHTML = "";

        if (data.length === 0) {
            results.innerHTML = "<p>No shows found 😶‍🌫️</p>";
            return;
        }

        // 2. Build and display show cards
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

            // Open modal on card click (uses pre-fetched search data)
            card.addEventListener("click", () => {
                modalImg.src = show.image?.original || show.image?.medium || imgUrl;
                modalTitle.innerText = show.name;
                modalRating.innerText = `Rating: ${show.rating?.average ?? "N/A"}`;
                modalGenres.innerText = `Genres: ${show.genres?.length ? show.genres.join(", ") : "N/A"}`;
                modalSummary.innerHTML = show.summary || "No summary available.";

                const trailerUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(show.name + " trailer")}`;

                if (trailerBtn) {
                    if (trailerBtn.tagName === 'A') {
                        trailerBtn.href = trailerUrl;
                        trailerBtn.target = "_blank";
                    } else {
                        trailerBtn.onclick = () => window.open(trailerUrl, "_blank");
                    }
                }

                modal.classList.remove("hidden");
            });
        }

        // Fun Easter Egg
        if (query.toLowerCase() === "dark") {
            const msgg = document.createElement("p");
            msgg.classList.add("msg");
            msgg.innerText = "You've got good taste😎";
            results.append(msgg);
        }

    } catch (err) {
        console.error(err);
        results.innerHTML = "<p>Something went wrong. Try again later.</p>";
    } finally {
        // 3. Hide loading spinner
        if (loader) loader.classList.add('hidden');
    }

    input.value = "";
});

// --- Modal Close Handlers ---

// 1. Close button click
if (closeModal) {
    closeModal.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevents event bubbling issues
        modal.classList.add("hidden");
    });
}

// 2. Click outside modal content (backdrop)
if (modal) {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.add("hidden");
        }
    });
}

// 3. Keyboard Escape key press
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
        modal.classList.add("hidden");
    }
});
