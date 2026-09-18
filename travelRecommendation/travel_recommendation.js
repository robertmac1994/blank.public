// ==========================================================
// ELEMENT REFERENCES
// Note: the search form/input/buttons exist on every page (they're
// part of the shared navbar), but #results only exists on the
// homepage. document.getElementById() returns null if an element
// isn't on the current page - we check for that below before wiring
// up search behavior, so this same file works safely on every page.
// ==========================================================
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const clearBtn = document.getElementById("clear-btn");
const resultsContainer = document.getElementById("results");

let travelData = null;

// ==========================================================
// FETCH THE TRAVEL RECOMMENDATIONS DATA
// ==========================================================
fetch("travel_recommendation_api.json")
  .then((response) => response.json())
  .then((data) => {
    travelData = data;
    console.log("Fetched travel data:", data);
  })
  .catch((error) => {
    console.error("Error fetching travel_recommendation_api.json:", error);
  });

// ==========================================================
// SEARCH BEHAVIOR (only wired up where #results actually exists)
// ==========================================================
if (searchForm && resultsContainer) {
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    handleSearch();
  });

  clearBtn.addEventListener("click", function () {
    searchInput.value = "";
    resultsContainer.innerHTML = "";
  });
}

function handleSearch() {
  if (!travelData) {
    console.log("Travel data hasn't loaded yet - try searching again in a moment.");
    return;
  }

  const query = searchInput.value.toLowerCase().trim();
  let matches = [];

  if (query.includes("beach")) {
    matches = travelData.beaches;
  } else if (query.includes("temple")) {
    matches = travelData.temples;
  } else if (query.includes("countr")) {
    matches = travelData.countries.flatMap((country) => country.cities);
  }

  console.log(`Search for "${query}" ->`, matches);
  renderResults(matches);
}

function renderResults(matches) {
  resultsContainer.innerHTML = "";

  if (!matches || matches.length === 0) {
    resultsContainer.innerHTML = "<p>No recommendations found. Try searching \"beach\", \"temple\", or \"country\".</p>";
    return;
  }

  matches.forEach((place) => {
    const card = document.createElement("div");
    card.className = "result-card";
    card.innerHTML = `
        <img src="${place.imageUrl}" alt="${place.name}">
        <h3>${place.name}</h3>
        <p>${place.description}</p>
    `;
    resultsContainer.appendChild(card);
  });
}