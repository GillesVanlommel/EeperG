function openPopup(id, name) {
    document.getElementById(id).style.display = "flex";
    try {
        console.log("Naam is ", name);
        document.getElementById("deleteForm").action = "/recipes/delete/" + name;
    } catch (error) {
        console.error(error);
    }
}
    
function closePopup(id) {
    document.getElementById(id).style.display = "none";
}