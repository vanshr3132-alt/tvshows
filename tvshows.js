const form = document.querySelector('#movies');
const input = document.querySelector('#good');
const results = document.querySelector('#results');
const loader = document.querySelector('#loader');

// Helper function to show Skeleton Placeholders
function showSkeletons(count = 6) {
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

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const query = input.value.trim();

    if (!query) {
        alert("Please enter something");
        return;
    }

    // 1. Show Spinner and Skeleton Loaders immediately
    if (loader) loader.classList.remove('hidden');
    showSkeletons(8);

    try {
        const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
        const data = response.data;
        
        // Clear skeleton placeholders
        results.innerHTML = "";

        if (data.length === 0) {
            results.innerHTML = "<p>No shows found 😶‍🌫️</p>";
            return;
        }

        // 2. Render actual show cards
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

            // Modal Trigger
            card.addEventListener("click", () => {
                modalImg.src = show.image?.original || show.image?.medium || imgUrl;
                modalTitle.innerText = show.name;
                modalRating.innerText = `Rating: ${show.rating?.average ?? "N/A"}`;
                modalGenres.innerText = `Genres: ${show.genres?.length ? show.genres.join(", ") : "N/A"}`;
                modalSummary.innerHTML = show.summary || "No summary available.";

                const trailerUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(show.name + " trailer")}`;
                if (trailerBtn.tagName === 'A') {
                    trailerBtn.href = trailerUrl;
                    trailerBtn.target = "_blank";
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
    } finally {
        // 3. Always hide spinner after request completes (success or fail)
        if (loader) loader.classList.add('hidden');
    }

    input.value = "";
});
