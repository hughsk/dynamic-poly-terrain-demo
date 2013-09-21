var shell = require('gl-now')({ clearColor: [1, 1, 1, 0] })
var camera = require('game-shell-orbit-camera')(shell)

var mesher = require('heightmap-mesher')
var zero = require('zeros')
var fs = require('fs')

var createShader = require('gl-shader')
var createBuffer = require('gl-buffer')
var createVAO = require('gl-vao')
var glm = require('gl-matrix')
var mat4 = glm.mat4
var vec2 = glm.vec2
var quat = glm.quat

shell.on('gl-init', init)
shell.on('gl-render', render)

var shader
var mesh
var gl

function init() {
  gl = shell.gl

  camera.center[0] = +64
  camera.center[1] = +32
  camera.center[2] = -64
  quat.rotateX(camera.rotation, camera.rotation, -0.35)

  mesh = createMesh()
  shader = createShader(gl
    , fs.readFileSync(__dirname + '/shaders/terrain.vert', 'utf8')
    , fs.readFileSync(__dirname + '/shaders/terrain.frag', 'utf8')
  )
}

var t = 0
function render() {
  gl.enable(gl.CULL_FACE)
  gl.enable(gl.DEPTH_TEST)
  t += 1

  var projection = mat4.perspective(new Float32Array(16), 0.25*Math.PI, shell.width/shell.height, 0.05, 1000)
  var model = mat4.identity(new Float32Array(16))
  var view = camera.view()

  shader.bind()
  shader.uniforms.uProjection = projection
  shader.uniforms.uModel = model
  shader.uniforms.uView = view
  shader.uniforms.t = t / 100

  shader.attributes.aPosition.location = 0
  shader.attributes.aVertex1.location = 1
  shader.attributes.aVertex2.location = 2
  shader.attributes.aVertex3.location = 3

  mesh.vao.bind()
  gl.drawArrays(gl.TRIANGLES, 0, mesh.length)
  mesh.vao.unbind()
}

function createMesh() {
  var count = 64 * 64
  var size = count * 12
  var aPositionData = new Float32Array(size)
  var aVertex1Data  = new Float32Array(size)
  var aVertex2Data  = new Float32Array(size)
  var aVertex3Data  = new Float32Array(size)
  var xoffset = 0
  var yoffset = 0
  var xscale = 2
  var yscale = 2

  var i = 0
  for (var X = 0; X < 64; X++)
  for (var Y = 0; Y < 64; Y++, i += 12) {
    var x = X * xscale + xoffset * xscale
    var y = Y * yscale + yoffset * yscale

    // Triangle 1
    aPositionData[i   ] = x+xscale
    aPositionData[i+1 ] = y
    aPositionData[i+2 ] = x
    aPositionData[i+3 ] = y
    aPositionData[i+4 ] = x
    aPositionData[i+5 ] = y+yscale

    // Triangle 2
    aPositionData[i+6 ] = x
    aPositionData[i+7 ] = y+yscale

    aPositionData[i+8 ] = x+xscale
    aPositionData[i+9 ] = y+yscale

    aPositionData[i+10] = x+xscale
    aPositionData[i+11] = y

    aVertex1Data[i   ] = x+xscale
    aVertex1Data[i+1 ] = y
    aVertex1Data[i+2 ] = x+xscale
    aVertex1Data[i+3 ] = y
    aVertex1Data[i+4 ] = x+xscale
    aVertex1Data[i+5 ] = y
    aVertex1Data[i+6 ] = x
    aVertex1Data[i+7 ] = y+yscale
    aVertex1Data[i+8 ] = x
    aVertex1Data[i+9 ] = y+yscale
    aVertex1Data[i+10] = x
    aVertex1Data[i+11] = y+yscale

    aVertex2Data[i   ] = x
    aVertex2Data[i+1 ] = y
    aVertex2Data[i+2 ] = x
    aVertex2Data[i+3 ] = y
    aVertex2Data[i+4 ] = x
    aVertex2Data[i+5 ] = y
    aVertex2Data[i+6 ] = x+xscale
    aVertex2Data[i+7 ] = y+yscale
    aVertex2Data[i+8 ] = x+xscale
    aVertex2Data[i+9 ] = y+yscale
    aVertex2Data[i+10] = x+xscale
    aVertex2Data[i+11] = y+yscale

    aVertex3Data[i   ] = x
    aVertex3Data[i+1 ] = y+yscale
    aVertex3Data[i+2 ] = x
    aVertex3Data[i+3 ] = y+yscale
    aVertex3Data[i+4 ] = x
    aVertex3Data[i+5 ] = y+yscale
    aVertex3Data[i+6 ] = x+xscale
    aVertex3Data[i+7 ] = y
    aVertex3Data[i+8 ] = x+xscale
    aVertex3Data[i+9 ] = y
    aVertex3Data[i+10] = x+xscale
    aVertex3Data[i+11] = y
  }

  function createAttribute(data) {
    return {
      buffer: createBuffer(gl, data)
      , type: gl.FLOAT
      , size: 2
      , offset: 0
      , stride: 0
      , normalized: false
    }
  }

  var attributes
  var vao = createVAO(gl, null, attributes = [
      createAttribute(aPositionData)
    , createAttribute(aVertex1Data)
    , createAttribute(aVertex2Data)
    , createAttribute(aVertex3Data)
  ])

  return { vao: vao, length: size / 2 }
}
