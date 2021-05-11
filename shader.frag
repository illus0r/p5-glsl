#version 300 es
precision mediump float;
uniform sampler2D u_texture;
// uniform vec2 u_texture_resolution;

uniform float tick;
uniform float u_time;
uniform vec2 u_resolution;
out vec4 outColor;

#define rnd(x) fract(54321.987 * sin(mod(987.12345 * x, 1000.)))

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
	outColor.rgb = texture(u_texture, uv).rgb;
	outColor.rgb += .8 * rnd(length(gl_FragCoord.xy + vec2(123.456, 31.171) + u_time));
	outColor.a = 1.;
	outColor = clamp(outColor, 0., 1.);
}
