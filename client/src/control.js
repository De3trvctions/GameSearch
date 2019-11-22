export function testFunction(props){

    console.log("Ready: " + props);

    document.getElementById("saveBtn").style.display = "none";
    document.getElementById("textarea").disabled = true;
    document.getElementById("editGenresDiv").style.display = "none";
    document.getElementById("genresDiv").style.display = "block";

    var result = [document.getElementById("textarea").value, document.getElementById("genresInput").value];
    return result;
}

export function editText(){

    document.getElementById("textarea").disabled = false;
    document.getElementById("saveBtn").style.display = "block";
    document.getElementById("editGenresDiv").style.display = "block";
    document.getElementById("genresDiv").style.display = "none";
}

export function mousein(id){
    document.querySelector("#a"+ id + " > p").style.display = "block";
}

export function mouseout(id){
    document.querySelector("#a"+ id + " > p").style.display = "none";
}