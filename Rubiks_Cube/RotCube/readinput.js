var contents;

function readSingleFile(evt) {
  //Retrieve the first (and only!) File from the FileList object
  var f = evt.target.files[0];

  if (f) {
    var r = new FileReader();
    r.onload = function(e) {
      contents = e.target.result;
      window.alert( "Got the file!" );
      inputString = contents; // inputString is global from cube.js, contents is global from readinput.js
      splitString = inputString.split(""); // splits the string into an array where each element is one character
      window.alert(splitString[0]); // tests whether it split the string correctly
    }
    r.readAsText(f);


  } else { 
    window.alert( "Failed to load file" );
  }
}
document.getElementById('fileinput').addEventListener('change', readSingleFile, false);