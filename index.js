'use strict';
let twgl = require('twgl.js')

// setting up canvas
var charCanvas = document.createElement('canvas');
charCanvas.width = 512
charCanvas.height = 512
var charContext = charCanvas.getContext("2d");
charContext.fillStyle = "blue";
charContext.fillRect(0, 0, charCanvas.width, charCanvas.height);
charContext.fillStyle = "black";
charContext.fillRect(100, 100, charCanvas.width - 200, charCanvas.height - 200);

const vShader = `#version 300 es
  precision mediump float;
  in vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }`;

const fShader = require('./shader.frag');

let tick = 0
let timeLounch = +new Date()
const canvas = document.getElementById('gl');
const gl = canvas.getContext('webgl2', { premultipliedAlpha: false });
twgl.addExtensionsToContext(gl);

let texture = twgl.createTexture(gl, {
  src: charContext.canvas,
  format: gl.RGB,
  min: gl.LINEAR,
  wrap: gl.CLAMP_TO_EDGE,
})

const program = twgl.createProgramInfo(gl, [vShader, fShader]);

const positionObject = { position: { data: [1, 1, 1, -1, -1, -1, -1, 1], numComponents: 2 } };
const positionBuffer = twgl.createBufferInfoFromArrays(gl, positionObject);

let dt;
let prevTime;

function draw(time) {
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  dt = (prevTime) ? time - prevTime : 0;
  prevTime = time;

  gl.useProgram(program.program);
  twgl.setBuffersAndAttributes(gl, program, positionBuffer);
  twgl.setUniforms(program, {
    u_texture: texture,
    tick: tick,
    u_time: (new Date() - timeLounch) / 1000,
    u_resolution: [gl.canvas.clientWidth, gl.canvas.clientHeight],
  });

  twgl.bindFramebufferInfo(gl, null)
  twgl.drawBufferInfo(gl, positionBuffer, gl.TRIANGLE_FAN)
  tick++
}


// Should be replaced with a p5 draw cycle?
(function animate(now) {
  draw(now / 1000);
  requestAnimationFrame(animate)
})(0);