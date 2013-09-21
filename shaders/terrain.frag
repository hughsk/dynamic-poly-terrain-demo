precision mediump float;

varying vec3 vNormal;

void main() {
  vec3 terrainColor = vNormal;
  gl_FragColor = vec4(terrainColor, 1.0);
}
