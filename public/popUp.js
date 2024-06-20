function openPopup(id, receptId) {
    // make the popup visible
    document.getElementById(id).style.display = "flex";
    // set the action of the form to the correct recipe 
    const deleteForm = document.getElementById("deleteForm");
    if (deleteForm) {
        deleteForm.action = "/recipes/delete/" + receptId;
    }
    // set the action of the form to the correct recipe
    const editForm = document.getElementById("editForm");
    if (editForm){
        console.log(receptId);
        editForm.action = "/recipes/edit/" + receptId;
    }
}
    
function closePopup(id) {
    document.getElementById(id).style.display = "none";
}