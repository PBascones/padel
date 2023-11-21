let id = 1;
let jugadores = [];
let jugadoresAdentro = [];
let jugadoresAfuera = [];
let equipos = [];
let resultados = [];

function agregarJugador() {
  const playerName = document.getElementById("player-name").value;
  if (playerName !== "") {
    const player = {
      id,
      nombre: playerName,
      partidos: 0,
    };
    id++;
    jugadores.push(player);
    localStorage.setItem("jugadores", JSON.stringify(jugadores));
    document.getElementById("player-name").value = "";
    mostrarJugadores();
  }
}

// Manejar el evento de presionar "Enter"
document
  .getElementById("player-name")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      agregarJugador();
    }
  });

function mostrarJugadores() {
  const playersList = document.getElementById("players-list");
  playersList.innerHTML = "";
  jugadores.forEach((jugador) => {
    const listItem = document.createElement("li");
    listItem.textContent = jugador.nombre;
    playersList.appendChild(listItem);
  });
}

function iniciarPartido() {
  if (jugadores.length < 4) {
    alert("Necesitas al menos 4 jugadores para iniciar un partido.");
    return;
  }

  if (equipos.length === 0) {
    // Formar dos equipos iniciales
    equipos = formarEquipos(true);
  } else {
    // Cambiar jugadores entre equipos y formar nuevos equipos
    intercambiarJugadores();
    equipos = formarEquipos();
  }

  mostrarEquipos();
}

function formarEquipos(isNew = false) {
  // Lógica para formar dos equipos de forma aleatoria
  const equiposAleatorios = [];
  const jugadoresCopiados = (jugadoresAdentro.length > 0 && [
    ...jugadoresAdentro,
  ]) || [...jugadores];

  jugadoresAdentro = [];

  while (equiposAleatorios.length < 2) {
    const equipo = [];
    for (let i = 0; i < 2 && jugadoresCopiados.length > 0; i++) {
      const jugadorIndex = Math.floor(Math.random() * jugadoresCopiados.length);
      const jugador = jugadoresCopiados.splice(jugadorIndex, 1)[0];
      jugador.partidos++;
      equipo.push(jugador);
      jugadoresAdentro.push(jugador);
    }
    equiposAleatorios.push(equipo);
  }

  if (isNew) {
    jugadoresAfuera = jugadoresCopiados;
  }

  return equiposAleatorios;
}

function intercambiarJugadores() {
  // Lógica para intercambiar jugadores entre equipos después de cada partido
  let equipo1 = equipos[0];
  let equipo2 = equipos[1];

  let jugadorSaleEquipo1 = equipo1.find((j) => j.partidos >= 2);
  let jugadorSaleEquipo2 = equipo2.find((j) => j.partidos >= 2);

  if (jugadorSaleEquipo1 !== undefined && jugadorSaleEquipo2 !== undefined) {
    equipo1 = equipo1.filter((j) => j.id !== jugadorSaleEquipo1.id);
    equipo2 = equipo2.filter((j) => j.id !== jugadorSaleEquipo2.id);
  } else {
    jugadorSaleEquipo1 = equipo1.pop();
    jugadorSaleEquipo2 = equipo2.pop();
  }

  // sacar jugadores
  jugadoresAdentro = jugadoresAdentro.filter(
    (j) => j.id != jugadorSaleEquipo1.id && j.id != jugadorSaleEquipo2.id
  );

  jugadoresAdentro.push(jugadoresAfuera[0]);
  jugadoresAdentro.push(jugadoresAfuera[1]);

  // reset partidos quienes salen
  jugadorSaleEquipo1.partidos = 0;
  jugadorSaleEquipo2.partidos = 0;

  jugadoresAfuera = [];
  jugadoresAfuera.push(jugadorSaleEquipo1);
  jugadoresAfuera.push(jugadorSaleEquipo2);
}

function mostrarEquipos() {
  const teamsList = document.getElementById("teams-list");
  teamsList.innerHTML = "";
  equipos.forEach((equipo, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Equipo ${index + 1}: ${equipo
      .map((x) => x.nombre)
      .join(", ")}`;
    teamsList.appendChild(listItem);
  });
}

function simularPartido() {
  resultados = [];

  // Lógica para simular un partido y registrar resultados
  // Puedes mejorar esta lógica según tus necesidades

  // ...

  // Mostrar resultados en la interfaz
  const resultsList = document.getElementById("results-list");
  resultsList.innerHTML = "";
  resultados.forEach((resultado, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Partido ${index + 1}: ${resultado}`;
    resultsList.appendChild(listItem);
  });
}

// Llamada a funciones de inicialización
mostrarJugadores();
