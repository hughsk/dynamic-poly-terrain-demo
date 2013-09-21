attribute vec2 aPosition;
attribute vec2 aVertex1;
attribute vec2 aVertex2;
attribute vec2 aVertex3;

uniform mat4 uProjection;
uniform mat4 uModel;
uniform mat4 uView;
uniform float t;

varying vec3 vNormal;

float getHeight(vec2 pos) {
  return -15.0 + sin(sin(pos.x * 0.1 + t) * cos(pos.y * 0.1 + t)) * 10.0
       + cos(pos.x * 0.3 - t * 0.25) * sin(pos.y * 0.2 + t * 0.25) * 2.5
       + cos(pos.x * 1.25 - t) * sin(pos.y * 0.75 + t) * 0.5
       + clamp(abs(tan((pos.y-pos.x*0.25) * 0.015 + t * 0.8)), -10.0, 10.0) * 0.7;
}

void main() {
  vec3 position = vec3(aPosition.x, getHeight(aPosition), aPosition.y);
  vec3 p1 = vec3(aVertex1.x, getHeight(aVertex1), aVertex1.y);
  vec3 p2 = vec3(aVertex2.x, getHeight(aVertex2), aVertex2.y);
  vec3 p3 = vec3(aVertex3.x, getHeight(aVertex3), aVertex3.y);
  vec3 normal = normalize(cross(p2 - p1, p3 - p1));

  vNormal = normal;
  gl_Position = uProjection * uView * uModel * vec4(position, 1.0);
}
