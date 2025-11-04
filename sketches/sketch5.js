// sketch5.js — Fuel vs Burn: Static Balancing Plate Visualization
// INFO 474 — Phoebe Dong 🍽️
// Static version — visually clear differences using height and proportion instead of motion.

let balancingPlate = function(p) {
  let table;
  let dietData = [];
  let colors;

  p.preload = function() {
    table = p.loadTable('data/Final_data.csv', 'csv', 'header');
  };

  p.setup = function() {
    p.createCanvas(1000, 750);
    p.textFont('Georgia');

    colors = {
      balanced: p.color(80, 180, 80),
      surplus: p.color(235, 80, 80),
      deficit: p.color(70, 130, 230)
    };

    // --- Group and summarize ---
    let grouped = {};
    for (let r = 0; r < table.getRowCount(); r++) {
      let diet = table.getString(r, 'diet_type');
      if (!grouped[diet]) grouped[diet] = { calIn: [], calOut: [] };
      grouped[diet].calIn.push(table.getNum(r, 'Calories'));
      grouped[diet].calOut.push(table.getNum(r, 'Calories_Burned'));
    }

    for (let d in grouped) {
      let avgIn = p.average(grouped[d].calIn);
      let avgOut = p.average(grouped[d].calOut);
      let bal = avgIn - avgOut;
      let type = "balanced";
      if (bal > 150) type = "surplus";
      if (bal < -150) type = "deficit";
      dietData.push({ diet: d, in: avgIn, out: avgOut, bal: bal, type: type });
    }
  };

  p.draw = function() {
    drawGradientBackground();

    // Title
    p.fill(30);
    p.textAlign(p.CENTER);
    p.textSize(28);
    p.text("Fuel vs Burn: Are Your Meals Helping or Hurting?", p.width / 2, 50);

    p.textSize(16);
    p.text("Vegan and Balanced diets stay steady 🌿; Keto and Paleo show more intake 🍕.", p.width / 2, 80);

    if (dietData.length === 0) return;

    let xStep = p.width / (dietData.length + 1);
    let maxBal = Math.max(...dietData.map(d => Math.abs(d.bal)));

    for (let i = 0; i < dietData.length; i++) {
      let d = dietData[i];
      let x = xStep * (i + 1);
      let y = p.height / 2 + 80;
      drawPlate(d, x, y, maxBal);
    }

    drawLegend();
    drawCaption();
  };

  function drawPlate(d, x, y, maxBal) {
    // Compute exaggeration based on balance
    let balanceRatio = d.bal / maxBal;
    let drop = p.map(balanceRatio, -1, 1, -50, 50); // move up or down instead of tilt
    let intakeRatio = d.in / (d.in + d.out);
    let stretch = p.map(intakeRatio, 0.3, 0.7, 0.8, 1.3); // visually show imbalance size

    // Shadow
    p.noStroke();
    p.fill(190, 170, 140, 80);
    p.ellipse(x + 5, y + 30 + drop, 180, 45);

    // Base plate
    p.push();
    p.translate(x, y + drop);
    p.noStroke();
    p.fill(255);
    p.stroke(120);
    p.strokeWeight(2);
    p.ellipse(0, 0, 170 * stretch, 40 * stretch);

    // Burn side (blue)
    p.noStroke();
    p.fill(70, 130, 230, 180);
    p.arc(0, 0, 170 * stretch, 40 * stretch, p.PI / 2, (3 * p.PI) / 2, p.PIE);

    // Intake side (red)
    p.fill(235, 80, 80, 180);
    p.arc(0, 0, 170 * stretch, 40 * stretch, (3 * p.PI) / 2, p.PI / 2, p.PIE);
    p.pop();

    // Labels
    p.noStroke();
    p.fill(40);
    p.textSize(14);
    p.textAlign(p.CENTER);
    p.text(d.diet, x, y + 100);

    p.textSize(12);
    p.fill(70);
    p.text(`Calories In: ${Math.round(d.in)}\nCalories Burned: ${Math.round(d.out)}`, x, y + 120);
  }

  // ---------------------------
  // Helpers
  // ---------------------------
  p.average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

  function drawGradientBackground() {
    for (let y = 0; y < p.height; y++) {
      let inter = p.map(y, 0, p.height, 0, 1);
      let c = p.lerpColor(p.color(255, 250, 240), p.color(245, 225, 190), inter);
      p.stroke(c);
      p.line(0, y, p.width, y);
    }
  }

  function drawLegend() {
    let startX = p.width - 220;
    let startY = p.height - 120;
    p.textAlign(p.LEFT);
    p.textSize(13);
    p.noStroke();

    p.fill(colors.balanced);
    p.ellipse(startX, startY, 14, 14);
    p.fill(30);
    p.text("Balanced", startX + 25, startY);

    p.fill(colors.surplus);
    p.ellipse(startX, startY + 25, 14, 14);
    p.fill(30);
    p.text("Surplus (Overeating)", startX + 25, startY + 25);

    p.fill(colors.deficit);
    p.ellipse(startX, startY + 50, 14, 14);
    p.fill(30);
    p.text("Deficit (More Burn)", startX + 25, startY + 50);
  }

  // Caption explaining metaphor
  function drawCaption() {
    p.noStroke();
    p.fill(255, 240);
    p.rect(40, 615, 650, 95, 12);  
    p.fill(40);
    p.textSize(13);
    p.textAlign(p.LEFT);
    p.textLeading(20); 
    p.text(
      "Each plate represents one diet type.\n" +
      "Red = Calories consumed, Blue = Calories burned.\n" +
      "Higher plate = more balanced ⚖️, Lower plate = excess intake 🍕.",
      60, 640
    );
  }
};

new p5(balancingPlate, 'sketch5');


