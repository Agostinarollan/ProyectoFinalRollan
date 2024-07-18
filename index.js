const clientes = JSON.parse(localStorage.getItem('clientes')) || [];

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
    const nombre = document.getElementById("nombre").value;
    const cliente = document.getElementById("cliente").value;
    const hectareas = parseFloat(document.getElementById("hectareas").value);
    const fertilizante = document.getElementById("fertilizante").value;

    let fertilizantePorHectarea;
    let nombreFertilizante;

    switch (fertilizante) {
        case "NK Soybeans":
            fertilizantePorHectarea = 4;
            nombreFertilizante = "NK Soybeans";
            break;
        case "Acuron":
            fertilizantePorHectarea = 5;
            nombreFertilizante = "Acuron";
            break;
        case "Miravis Neo":
            fertilizantePorHectarea = 6;
            nombreFertilizante = "Miravis Neo";
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
    localStorage.setItem('clientes', JSON.stringify(clientes));

    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.innerHTML = `
        <p>Usuario: ${nombre}</p>
        <p>Cliente: ${cliente}</p>
        <p>Hectáreas: ${hectareas}</p>
        <p>Marca: ${nombreFertilizante}</p>
        <p>Total de aplicación: ${tipoFertilizante} kg/h</p>`;
    
    actualizarGrafico();
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
            </div>`;
    });
}

document.getElementById("buscarBtn").addEventListener("click", () => {
    const busqueda = document.getElementById("buscar").value.toLowerCase();
    const resultados = clientes.filter(c => c.usuario.toLowerCase().includes(busqueda) || c.cliente.toLowerCase().includes(busqueda));
    mostrarResultadosBusqueda(resultados);
});

window.addEventListener('load', () => {
    if (clientes.length === 0) {
        cargarDatosJSON();
    } else {
        mostrarResultadosBusqueda(clientes);
    }
    actualizarGrafico();
});

function actualizarGrafico() {
    const ctx = document.getElementById('myChart').getContext('2d');
    const labels = clientes.map(c => c.usuario);
    const data = clientes.map(c => c.tipoFertilizante);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cantidad de Fertilizante Aplicado (kg/h)',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
