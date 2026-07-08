// =======================================
// ESTADO GLOBAL
// =======================================

let usuarioActual = "";

let gastos =
JSON.parse(localStorage.getItem("gastos")) || [];

let gastoSeleccionado = null;


// =======================================
// LOGIN
// =======================================

function login(){

    const usuario =
    document.getElementById("usuario").value.trim();

    const password =
    document.getElementById("password").value;

    if(usuario === "admin" && password === "123"){

        usuarioActual = usuario;

    }
    else if(usuario === "usuario" && password === "123"){

        usuarioActual = usuario;

    }
    else{

        alert("Credenciales incorrectas");

        return;

    }

    document
    .getElementById("loginContainer")
    .classList.add("hidden");

    document
    .getElementById("app")
    .classList.remove("hidden");

    document
    .getElementById("bienvenida")
    .innerHTML =
    "Bienvenido <b>" + usuarioActual + "</b>";

    iniciarReloj();

    actualizarDashboard();

    mostrarGastos();

}


// =======================================
// LOGOUT
// =======================================

function logout(){

    if(confirm("¿Cerrar sesión?")){

        location.reload();

    }

}


// =======================================
// RELOJ
// =======================================

function iniciarReloj(){

    setInterval(()=>{

        document
        .getElementById("reloj")
        .innerHTML =
        new Date().toLocaleString();

    },1000);

}


// =======================================
// MODAL CONTROL
// =======================================

function abrirModal(){

    document
    .getElementById("modal")
    .classList
    .remove("hidden");

    document
    .getElementById("nombre")
    .focus();

}

function cerrarModal(){

    document
    .getElementById("modal")
    .classList
    .add("hidden");

    limpiarFormulario();

}


// =======================================
// LIMPIAR FORM
// =======================================

function limpiarFormulario(){

    document.getElementById("idGasto").value = "";

    document.getElementById("nombre").value = "";

    document.getElementById("monto").value = "";

    document.getElementById("categoria").selectedIndex = 0;

    document.getElementById("tipo").value = "Unico";

    document.getElementById("frecuencia").selectedIndex = 0;

    document.getElementById("fecha").value = "";

    document.getElementById("observaciones").value = "";

}


// =======================================
// GUARDAR GASTO (CREATE / UPDATE)
// =======================================

function guardarGasto(){

    const id =
    document.getElementById("idGasto").value;

    const nombre =
    document.getElementById("nombre").value.trim();

    const monto =
    parseFloat(document.getElementById("monto").value);

    const categoria =
    document.getElementById("categoria").value;

    const tipo =
    document.getElementById("tipo").value;

    const frecuencia =
    document.getElementById("frecuencia").value;

    const fecha =
    document.getElementById("fecha").value;

    const observaciones =
    document.getElementById("observaciones").value;


    if(nombre === "" || isNaN(monto)){

        alert("Complete nombre y monto");

        return;

    }


    // =========================
    // EDITAR
    // =========================

    if(id !== ""){

        const gasto =
        gastos.find(g => g.id == id);

        gasto.nombre = nombre;

        gasto.monto = monto;

        gasto.categoria = categoria;

        gasto.tipo = tipo;

        gasto.frecuencia = frecuencia;

        gasto.fecha = fecha;

        gasto.observaciones = observaciones;

        alert("Gasto actualizado");

    }

    // =========================
    // NUEVO
    // =========================

    else{

        gastos.push({

            id: Date.now(),

            nombre,
            monto,
            categoria,
            tipo,
            frecuencia,
            fecha,
            observaciones

        });

        alert("Gasto registrado");

    }


    localStorage.setItem(
        "gastos",
        JSON.stringify(gastos)
    );


    cerrarModal();

    actualizarDashboard();

    mostrarGastos();

}


// =======================================
// DASHBOARD
// =======================================

function actualizarDashboard(){

    let total = 0;

    let mes = 0;

    let recurrentes = 0;

    let suma = 0;


    const mesActual =
    new Date().getMonth();


    gastos.forEach(g => {

        total += g.monto;

        suma += g.monto;

        if(g.tipo === "Recurrente"){

            recurrentes++;

        }

        if(new Date(g.fecha).getMonth() === mesActual){

            mes += g.monto;

        }

    });


    document
    .getElementById("totalGastado")
    .innerHTML =
    "Gs. " + total;


    document
    .getElementById("gastoMes")
    .innerHTML =
    "Gs. " + mes;


    document
    .getElementById("totalRecurrentes")
    .innerHTML =
    recurrentes;


    document
    .getElementById("promedioGastos")
    .innerHTML =
    gastos.length > 0
    ? "Gs. " + (suma / gastos.length).toFixed(0)
    : "Gs. 0";

}

// =======================================
// MOSTRAR GASTOS
// =======================================

function mostrarGastos(lista = gastos){

    const contenedor =
    document.getElementById("contenedorGastos");

    const inputNombre =
    document.getElementById("buscarNombre");

    const selectCategoria =
    document.getElementById("buscarCategoria");

    contenedor.innerHTML = "";

    inputNombre.value="";

    selectCategoria.selectedIndex = 0;


    if(lista.length === 0){

        contenedor.innerHTML =
        "<p>No hay gastos registrados</p>";

        return;

    }


    lista.forEach(g => {

        contenedor.innerHTML += `

        <div
        class="gastoCard ${g.tipo === 'Recurrente' ? 'recurrente' : 'unico'}"
        onclick="verDetalle(${g.id})">

            <h3>${g.nombre}</h3>

            <p>💰 Gs. ${g.monto}</p>

            <p>📂 ${g.categoria}</p>

            <p>📅 ${g.fecha || '-'}</p>

        </div>

        `;

    });

}


// =======================================
// BUSCADOR
// =======================================

function buscarGastos(){

    const nombre =
    document.getElementById("buscarNombre")
    .value.toLowerCase().trim();

    const categoria =
    document.getElementById("buscarCategoria")
    .value;


    const resultado = gastos.filter(g => {

        const matchNombre =
        g.nombre.toLowerCase().includes(nombre);

        const matchCategoria =
        categoria === "" || g.categoria === categoria;

        return matchNombre && matchCategoria;

    });


    mostrarGastos(resultado);

}


// =======================================
// DETALLE
// =======================================

function verDetalle(id){

    gastoSeleccionado =
    gastos.find(g => g.id === id);


    if(!gastoSeleccionado) return;


    document
    .getElementById("detalle")
    .classList
    .remove("hidden");


    document.getElementById("detalleNombre").innerText =
    gastoSeleccionado.nombre;

    document.getElementById("detalleMonto").innerText =
    "Gs. " + gastoSeleccionado.monto;

    document.getElementById("detalleCategoria").innerText =
    gastoSeleccionado.categoria;

    document.getElementById("detalleTipo").innerText =
    gastoSeleccionado.tipo;

    document.getElementById("detalleFrecuencia").innerText =
    gastoSeleccionado.frecuencia;

    document.getElementById("detalleFecha").innerText =
    gastoSeleccionado.fecha;

    document.getElementById("detalleObservaciones").innerText =
    gastoSeleccionado.observaciones;

}


// =======================================
// CERRAR DETALLE
// =======================================

function cerrarDetalle(){

    document
    .getElementById("detalle")
    .classList
    .add("hidden");

}


// =======================================
// EDITAR DESDE DETALLE
// =======================================

function editarGasto(){

    if(!gastoSeleccionado) return;


    document.getElementById("idGasto").value =
    gastoSeleccionado.id;

    document.getElementById("nombre").value =
    gastoSeleccionado.nombre;

    document.getElementById("monto").value =
    gastoSeleccionado.monto;

    document.getElementById("categoria").value =
    gastoSeleccionado.categoria;

    document.getElementById("tipo").value =
    gastoSeleccionado.tipo;

    document.getElementById("frecuencia").value =
    gastoSeleccionado.frecuencia;

    document.getElementById("fecha").value =
    gastoSeleccionado.fecha;

    document.getElementById("observaciones").value =
    gastoSeleccionado.observaciones;


    cerrarDetalle();

    abrirModal();

}


// =======================================
// ELIMINAR GASTO
// =======================================

function eliminarGasto(){

    if(!gastoSeleccionado) return;


    if(!confirm("¿Eliminar este gasto?")) return;


    gastos = gastos.filter(
        g => g.id !== gastoSeleccionado.id
    );


    localStorage.setItem(
        "gastos",
        JSON.stringify(gastos)
    );


    gastoSeleccionado = null;


    cerrarDetalle();

    actualizarDashboard();

    mostrarGastos();

    alert("Gasto eliminado");

}


// =======================================
// ESTADÍSTICAS
// =======================================

function mostrarEstadisticas(){

    let categorias = {};

    let total = 0;


    gastos.forEach(g => {

        total += g.monto;


        if(!categorias[g.categoria]){

            categorias[g.categoria] = 0;

        }


        categorias[g.categoria] += g.monto;

    });


    let categoriaMayor = "-";

    let max = 0;


    for(let c in categorias){

        if(categorias[c] > max){

            max = categorias[c];

            categoriaMayor = c;

        }

    }


    document.getElementById("categoriaMayor").innerText =
    categoriaMayor;

    document.getElementById("cantidadGastos").innerText =
    gastos.length;

    document.getElementById("estadisticaPromedio").innerText =
    gastos.length > 0
    ? "Gs. " + (total / gastos.length).toFixed(0)
    : "Gs. 0";

    document.getElementById("estadisticaRecurrentes").innerText =
    gastos.filter(g => g.tipo === "Recurrente").length;


    document
    .getElementById("estadisticas")
    .classList
    .remove("hidden");

}


// =======================================
// CERRAR ESTADISTICAS
// =======================================

function cerrarEstadisticas(){

    document
    .getElementById("estadisticas")
    .classList
    .add("hidden");

}


// =======================================
// INICIALIZAR
// =======================================

mostrarGastos();