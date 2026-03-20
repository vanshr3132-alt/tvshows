// const forms= document.querySelector('#movies');
// const results= document.querySelector("#results");
// const vals= document.querySelector("#good")
// forms.addEventListener("submit", async function(e){
//     e.preventDefault();
//   results.innerHTML="";
//     const res= vals.value;
//     const gett= await axios.get(`https://api.tvmaze.com/search/shows?q=${res}`);
//     for (result of gett.data){
        
//         const dd= result.show.image?.medium;
// if(dd){
//     const imgs= document.createElement("img");
//     imgs.src=dd;
//     results.append(imgs);
//     vals.value="";
// }
//     }
//     const title = document.createElement("p")
// title.innerText = result.show.name

// const card = document.createElement("div")
// card.append(img, title)

// results.append(card)
// })


const form = document.querySelector('#movies');
const input = document.querySelector('#good');
const results = document.querySelector('#results');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const query = input.value.trim();

    if (!query) {
        alert("Please enter something")
    }

    
    
    try {
        const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
        const data = response.data;
        results.innerHTML = "";

        // No results found
        if (data.length === 0) {
            results.innerHTML = "<p>No shows found 😶‍🌫️</p>";
            return;
        }
        

        // Loop through results
        for (let result of data) {
            const show = result.show;

            // Safe image (fallback if missing)
            const imgUrl = show.image?.medium || "https://via.placeholder.com/210x295?text=No+Image";

            // Create elements
            const card = document.createElement("div");
            

            const img = document.createElement("img");
            img.src = imgUrl;

            const title = document.createElement("p");
            title.innerText = show.name;

            // Append elements
            card.append(img, title);
            results.append(card);
        }
        if(query.toLowerCase()=== "dark"){
            const msgg= document.createElement("p");
            msgg.classList.add("msg");
          msgg.innerText = "You've got good taste😎";
          results.append(msgg);
        }

    } catch (err) {
        console.error(err);
        results.innerHTML = "<p>Something went wrong. Try again later.</p>";
    }

    // Clear input after search
    input.value = "";
});