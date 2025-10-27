registerSketch('sk4', function (p) {
  const MAX_CANVAS = 800;
  const LINE_HEIGHT = 40;
  const MARGIN = 50;
  const TITLE = "Notebook of Time";
  const PHRASES = [
    "Focus builds progress.",
    "Keep going.",
    "Learning in motion.",
    "Write your time.",
    "One thought at a time."
  ];

  let lines = [];
  let currentLineIndex = 0;
  let cursorVisible = true;
  let lastMinute = -1;

  p.setup = function () {
    const w = Math.min(p.windowWidth, MAX_CANVAS);
    const h = Math.min(p.windowHeight, MAX_CANVAS);
    p.createCanvas(w, h);
    p.textFont('Georgia');
    p.textSize(18);
    p.frameRate(30); // smooth but not too fast
  };

  // Draw notebook lines
  function drawLines() {
    p.stroke(200);
    for (let i = MARGIN; i < p.height; i += LINE_HEIGHT) {
      p.line(MARGIN, i, p.width - MARGIN, i);
    }
  }

  // Draw title
  function drawTitle() {
    p.fill(0);
    p.textAlign(p.CENTER);
    p.textSize(28);
    p.text(TITLE, p.width / 2, MARGIN - 20);
    p.textSize(18); // reset for content
  }

  // Update the current line's text based on second()
  function updateTyping() {
    if (lines.length === 0) return;

    const phrase = PHRASES[currentLineIndex % PHRASES.length];
    const charCount = Math.min(p.second(), phrase.length);

    lines[currentLineIndex] = phrase.substring(0, charCount);
  }

  // Draw all text lines
  function drawTextLines() {
    p.fill(0);
    p.textAlign(p.LEFT);

    for (let i = 0; i < lines.length; i++) {
      let lineText = lines[i];

      // Only current line gets cursor
      if (i === currentLineIndex && cursorVisible && lineText.length < PHRASES[i % PHRASES.length].length) {
        lineText += "|";
      }

      p.text(lineText, MARGIN, MARGIN + (i + 1) * LINE_HEIGHT);
    }
  }

  // Add a new line if minute changes
  function checkNewLine() {
    const currentMinute = p.minute();
    if (currentMinute !== lastMinute) {
      lines.push("");
      currentLineIndex = lines.length - 1;
      lastMinute = currentMinute;
    }
  }

  // Draw time in bottom-right corner
  function drawTime() {
    const hh = p.nf(p.hour(), 2);
    const mm = p.nf(p.minute(), 2);
    const ss = p.nf(p.second(), 2);
    const timeStr = `${hh}:${mm}:${ss}`;

    p.push();
    p.textAlign(p.RIGHT);
    p.textSize(14);
    p.fill(0);
    p.text(timeStr, p.width - MARGIN, p.height - MARGIN);
    p.pop();
  }

  p.draw = function () {
    p.background(240, 230, 220); // soft beige
    drawLines();
    drawTitle();
    checkNewLine();
    updateTyping();
    drawTextLines();
    drawTime();

    // Cursor blink toggle every ~1 second
    if (p.frameCount % 30 === 0) {
      cursorVisible = !cursorVisible;
    }
  };

  p.windowResized = function () {
    const w = Math.min(p.windowWidth, MAX_CANVAS);
    const h = Math.min(p.windowHeight, MAX_CANVAS);
    p.resizeCanvas(w, h);
  };
});




