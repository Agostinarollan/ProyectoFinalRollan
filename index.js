const clientes = JSON.parse(localStorage.getItem('clientes')) || [];

// Función para cargar datos desde un archivo JSON
function cargarDatosJSON() {
    fetch('clientes.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(cliente => clientes.push(cliente));
            localStorage.setItem('clientes', JSON.stringify(clientes));
            mostrarResultadosBusqueda(clientes);
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

document.getElementById("calcular").addEventListener("click", () => {
    // Obtener los valores del formulario
    const nombre = document.getElementById("nombre").value;
    const cliente = document.getElementById("cliente").value;
    const hectareas = parseFloat(document.getElementById("hectareas").value);
    const fertilizante = document.getElementById("fertilizante").value;

    let fertilizantePorHectarea;
    let nombreFertilizante;

    switch(fertilizante){
        case "nk soybeans":
            fertilizantePorHectarea = 4;
            nombreFertilizante = "NK Soybeans";
            break;
        case "acuron":
            fertilizantePorHectarea = 5;
            nombreFertilizante = "Acuron";
            break;
        case "miravis":
            fertilizantePorHectarea = 6;
            nombreFertilizante = "Miravis";
            break;
        default:
            fertilizantePorHectarea = 0;
            nombreFertilizante = "Ninguno";
    }

    const tipoFertilizante = hectareas * fertilizantePorHectarea;

    const clienteObj = {
        usuario: nombre,
        cliente: cliente,
        hectareas: hectareas,
        nombreFertilizante: nombreFertilizante,
        tipoFertilizante: tipoFertilizante
    };

    clientes.push(clienteObj);
    localStorage.setItem('clientes', JSON.stringify(clientes)); // Guardar en localStorage

    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.innerHTML = "";

    resultadoDiv.innerHTML = `
        <p>Usuario: ${nombre}</p>
        <p>Cliente: ${cliente}</p>
        <p>Hectareas: ${hectareas}</p>
        <p>Marca: ${nombreFertilizante}</p>
        <p>Total de aplicación: ${tipoFertilizante} kg/h</p>`;
});

function mostrarResultadosBusqueda(listaClientes) {
    const buscarResultadoDiv = document.getElementById("buscarResultado");
    buscarResultadoDiv.innerHTML = "";

    if (listaClientes.length === 0) {
        buscarResultadoDiv.innerHTML = "<p>No se encontraron resultados.</p>";
        return;
    }

    listaClientes.forEach((c, index) => {
        buscarResultadoDiv.innerHTML += `
            <div>
                <h3>Pedido ${index + 1}</h3>
                <p>Usuario: ${c.usuario}</p>
                <p>Cliente: ${c.cliente}</p>
                <p>Hectáreas: ${c.hectareas}</p>
                <p>Marca: ${c.nombreFertilizante}</p>
                <p>Total de aplicación: ${c.tipoFertilizante} kg/h</p>
            </div>
        `;
    });
}

// Agregar evento de búsqueda
document.getElementById("buscarBtn").addEventListener("click", () => {
    const busqueda = document.getElementById("buscar").value.toLowerCase();
    const resultados = clientes.filter(c => c.usuario.toLowerCase().includes(busqueda) || c.cliente.toLowerCase().includes(busqueda));
    mostrarResultadosBusqueda(resultados);
});

// Cargar datos desde localStorage y archivo JSON al iniciar la página
window.addEventListener('load', () => {
    if (clientes.length === 0) {
        cargarDatosJSON(); // Solo cargar el JSON si no hay datos en localStorage
    } else {
        mostrarResultadosBusqueda(clientes);
    }
});
