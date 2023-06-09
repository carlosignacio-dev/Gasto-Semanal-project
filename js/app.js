
//Variables y Selectores
const formulario = document.querySelector("#agregar-gasto");
const gastosListado = document.querySelector("#gastos ul");

//Eventos
eventListeners();
function eventListeners() {
    document.addEventListener("DOMContentLoaded", preguntarPresupuesto);

    formulario.addEventListener("submit", agregarGasto);
}

//Classes
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;

        console.log(this.restante);
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        //Extrayendo valores
        const {presupuesto, restante} = cantidad;

        //Agregar al HTML
        document.querySelector("#total").textContent = presupuesto;
        document.querySelector("#restante").textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        //crear div
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("text-center", "alert");

        if(tipo === "error") {
            divMensaje.classList.add("alert-danger");
        } else {
            divMensaje.classList.add("alert-success")
        }

        //Mensaje de error
        divMensaje.textContent = mensaje;

        //insertar en HTML
        document.querySelector(".primario").insertBefore(divMensaje, formulario);

        setTimeout(() => {
            divMensaje.remove();
        }, 2500);
    }

    mostrarGastos(gastos) {

        this.limpiarHTML();//Elimina HTML previo
        
        //Iterar sobre los gastos
        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto;

            //Crear Li
            const nuevoGasto = document.createElement("li");
            nuevoGasto.className = "list-group-item d-flex justify-content-between align-items-center";
            nuevoGasto.dataset.id = id;

            //Agregar HTML de gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $${cantidad} </span>`

            //Boton para borrar el gasto
            const btnBorrar = document.createElement("button");
            btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
            btnBorrar.innerHTML = "Borrar &times;";
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            //Agregar al html
            gastosListado.appendChild(nuevoGasto);
        })    
    }

    limpiarHTML() {
        while (gastosListado.firstChild) {
            gastosListado.removeChild(gastosListado.firstChild);
        }
    }

    actualizarRestante(restante) {
        document.querySelector("#restante").textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector(".restante");

        //Comprobar 25%
        if( (presupuesto / 4) > restante ) {
            restanteDiv.classList.remove("alert-success", "alert-warning");
            restanteDiv.classList.add("alert-danger");
        } else if( (presupuesto / 2) > restante ) {
            restanteDiv.classList.remove("alert-success");
            restanteDiv.classList.add("alert-warning");
        } else {
            restanteDiv.classList.remove("alert-danger", "alert-warning");
            restanteDiv.classList.add("alert-success");
        }

        //Si el total es 0 o menor
        if(restante <= 0) {
            ui.imprimirAlerta("El presupuesto se ha agotado");
            formulario.querySelector("button[type='submit']").disabled = true;
        }
    }
}

//Instanciar
const ui = new UI();
let presupuesto;

//Funciones
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt("¿Cual es tu Presupuesto?");

    //validacion
    if(presupuestoUsuario === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }

    //Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);
}

//Añadir gastos
function agregarGasto(e) {
    e.preventDefault();

    //Leer datos del formulario
    const nombre = document.querySelector("#gasto").value;
    const cantidad = Number(document.querySelector("#cantidad").value);

    //Validar
    if(nombre === "" || cantidad === "") {
        ui.imprimirAlerta("Ambos campos son obligatorios.", "error");
        return;
    } else if(cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta("Cantidad no Valida", "error");
        return;
    }
    
    //Generar objeto con el gasto
    const gasto = {
        nombre,
        cantidad,
        id: Date.now()
    };
    
    //Añade nuevo gasto
    presupuesto.nuevoGasto(gasto);

    //Mensaje de gasto exitoso
    ui.imprimirAlerta("Gasto agregado correctamente.");

    //Imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    //Reiniciar formulario
    formulario.reset();
}

function eliminarGasto(id) {
    //Elimina gastos del objeto
    presupuesto.eliminarGasto(id);

    //Elimina gastos del HTML
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}