(function () {

  "use strict";

  var GREY = "#cccccc";

  function supershape () {
  }

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

  function draw (width, height, context, params) {
    var scaler = ((width > height) ? height : width) * 0.75;

    var radius = params.radius * (scaler / 2);
    var size = params.size * (scaler / 2);

    var arc = supershape();

    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, width, height);
    context.restore();

    /*
    draw_guides(context, radius, size);
    draw_curves(context, arc.inner);
    draw_curves(context, arc.outer);
    */
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
    n1: 0.8,
    n2: 0.2,
    n3: 0,
    m: 0,
    a: 1,
    b: 1,
    scale: 1
  };

  function render () {
    draw(canvas.width, canvas.height, context, params);
  }

  gui.add(params, "n1", 0, Math.PI * 2).onChange(render);
  gui.add(params, "n2", 0, Math.PI * 2).onChange(render);
  gui.add(params, "n3", 0, 1).onChange(render);
  gui.add(params, "m", 0, 1).onChange(render);
  gui.add(params, "a", 0, 1).onChange(render);
  gui.add(params, "b", 0, 1).onChange(render);
  gui.add(params, "scale", 0, 1).onChange(render);
  gui.open();

  document.getElementById("gui").appendChild(gui.domElement);

  resize(canvas);
  draw(canvas.width, canvas.height, context, params);

  window.addEventListener("resize", function () {
    resize(canvas);
    draw(canvas.width, canvas.height, context, params);
  }, false);

}());