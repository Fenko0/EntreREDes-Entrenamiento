let preguntas = []
let preguntasTest = []
let indice = 0

let correctas = 0
let falladas = 0
let respondidas = 0

let segundos = 0
let intervalo = null
let racha = 0

let preguntasSeleccionadas = [];

function toggleMenu(id) {
  let seccion = document.getElementById(id)
  if (seccion.style.display === "none") {
    seccion.style.display = "block"
  } else {
    seccion.style.display = "none"
  }
}

function iniciarTiempo(){
  segundos = 0

  intervalo = setInterval(function(){
    segundos++

    let min = Math.floor(segundos / 60)
    let sec = segundos % 60

    if(min < 10) min = "0" + min
    if(sec < 10) sec = "0" + sec

    document.getElementById("tiempo").innerHTML = "Tiempo: " + min + ":" + sec
  }, 1000)
}

function cargarTema(ruta){

document.getElementById("creditos").style.opacity = "0";

let script = document.createElement("script")
script.src = ruta

script.onload = function(){

document.getElementById("menu").style.display="none"
document.getElementById("modos").style.display="block"

}

document.body.appendChild(script)

}

function iniciarTest(modo){

document.getElementById("testMultiple").style.display = "none";
document.getElementById("seleccionarTemas").style.display = "none";

iniciarTiempo()

let base = preguntasSeleccionadas.length ? preguntasSeleccionadas : preguntas
let copia = [...base]

mezclar(copia)

if(modo === "all"){

preguntasTest = copia

}else{

preguntasTest = copia.slice(0,modo)

}

document.getElementById("total").innerHTML = preguntasTest.length

indice = 0
correctas = 0
falladas = 0
respondidas = 0

mostrarPregunta()

}

function mostrarPregunta(){

let p = preguntasTest[indice]

document.getElementById("pregunta").innerHTML = p.pregunta

let opciones = [...p.opciones]

mezclar(opciones)

let cont = document.getElementById("opciones")
cont.innerHTML=""

opciones.forEach(op=>{

let b = document.createElement("button")
b.innerHTML = op
b.className="opcion"

b.onclick = ()=>responder(b,op,p)

cont.appendChild(b)

})

}

function responder(boton,opcion,pregunta){

let botones = document.querySelectorAll(".opcion")

botones.forEach(b=>b.disabled=true)

let correcta = pregunta.opciones[pregunta.correcta]

if(opcion === correcta){

boton.classList.add("correcta")
correctas++
racha++

}else{

boton.classList.add("incorrecta")
racha = 0

botones.forEach(b=>{

if(b.innerHTML === correcta){

b.classList.add("correcta")

}

})

falladas++

preguntasTest.push(pregunta)

}

respondidas++

actualizarContadores()

document.getElementById("siguiente").style.display="block"

}

function siguientePregunta(){

indice++

document.getElementById("siguiente").style.display="none"

if(indice < preguntasTest.length){

mostrarPregunta()

}else{

mostrarResultado()

}

}

function actualizarContadores(){

document.getElementById("respondidas").innerHTML = respondidas
document.getElementById("correctas").innerHTML = correctas
document.getElementById("falladas").innerHTML = falladas

document.getElementById("racha").innerHTML = "Racha: " + racha + " 🔥"

let progreso = (respondidas / preguntasTest.length) * 100
document.getElementById("barra").style.width = progreso + "%"

}

function mostrarResultado() {
clearInterval(intervalo)

  let porcentaje = ((correctas / preguntasTest.length) * 100).toFixed(1)
  let nota = ((correctas / preguntasTest.length) * 10).toFixed(2)

  document.getElementById("pregunta").innerHTML = `
    <h2>Test terminado! :)</h2>
    <p>Nota: ${nota} / 10</p>
    <button onclick="volverMenu()">Volver al menú</button>
  `

  document.getElementById("opciones").innerHTML = ""
}

function volverMenu() {
document.getElementById("seleccionarTemas").style.display = "block";
document.getElementById("testMultiple").style.display = "block";
document.getElementById("creditos").style.opacity = "0.8";
  location.reload()
}

function activarSeleccion() {

let botones = document.querySelectorAll("#menu button");

botones.forEach(boton => {

    let ruta = boton.getAttribute("onclick");

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "temaCheck";

    let contenedor = document.createElement("div");
    contenedor.className = "temaSeleccion";

    contenedor.appendChild(boton.cloneNode(true));
    contenedor.appendChild(checkbox);

    boton.replaceWith(contenedor);

});

document.getElementById("testMultiple").style.display = "block";

}

async function iniciarTestMultiple(){

let checks = document.querySelectorAll(".temaCheck:checked");

let temas = [];

checks.forEach(c => {

    let boton = c.parentElement.querySelector("button");

    if(boton){
        let onclick = boton.getAttribute("onclick");
        let ruta = onclick.match(/'(.*?)'/)[1];
        temas.push(ruta);
    }

});

preguntasSeleccionadas = [];

for(let tema of temas){

    let r = await fetch(tema);
    let code = await r.text();

    eval(code);

    preguntasSeleccionadas = preguntasSeleccionadas.concat(preguntas);

}

console.log("Preguntas combinadas:", preguntasSeleccionadas);

document.getElementById("modos").style.display = "block";
document.getElementById("seleccionarTemas").style.display = "none";

}

function mezclar(array){

for(let i=array.length-1;i>0;i--){

let j = Math.floor(Math.random()*(i+1))

let temp = array[i]
array[i]=array[j]
array[j]=temp

}

}

let menu = document.getElementById("menu")

menu.innerHTML = `

<h1 onclick="toggleMenu('eso4')">▶ 4º ESO</h1>
<div id="eso4" style="display:none;">

<h2 onclick="toggleMenu('mates4')">▶ Matemáticas</h2>
<div id="mates4" style="display:none;">

<button onclick="cargarTema('4 ESO/Matematicas/preguntas_4ESO-Matematicas-Combinatoria.js')">Combinatoria</button>
<button onclick="cargarTema('4 ESO/Matematicas/preguntas_4ESO-Matematicas-EcuacionesDePrimerGrado.js')">Ecuaciones de primer grado</button>
<button onclick="cargarTema('4 ESO/Matematicas/preguntas_4ESO-Matematicas-EcuacionesDeSegundoGrado.js')">Ecuaciones de segundo grado</button>
<button onclick="cargarTema('4 ESO/Matematicas/preguntas_4ESO-Matematicas-Estadistica.js')">Estadística</button>
<button onclick="cargarTema('4 ESO/Matematicas/preguntas_4ESO-Matematicas-FuncionesExponenciales.js')">Funciones exponenciales</button>
<button onclick="cargarTema('4 ESO/Matematicas/preguntas_4ESO-Matematicas-FuncionesIrracionales.js')">Funciones irracionales</button>
<button onclick="cargarTema('4 ESO/Matematicas/preguntas_4ESO-Matematicas-FuncionesRacionales.js')">Funciones racionales</button>
<button onclick="cargarTema('4 ESO/Matematicas/preguntas_4ESO-Matematicas-FuncionesRectas.js')">Funciones rectas</button>
<button onclick="cargarTema('4 ESO/Matematicas/preguntas_4ESO-Matematicas-GeometriaAnalitica.js')">Geometría analítica</button>
<button onclick="cargarTema('4 ESO/Matematicas/preguntas_4ESO-Matematicas-NumerosEnteros.js')">Números enteros</button>
<button onclick="cargarTema('4 ESO/Matematicas/preguntas_4ESO-Matematicas-NumerosRacionales.js')">Números racionales</button>
<button onclick="cargarTema('4 ESO/Matematicas/preguntas_4ESO-Matematicas-NumerosReales.js')">Números reales</button>
<button onclick="cargarTema('4 ESO/Matematicas/preguntas_4ESO-Matematicas-Parabolas.js')">Parábolas</button>
<button onclick="cargarTema('4 ESO/Matematicas/preguntas_4ESO-Matematicas-Polinomios.js')">Polinomios</button>
<button onclick="cargarTema('4 ESO/Matematicas/preguntas_4ESO-Matematicas-Potencias.js')">Potencias</button>
<button onclick="cargarTema('4 ESO/Matematicas/preguntas_4ESO-Matematicas-Probabilidad.js')">Probabilidad</button>
<button onclick="cargarTema('4 ESO/Matematicas/preguntas_4ESO-Matematicas-Radicales.js')">Radicales</button>
<button onclick="cargarTema('4 ESO/Matematicas/preguntas_4ESO-Matematicas-Semejanza.js')">Semejanza</button>
<button onclick="cargarTema('4 ESO/Matematicas/preguntas_4ESO-Matematicas-SistemasDeEcuaciones.js')">Sistemas de ecuaciones</button>
<button onclick="cargarTema('4 ESO/Matematicas/preguntas_4ESO-Matematicas-Trigonometria.js')">Trigonometría</button>

</div>

<h2 onclick="toggleMenu('lengua4')">▶ Lengua</h2>
<div id="lengua4" style="display:none;">

<button onclick="cargarTema('4 ESO/Lengua/preguntas_4ESO-Literatura-AnalisisDeLaOracionCompuesta.js')">Análisis de la oración compuesta</button>
<button onclick="cargarTema('4 ESO/Lengua/preguntas_4ESO-Literatura-ComprensionLectora.js')">Comprensión lectora</button>
<button onclick="cargarTema('4 ESO/Lengua/preguntas_4ESO-Literatura-ConectoresTextuales.js')">Conectores textuales</button>
<button onclick="cargarTema('4 ESO/Lengua/preguntas_4ESO-Literatura-ElModernismoYLaGeneracionDel98.js')">Modernismo y Generación del 98</button>
<button onclick="cargarTema('4 ESO/Lengua/preguntas_4ESO-Literatura-ElNovecentismoYLasVanguardias.js')">Novecentismo y Vanguardias</button>
<button onclick="cargarTema('4 ESO/Lengua/preguntas_4ESO-Literatura-ElTextoArgumentativo.js')">Texto argumentativo</button>
<button onclick="cargarTema('4 ESO/Lengua/preguntas_4ESO-Literatura-ElTextoExpositivo.js')">Texto expositivo</button>
<button onclick="cargarTema('4 ESO/Lengua/preguntas_4ESO-Literatura-LaGeneracionDel27.js')">Generación del 27</button>
<button onclick="cargarTema('4 ESO/Lengua/preguntas_4ESO-Literatura-LaLiteraturaEnElSigloXIX.js')">Literatura del siglo XIX</button>
<button onclick="cargarTema('4 ESO/Lengua/preguntas_4ESO-Literatura-LaLiteraturaEspanolaPosterior.js')">Literatura española posterior</button>
<button onclick="cargarTema('4 ESO/Lengua/preguntas_4ESO-Literatura-LaOracionCompuestaYSusTipos.js')">Oración compuesta y tipos</button>
<button onclick="cargarTema('4 ESO/Lengua/preguntas_4ESO-Literatura-LaOracionSimple.js')">Oración simple</button>
<button onclick="cargarTema('4 ESO/Lengua/preguntas_4ESO-Literatura-LaPalabraCategoriasYAccidentes.js')">Categorías y accidentes de la palabra</button>
<button onclick="cargarTema('4 ESO/Lengua/preguntas_4ESO-Literatura-LaPalabraYsuFormacion.js')">Formación de palabras</button>
<button onclick="cargarTema('4 ESO/Lengua/preguntas_4ESO-Literatura-LiteraturaGeneros.js')">Géneros literarios</button>
<button onclick="cargarTema('4 ESO/Lengua/preguntas_4ESO-Literatura-LiteraturaHispanoamericana.js')">Literatura hispanoamericana</button>
<button onclick="cargarTema('4 ESO/Lengua/preguntas_4ESO-Literatura-ObjetividadYSubjetividad.js')">Objetividad y subjetividad</button>
<button onclick="cargarTema('4 ESO/Lengua/preguntas_4ESO-Literatura-OrtografiaCasosDeEspecialDificultad.js')">Ortografía (casos difíciles)</button>
<button onclick="cargarTema('4 ESO/Lengua/preguntas_4ESO-Literatura-OrtografiaPuntuacion.js')">Ortografía y puntuación</button>
<button onclick="cargarTema('4 ESO/Lengua/preguntas_4ESO-Literatura-Pragmatica.js')">Pragmática</button>
<button onclick="cargarTema('4 ESO/Lengua/preguntas_4ESO-Literatura-PropiedadesDelTexto.js')">Propiedades del texto</button>
<button onclick="cargarTema('4 ESO/Lengua/preguntas_4ESO-Literatura-TiposDeTexto.js')">Tipos de texto</button>

</div>

<h2 onclick="toggleMenu('historia4')">▶ Historia</h2>
<div id="historia4" style="display:none;">

<button onclick="cargarTema('4 ESO/Historia/preguntas_4ESO-Geografia-DeLaSociedadEstamentalALaLiberal.js')">De sociedad estamental a liberal</button>
<button onclick="cargarTema('4 ESO/Historia/preguntas_4ESO-Geografia-ElMundoTrasLaGuerra.js')">El mundo tras la guerra</button>
<button onclick="cargarTema('4 ESO/Historia/preguntas_4ESO-Geografia-LaSociedadDeMasas.js')">La sociedad de masas</button>
<button onclick="cargarTema('4 ESO/Historia/preguntas_4ESO-Geografia-LaSociedadPosindustrial.js')">Sociedad posindustrial</button>

</div>

<h2 onclick="toggleMenu('fisica4')">▶ Física y Química</h2>
<div id="fisica4" style="display:none;">

<button onclick="cargarTema('4 ESO/Fisica y quimica/preguntas_4ESO-Fisica-AspectosIndustrialesDeLaEnergia.js')">Aspectos industriales de la energía</button>
<button onclick="cargarTema('4 ESO/Fisica y quimica/preguntas_4ESO-Fisica-CambiosFisicosYReaccionesQuimicas.js')">Cambios físicos y reacciones químicas</button>
<button onclick="cargarTema('4 ESO/Fisica y quimica/preguntas_4ESO-Fisica-Cinematica.js')">Cinemática</button>
<button onclick="cargarTema('4 ESO/Fisica y quimica/preguntas_4ESO-Fisica-Dinamica.js')">Dinámica</button>
<button onclick="cargarTema('4 ESO/Fisica y quimica/preguntas_4ESO-Fisica-ElMetodoCientifico.js')">Método científico</button>
<button onclick="cargarTema('4 ESO/Fisica y quimica/preguntas_4ESO-Fisica-EnergiaMecanica.js')">Energía mecánica</button>
<button onclick="cargarTema('4 ESO/Fisica y quimica/preguntas_4ESO-Fisica-EnergiaTermica.js')">Energía térmica</button>
<button onclick="cargarTema('4 ESO/Fisica y quimica/preguntas_4ESO-Fisica-EstructuraAtomica.js')">Estructura atómica</button>
<button onclick="cargarTema('4 ESO/Fisica y quimica/preguntas_4ESO-Fisica-FuerzasDeLaNaturaleza.js')">Fuerzas de la naturaleza</button>
<button onclick="cargarTema('4 ESO/Fisica y quimica/preguntas_4ESO-Fisica-LaQuimicaEnLaSociedadYElMedioAmbiente.js')">Química en la sociedad y medio ambiente</button>
<button onclick="cargarTema('4 ESO/Fisica y quimica/preguntas_4ESO-Fisica-NomenclaturaYFormulacionDeCompuestosBinarios.js')">Nomenclatura de compuestos binarios</button>
<button onclick="cargarTema('4 ESO/Fisica y quimica/preguntas_4ESO-Fisica-PresionEHidrostatica.js')">Presión e hidrostática</button>
<button onclick="cargarTema('4 ESO/Fisica y quimica/preguntas_4ESO-Fisica-QuimicaDelCarbono.js')">Química del carbono</button>
<button onclick="cargarTema('4 ESO/Fisica y quimica/preguntas_4ESO-Fisica-UtilizacionDeLasTecnologias.js')">Uso de las tecnologías</button>

</div>

</div>

<h1 onclick="toggleMenu('eso3')">▶ 3º ESO</h1>
<div id="eso3" style="display:none;">

<h2 onclick="toggleMenu('mates3')">▶ Matemáticas</h2>
<div id="mates3" style="display:none;">

<button onclick="cargarTema('3 ESO/Matematicas/preguntas_3ESO-Matematicas-ConjuntosNumericos.js')">Conjuntos numéricos</button>
<button onclick="cargarTema('3 ESO/Matematicas/preguntas_3ESO-Matematicas-CuerposGeometricos.js')">Cuerpos geométricos</button>
<button onclick="cargarTema('3 ESO/Matematicas/preguntas_3ESO-Matematicas-Ecuaciones.js')">Ecuaciones</button>
<button onclick="cargarTema('3 ESO/Matematicas/preguntas_3ESO-Matematicas-EstadisticaUnidimensional.js')">Estadística unidimensional</button>
<button onclick="cargarTema('3 ESO/Matematicas/preguntas_3ESO-Matematicas-FigurasPlanas.js')">Figuras planas</button>
<button onclick="cargarTema('3 ESO/Matematicas/preguntas_3ESO-Matematicas-Funciones.js')">Funciones</button>
<button onclick="cargarTema('3 ESO/Matematicas/preguntas_3ESO-Matematicas-FuncionesLinealesYCuadraticas.js')">Funciones lineales y cuadráticas</button>
<button onclick="cargarTema('3 ESO/Matematicas/preguntas_3ESO-Matematicas-MovimientosEnElPlano.js')">Movimientos en el plano</button>
<button onclick="cargarTema('3 ESO/Matematicas/preguntas_3ESO-Matematicas-Polinomios.js')">Polinomios</button>
<button onclick="cargarTema('3 ESO/Matematicas/preguntas_3ESO-Matematicas-PotenciasYRaices.js')">Potencias y raíces</button>
<button onclick="cargarTema('3 ESO/Matematicas/preguntas_3ESO-Matematicas-Probabilidad.js')">Probabilidad</button>
<button onclick="cargarTema('3 ESO/Matematicas/preguntas_3ESO-Matematicas-Proporcionalidad.js')">Proporcionalidad</button>
<button onclick="cargarTema('3 ESO/Matematicas/preguntas_3ESO-Matematicas-Sistemas.js')">Sistemas de ecuaciones</button>
<button onclick="cargarTema('3 ESO/Matematicas/preguntas_3ESO-Matematicas-Sucesiones.js')">Sucesiones</button>

</div>


<h2 onclick="toggleMenu('lengua3')">▶ Lengua y Literatura</h2>
<div id="lengua3" style="display:none;">

<button onclick="cargarTema('3 ESO/Lengua/preguntas_3ESO-Literatura-ComplementosDelVerbo.js')">Complementos del verbo</button>
<button onclick="cargarTema('3 ESO/Lengua/preguntas_3ESO-Literatura-ComprensionLectora.js')">Comprensión lectora</button>
<button onclick="cargarTema('3 ESO/Lengua/preguntas_3ESO-Literatura-ConvencionesLiterariasMetrica.js')">Convenciones literarias y métrica</button>
<button onclick="cargarTema('3 ESO/Lengua/preguntas_3ESO-Literatura-DeterminantesYPronombres.js')">Determinantes y pronombres</button>
<button onclick="cargarTema('3 ESO/Lengua/preguntas_3ESO-Literatura-ExposicionYArgumentacion.js')">Exposición y argumentación</button>
<button onclick="cargarTema('3 ESO/Lengua/preguntas_3ESO-Literatura-LaConjugacionVerbal.js')">La conjugación verbal</button>
<button onclick="cargarTema('3 ESO/Lengua/preguntas_3ESO-Literatura-LaLiteraturaEnElSigloXv.js')">Literatura siglo XV</button>
<button onclick="cargarTema('3 ESO/Lengua/preguntas_3ESO-Literatura-LaLiteraturaEnElSigloXvi.js')">Literatura siglo XVI</button>
<button onclick="cargarTema('3 ESO/Lengua/preguntas_3ESO-Literatura-LaLiteraturaEnElSigloXvii.js')">Literatura siglo XVII</button>
<button onclick="cargarTema('3 ESO/Lengua/preguntas_3ESO-Literatura-LaLiteraturaEnElSigloXviii.js')">Literatura siglo XVIII</button>
<button onclick="cargarTema('3 ESO/Lengua/preguntas_3ESO-Literatura-LaLiteraturaEnLaEdadMedia.js')">Literatura Edad Media</button>
<button onclick="cargarTema('3 ESO/Lengua/preguntas_3ESO-Literatura-LasLenguasDeEspYElEspDeAmerica.js')">Lenguas de España y América</button>
<button onclick="cargarTema('3 ESO/Lengua/preguntas_3ESO-Literatura-LosNivelesDeLaLengua.js')">Niveles de la lengua</button>
<button onclick="cargarTema('3 ESO/Lengua/preguntas_3ESO-Literatura-NarracionYDescripcion.js')">Narración y descripción</button>
<button onclick="cargarTema('3 ESO/Lengua/preguntas_3ESO-Literatura-OrtografiaAcentuacionDeCompuestos.js')">Acentuación de compuestos</button>
<button onclick="cargarTema('3 ESO/Lengua/preguntas_3ESO-Literatura-OrtografiaLasMayusculas.js')">Mayúsculas</button>
<button onclick="cargarTema('3 ESO/Lengua/preguntas_3ESO-Literatura-OrtografiaLetrasDudosas.js')">Letras dudosas</button>
<button onclick="cargarTema('3 ESO/Lengua/preguntas_3ESO-Literatura-SiglasYAcronimos.js')">Siglas y acrónimos</button>
<button onclick="cargarTema('3 ESO/Lengua/preguntas_3ESO-Literatura-TiposDeOracionesSimplesYCompuestas.js')">Oraciones simples y compuestas</button>
<button onclick="cargarTema('3 ESO/Lengua/preguntas_3ESO-Literatura-TiposDePalabrasSegunSuFormacionSimple.js')">Formación de palabras</button>
<button onclick="cargarTema('3 ESO/Lengua/preguntas_3ESO-Literatura-TiposDePalabrasSegunSuOrigen.js')">Origen de las palabras</button>

</div>


<h2 onclick="toggleMenu('historia3')">▶ Historia / Geografía</h2>
<div id="historia3" style="display:none;">

<button onclick="cargarTema('3 ESO/Historia/preguntas_3ESO-Geografia-GeografiaFisica(europa).js')">Geografía física (Europa)</button>
<button onclick="cargarTema('3 ESO/Historia/preguntas_3ESO-Geografia-GeografiaFisica.js')">Geografía física</button>
<button onclick="cargarTema('3 ESO/Historia/preguntas_3ESO-Geografia-GeografiaGeopolitica(esp).js')">Geopolítica España</button>
<button onclick="cargarTema('3 ESO/Historia/preguntas_3ESO-Geografia-GeografiaGeopolitica(europa).js')">Geopolítica Europa</button>
<button onclick="cargarTema('3 ESO/Historia/preguntas_3ESO-Geografia-GeografiaGeopolitica.js')">Geopolítica</button>
<button onclick="cargarTema('3 ESO/Historia/preguntas_3ESO-Geografia-GeografiaHumana(economica).js')">Geografía humana económica</button>
<button onclick="cargarTema('3 ESO/Historia/preguntas_3ESO-Geografia-GeografiaHumana(europa).js')">Geografía humana Europa</button>
<button onclick="cargarTema('3 ESO/Historia/preguntas_3ESO-Geografia-GeografiaHumana(poblacion).js')">Geografía de población</button>
<button onclick="cargarTema('3 ESO/Historia/preguntas_3ESO-Geografia-GeografiaHumana(urbana).js')">Geografía urbana</button>
<button onclick="cargarTema('3 ESO/Historia/preguntas_3ESO-Geografia-GeografiaYGlobalizacionActual.js')">Globalización actual</button>

</div>


<h2 onclick="toggleMenu('fisica3')">▶ Física y Química</h2>
<div id="fisica3" style="display:none;">

<button onclick="cargarTema('3 ESO/Fisica/preguntas_3ESO-Fisica-AspectosIndustrialesDeLaEnergia.js')">Aspectos industriales de la energía</button>
<button onclick="cargarTema('3 ESO/Fisica/preguntas_3ESO-Fisica-CalculosEstequiometricosSencillos.js')">Cálculos estequiométricos</button>
<button onclick="cargarTema('3 ESO/Fisica/preguntas_3ESO-Fisica-CambiosDeEstado.ModeloCineticoMolecular.js')">Cambios de estado</button>
<button onclick="cargarTema('3 ESO/Fisica/preguntas_3ESO-Fisica-CambiosFisicosYQuimicos.js')">Cambios físicos y químicos</button>
<button onclick="cargarTema('3 ESO/Fisica/preguntas_3ESO-Fisica-Cinematica.js')">Cinemática</button>
<button onclick="cargarTema('3 ESO/Fisica/preguntas_3ESO-Fisica-DispositivosElectricosDeUsoFrecuente.js')">Dispositivos eléctricos</button>
<button onclick="cargarTema('3 ESO/Fisica/preguntas_3ESO-Fisica-ElectricidadYCircuitosElectricos.js')">Electricidad y circuitos</button>
<button onclick="cargarTema('3 ESO/Fisica/preguntas_3ESO-Fisica-ElementosYCompuestosDeInteres.js')">Elementos y compuestos</button>
<button onclick="cargarTema('3 ESO/Fisica/preguntas_3ESO-Fisica-ElMetodoCientificoSusEtapas.js')">Método científico</button>
<button onclick="cargarTema('3 ESO/Fisica/preguntas_3ESO-Fisica-ElSistemaPeriodicoDeLosElementos.js')">Sistema periódico</button>
<button onclick="cargarTema('3 ESO/Fisica/preguntas_3ESO-Fisica-ElTrabajoEnElLaboratorio.js')">Trabajo en laboratorio</button>
<button onclick="cargarTema('3 ESO/Fisica/preguntas_3ESO-Fisica-EstadosDeAgregacion.js')">Estados de agregación</button>
<button onclick="cargarTema('3 ESO/Fisica/preguntas_3ESO-Fisica-EstructuraAtomica.js')">Estructura atómica</button>
<button onclick="cargarTema('3 ESO/Fisica/preguntas_3ESO-Fisica-FormulacionYNomenclaturaDeCompuestosBinarios.js')">Formulación binaria</button>
<button onclick="cargarTema('3 ESO/Fisica/preguntas_3ESO-Fisica-FuerzasDeLaNaturaleza.js')">Fuerzas de la naturaleza</button>
<button onclick="cargarTema('3 ESO/Fisica/preguntas_3ESO-Fisica-LaQuimicaEnLaSociedadYElMedioambiente.js')">Química y sociedad</button>
<button onclick="cargarTema('3 ESO/Fisica/preguntas_3ESO-Fisica-LasFuerzas.js')">Las fuerzas</button>
<button onclick="cargarTema('3 ESO/Fisica/preguntas_3ESO-Fisica-LeyDeConservacionDeLaMasa.js')">Conservación de la masa</button>
<button onclick="cargarTema('3 ESO/Fisica/preguntas_3ESO-Fisica-LeyDeOhm.js')">Ley de Ohm</button>
<button onclick="cargarTema('3 ESO/Fisica/preguntas_3ESO-Fisica-LeyesDeLosGases.js')">Leyes de los gases</button>
<button onclick="cargarTema('3 ESO/Fisica/preguntas_3ESO-Fisica-MasasAtomicasYMoleculares.js')">Masas atómicas</button>
<button onclick="cargarTema('3 ESO/Fisica/preguntas_3ESO-Fisica-MedidaDeMagnitudes.js')">Medida de magnitudes</button>
<button onclick="cargarTema('3 ESO/Fisica/preguntas_3ESO-Fisica-NotacionCientifica.js')">Notación científica</button>
<button onclick="cargarTema('3 ESO/Fisica/preguntas_3ESO-Fisica-PropiedadesDeLaMateria.js')">Propiedades de la materia</button>
<button onclick="cargarTema('3 ESO/Fisica/preguntas_3ESO-Fisica-SustanciasPurasYMezclas.js')">Sustancias puras y mezclas</button>
<button onclick="cargarTema('3 ESO/Fisica/preguntas_3ESO-Fisica-UnionesEntreAtomos.MoleculasYCristales.js')">Uniones entre átomos</button>

</div>

</div>

<h1 onclick="toggleMenu('eso2')">▶ 2º ESO</h1>
<div id="eso2" style="display:none;">

<h2 onclick="toggleMenu('mates2')">▶ Matematicas</h2>
<div id="mates2" style="display:none;">

<button onclick="cargarTema('2 ESO/Matematicas/preguntas_2ESO-Matematicas-Areas.js')">Areas</button>
<button onclick="cargarTema('2 ESO/Matematicas/preguntas_2ESO-Matematicas-CuerposEnElEspacio.js')">Cuerpos en el espacio</button>
<button onclick="cargarTema('2 ESO/Matematicas/preguntas_2ESO-Matematicas-DivisibilidadYNumerosEnteros.js')">Divisibilidad y numeros enteros</button>
<button onclick="cargarTema('2 ESO/Matematicas/preguntas_2ESO-Matematicas-EcuacionesDePrimerGrado.js')">Ecuaciones de primer grado</button>
<button onclick="cargarTema('2 ESO/Matematicas/preguntas_2ESO-Matematicas-EcuacionesDeSegundoGrado.js')">Ecuaciones de segundo grado</button>
<button onclick="cargarTema('2 ESO/Matematicas/preguntas_2ESO-Matematicas-Estadistica.js')">Estadistica</button>
<button onclick="cargarTema('2 ESO/Matematicas/preguntas_2ESO-Matematicas-FraccionesYNumerosDecimales.js')">Fracciones y numeros decimales</button>
<button onclick="cargarTema('2 ESO/Matematicas/preguntas_2ESO-Matematicas-Hiperbolas.js')">Hiperbolas</button>
<button onclick="cargarTema('2 ESO/Matematicas/preguntas_2ESO-Matematicas-MedidaDeAngulosYDeTiempo.js')">Medida de angulos y tiempo</button>
<button onclick="cargarTema('2 ESO/Matematicas/preguntas_2ESO-Matematicas-Polinomios.js')">Polinomios</button>
<button onclick="cargarTema('2 ESO/Matematicas/preguntas_2ESO-Matematicas-PotenciasYRaices.js')">Potencias y raices</button>
<button onclick="cargarTema('2 ESO/Matematicas/preguntas_2ESO-Matematicas-Proporcionalidad.js')">Proporcionalidad</button>
<button onclick="cargarTema('2 ESO/Matematicas/preguntas_2ESO-Matematicas-Rectas.js')">Rectas</button>
<button onclick="cargarTema('2 ESO/Matematicas/preguntas_2ESO-Matematicas-SemejanzaTeoremaDeTalesYPitagoras.js')">Semejanza, Tales y Pitagoras</button>
<button onclick="cargarTema('2 ESO/Matematicas/preguntas_2ESO-Matematicas-SistemasDeEcuacionesDePrimerGrado.js')">Sistemas de ecuaciones</button>
<button onclick="cargarTema('2 ESO/Matematicas/preguntas_2ESO-Matematicas-Volumenes.js')">Volumenes</button>

</div>

<h2 onclick="toggleMenu('lengua2')">▶ Lengua</h2>
<div id="lengua2" style="display:none;">

<button onclick="cargarTema('2 ESO/Literatura/preguntas_2ESO-Literatura-AccidentesGramaticales.js')">Accidentes gramaticales</button>
<button onclick="cargarTema('2 ESO/Literatura/preguntas_2ESO-Literatura-CategoriasGramaticales.js')">Categorias gramaticales</button>
<button onclick="cargarTema('2 ESO/Literatura/preguntas_2ESO-Literatura-ComplementosDelVerbo.js')">Complementos del verbo</button>
<button onclick="cargarTema('2 ESO/Literatura/preguntas_2ESO-Literatura-ComponentesDeLaPalabra.js')">Componentes de la palabra</button>
<button onclick="cargarTema('2 ESO/Literatura/preguntas_2ESO-Literatura-ComprensionLectora.js')">Comprension lectora</button>
<button onclick="cargarTema('2 ESO/Literatura/preguntas_2ESO-Literatura-ElCAyCPyCDR.js')">El CAg, CPred y CReg</button>
<button onclick="cargarTema('2 ESO/Literatura/preguntas_2ESO-Literatura-ElCDyElCI.js')">El CD y el CI</button>
<button onclick="cargarTema('2 ESO/Literatura/preguntas_2ESO-Literatura-ElementosDeLaComunicacion.js')">Elementos de la comunicacion</button>
<button onclick="cargarTema('2 ESO/Literatura/preguntas_2ESO-Literatura-ElTeatroYSusConvenciones.js')">El teatro</button>
<button onclick="cargarTema('2 ESO/Literatura/preguntas_2ESO-Literatura-FuncionesDelLenguaje.js')">Funciones del lenguaje</button>
<button onclick="cargarTema('2 ESO/Literatura/preguntas_2ESO-Literatura-GruposDePalabrasOSintagmas.js')">Sintagmas</button>
<button onclick="cargarTema('2 ESO/Literatura/preguntas_2ESO-Literatura-LaLiricaMetricaYRima.js')">La lirica</button>
<button onclick="cargarTema('2 ESO/Literatura/preguntas_2ESO-Literatura-LaNarrativaYSusElementos.js')">La narrativa</button>
<button onclick="cargarTema('2 ESO/Literatura/preguntas_2ESO-Literatura-LaOracionSimpleSujetoYPredicado.js')">Oracion simple</button>
<button onclick="cargarTema('2 ESO/Literatura/preguntas_2ESO-Literatura-LenguasDeEspana.js')">Lenguas de España</button>
<button onclick="cargarTema('2 ESO/Literatura/preguntas_2ESO-Literatura-LosComplementosCircunstanciales.js')">Complementos circunstanciales</button>
<button onclick="cargarTema('2 ESO/Literatura/preguntas_2ESO-Literatura-OracionesPredicativasYOraciones.js')">Oraciones predicativas</button>
<button onclick="cargarTema('2 ESO/Literatura/preguntas_2ESO-Literatura-OrtografiaAcentuacion.js')">Acentuacion</button>
<button onclick="cargarTema('2 ESO/Literatura/preguntas_2ESO-Literatura-OrtografiaLetras.js')">Ortografia letras</button>
<button onclick="cargarTema('2 ESO/Literatura/preguntas_2ESO-Literatura-Puntuacion.js')">Puntuacion</button>
<button onclick="cargarTema('2 ESO/Literatura/preguntas_2ESO-Literatura-RecursosRetoricos.js')">Recursos retoricos</button>
<button onclick="cargarTema('2 ESO/Literatura/preguntas_2ESO-Literatura-TiposDeSignos.js')">Tipos de signos</button>

</div>

<h2 onclick="toggleMenu('geo2')">▶ Geografia</h2>
<div id="geo2" style="display:none;">

<button onclick="cargarTema('2 ESO/Geografia/preguntas_2ESO-Geografia-DeLaBajaEdadMediaALaEdadModerna.js')">Baja Edad Media a Edad Moderna</button>
<button onclick="cargarTema('2 ESO/Geografia/preguntas_2ESO-Geografia-ElEspacioUrbano.js')">Espacio urbano</button>
<button onclick="cargarTema('2 ESO/Geografia/preguntas_2ESO-Geografia-ElInicioDeLaEdadModerna.js')">Inicio de la Edad Moderna</button>
<button onclick="cargarTema('2 ESO/Geografia/preguntas_2ESO-Geografia-ElIslamYAlAndalus.js')">Islam y Al Andalus</button>
<button onclick="cargarTema('2 ESO/Geografia/preguntas_2ESO-Geografia-ImperioBizantinoYCaroligio.js')">Imperio Bizantino y Carolingio</button>
<button onclick="cargarTema('2 ESO/Geografia/preguntas_2ESO-Geografia-LaAltaEdadMedia.js')">Alta Edad Media</button>
<button onclick="cargarTema('2 ESO/Geografia/preguntas_2ESO-Geografia-LaEuropaDelBarroco.js')">Europa del Barroco</button>
<button onclick="cargarTema('2 ESO/Geografia/preguntas_2ESO-Geografia-LaEuropaFeudal.js')">Europa feudal</button>
<button onclick="cargarTema('2 ESO/Geografia/preguntas_2ESO-Geografia-LaPoblacion.js')">La poblacion</button>
<button onclick="cargarTema('2 ESO/Geografia/preguntas_2ESO-Geografia-LasSociedadesActuales.js')">Sociedades actuales</button>
<button onclick="cargarTema('2 ESO/Geografia/preguntas_2ESO-Geografia-LosReinosCristianos.js')">Reinos cristianos</button>

</div>

<h2 onclick="toggleMenu('fisica2')">▶ Fisica</h2>
<div id="fisica2" style="display:none;">

<button onclick="cargarTema('2 ESO/Fisica/preguntas_2ESO-Fisica-CambiosDeEstado.js')">Cambios de estado</button>
<button onclick="cargarTema('2 ESO/Fisica/preguntas_2ESO-Fisica-CambiosFisicosYQuimicos.js')">Cambios fisicos y quimicos</button>
<button onclick="cargarTema('2 ESO/Fisica/preguntas_2ESO-Fisica-Cinematica.js')">Cinematica</button>
<button onclick="cargarTema('2 ESO/Fisica/preguntas_2ESO-Fisica-ElementosYCompuestosDeInteres.js')">Elementos y compuestos</button>
<button onclick="cargarTema('2 ESO/Fisica/preguntas_2ESO-Fisica-ElMetodoCientificoSusEtapas.js')">Metodo cientifico</button>
<button onclick="cargarTema('2 ESO/Fisica/preguntas_2ESO-Fisica-ElSistemaPeriodicoDeLosElementos.js')">Sistema periodico</button>
<button onclick="cargarTema('2 ESO/Fisica/preguntas_2ESO-Fisica-EnergiaTermicaElCalorYLaTemperatura.js')">Energia termica</button>
<button onclick="cargarTema('2 ESO/Fisica/preguntas_2ESO-Fisica-EnergiaUnidadesYTipos.js')">Energia</button>
<button onclick="cargarTema('2 ESO/Fisica/preguntas_2ESO-Fisica-EstadosDeAgregacionDeLaMateria.js')">Estados de la materia</button>
<button onclick="cargarTema('2 ESO/Fisica/preguntas_2ESO-Fisica-EstructuraAtomica.js')">Estructura atomica</button>
<button onclick="cargarTema('2 ESO/Fisica/preguntas_2ESO-Fisica-FuentesDeEnergia.js')">Fuentes de energia</button>
<button onclick="cargarTema('2 ESO/Fisica/preguntas_2ESO-Fisica-FuerzasDeLaNaturaleza.js')">Fuerzas de la naturaleza</button>
<button onclick="cargarTema('2 ESO/Fisica/preguntas_2ESO-Fisica-LaQuimicaEnLaSociedadYElMedioambiente.js')">Quimica y medioambiente</button>
<button onclick="cargarTema('2 ESO/Fisica/preguntas_2ESO-Fisica-LasFuerzas.js')">Las fuerzas</button>
<button onclick="cargarTema('2 ESO/Fisica/preguntas_2ESO-Fisica-LeyDeConservacionDeLaMasa.js')">Conservacion de la masa</button>
<button onclick="cargarTema('2 ESO/Fisica/preguntas_2ESO-Fisica-MaquinasSimples.js')">Maquinas simples</button>
<button onclick="cargarTema('2 ESO/Fisica/preguntas_2ESO-Fisica-MasasAtomicasYMoleculares.js')">Masas atomicas</button>
<button onclick="cargarTema('2 ESO/Fisica/preguntas_2ESO-Fisica-PropiedadesDeLaMateria.js')">Propiedades de la materia</button>
<button onclick="cargarTema('2 ESO/Fisica/preguntas_2ESO-Fisica-SustanciasYMezclas.js')">Sustancias y mezclas</button>
<button onclick="cargarTema('2 ESO/Fisica/preguntas_2ESO-Fisica-TransformacionDeLaEnergiaYSuConservacion.js')">Transformacion de la energia</button>
<button onclick="cargarTema('2 ESO/Fisica/preguntas_2ESO-Fisica-UnionesEntreAtomosYMoleculas.js')">Uniones entre atomos</button>
<button onclick="cargarTema('2 ESO/Fisica/preguntas_2ESO-Fisica-UsoRacionalDeLaEnergia.js')">Uso racional de la energia</button>

</div>

</div>

<h1 onclick="toggleMenu('eso1')">▶ 1º ESO</h1>
<div id="eso1" style="display:none;">

<h2 onclick="toggleMenu('mates1')">▶ Matematicas</h2>
<div id="mates1" style="display:none;">

<button onclick="cargarTema('1 ESO/Matematicas/preguntas_1ESO-Matematicas-AreasYPerimetros.js')">Areas y perimetros</button>
<button onclick="cargarTema('1 ESO/Matematicas/preguntas_1ESO-Matematicas-ComoRealizarUnEstudioEstadistico.js')">Estudio estadistico</button>
<button onclick="cargarTema('1 ESO/Matematicas/preguntas_1ESO-Matematicas-CoordenadasCartesianas.js')">Coordenadas cartesianas</button>
<button onclick="cargarTema('1 ESO/Matematicas/preguntas_1ESO-Matematicas-Divisibilidad.js')">Divisibilidad</button>
<button onclick="cargarTema('1 ESO/Matematicas/preguntas_1ESO-Matematicas-Ecuaciones.js')">Ecuaciones</button>
<button onclick="cargarTema('1 ESO/Matematicas/preguntas_1ESO-Matematicas-EcuacionesDePrimerGradoConUnaIncognita.js')">Ecuaciones de primer grado</button>
<button onclick="cargarTema('1 ESO/Matematicas/preguntas_1ESO-Matematicas-ExpresionesAlgebraicas.js')">Expresiones algebraicas</button>
<button onclick="cargarTema('1 ESO/Matematicas/preguntas_1ESO-Matematicas-FigurasGeometricas.js')">Figuras geometricas</button>
<button onclick="cargarTema('1 ESO/Matematicas/preguntas_1ESO-Matematicas-FrecuenciaYTablasDeFrecuencias.js')">Tablas de frecuencias</button>
<button onclick="cargarTema('1 ESO/Matematicas/preguntas_1ESO-Matematicas-FuncionesLinealesYGraficas.js')">Funciones lineales</button>
<button onclick="cargarTema('1 ESO/Matematicas/preguntas_1ESO-Matematicas-GraficosEstadisticos.js')">Graficos estadisticos</button>
<button onclick="cargarTema('1 ESO/Matematicas/preguntas_1ESO-Matematicas-LetrasEnVezDeNumeros.js')">Letras en vez de numeros</button>
<button onclick="cargarTema('1 ESO/Matematicas/preguntas_1ESO-Matematicas-LosNumerosDecimales.js')">Numeros decimales</button>
<button onclick="cargarTema('1 ESO/Matematicas/preguntas_1ESO-Matematicas-LosNumerosEnteros.js')">Numeros enteros</button>
<button onclick="cargarTema('1 ESO/Matematicas/preguntas_1ESO-Matematicas-LosNumerosNaturales.js')">Numeros naturales</button>
<button onclick="cargarTema('1 ESO/Matematicas/preguntas_1ESO-Matematicas-LosNumerosRacionales.js')">Numeros racionales</button>
<button onclick="cargarTema('1 ESO/Matematicas/preguntas_1ESO-Matematicas-ParametrosEstadisticos.js')">Parametros estadisticos</button>
<button onclick="cargarTema('1 ESO/Matematicas/preguntas_1ESO-Matematicas-PotenciasYRaices.js')">Potencias y raices</button>
<button onclick="cargarTema('1 ESO/Matematicas/preguntas_1ESO-Matematicas-ProporcionalidadYPorcentajes.js')">Proporcionalidad y porcentajes</button>
<button onclick="cargarTema('1 ESO/Matematicas/preguntas_1ESO-Matematicas-RectasYAngulos.js')">Rectas y angulos</button>
<button onclick="cargarTema('1 ESO/Matematicas/preguntas_1ESO-Matematicas-ResolucionDeProblemasMedianteEcuaciones.js')">Problemas con ecuaciones</button>
<button onclick="cargarTema('1 ESO/Matematicas/preguntas_1ESO-Matematicas-TablasDeValoresYGraficas.js')">Tablas de valores</button>
<button onclick="cargarTema('1 ESO/Matematicas/preguntas_1ESO-Matematicas-TecnicasParaResolverEcuaciones.js')">Tecnicas para resolver ecuaciones</button>

</div>

<h2 onclick="toggleMenu('lengua1')">▶ Lengua</h2>
<div id="lengua1" style="display:none;">

<button onclick="cargarTema('1 ESO/Literatura/preguntas_1ESO-Literatura-ElLenguajeLiterarioYSusRecursosLinguisticos.js')">Lenguaje literario</button>
<button onclick="cargarTema('1 ESO/Literatura/preguntas_1ESO-Literatura-ElSignificadoDeLasPalabras.js')">Significado de palabras</button>
<button onclick="cargarTema('1 ESO/Literatura/preguntas_1ESO-Literatura-LaComunicacionYSusElementos.js')">La comunicacion</button>
<button onclick="cargarTema('1 ESO/Literatura/preguntas_1ESO-Literatura-LaDescripcion.js')">La descripcion</button>
<button onclick="cargarTema('1 ESO/Literatura/preguntas_1ESO-Literatura-LaFormacionDePalabras.js')">Formacion de palabras</button>
<button onclick="cargarTema('1 ESO/Literatura/preguntas_1ESO-Literatura-LaNarracion.js')">La narracion</button>
<button onclick="cargarTema('1 ESO/Literatura/preguntas_1ESO-Literatura-LaOracionSimple.js')">Oracion simple</button>
<button onclick="cargarTema('1 ESO/Literatura/preguntas_1ESO-Literatura-LasCategoriasGramaticales.js')">Categorias gramaticales</button>
<button onclick="cargarTema('1 ESO/Literatura/preguntas_1ESO-Literatura-LosGenerosLiterarios.js')">Generos literarios</button>
<button onclick="cargarTema('1 ESO/Literatura/preguntas_1ESO-Literatura-LosSintagmasOGruposDePalabras.js')">Sintagmas</button>
<button onclick="cargarTema('1 ESO/Literatura/preguntas_1ESO-Literatura-OrtografiaYPuntuacion.js')">Ortografia y puntuacion</button>

</div>

<h2 onclick="toggleMenu('geo1')">▶ Historia</h2>
<div id="geo1" style="display:none;">

<button onclick="cargarTema('1 ESO/Geografia/preguntas_1ESO-Geografia-ElClima.js')">El clima</button>
<button onclick="cargarTema('1 ESO/Geografia/preguntas_1ESO-Geografia-ElMundoClasicoGrecia.js')">Grecia</button>
<button onclick="cargarTema('1 ESO/Geografia/preguntas_1ESO-Geografia-ElMundoClasicoRoma.js')">Roma</button>
<button onclick="cargarTema('1 ESO/Geografia/preguntas_1ESO-Geografia-ElPaisaje.js')">El paisaje</button>
<button onclick="cargarTema('1 ESO/Geografia/preguntas_1ESO-Geografia-ElRelieve.js')">El relieve</button>
<button onclick="cargarTema('1 ESO/Geografia/preguntas_1ESO-Geografia-LaHidrosfera.js')">La hidrosfera</button>
<button onclick="cargarTema('1 ESO/Geografia/preguntas_1ESO-Geografia-LaHistoriaAntigua.js')">Historia antigua</button>
<button onclick="cargarTema('1 ESO/Geografia/preguntas_1ESO-Geografia-LaPeninsulaIberica.js')">La peninsula iberica</button>
<button onclick="cargarTema('1 ESO/Geografia/preguntas_1ESO-Geografia-LaPrehistoria.js')">La prehistoria</button>
<button onclick="cargarTema('1 ESO/Geografia/preguntas_1ESO-Geografia-LaRepresentacionDeLaTierra.js')">Representacion de la Tierra</button>
<button onclick="cargarTema('1 ESO/Geografia/preguntas_1ESO-Geografia-LaTierraEnElSistemaSolar.js')">Sistema solar</button>
<button onclick="cargarTema('1 ESO/Geografia/preguntas_1ESO-Geografia-MedioNaturalYProblemasMedioambientales.js')">Medio natural</button>

</div>

<h2 onclick="toggleMenu('fisica1')">▶ Biología</h2>
<div id="fisica1" style="display:none;">

<button onclick="cargarTema('1 ESO/Fisica/preguntas_1ESO-Fisica-ComponentesDeLosEcosistemas.js')">Componentes de ecosistemas</button>
<button onclick="cargarTema('1 ESO/Fisica/preguntas_1ESO-Fisica-EcosistemasAcuaticos.js')">Ecosistemas acuaticos</button>
<button onclick="cargarTema('1 ESO/Fisica/preguntas_1ESO-Fisica-EcosistemasTerrestres.js')">Ecosistemas terrestres</button>
<button onclick="cargarTema('1 ESO/Fisica/preguntas_1ESO-Fisica-ElPlanetaTierraYSusMovimientos.js')">Planeta Tierra</button>
<button onclick="cargarTema('1 ESO/Fisica/preguntas_1ESO-Fisica-ElSueloComoEcosistema.js')">El suelo</button>
<button onclick="cargarTema('1 ESO/Fisica/preguntas_1ESO-Fisica-ElUniversoYElSistemaSolar.js')">Universo y sistema solar</button>
<button onclick="cargarTema('1 ESO/Fisica/preguntas_1ESO-Fisica-FactoresDeDesequilibrioDeLosEcosistemas.js')">Desequilibrio ecosistemas</button>
<button onclick="cargarTema('1 ESO/Fisica/preguntas_1ESO-Fisica-Invertebrados.js')">Invertebrados</button>
<button onclick="cargarTema('1 ESO/Fisica/preguntas_1ESO-Fisica-LaAtmosfera.js')">Atmosfera</button>
<button onclick="cargarTema('1 ESO/Fisica/preguntas_1ESO-Fisica-LaBiosfera.js')">Biosfera</button>
<button onclick="cargarTema('1 ESO/Fisica/preguntas_1ESO-Fisica-LaCelula.js')">La celula</button>
<button onclick="cargarTema('1 ESO/Fisica/preguntas_1ESO-Fisica-LaConservacionDelMedioAmbiente.js')">Conservacion del medio ambiente</button>
<button onclick="cargarTema('1 ESO/Fisica/preguntas_1ESO-Fisica-LaGeosfera.js')">Geosfera</button>
<button onclick="cargarTema('1 ESO/Fisica/preguntas_1ESO-Fisica-LaHidrosfera.js')">Hidrosfera</button>
<button onclick="cargarTema('1 ESO/Fisica/preguntas_1ESO-Fisica-LaMetodologiaCientifica.js')">Metodo cientifico</button>
<button onclick="cargarTema('1 ESO/Fisica/preguntas_1ESO-Fisica-LasFuncionesVitales.js')">Funciones vitales</button>
<button onclick="cargarTema('1 ESO/Fisica/preguntas_1ESO-Fisica-Plantas.js')">Plantas</button>
<button onclick="cargarTema('1 ESO/Fisica/preguntas_1ESO-Fisica-ReinosDeLosSeresVivos.js')">Reinos de los seres vivos</button>
<button onclick="cargarTema('1 ESO/Fisica/preguntas_1ESO-Fisica-SistemasDeClasificacionDeLosSeresVivos.js')">Clasificacion seres vivos</button>
<button onclick="cargarTema('1 ESO/Fisica/preguntas_1ESO-Fisica-Vertebrados.js')">Vertebrados</button>

</div>

</div>

<h2 onclick="toggleMenu('Otros')">▶ Extras</h2>
<div id="Otros" style="display:none;">

<button onclick="cargarTema('Otros/preguntas_cultura.js')">
Cultura
</button>

<button onclick="cargarTema('Otros/preguntas_electricidad.js')">
Electricidad
</button>

</div>

</div>
`