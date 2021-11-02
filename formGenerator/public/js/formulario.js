function responder() {
    var respuestas = document.getElementsByName("pregunta");

    console.log(respuestas)

    for(respuesta of respuestas){

        document.getElementById("respuestas").value = document.getElementById("respuestas").value + respuesta.value + ";"

        document.getElementById("enviar").click();
    }
}