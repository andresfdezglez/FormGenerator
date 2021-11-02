function  anadirPregunta() {
    document.getElementById("preguntas").value =  document.getElementById("preguntas").value + document.getElementById("pregunta").value + ";"

    document.getElementById("pregunta").value = "";
}