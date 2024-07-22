function handler1(id) {
    document.getElementById("edit1" + id).setAttribute("hidden", true);
    document.getElementById("done1" + id).removeAttribute("hidden");
    document.getElementById("textarea1" + id).removeAttribute("hidden");
    document.getElementById("description" + id).setAttribute("hidden", true);
  }
  function handler2(id) {
    document.getElementById("edit2" + id).setAttribute("hidden", true);
    document.getElementById("done2" + id).removeAttribute("hidden");
    document.getElementById("textarea2" + id).removeAttribute("hidden");
    document.getElementById("notes" + id).setAttribute("hidden", true);
  }
 function setFormValues(value){
  const textarea = document.getElementById(`textarea1${value}`);
  const description = textarea.value.trim();
  document.getElementById('updateddescription').value = description;
 }
function setValues(value){
  const notes = document.getElementById(`textarea2${value}`).value.trim;
  document.getElementById('updatednotes').value = notes;
}
function setrating(value){ 
  document.getElementById("edit" + value).setAttribute("hidden", true);
  document.getElementById("rate" + value).setAttribute("hidden", true);
  document.getElementById("rating" + value).removeAttribute("hidden");
  document.getElementById("done" + value).removeAttribute("hidden");

}
