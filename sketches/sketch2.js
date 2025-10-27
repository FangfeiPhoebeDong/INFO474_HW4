// Pomodoro-style focus timer — instance-mode p5 sketch
registerSketch('sk2', function (p) {
  // ---------- Config ----------
  const TOTAL_MINUTES = 25;          // starting countdown minutes
  const WARNING_MINUTES = 5;         // last-X-minutes message
  const MAX_CANVAS = 800;

  // ---------- State ----------
  let totalMs;
  let startMillis;                   // when the countdown began
  let paused = false;                // (kept for future extension)
  let pausedOffset = 0;              // ms already elapsed when paused

  // Helper: format MM:SS
  function two(n) { return (n < 10 ? '0' : '') + n; }

  // ---------- p5 Lifecycle ----------
  p.setup = function () {
    // Canvas no larger than 800x800
    const w = Math.min(p.windowWidth, MAX_CANVAS);
    const h = Math.min(p.windowHeight, MAX_CANVAS);
    p.createCanvas(w, h);

    // Use HSB for smooth color interpolation (green -> yellow -> red)
    p.colorMode(p.HSB, 360, 100, 100, 255);
    p.textFont('Helvetica');
    p.textAlign(p.CENTER, p.CENTER);
    p.frameRate(60); // smooth animation

    // Initialize timer
    totalMs = TOTAL_MINUTES * 60 * 1000;
    startMillis = p.millis();
  };

  p.draw = function () {
    // ---------- Time logic ----------
    const now = p.millis();
    const elapsed = paused ? pausedOffset : (now - startMillis) + pausedOffset;
    let remaining = Math.max(0, totalMs - elapsed); // ms remaining
    const remRatio = remaining / totalMs;           // 1 -> start, 0 -> finished

    // Convert remaining ms to minutes:seconds
    const remSecondsTotal = Math.floor(remaining / 1000);
    const minutes = Math.floor(remSecondsTotal / 60);
    const seconds = remSecondsTotal % 60;
    const timeText = `${two(minutes)}:${two(seconds)}`;

    // ---------- Visual encoding ----------
    p.background(0, 0, 98); // light neutral background

    const cx = p.width / 2;
    const cy = p.height / 2;
    const outerRadius = Math.min(p.width, p.height) * 0.38;
    const ringThickness = Math.max(10, outerRadius * 0.14);
    const innerRadius = outerRadius - ringThickness * 0.6;

    // Color: interpolate hue 120 (green) -> 60 (yellow) -> 0 (red).
    // Map remRatio in [1,0] -> hue in [120, 0]
    const hue = p.lerp(0, 120, remRatio); // reversed to get green at high ratio
    const ringColor = p.color(hue, 80, 75, 220);

    // Draw faint background ring (track)
    p.noFill();
    p.stroke(p.color(220, 8, 95, 80)); // subtle grey track
    p.strokeWeight(ringThickness);
    p.strokeCap(p.SQUARE);
    p.arc(cx, cy, outerRadius * 2, outerRadius * 2, 0, p.TWO_PI);

    // Draw remaining-time arc (starts at top, moves clockwise)
    const startAng = -p.HALF_PI;
    const endAng = startAng + p.TWO_PI * remRatio; // proportion of full circle remaining
    p.stroke(ringColor);
    p.strokeWeight(ringThickness);
    p.strokeCap(p.ROUND);
    p.noFill();
    p.arc(cx, cy, outerRadius * 2, outerRadius * 2, startAng, endAng);

    // Inner circle for contrast
    p.noStroke();
    p.fill(0, 0, 100);
    p.ellipse(cx, cy, innerRadius * 2, innerRadius * 2);

    // Time text in center
    p.fill(0, 0, 10); // dark text
    p.noStroke();
    const timeSize = Math.max(20, innerRadius * 0.5);
    p.textSize(timeSize);
    p.text(timeText, cx, cy);

    // Encouraging message logic
    p.textSize(Math.max(12, timeSize * 0.28));
    p.fill(0, 0, 30);
    if (remaining <= 0) {
      // Finished
      p.text('You did it!', cx, cy + innerRadius * 0.6);
    } else if (remaining <= WARNING_MINUTES * 60 * 1000) {
      // Last few minutes encouragement
      p.text("Hang on, you're almost there", cx, cy + innerRadius * 0.6);
    } else {
      // Gentle reminder / goal message
      p.text('Stay in the zone ✨', cx, cy + innerRadius * 0.6);
    }

    // Optional: subtle shrinking pulse when near end (visual emphasis)
    if (remaining > 0 && remaining <= WARNING_MINUTES * 60 * 1000) {
      const pulse = 1 + 0.02 * Math.sin(p.frameCount * 0.25);
      p.push();
      p.translate(cx, cy);
      p.scale(pulse);
      p.pop();
      // (Scaling applied to nothing here keeps logic simple; this placeholder
      // indicates where additional pulsing effects could be applied.)
    }
  };

  // Responsive resizing (cap at 800x800)
  p.windowResized = function () {
    const w = Math.min(p.windowWidth, MAX_CANVAS);
    const h = Math.min(p.windowHeight, MAX_CANVAS);
    p.resizeCanvas(w, h);
  };
});
