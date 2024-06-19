function filterAndLoad(event) {
    const filterValue = event.target.value;
    
    filteredRecipes = recipes.filter(recipe =>
        recipe.Recept.tags[filterValue] === "on" || filterValue === "alle");
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
                    onclick="openPopup('edit-container', '${recipe.Recept.Naam}'); event.stopPropagation()" id="icon"
                    title="Bewerken">
                <img src="/icons/trash.png"
                    onclick="openPopup('delete-container', '${recipe.Recept.Naam}'); event.stopPropagation()" id="icon"
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