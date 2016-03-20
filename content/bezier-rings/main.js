(function () {

  "use strict";

  function calculate_ctrl_points (x1, y1, x2, y2) {
    // Calculate bezier control points for a single arc between two points
    var ax = x1;
    var ay = y1;
    var bx = x2;
    var by = y2;

    // Section 9 of Aleksas Riškus paper
    var q1 = (ax * ax) + (ay * ay);
    var q2 = q1 + (ax * bx) + (ay * by);
    var k2 = (4 / 3) * (Math.sqrt(2 * q1 * q2) - q2) / (ax * by - ay * bx);

    // ...and correction posted on Hans Muller's blog
    var x2 = ax - k2 * ay;
    var y2 = ay + k2 * ax;
    var x3 = bx + k2 * by;
    var y3 = by - k2 * bx;

    return {
      x2: x2,
      y2: y2,
      x3: x3,
      y3: y3
    };
  }

  function bezier_arc (radius, start, end) {
    var PI_OVER_TWO = Math.PI / 2.0;
    var TWO_PI = Math.PI * 2;

    // Sanitize input
    if (start > end) {
      var temp = start;
      start = end;
      end = temp;
    }

    // Angle of the arc
    var angle = end - start;

    // Number of curves needed to construct the arc
    var num_curves = Math.ceil(angle / PI_OVER_TWO);
    var curves = [];

    // Angle of the final curve
    var fract = angle % PI_OVER_TWO;
    fract = (fract === 0) ? PI_OVER_TWO : fract;

    var angle1 = start;
    for (var i = 0; i < num_curves; ++i) {
      var angle2 = angle1 + ((i !== num_curves - 1) ? PI_OVER_TWO : fract);

      var x1 = radius * Math.cos(angle1);
      var y1 = radius * Math.sin(angle1);

      var x4 = radius * Math.cos(angle2);
      var y4 = radius * Math.sin(angle2);

      angle1 = angle2;

      // Calculate the two control points
      var control = calculate_ctrl_points(x1, y1, x4, y4);
      curves.push({
        x1: x1,
        y1: y1,
        x2: control.x2,
        y2: control.y2,
        x3: control.x3,
        y3: control.y3,
        x4: x4,
        y4: y4
      });
    }

    return curves;
  }

  function bezier_donut_arc (radius, size, start, end) {
    var offset = size / 2;
    return {
      inner: bezier_arc(radius - offset, start, end),
      outer: bezier_arc(radius + offset, start, end)
    };
  }

  var GREY = "#cccccc";

  function draw_curves (context, curves) {
    var colors = [
      "#2edfd2",
      "#ff584f",
      "#9ee52c",
      "#ff8c00",
    ];

    for (var i = 0; i < curves.length; ++i) {
      var curve = curves[i];
      var color = colors[i];
      context.beginPath();
      context.moveTo(curve.x1, curve.y1);
      context.lineTo(curve.x2, curve.y2);
      context.strokeStyle = GREY;
      context.stroke();

      context.beginPath();
      context.moveTo(curve.x3, curve.y3);
      context.lineTo(curve.x4, curve.y4);
      context.strokeStyle = GREY;
      context.stroke();

      context.beginPath();
      context.moveTo(curve.x1, curve.y1);
      context.bezierCurveTo(
        curve.x2, curve.y2,
        curve.x3, curve.y3,
        curve.x4, curve.y4
      );
      context.strokeStyle = color;
      context.stroke();

      context.fillStyle = GREY;
      context.fillRect(curve.x2, curve.y2, 4, 4);
      context.fillRect(curve.x3, curve.y3, 4, 4);

      context.fillStyle = "black";
      context.fillText("2", curve.x2 + 8, curve.y2 + 5);
      context.fillText("3", curve.x3 + 8, curve.y3 + 5);
    }
  }

  function draw_guides (context, radius, size) {
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.strokeStyle = GREY;
    context.stroke();

    var guide = radius + (size / 2) + 8;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(guide, 0);
    context.moveTo(0, 0);
    context.lineTo(-guide, 0);
    context.moveTo(0, 0);
    context.lineTo(0, guide);
    context.moveTo(0, 0);
    context.lineTo(0, -guide);
    context.stroke();
    context.fillText("0", guide + 8, 2);
    context.fillText("π / 2", -10, (guide + 12));
    context.fillText("π", -(guide + 16), 2);
    context.fillText("π x 1.5", -12, -(guide + 8));
  }

  function draw (width, height, context, params) {
    var scaler = ((width > height) ? height : width) * 0.75;

    var radius = params.radius * (scaler / 2);
    var size = params.size * (scaler / 2);

    var arc = bezier_donut_arc(radius, size, params.start, params.end);

    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, width, height);
    context.restore();

    draw_guides(context, radius, size);
    draw_curves(context, arc.inner);
    draw_curves(context, arc.outer);
  }

  function resize (canvas) {
    canvas.width = canvas.parentNode.offsetWidth;
    canvas.height = canvas.parentNode.offsetHeight;
    context.translate(canvas.width / 2, canvas.height / 2);
  }

  var canvas = document.querySelector(".example");
  var context = canvas.getContext("2d");

  var gui = new dat.GUI({autoPlace: false});
  var params = {
    radius: 0.8,
    size: 0.2,
    start: 0,
    end: Math.PI
  };

  function render () {
    draw(canvas.width, canvas.height, context, params);
  }

  gui.add(params, "start", 0, Math.PI * 2).onChange(render);
  gui.add(params, "end", 0, Math.PI * 2).onChange(render);
  gui.add(params, "size", 0, 1).onChange(render);
  gui.add(params, "radius", 0, 1).onChange(render);
  gui.open();

  document.getElementById("gui").appendChild(gui.domElement);

  resize(canvas);
  draw(canvas.width, canvas.height, context, params);

  window.addEventListener("resize", function () {
    resize(canvas);
    draw(canvas.width, canvas.height, context, params);
  }, false);

}());
