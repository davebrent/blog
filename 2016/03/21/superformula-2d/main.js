(function () {

  "use strict";

  function formula (m, n1, n2, n3, a, b, phi) {
    var t1 = Math.cos(m * phi / 4) / a;
    t1 = Math.abs(t1);
    t1 = Math.pow(t1, n2);

    var t2 = Math.sin(m * phi / 4) / b;
    t2 = Math.abs(t2);
    t2 = Math.pow(t2, n3);

    var r = Math.pow(t1 + t2, 1 / n1);

    if (Math.abs(r) == 0) {
      return [0, 0];
    }

    r = 1 / r;

    return [
      r * Math.cos(phi),
      r * Math.sin(phi)
    ];
  }

  function supershape (params) {
    var data = [];
    var two_pi = Math.PI * params.pi;

    for (var i = 0; i <= params.resolution; ++i) {
      var phi = (i / params.resolution) * two_pi;
      var point = formula(params.m, params.n1, params.n2, params.n3,
                          params.a, params.b, phi)

      point[0] *= params.radius;
      point[1] *= params.radius;

      data.push(point);
    }

    return data;
  }

  function draw_supershape (data, params) {
    var start = data[0];

    context.beginPath();
    context.moveTo(start[0], start[1]);

    for (var i = 1; i < data.length; ++i) {
      var point = data[i];
      context.lineTo(point[0], point[1]);
    }

    context.lineTo(start[0], start[1]);
    context.strokeStyle = "#333";
    context.stroke();
  }

  function draw_points (data) {
    context.fillStyle = "#333";

    for (var i = 0; i < data.length; ++i) {
      var point = data[i];
      context.fillRect(point[0] - 2, point[1] - 2, 4, 4);
    }
  }

  function draw (width, height, context, params) {
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, width, height);
    context.restore();

    var data = supershape(params);
    draw_points(data);
    draw_supershape(data, params);
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
    n1: 2,
    n2: 2,
    n3: 2,
    m: 10,
    a: 1,
    b: 1,
    pi: 2,
    resolution: 90,
    radius: 100
  };

  function render () {
    draw(canvas.width, canvas.height, context, params);
  }

  gui.add(params, "n1").onChange(render);
  gui.add(params, "n2").onChange(render);
  gui.add(params, "n3").onChange(render);
  gui.add(params, "m").onChange(render);
  gui.add(params, "a").onChange(render);
  gui.add(params, "b").onChange(render);
  gui.add(params, "pi").onChange(render);
  gui.add(params, "resolution").onChange(render);
  gui.add(params, "radius").onChange(render);
  gui.open();

  document.getElementById("gui").appendChild(gui.domElement);

  resize(canvas);
  draw(canvas.width, canvas.height, context, params);

  window.addEventListener("resize", function () {
    resize(canvas);
    draw(canvas.width, canvas.height, context, params);
  }, false);

}());