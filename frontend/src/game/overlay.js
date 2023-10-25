import { setFrameCapping } from "../index.js";

// this function handles the framerate, displaying it in game
export function frameRate(frameTimes) {
  const now = performance.now(); // current performance
  while (frameTimes.length > 0 && frameTimes[0] <= now - 1000) {
    frameTimes.shift();
  }
  frameTimes.push(now);
  let fps =
    frameTimes.length > 30
      ? frameTimes.length.toString()
      : frameTimes.length.toString();
  if (fps > 62) {
    console.log(
      fps,
      "Your refresh rate is too high, your frame rate is capped for this session!"
    );
    setFrameCapping(1000 / 72);
  }
  document.getElementById("fps").innerHTML = "FPS: " + fps;
}
