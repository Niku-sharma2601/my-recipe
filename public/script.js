let currentPage = 1;
let isLoading = false;

// Function to fetch recipes
function fetchRecipes(page) {
    if (isLoading) return;
    isLoading = true;

    fetch(`/recipes?page=${page}`)
        .then(response => response.json())
        .then(data => {
            if (page === 1) {
                document.getElementById('recipe-list').innerHTML = renderRecipes(data.recipes);
            } else {
                document.getElementById('recipe-list').innerHTML += renderRecipes(data.recipes);
            }
            isLoading = false;
        });
}

// Function to render recipes
function renderRecipes(recipes) {
    return recipes.map(recipe => `
        <div class="recipe" data-id="${recipe.id}">
            <span>${recipe.name}</span>
            <button onclick="saveFavorite(this)">Save</button>
        </div>
    `).join('');
}

// Function to handle saving recipes
function saveFavorite(button) {
    const recipeId = button.parentElement.dataset.id;
    fetch('/save-favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            button.textContent = 'Saved';
        }
    });
}

// Function to load more recipes when scrolling
function loadMoreRecipes() {
    currentPage++;
    fetchRecipes(currentPage);
}

// Scroll event listener for infinite scrolling
window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        loadMoreRecipes();
    }
});

// Handle collection creation
document.getElementById('create-collection-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('collection-name').value;
    fetch('/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, userId: 1 }) // Replace with actual user ID
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Collection created');
            // Optionally update collection dropdown
        }
    });
});

// Function to add a recipe to a collection
function addRecipeToCollection(recipeId) {
    const collectionId = document.getElementById('collection-select').value;
    fetch('/collections/add-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionId, recipeId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Recipe added to collection');
        }
    });
}

// Social sharing functions
function shareOnTwitter(url) {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, '_blank');
}

function shareOnFacebook(url) {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
}

// Initial load
fetchRecipes(currentPage);