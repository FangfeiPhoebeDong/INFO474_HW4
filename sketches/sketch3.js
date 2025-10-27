registerSketch('sk3', function (p) {
  // Tree Growth Clock — instance-mode p5 sketch
  // - hour() -> tree height (taller as hours increase)
  // - minute() -> number of leaves (more leaves appear each minute)
  // - second() -> leaf sparkle/movement (gentle jitter or flashing)
  // - Hovering over tree briefly adds new leaves or makes them glow
  // All code uses p.* to run in p5 instance mode.

  const MAX_CANVAS = 800;
  const MAX_LEAVES = 100; // maximum leaves on the tree
  const BASE_HEIGHT = 100; // base height of the trunk
  const LEAF_SIZE = 10; // size of each leaf
  const GROWTH_RATE = 0.5; // rate of growth per hour
  const LEAF_GROWTH_RATE = 1; // leaves added per minute
  const SPARKLE_RATE = 0.1; // sparkle effect intensity

  let leaves = []; // array to hold leaf positions
  let trunkHeight = BASE_HEIGHT; // current height of the trunk

  p.setup = function () {
    const w = Math.min(p.windowWidth, MAX_CANVAS);
    const h = Math.min(p.windowHeight, MAX_CANVAS);
    p.createCanvas(w, h);
    p.colorMode(p.HSB, 360, 100, 100, 255);
    p.textFont('Georgia');
    p.frameRate(60);
  };

  // Draw the tree trunk
  function drawTrunk(x, y, height) {
    p.fill(30, 60, 40); // brown color for trunk
    p.rect(x - 10, y - height, 20, height); // trunk rectangle
  }

  // Draw leaves at given positions
  function drawLeaves() {
    for (let i = 0; i < leaves.length; i++) {
      const leaf = leaves[i];
      p.fill(120, 80, 50); // green color for leaves
      p.ellipse(leaf.x, leaf.y, LEAF_SIZE, LEAF_SIZE); // draw leaf
    }
  }

  // Update leaves based on current minute
  function updateLeaves(currMinute) {
    const newLeaves = Math.min(currMinute * LEAF_GROWTH_RATE, MAX_LEAVES);
    while (leaves.length < newLeaves) {
      const x = p.random(p.width / 2 - 30, p.width / 2 + 30);
      const y = p.height - trunkHeight - p.random(10, 30); // random y position above trunk
      leaves.push({ x, y });
    }
  }

  // Draw grass at the base of the tree
  function drawGrass() {
    p.fill(120, 60, 40); // green color for grass
    p.rect(0, p.height - 20, p.width, 20); // grass rectangle
  }

  // Draw caption below the tree
  function drawCaption() {
    p.push();
    p.textAlign(p.LEFT);
    p.textSize(16);
    p.fill(30, 20, 20);
    p.text("Knowledge grows with every moment.", 20, p.height - 40);
    p.pop();
  }

  // Draw current time in HH:MM:SS format
  function drawTime() {
    const hh = p.nf(p.hour(), 2);
    const mm = p.nf(p.minute(), 2);
    const ss = p.nf(p.second(), 2);
    const timeStr = `${hh}:${mm}:${ss}`;

    p.push();
    p.textAlign(p.RIGHT);
    p.textSize(14);
    p.fill(30, 20, 20);
    p.text(timeStr, p.width - 20, p.height - 40);
    p.pop();
  }

  p.draw = function () {
    // Keep canvas capped to MAX_CANVAS
    const desiredW = Math.min(p.windowWidth, MAX_CANVAS);
    const desiredH = Math.min(p.windowHeight, MAX_CANVAS);
    if (p.width !== desiredW || p.height !== desiredH) {
      p.resizeCanvas(desiredW, desiredH);
    }

    // Background color (light sky blue)
    p.background(200, 80, 90); // light blue background

    // Update trunk height based on hour
    trunkHeight = BASE_HEIGHT + (p.hour() * GROWTH_RATE * 10); // grow 10 pixels per hour

    // Draw the tree
    const trunkBaseY = p.height - 20; // base of the trunk at the bottom
    drawTrunk(p.width / 2, trunkBaseY, trunkHeight); // draw trunk

    // Update leaves based on current minute
    const currMinute = p.minute();
    updateLeaves(currMinute); // update leaves

    // Draw leaves
    drawLeaves(); // draw all leaves

    // Draw grass
    drawGrass(); // draw grass at the bottom

    // Draw caption
    drawCaption(); // draw caption below the tree

    // Draw current time
    drawTime(); // draw current time

    // Optional: sparkle effect on leaves based on second
    if (p.second() % 2 === 0) {
      for (let i = 0; i < leaves.length; i++) {
        const leaf = leaves[i];
        leaf.y += p.random(-1, 1); // slight jitter effect
      }
    }
  };

  // Responsive canvas
  p.windowResized = function () {
    const w = Math.min(p.windowWidth, MAX_CANVAS);
    const h = Math.min(p.windowHeight, MAX_CANVAS);
    p.resizeCanvas(w, h);
  };
});



