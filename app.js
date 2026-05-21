// ===== Elementos del DOM =====
const campoBusqueda   = document.getElementById('campo-nombre');
const botonBuscar     = document.getElementById('boton-buscar');
const mensajeEstado   = document.getElementById('mensaje-estado');
const contenedorTarjetas = document.getElementById('contenedor-tarjetas');
const listaUsuarios   = document.getElementById('lista-usuarios');

// ===== Evento: clic en botón =====
botonBuscar.addEventListener('click', realizarBusqueda);

// ===== Evento: presionar Enter =====
campoBusqueda.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') realizarBusqueda();
});

// ===== Cargar lista inicial al abrir la página =====
window.addEventListener('load', cargarListaInicial);

// ===== Función principal de búsqueda =====
async function realizarBusqueda() {
  const nombre = campoBusqueda.value.trim().toLowerCase();

  if (!nombre) {
    mostrarMensaje('Por favor escribe un nombre para buscar.');
    return;
  }

  mostrarMensaje('Buscando...');
  contenedorTarjetas.innerHTML = '';

  try {
    // Pedimos 20 usuarios con la misma semilla y filtramos por nombre localmente
    const respuesta = await fetch('https://randomuser.me/api/?results=20&nat=es,mx,ar,co&seed=carpets');
    const datos = await respuesta.json();

    const usuariosFiltrados = datos.results.filter((usuario) => {
      const nombreCompleto = `${usuario.name.first} ${usuario.name.last}`.toLowerCase();
      return nombreCompleto.includes(nombre);
    });

    if (usuariosFiltrados.length === 0) {
      mostrarMensaje(`No se encontraron usuarios con el nombre "${campoBusqueda.value}".`);
    } else {
      mostrarMensaje(`Se encontraron ${usuariosFiltrados.length} usuario(s).`);
      usuariosFiltrados.forEach(mostrarTarjeta);
      // Desplazarse hacia el contenedor de tarjetas
      setTimeout(() => {
        contenedorTarjetas.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }

  } catch (error) {
    mostrarMensaje('Error al conectar con la API. Intenta de nuevo.');
    console.error(error);
  }
}

// ===== Crea y muestra una tarjeta de usuario =====
function mostrarTarjeta(usuario) {
  const nombreCompleto = `${usuario.name.first} ${usuario.name.last}`;
  const correo  = usuario.email;
  const ciudad  = usuario.location.city;
  const fotoPerfil = usuario.picture.medium;

  const tarjeta = document.createElement('div');
  tarjeta.classList.add('tarjeta');

  tarjeta.innerHTML = `
    <img class="tarjeta-foto" src="${fotoPerfil}" alt="Foto de ${nombreCompleto}" />
    <p class="tarjeta-nombre">${nombreCompleto}</p>
    <p class="tarjeta-info"><span>📧</span>${correo}</p>
    <p class="tarjeta-info"><span>📍</span>${ciudad}</p>
  `;

  contenedorTarjetas.appendChild(tarjeta);
}

// ===== Muestra un mensaje de estado =====
function mostrarMensaje(texto) {
  mensajeEstado.textContent = texto;
}

// ===== Carga y muestra la lista inicial de usuarios =====
async function cargarListaInicial() {
  try {
    const respuesta = await fetch('https://randomuser.me/api/?results=20&nat=es,mx,ar,co&seed=carpets');
    const datos = await respuesta.json();
    listaUsuarios.innerHTML = '';
    datos.results.forEach(mostrarElementoLista);
  } catch (error) {
    console.error('Error al cargar lista inicial:', error);
  }
}

// ===== Crea y muestra un elemento de la lista de usuarios =====
function mostrarElementoLista(usuario) {
  const nombreCompleto = `${usuario.name.first} ${usuario.name.last}`;
  const correo = usuario.email;
  const fotoPerfil = usuario.picture.medium;

  const elemento = document.createElement('div');
  elemento.classList.add('elemento-lista-usuario');

  elemento.innerHTML = `
    <img class="foto-usuario" src="${fotoPerfil}" alt="Foto de ${nombreCompleto}" />
    <p class="nombre-usuario">${nombreCompleto}</p>
    <p class="correo-usuario">${correo}</p>
  `;

  listaUsuarios.appendChild(elemento);
}

// ===== Función de refrescar búsqueda =====
function refrescarBusqueda() {

    // Limpiar input
    campoBusqueda.value = '';

    // Limpiar tarjetas actuales
    contenedorTarjetas.innerHTML = '';

    // Limpiar mensaje
    mostrarMensaje('');
}