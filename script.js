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

function login() {

    const usuario =
        document.getElementById("usuario").value.trim();

    const password =
        document.getElementById("password").value;

    if (usuario === "admin" && password === "123") {

        usuarioActual = usuario;

    }
    else if (usuario === "usuario" && password === "123") {

        usuarioActual = usuario;

    }
    else {

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

    actualizarDashboard();

    mostrarGastos();

    actualizarFrecuencia();
}


// =======================================
// LOGOUT
// =======================================

function logout() {

    if (confirm("¿Cerrar sesión?")) {

        location.reload();

    }

}


// =======================================
// RELOJ
// =======================================




// =======================================
// MODAL CONTROL
// =======================================

function abrirModal() {

    document
        .getElementById("modal")
        .classList
        .remove("hidden");

    document
        .getElementById("nombre")
        .focus();
}

function cerrarModal() {

    document
        .getElementById("modal")
        .classList
        .add("hidden");

    limpiarFormulario();

}


// =======================================
// LIMPIAR FORM
// =======================================

function limpiarFormulario() {

    document.getElementById("idGasto").value = "";

    document.getElementById("nombre").value = "";

    document.getElementById("monto").value = "";

    document.getElementById("categoria").selectedIndex = 0;

    document.getElementById("tipo").value = "Unico";

    document
        .getElementById("frecuencia").selectedIndex = 0;

    actualizarFrecuencia();

    document.getElementById("fecha").value =
        obtenerFechaHoy();

    document.getElementById("observaciones").value = "";

}


// =======================================
// GUARDAR GASTO (CREATE / UPDATE)
// =======================================

function guardarGasto() {

    const id =
        document.getElementById("idGasto").value;

    var esNuevo = id == "";

    const nombre =
        document.getElementById("nombre").value.trim();

    const monto =
        parseFloat(document.getElementById("monto").value);

    const categoria =
        document.getElementById("categoria").value;

    const tipo =
        document.getElementById("tipo").value;

    const frecuencia =
        document.getElementById("tipo").value === "Recurrente"
            ? document.getElementById("frecuencia").value : "";

    const fecha =
        document.getElementById("fecha").value;

    const observaciones =
        document.getElementById("observaciones").value;


    if (nombre === "" || isNaN(monto)) {

        alert("Complete nombre y monto");

        return;

    }


    // =========================
    // EDITAR
    // =========================

    if (!esNuevo) {

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

    else {

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

    //mostrarGastos();
    buscarGastos();

}


// =======================================
// DASHBOARD
// =======================================

function actualizarDashboard() {

    let total = 0;

    let mes = 0;

    let recurrentes = 0;

    let suma = 0;


    const mesActual =
        new Date().getMonth();


    gastos.forEach(g => {

        total += g.monto;

        suma += g.monto;

        if (g.tipo === "Recurrente") {

            recurrentes++;

        }

        if (new Date(g.fecha).getMonth() === mesActual) {

            mes += g.monto;

        }

    });


    document
        .getElementById("totalGastado")
        .innerHTML =
        "Gs. " + formatoPYG(total);


    document
        .getElementById("gastoMes")
        .innerHTML =
        "Gs. " + formatoPYG(mes);


    document
        .getElementById("totalRecurrentes")
        .innerHTML =
        recurrentes;


    document
        .getElementById("promedioGastos")
        .innerHTML =
        gastos.length > 0
            ? "Gs. " + formatoPYG((suma / gastos.length).toFixed(0))
            : "Gs. 0";

}

// =======================================
// MOSTRAR GASTOS
// =======================================

function mostrarGastos(lista = gastos) {

    const contenedor =
        document.getElementById("contenedorGastos");

    const inputNombre =
        document.getElementById("buscarNombre");

    const selectCategoria =
        document.getElementById("buscarCategoria");

    contenedor.innerHTML = "";

    /*inputNombre.value = "";

    selectCategoria.selectedIndex = 0;*/


    if (lista.length === 0) {

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

            <p>💰 Gs. ${formatoPYG(g.monto)}</p>

            <p>📂 ${g.categoria}</p>

            <p>📅 ${g.fecha || '-'}</p>

        </div>

        `;

    });

    actualizarFrecuencia();

}


// =======================================
// BUSCADOR
// =======================================

function buscarGastos() {

    const nombre =
        document
            .getElementById("buscarNombre")
            .value
            .toLowerCase()
            .trim();


    const categoria =
        document
            .getElementById("buscarCategoria")
            .value;


    const resultado = gastos.filter(g => {

        const coincideNombre =
            g.nombre
                .toLowerCase()
                .includes(nombre);


        const coincideCategoria =
            categoria === "" ||
            g.categoria === categoria;


        return coincideNombre &&
            coincideCategoria;

    });


    mostrarGastos(resultado);

}


// =======================================
// DETALLE
// =======================================

function verDetalle(id) {

    gastoSeleccionado =
        gastos.find(g => g.id === id);


    if (!gastoSeleccionado) return;

    const modalDetalle =
        document.getElementById("detalle");

    modalDetalle
        .classList
        .remove("hidden");

    modalDetalle.focus();

    modalDetalle.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });


    document.getElementById("detalleNombre").innerText =
        gastoSeleccionado.nombre;

    document.getElementById("detalleMonto").innerHTML =
        "Gs. " + formatoPYG(gastoSeleccionado.monto);

    document.getElementById("detalleCategoria").innerHTML =

        '<span class="categoriaChip">' +

        gastoSeleccionado.categoria +

        '</span>';

    document.getElementById("detalleTipo").innerHTML =
        gastoSeleccionado.tipo === "Recurrente" ?
            '<span class="badgeRecurrente">🔁 Recurrente</span>'
            :
            '<span class="badgeUnico">📌 Único</span>';

    document.getElementById("detalleFrecuencia").innerHTML =
        gastoSeleccionado.tipo === "Recurrente"
            ? gastoSeleccionado.frecuencia : "-";

    document.getElementById("detalleFecha").innerText =
        gastoSeleccionado.fecha;

    document.getElementById("detalleObservaciones").innerText =
        gastoSeleccionado.observaciones;

}


// =======================================
// CERRAR DETALLE
// =======================================

function cerrarDetalle() {

    document
        .getElementById("detalle")
        .classList
        .add("hidden");

    document.body.style.overflow = "auto";

}


// =======================================
// EDITAR DESDE DETALLE
// =======================================

function editarGasto() {

    if (!gastoSeleccionado)
        return;


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


    actualizarFrecuencia();


    document.getElementById("frecuencia").value =
        gastoSeleccionado.frecuencia || "";


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

function eliminarGasto() {

    if (!gastoSeleccionado) return;


    if (!confirm("¿Eliminar este gasto?")) return;


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

    //mostrarGastos();
    buscarGastos();

    alert("Gasto eliminado");

}


// =======================================
// ESTADÍSTICAS
// =======================================

function mostrarEstadisticas() {

    let categorias = {};

    let total = 0;


    gastos.forEach(g => {

        total += g.monto;


        if (!categorias[g.categoria]) {

            categorias[g.categoria] = 0;

        }


        categorias[g.categoria] += g.monto;

    });


    let categoriaMayor = "-";

    let max = 0;


    for (let c in categorias) {

        if (categorias[c] > max) {

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
            ? "Gs. " + formatoPYG((total / gastos.length).toFixed(0))
            : "Gs. 0";

    document.getElementById("estadisticaRecurrentes").innerText =
        gastos.filter(g => g.tipo === "Recurrente").length;


    document
        .getElementById("estadisticas")
        .classList
        .remove("hidden");

    dibujarGrafico(categorias);
}


// =======================================
// CERRAR ESTADISTICAS
// =======================================

function cerrarEstadisticas() {

    document
        .getElementById("estadisticas")
        .classList
        .add("hidden");

}

function actualizarFrecuencia() {

    const recurrente =
        document.getElementById("tipo").value === "Recurrente";

    document
        .getElementById("grupoFrecuencia")
        .style.display =
        recurrente
            ? "block"
            : "none";
}

function dibujarGrafico(categorias) {

    const canvas =
        document.getElementById("graficoCategorias");

    const ctx =
        canvas.getContext("2d");

    ctx.clearRect(0, 0, 300, 300);

    const colores = [

        "#22c55e",
        "#3b82f6",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#06b6d4",
        "#ec4899",
        "#84cc16",
        "#f97316",
        "#14b8a6"

    ];

    const total =
        Object.values(categorias)
            .reduce((a, b) => a + b, 0);

    let inicio = 0;

    let i = 0;

    for (const categoria in categorias) {

        const angulo =
            (categorias[categoria] / total)
            * Math.PI * 2;

        ctx.beginPath();

        ctx.moveTo(150, 150);

        ctx.arc(
            150,
            150,
            110,
            inicio,
            inicio + angulo
        );

        ctx.closePath();

        ctx.fillStyle =
            colores[i % colores.length];

        ctx.fill();

        inicio += angulo;

        i++;

    }

}

function obtenerFechaHoy() {

    const hoy = new Date();

    const anio = hoy.getFullYear();

    const mes = String(hoy.getMonth() + 1)
        .padStart(2, "0");

    const dia = String(hoy.getDate())
        .padStart(2, "0");

    return `${anio}-${mes}-${dia}`;

}

function formatoPYG(valor) {

    return Number(valor).toLocaleString(

        "es-PY",

        {

            minimumFractionDigits: 0,

            maximumFractionDigits: 2

        }

    );

}

function obtenerFiltrosActuales() {

    return {

        nombre:
            document.getElementById("buscarNombre").value,

        categoria:
            document.getElementById("buscarCategoria").value

    };

}

function nuevoGasto() {

    limpiarFormulario();

    document
        .getElementById("fecha")
        .value = obtenerFechaHoy();


    abrirModal();

}

function reiniciarBusqueda(){

    document
    .getElementById("buscarNombre")
    .value = "";


    document
    .getElementById("buscarCategoria")
    .selectedIndex = 0;


    mostrarGastos();

}

// =======================================
// INICIALIZAR
// =======================================

mostrarGastos();

