export let levelMaps = [[], []];

export let buildMaps = () => {
  return Promise.all([
    fetch(`src/game/maps/tilemap_01.txt`).then((response) => response.text()),
    fetch(`src/game/maps/tilemap_02.txt`).then((response) => response.text()),
  ])
    .then(([mapData1]) => {
      let x_lines1 = mapData1.split("\n");
      levelMaps[0].push(x_lines1.map((line) => line.split(",")));

      let x_lines2 = mapData1.split("\n");
      levelMaps[1].push(x_lines2.map((line) => line.split(",")));
    })
    .catch((error) => {
      console.error("Error loading maps:", error);
    });
};
