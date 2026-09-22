// ==================================================
// NUESTRO PEQUEÑO UNIVERSO 🌻
// Lógica principal de la experiencia
// ==================================================

(function () {
  "use strict";

  // ==================================================
  // CONFIGURACIÓN DE LAS 6 ESTACIONES
  // AQUÍ PUEDES CAMBIAR LAS FOTOS Y LOS MENSAJES
  // Reemplaza cada "fotoX.jpeg" por tu propia fotografía.
  // Estas fotos van sueltas en la raíz del proyecto, junto a index.html
  // (puedes usar .jpeg o .jpg, solo mantén el mismo nombre aquí y en tu archivo)
  // ==================================================
  const estaciones = [
    {
      imagen: "foto1.jpeg",
      mensaje: "Todo viaje comienza con un primer paso. 🌻"
    },
    {
      imagen: "foto2.jpeg",
      mensaje: "Y qué bonito encontrarte en el camino."
    },
    {
      imagen: "foto3.jpeg",
      mensaje: "Hay momentos que merecen quedarse para siempre."
    },
    {
      imagen: "foto4.jpeg",
      mensaje: "Entre millones de estrellas, siempre te encontraría."
    },
    {
      imagen: "foto5.jpeg",
      mensaje: "Este pequeño viaje es solo para ti."
    },
    {
      imagen: "foto6.jpeg",
      mensaje: "Y todavía nos quedan muchos lugares por descubrir. 🌻"
    }
  ];

  // ==================================================
  // VELOCIDAD DE CADA ESTACIÓN
  // Un valor más alto = el universo se mueve más rápido.
  // Deben existir tantos valores como estaciones.
  // ==================================================
  const velocidades = [0.8, 1, 1.2, 1.5, 1.8, 2.2];

  // Multiplicador temporal aplicado durante cada transición entre estaciones
  const IMPULSO_TRANSICION = 1.9;
  const DURACION_TRANSICION_MS = 1400;

  // ==================================================
  // CONFIGURACIÓN DE LA MÚSICA
  // Cambia el archivo en index.html: <audio id="musica" src="TU_CANCION.mp3">
  // La canción va suelta junto a index.html (sin carpeta "audio").
  // ==================================================
  const musica = document.getElementById("musica");

  // --------------------------------------------------
  // Referencias del DOM
  // --------------------------------------------------
  const pantallaInicio = document.getElementById("pantalla-inicio");
  const pantallaViaje = document.getElementById("pantalla-viaje");
  const btnEmpezar = document.getElementById("btn-empezar");
  const btnContinuar = document.getElementById("btn-continuar");
  const btnSonido = document.getElementById("btn-sonido");
  const estacionFoto = document.getElementById("estacion-foto");
  const estacionMensaje = document.getElementById("estacion-mensaje");
  const contador = document.getElementById("contador-estaciones");
  const canvas = document.getElementById("universo");
  const ctx = canvas.getContext("2d");

  const prefiereMenosMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // --------------------------------------------------
  // Estado de la experiencia
  // --------------------------------------------------
  let estacionActual = 0;
  let enTransicion = false;
  let velocidadActual = velocidades[0];
  let impulsoActivo = 1;

  // ==================================================
  // UNIVERSO: estrellas, partículas y flores (canvas)
  // Todo se dibuja con JavaScript, sin imágenes externas.
  // ==================================================

  // El universo se dibuja en perspectiva: cada estrella/flor tiene una
  // posición (x, y) relativa al centro y una profundidad (z). En cada
  // fotograma "z" se acerca a la cámara, y al proyectar (x/z, y/z) en la
  // pantalla se obtiene la sensación de volar hacia adelante, como un
  // avión que atraviesa el espacio y va acelerando.
  let ancho = 0;
  let alto = 0;
  let estrellas = [];
  let flores = [];

  const ENFOQUE = 320; // distancia focal de la "cámara": más alto = túnel más cerrado
  const PROFUNDIDAD_MAX = 1400;

  function ajustarTamano() {
    ancho = window.innerWidth;
    alto = window.innerHeight;
    canvas.width = ancho * window.devicePixelRatio;
    canvas.height = alto * window.devicePixelRatio;
    canvas.style.width = ancho + "px";
    canvas.style.height = alto + "px";
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  // Genera una coordenada en un plano ancho, centrado en (0,0),
  // para que al proyectarla en perspectiva llene toda la pantalla.
  function posicionAleatoriaEnPlano() {
    const rango = Math.max(ancho, alto) * 1.3;
    return {
      x: (Math.random() * 2 - 1) * rango,
      y: (Math.random() * 2 - 1) * rango
    };
  }

  function nuevaEstrella(zAleatoria) {
    const pos = posicionAleatoriaEnPlano();
    const z = zAleatoria ? Math.random() * PROFUNDIDAD_MAX + 1 : PROFUNDIDAD_MAX;
    return { x: pos.x, y: pos.y, z, pz: z, r: Math.random() * 1.3 + 0.6 };
  }

  function crearEstrellas() {
    const cantidad = ancho < 600 ? 90 : 180;
    estrellas = Array.from({ length: cantidad }, () => nuevaEstrella(true));
  }

  // Una "flor" es en realidad, según su tamaño, o bien un pétalo suelto
  // o una pequeña flor amarilla de 5 pétalos dibujada con arcos.
  function crearFlores() {
    const cantidad = ancho < 600 ? 16 : 26;
    flores = Array.from({ length: cantidad }, () => nuevaFlor(true));
  }

  function nuevaFlor(zAleatoria) {
    const pos = posicionAleatoriaEnPlano();
    const esFlorGrande = Math.random() < 0.35;
    const z = zAleatoria ? Math.random() * PROFUNDIDAD_MAX + 1 : PROFUNDIDAD_MAX;
    return {
      x: pos.x,
      y: pos.y,
      z,
      pz: z,
      tamanoBase: esFlorGrande ? Math.random() * 26 + 30 : Math.random() * 10 + 10,
      esFlor: esFlorGrande,
      rotacion: Math.random() * Math.PI * 2,
      velRotacion: (Math.random() - 0.5) * 0.02,
      factorVelocidad: Math.random() * 0.5 + 0.8
    };
  }

  // Avanza un objeto (estrella o flor) hacia la cámara según la
  // velocidad actual de la estación, y lo reubica al pasar de largo.
  function avanzarHaciaLaCamara(obj, velocidadBase, esFlor) {
    obj.pz = obj.z;
    if (!prefiereMenosMovimiento) {
      obj.z -= velocidadBase * velocidadActual * impulsoActivo;
    }
    if (obj.z < 1) {
      const nuevo = esFlor ? nuevaFlor(false) : nuevaEstrella(false);
      Object.assign(obj, nuevo);
    }
  }

  function dibujarEstrellas() {
    const cx = ancho / 2;
    const cy = alto / 2;

    for (const s of estrellas) {
      const sxAnt = cx + (s.x / s.pz) * ENFOQUE;
      const syAnt = cy + (s.y / s.pz) * ENFOQUE;

      avanzarHaciaLaCamara(s, 5.5, false);

      const sx = cx + (s.x / s.z) * ENFOQUE;
      const sy = cy + (s.y / s.z) * ENFOQUE;
      const cercania = 1 - s.z / PROFUNDIDAD_MAX;
      const grosor = Math.max(0.5, cercania * 2.6 * s.r);
      const alfa = Math.min(1, 0.15 + cercania * 1.1);

      ctx.strokeStyle = `rgba(255, 255, 240, ${alfa})`;
      ctx.lineWidth = grosor;
      ctx.lineCap = "round";

      // A alta velocidad, cada estrella se dibuja como una pequeña estela
      // (como ver las estrellas alargarse al volar rápido); en reposo,
      // como un punto que titila suavemente.
      if (velocidadActual * impulsoActivo > 1.4 && !prefiereMenosMovimiento) {
        ctx.beginPath();
        ctx.moveTo(sxAnt, syAnt);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 240, ${alfa})`;
        ctx.arc(sx, sy, Math.max(0.6, grosor * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function dibujarFlorPequena(x, y, tamano, rotacion, esFlor) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotacion);

    if (esFlor) {
      // Cinco pétalos amarillos alrededor de un centro cálido
      const petalos = 5;
      for (let i = 0; i < petalos; i++) {
        ctx.save();
        ctx.rotate((Math.PI * 2 * i) / petalos);
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 212, 71, 0.85)";
        ctx.ellipse(0, -tamano * 0.55, tamano * 0.32, tamano * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.beginPath();
      ctx.fillStyle = "rgba(255, 179, 71, 0.95)";
      ctx.arc(0, 0, tamano * 0.28, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Un pétalo suelto: una elipse alargada
      ctx.beginPath();
      ctx.fillStyle = "rgba(255, 227, 138, 0.75)";
      ctx.ellipse(0, 0, tamano * 0.4, tamano, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function dibujarFlores() {
    const cx = ancho / 2;
    const cy = alto / 2;

    for (const f of flores) {
      avanzarHaciaLaCamara(f, 4 * f.factorVelocidad, true);

      const sx = cx + (f.x / f.z) * ENFOQUE;
      const sy = cy + (f.y / f.z) * ENFOQUE;
      const cercania = 1 - f.z / PROFUNDIDAD_MAX;
      const tamanoProyectado = Math.min(f.tamanoBase * cercania * 3.2, 220);

      if (!prefiereMenosMovimiento) {
        f.rotacion += f.velRotacion;
      }

      // Solo se dibuja cuando entra en el encuadre, para no gastar
      // tiempo en flores diminutas que apenas se distinguen al fondo
      if (tamanoProyectado > 1.5) {
        dibujarFlorPequena(sx, sy, tamanoProyectado, f.rotacion, f.esFlor);
      }
    }
  }

  function bucleAnimacion() {
    ctx.clearRect(0, 0, ancho, alto);
    dibujarEstrellas();
    dibujarFlores();
    requestAnimationFrame(bucleAnimacion);
  }

  // ==================================================
  // CONTROL DE LA MÚSICA
  // ==================================================

  function reproducirMusica() {
    const promesa = musica.play();
    if (promesa !== undefined) {
      promesa.catch(() => {
        // El navegador bloqueó la reproducción automática.
        // Dejamos el botón de sonido visible para que se active manualmente.
        btnSonido.classList.remove("oculto");
        btnSonido.textContent = "🔈";
        btnSonido.setAttribute("aria-label", "Activar música");
      });
    }
  }

  function alternarSonido() {
    if (musica.paused) {
      reproducirMusica();
      musica.muted = false;
      btnSonido.textContent = "🔊";
      btnSonido.setAttribute("aria-label", "Silenciar música");
      return;
    }
    musica.muted = !musica.muted;
    btnSonido.textContent = musica.muted ? "🔇" : "🔊";
    btnSonido.setAttribute(
      "aria-label",
      musica.muted ? "Activar música" : "Silenciar música"
    );
  }

  // ==================================================
  // CONTROL DE LAS ESTACIONES
  // ==================================================

  function mostrarEstacion(indice) {
    const datos = estaciones[indice];
    velocidadActual = velocidades[indice];

    estacionFoto.classList.remove("visible");
    estacionMensaje.classList.remove("visible");

    // Se espera a que la imagen cargue antes de revelarla
    const imagenTemporal = new Image();
    imagenTemporal.onload = () => {
      estacionFoto.src = datos.imagen;
      estacionFoto.alt = datos.mensaje;
      requestAnimationFrame(() => {
        estacionFoto.classList.add("visible");
      });
    };
    imagenTemporal.onerror = () => {
      // Si la foto todavía no fue colocada, igual mostramos la escena
      estacionFoto.src = datos.imagen;
      estacionFoto.alt = datos.mensaje;
      estacionFoto.classList.add("visible");
    };
    imagenTemporal.src = datos.imagen;

    setTimeout(() => {
      estacionMensaje.textContent = datos.mensaje;
      estacionMensaje.classList.add("visible");
    }, 500);

    const esUltima = indice === estaciones.length - 1;
    contador.textContent = `${indice + 1} / ${estaciones.length}`;
    btnContinuar.textContent = esUltima ? "Volver a comenzar 🌻" : "Continuar →";
    btnContinuar.setAttribute(
      "aria-label",
      esUltima ? "Volver a comenzar la aventura" : "Ir a la siguiente estación"
    );
  }

  function irASiguienteEstacion() {
    if (enTransicion) return;

    const esUltima = estacionActual === estaciones.length - 1;
    if (esUltima) {
      reiniciarExperiencia();
      return;
    }

    enTransicion = true;
    impulsoActivo = IMPULSO_TRANSICION;
    pantallaViaje.classList.add("en-transito");

    setTimeout(() => {
      estacionActual += 1;
      mostrarEstacion(estacionActual);
      pantallaViaje.classList.remove("en-transito");
      impulsoActivo = 1;
      enTransicion = false;
    }, DURACION_TRANSICION_MS);
  }

  function empezarAventura() {
    pantallaInicio.classList.add("oculto");
    pantallaViaje.classList.remove("oculto");
    btnSonido.classList.remove("oculto");

    estacionActual = 0;
    reproducirMusica();
    mostrarEstacion(0);
  }

  function reiniciarExperiencia() {
    pantallaViaje.classList.remove("en-transito");
    estacionFoto.classList.remove("visible");
    estacionMensaje.classList.remove("visible");
    estacionFoto.src = "";

    pantallaViaje.classList.add("oculto");
    pantallaInicio.classList.remove("oculto");

    musica.pause();
    musica.currentTime = 0;

    estacionActual = 0;
    enTransicion = false;
    impulsoActivo = 1;
    velocidadActual = velocidades[0];
  }

  // ==================================================
  // EVENTOS (se registran una única vez)
  // ==================================================

  btnEmpezar.addEventListener("click", empezarAventura);
  btnContinuar.addEventListener("click", irASiguienteEstacion);
  btnSonido.addEventListener("click", alternarSonido);

  window.addEventListener("resize", () => {
    ajustarTamano();
  });

  // ==================================================
  // INICIALIZACIÓN
  // ==================================================

  ajustarTamano();
  crearEstrellas();
  crearFlores();
  bucleAnimacion();
})();
