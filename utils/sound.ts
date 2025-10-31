// NOTA: Debes añadir los archivos de audio a un directorio `public/audio`.
// - /audio/correct.mp3
// - /audio/incorrect.mp3
// - /audio/level-up.mp3
// - /audio/game-win.mp3
// - /audio/achievement.mp3

export const playSound = (soundFile: string) => {
  try {
    const audio = new Audio(`/audio/${soundFile}`);
    audio.volume = 0.5; // Ajusta el volumen a un nivel razonable
    audio.play().catch(error => {
      // La reproducción automática suele estar bloqueada por los navegadores hasta que el usuario interactúa.
      // Esto es un comportamiento esperado, por lo que solo lo registramos para depuración.
      console.log(`No se pudo reproducir el sonido "${soundFile}" debido a la política del navegador:`, error);
    });
  } catch (e) {
    console.error(`Fallo al crear o reproducir el sonido "${soundFile}":`, e);
  }
};
