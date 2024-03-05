function openPopup(id, name) {
    // make the popup visible
    document.getElementById(id).style.display = "flex";
    // set the action of the form to the correct recipe 
    const deleteForm = document.getElementById("deleteForm");
    if (deleteForm) {
        deleteForm.action = "/recipes/delete/" + name;
    }
    // set the action of the form to the correct recipe
    const editForm = document.getElementById("editForm");
    if (editForm){
        console.log(name);
        editForm.action = "/recipes/edit/" + name;
    }
}
    
function closePopup(id) {
    document.getElementById(id).style.display = "none";
}