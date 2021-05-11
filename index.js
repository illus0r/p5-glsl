'use strict';
let twgl = require('twgl.js')

// setting up canvas
let canvasP5, ctx
let fShader
let canvasGl
let gl
let program
let positionObject
let positionBuffer

let timeStart = +new Date();

let sketch = function (p) {
  p.setup = function () {
    canvasP5 = p.createCanvas(512, 512).elt;

    // shader stuff
    setupShader()
  }

  p.draw = function () {
    p.background(0);
    p.fill(255);
    p.circle(256 + p.sin(p.frameCount*.1) * 100, 256 + p.cos(p.frameCount*.1) * 100, 50);

    // shader stuff
    drawShader(p.frameCount)
  };
};
let myp5 = new p5(sketch);


function setupShader() {
  ctx = canvasP5.getContext("2d");
  const vShader = `#version 300 es
  precision mediump float;
  in vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }`
  fShader = require('./shader.frag')
  canvasGl = document.getElementById('gl')
  gl = canvasGl.getContext('webgl2', { premultipliedAlpha: false })
  twgl.addExtensionsToContext(gl)
  program = twgl.createProgramInfo(gl, [vShader, fShader])
  positionObject = { position: { data: [1, 1, 1, -1, -1, -1, -1, 1], numComponents: 2 } }
  positionBuffer = twgl.createBufferInfoFromArrays(gl, positionObject)
}

function drawShader(tick) {
  let texture = twgl.createTexture(gl, {
    src: ctx.canvas,
    format: gl.RGB,
    min: gl.LINEAR,
    wrap: gl.CLAMP_TO_EDGE,
  })
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  gl.useProgram(program.program)
  twgl.setBuffersAndAttributes(gl, program, positionBuffer)
  twgl.setUniforms(program, {
    u_texture: texture,
    u_tick: tick,
    u_time: (new Date() - timeStart) / 1000,
    u_resolution: [gl.canvas.clientWidth, gl.canvas.clientHeight],
  })
  twgl.bindFramebufferInfo(gl, null)
  twgl.drawBufferInfo(gl, positionBuffer, gl.TRIANGLE_FAN)
}