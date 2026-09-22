# Nuestro pequeño universo 🌻

Una experiencia web interactiva, romántica y cinematográfica: un viaje por un universo de flores amarillas dividido en 6 estaciones, con fotos y una canción propias.

Hecho solo con HTML, CSS y JavaScript. Sin frameworks, sin backend, sin instalación, y funciona igual de bien en teléfono, tablet o computadora.

## Estructura del proyecto

Todo va suelto, sin ninguna subcarpeta: index.html, styles.css, app.js, tus fotos y tu canción, todos al mismo nivel:

```
universo-flores-amarillas/
│
├── index.html
├── styles.css
├── app.js
├── foto1.jpeg
├── foto2.jpeg
├── foto3.jpeg
├── foto4.jpeg
├── foto5.jpeg
├── foto6.jpeg
├── cancion.mp3
└── README.md
```

## Cómo usarlo

1. Descarga o clona esta carpeta.
2. Coloca tus 6 fotografías directamente en la raíz del proyecto (junto a `index.html`), con estos nombres exactos: `foto1.jpeg`, `foto2.jpeg`, `foto3.jpeg`, `foto4.jpeg`, `foto5.jpeg`, `foto6.jpeg`.
3. Coloca tu canción también en la raíz, con el nombre `cancion.mp3`.
4. Abre `app.js` si quieres cambiar los mensajes de cada estación (busca el bloque `CONFIGURACIÓN DE LAS 6 ESTACIONES`).
5. Abre `index.html` en tu navegador para probarlo localmente.

### Cambiar los mensajes

En `app.js`, dentro del arreglo `estaciones`, cada objeto tiene una propiedad `mensaje`. Solo edita el texto entre comillas.

### Cambiar la velocidad del viaje

En `app.js`, busca el bloque `VELOCIDAD DE CADA ESTACIÓN`:

```js
const velocidades = [0.8, 1, 1.2, 1.5, 1.8, 2.2];
```

Cada número corresponde a una estación (de la 1 a la 6). Números más altos = más velocidad. Ajusta con cuidado para que el viaje no se sienta demasiado brusco.

### Cambiar la canción

Reemplaza el archivo `cancion.mp3` por el tuyo (mantén el mismo nombre), o cambia la ruta en `index.html`:

```html
<audio id="musica" src="cancion.mp3" loop preload="auto"></audio>
```

## Cómo publicarlo en GitHub Pages

1. Crea un repositorio nuevo en GitHub (puede ser público o privado).
2. Sube todos los archivos y carpetas de este proyecto tal cual están (incluyendo tus fotos y tu canción sueltas junto a `index.html`), asegurándote de que `index.html` quede en la raíz del repositorio.
3. Entra al repositorio y ve a **Settings**.
4. En el menú lateral, busca la sección **Pages**.
5. En "Branch", selecciona la rama `main` y la carpeta `/ (root)`.
6. Guarda los cambios.
7. Espera uno o dos minutos: GitHub te mostrará el enlace donde quedó publicado el sitio.

## Notas

- La música solo comienza cuando se presiona "🌻 Empezar aventura" (los navegadores bloquean el sonido automático).
- Si el navegador bloquea igualmente la reproducción, aparece un botón de sonido para activarla manualmente.
- El proyecto respeta la preferencia de "reducir movimiento" del sistema operativo, por si la persona que lo abre es sensible a las animaciones.
- Es completamente responsive: se adapta a pantallas de teléfono, tablet y computadora, con botones grandes y fáciles de tocar y sin scroll horizontal.
- Funciona sin conexión a internet una vez descargado (no depende de fuentes, CDNs ni APIs externas).
