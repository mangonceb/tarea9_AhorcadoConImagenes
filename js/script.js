function soloLetras(event) {
    var key = event.keyCode;
    if ((key >= 65 && key <= 90) || key == 8 || key == 192) {
    }
    //Devuelve cualquier letra, incluso el delete para poder borrar la cadena
    return ((key >= 65 && key <= 90) || key == 8 || key == 192)
        ;
};

//Variables
var aciertos = document.getElementById("aciertos");
var fallos = document.getElementById("fallos");
var contadorFallos = document.getElementById("contadorFallos");
var inputLetra = document.getElementById("letra");
var guiones;
var estaJugando = false;
var contFallos = 0;
var juegoGanado = false;
var images;

// Leer ficheros del directorio seleccioando
function SeleccionImagenes(evt) {

    var files = evt.target.files; // FileList object

    // Bucle que recorre las imagenes obtenidos de la carpeta seleccionada.
    var columnas = 0;
    for (var i = 0, f; f = files[i]; i++) {

        // Si f no es de type image , no continua y vuelve al inicio del bucle(continue)
        if (!f.type.match('image.*')) {
            continue;
        }
        var reader = new FileReader();

        // Function(Clousure) que obtiene la información de cada archivo. la funcion
        // se ejecuta al cargar (load) cada unop de los archivos seleccionadso
        reader.onload = (function (ElFichero) {

            return function (e) {

                //ElFichero.name contiene el nombre de los ficheros seleccionados
                // e.target.result contiene el Data de la imagen,que asigándo el mismo
                // a la prpiedad src de un elemento html img, sevisualiza en el mismo

                var cadena = escape(ElFichero.name);
                var ppunto = cadena.indexOf(".");
                var nimagen = cadena.substring(0, ppunto)

                // Creamos la IMAGEN
                imm = document.createElement("img");
                imm.src = e.target.result;

                //Podemos guardar el nombre de la imagen a adivinar
                //en esta propiedad alt
                imm.alt = nimagen;

                //Crea un atributo onload en cada imagen que llama a la función imgCargadas
                imm.setAttribute("onload", "imgCargadas();");

                // Programamos en evento clic sobre la imagen para jugar con ella
                document.getElementById("contenedor").insertBefore(imm, null);

            }

        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }
}

document.getElementById('files').addEventListener('change', SeleccionImagenes, false);

//Eleccion de palabra a partir de la imagen
var palabra;
var numero;

/*Lo que hace el images.forEach es cada vez que se pulse click en una imagen, 
accede a la propiedad alt de la misma y da ese valor a la palabra*/
function imgCargadas() {
    images = [...document.querySelectorAll("#contenedor img")];
    images.forEach(element => element.addEventListener("click",
        function devolverPalabra(event) {
            if (!estaJugando) {
                if (numero != null) {
                    resetImg(images[numero]);
                }
                numero = images.indexOf(element);
                enlargeImg(element);

                return palabra = event.target.alt;
            }
        }, false));
}

//Estas dos siguientes funciones son para dar formato a la imagen cuando se selecciona
function enlargeImg(img) {
    img.style.transform = "scale(1.1)";
    img.style.border = "2px solid #555";
    img.style.transition =
        "transform 0.25s ease";
}
function resetImg(img) {
    img.style.transform = "scale(1.0)";
    img.style.border = "none";
    img.style.transition =
        "transform 0.25s ease";
}

//Cuando se escriba la letra ejecuta la función de buscar
inputLetra.addEventListener("keyup", function () {
    if (estaJugando && aciertos.value != "") {
        buscarCaracter();
    }
}, false);

//Función que escribe los guiones, si la palabra esta vacía no se empieza el juego
function jugar() {
    if (palabra != "" && !estaJugando) {
        estaJugando = true;
        guiones = palabra.replace(/[a-z]/gi, "-");
        aciertos.value = guiones;
    }
};

//Función que busca los caracteres y verifica si se ha acertado o no
function buscarCaracter() {
    var caracter = inputLetra.value;
    if (caracter == "") {
        alert("No hay caracter");
        return
    }
    var caracterBuscar = caracter.toUpperCase();
    var palabraMayus = palabra.toUpperCase();
    var posicion = palabraMayus.indexOf(caracterBuscar);

    /*Conversión del input de los aciertos en un array de caractéres para poder sustituir
    el carácter encontrado por el guión a través de un sencillo = */
    var aciertosResueltos = Array.from(aciertos.value);

    for (let index = 0; index < palabra.length; index++) {

        if (palabraMayus.charAt(index) == caracterBuscar) {
            aciertosResueltos[index] = caracterBuscar;
        }

    }
    //Conversión de nuevo del array de caractéres en un string
    aciertos.value = aciertosResueltos.join("");

    //Esta cadena de ifs verifica si el carácter no existe
    if (posicion == -1) {

        var repetido = false;

        //Bucle con if para saber si el carácter está repetido o no en la lista de fallos
        for (let index = 0; index < fallos.value.length; index++) {
            if (fallos.value.toUpperCase().charAt(index) == caracterBuscar) {
                repetido = true;
                alert("Ese carácter ya lo has buscado anteriormente y has fallado");
            }
        }
        //Suma el contador de fallos y lo escribe en el HTML
        if (!repetido) {
            fallos.value = fallos.value.concat(caracterBuscar);
            contFallos++;
            
            //Ir cargando la sequencia del ahorcado con los fallos
            document.getElementById("seleccion").src = "ahorcado/ahorcado_" + (6 - contFallos) + ".png"
            console.log(contFallos);
            contadorFallos.innerHTML = contFallos;
        }
    }
    inputLetra.value = null;
    //Comprobar si se ha acabado el juego
    seAcaba();
}

function seAcaba() {
    //Mas de 5 fallos se pierde y se refresca la página
    if (contFallos >= 6) {
        alert("HAS PERDIDO :( La palabra era " + palabra);
        setTimeout(function () {
            location.reload();
        }, 1000);
        //location.reload();
    }
    //Si no encuentra guiones, es decir, si se ha ganado, sale una alerta y se refresca la página
    if (aciertos.value.indexOf('-') == -1) {
        alert("HAS GANADO! :)");
        setTimeout(function () {
            location.reload();
        }, 1000);
    }
}
