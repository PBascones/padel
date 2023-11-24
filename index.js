const jugadoresEnMemoria = JSON.parse(localStorage.getItem("jugadores"));
const rankingEnMemoria = JSON.parse(localStorage.getItem("ranking"));

let id = 1;
let jugadores = jugadoresEnMemoria || [];
let jugadoresAdentro = [];
let jugadoresAfuera = [];
let equipos = [];
let resultados = [];
let ranking = [];

function agregarJugador() {
  const nombre = document.getElementById("player-name").value;
  if (nombre !== "") {
    const player = {
      id,
      nombre: nombre,
      partidos: 0,
      puntos: 0,
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

function eliminarJugadores() {
  localStorage.clear();

  jugadores = [];
  jugadoresAdentro = [];
  jugadoresAfuera = [];

  mostrarEquipos();
  mostrarJugadores();
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
  let jugadoresSalen = jugadoresAdentro.filter(
    (jugador) => jugador.partidos >= 2
  );

  if (jugadoresSalen.length === 0) {
    jugadoresSalen.push(equipos[0].pop());
    jugadoresSalen.push(equipos[1].pop());
  }

  // sacar jugadores
  jugadoresAdentro = jugadoresAdentro.filter(
    (j) => !jugadoresSalen.map((jj) => jj.id).includes(j.id)
  );

  jugadoresAdentro.push(jugadoresAfuera[0]);
  jugadoresAdentro.push(jugadoresAfuera[1]);

  // reset partidos quienes salen
  jugadoresAfuera = [];

  jugadoresSalen.forEach((j) => {
    j.partidos = 0;
    jugadoresAfuera.push(j);
  });
}

function mostrarEquipos() {
  const teamsList = document.getElementById("teams-list");
  teamsList.innerHTML = "";
  equipos.forEach((equipo, index) => {
    const team = document.createElement("h3");

    team.className = "team-members";
    team.textContent = `Equipo ${index + 1}: ${equipo
      .map((x) => x.nombre)
      .join(", ")}`;
    teamsList.appendChild(team);
  });
}

function confirmarResultado() {
  const resultadoEquipo1 = parseInt(
    document.getElementById("resultado1").value
  );
  const resultadoEquipo2 = parseInt(
    document.getElementById("resultado2").value
  );

  if (
    !isNaN(resultadoEquipo1) &&
    !isNaN(resultadoEquipo2) &&
    !(resultadoEquipo1 > 7 || resultadoEquipo2 > 7)
  ) {
    const resultado = `${equipos[0]
      .map((x) => x.nombre)
      .join(", ")} ${resultadoEquipo1} -
       ${resultadoEquipo2} ${equipos[1].map((x) => x.nombre).join(", ")}`;
    resultados.push(resultado);

    jugadores.forEach((element, index) => {
      if (equipos[0].map((j) => j.id).includes(element.id)) {
        jugadores[index].puntos += resultadoEquipo1;
      } else if (equipos[1].map((j) => j.id).includes(element.id)) {
        jugadores[index].puntos += resultadoEquipo2;
      }
    });

    // Limpiar los inputs después de sumar resultados
    document.getElementById("resultado1").value = "";
    document.getElementById("resultado2").value = "";

    sumarRankings();
    mostrarResultados();

    iniciarPartido();
  } else {
    alert("Ingresa resultados válidos.");
  }
}

function mostrarResultados() {
  const resultsList = document.getElementById("results-list");
  resultsList.innerHTML = "";
  resultados.forEach((resultado, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Partido ${index + 1}: ${resultado}`;
    resultsList.appendChild(listItem);
  });
}

function sumarRankings(inicializar) {
  if (inicializar) {
    ranking =
      (rankingEnMemoria.length && rankingEnMemoria) ||
      jugadores.sort((a, b) => b.puntos - a.puntos);
  } else {
    ranking.forEach((jugador) => {
      jugador.puntos += jugadores.filter((j) => j.id === jugador.id)[0].puntos;
    });

    ranking.sort((a, b) => b.puntos - a.puntos)
  }

  jugadores.forEach((j) => (j.puntos = 0));

  const rankingList = document.getElementById("ranking-list");
  rankingList.innerHTML = "";
  ranking.forEach((jugador, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${index + 1} - ${jugador.nombre}: ${
      jugador.puntos
    } puntos`;
    rankingList.appendChild(listItem);
  });

  localStorage.setItem("ranking", JSON.stringify(ranking));
}

// Llamada a funciones de inicialización
mostrarJugadores();
sumarRankings(true);

// hacer que se inicie un nuevo partido desp de confirmar
