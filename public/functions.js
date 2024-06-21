function filterAndLoad(event) {
    const filterValue = event.target.value;
    let personRecipes = [];
    if (filterValue === "Alle") {
        personRecipes = recipes;;
    } else {
        personRecipes = recipes.filter(recipe =>
            recipe.Recept.Persoon.map(Persoon => Persoon.toLowerCase().replace(/\s/g, "")).includes(filterValue.toLowerCase().replace(/\s/g, "")));
    }
    loadRecipes(personRecipes);
}
function loadRecipes(filteredRecipes) {
    // Clear the current tiles
    const gridContainer = document.getElementById("gridContainer");
    gridContainer.innerHTML = "";
    filteredRecipes.forEach(recipe => {
        // Add the new tiles
        const recipeHTML = `
        <div class="receptTile" onclick="window.location.href = '/recipes/${recipe.Recept.Naam}'">
            <div class="receptImg">
                <img src="${recipe.Recept.Foto}" id="foto">
            </div>
            <div class="receptName">
                ${recipe.Recept.Naam}
            </div>
            <div class="editbox">
                <img src="/icons/edit.png"
                    onclick="openPopup('edit-container', '${recipe.Recept.Id}'); event.stopPropagation()" id="icon"
                    title="Bewerken">
                <img src="/icons/trash.png"
                    onclick="openPopup('delete-container', '${recipe.Recept.Id}'); event.stopPropagation()" id="icon"
                    title="Verwijder">
            </div>
        </div>`;
        gridContainer.innerHTML += recipeHTML;
    });
    gridContainer.innerHTML += `
            <div class="addTile" onclick="window.location.href = '/recipes/add'">
                <p>+</p>
            </div>`;
}

function downloadJSON(){
    const data  = JSON.stringify(recipes);
    const blob = new Blob([data], {type: 'application/json'});
    const url  = URL.createObjectURL(blob);
    const a = document.getElementById('download');
    a.href = url
    a.download = 'recipes.json';
    a.click();
    console.log("Downloaded JSON");
    setTimeout(() => URL.revokeObjectURL(url));
}