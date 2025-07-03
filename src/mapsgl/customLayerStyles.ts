import { WeatherLayerOptions, LayerType } from '@aerisweather/mapsgl';

export const customFiresStyle: Partial<WeatherLayerOptions> = {
    type: 'symbol' as LayerType,
    paint: {
        symbol: {
            shader: `
// https://www.shadertoy.com/view/Xtf3DX
#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform vec2 resolution;
uniform float dpr;
uniform float time;
uniform sampler2D tDiffuse;

varying vec2 vUv;
varying vec2 vPosition;
varying float vFactor;
varying float vRandom;

#include <fbm>

float rand(const vec2 co) {
float t = dot(vec2(12.9898, 78.233), co);
return fract(sin(t) * (4375.85453 + t));
}

void main() {
// vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
float t = (time + vRandom * 10.) * 0.5;

vec2 q = uv;
q.x *= 1.;
q.y *= 2.;
float strength = floor(q.x + 2.0);
float T3 = max(3., 1.25 * strength) * t;
q.x = mod(q.x, 1.) - 0.5;
q.y -= 0.25;

float n = fbm(strength * q - vec2(0, T3));
float c = 1. - 16. * pow(max(0., length(q * vec2(1.8 + q.y * 1.5, .75)) - n * max(0., q.y + .25)), 1.2);
float c1 = n * c * (1.5 - pow(1.25 * uv.y, 2.));
c1 = clamp(c1, 0., 1.);

// flame color
vec3 col = vec3(3.5*c1, 1.5*c1*c1*c1, c1*c1*c1*c1*c1*c1);
float alpha = 1.0;

// adjust color and alpha based on vFactor (percent contained)
if (vFactor == 1.) {
col *= vec3(0.);
alpha = 0.7;
}

// smoke intensity: lower number gives more smoke
float a = c * (1. - pow(uv.y, 1.0));
col = mix(vec3(0.3), col, a);

if (col.r == col.g && col.g == col.b) {
alpha *= 1.0 - col.r;
}
if (uv.y > 0.5) {
float dist = length(2.0 * uv - 1.0);
float delta = fwidth(dist);
alpha *= 1.0 - smoothstep(1.0 - delta - 0.5, 1.0, dist);
}

gl_FragColor = vec4(col, alpha);
gl_FragColor.a = alpha;
gl_FragColor.rgb *= gl_FragColor.a;
}
            `,
            animated: true,
            pitchWithMap: false,
            size: (data: any) => {
                const area = Math.max(1, data.report?.areaAC);
                const contained = data.report?.perContained || 0;
                const factor = (area * (contained === 100 ? 0.75 : 1)) / 10000;
                const size = {
                    width: Math.min(80, Math.round(30 + 40 * factor)),
                    height: Math.min(130, Math.round(40 + 80 * factor))
                };
                return size;
            },
            offset: (data: any) => {
                const area = Math.max(1, data.report?.areaAC);
                const contained = data.report?.perContained || 0;
                const factor = (area * (contained === 100 ? 0.75 : 1)) / 10000;
                const size = {
                    width: Math.min(80, Math.round(30 + 40 * factor)),
                    height: Math.min(130, Math.round(40 + 80 * factor))
                };
                return { x: 0, y: -size.height / 2 };
            },
            factor: (data: any) => {
                const contained = data.report?.perContained || 0;
                return contained / 100;
            }
        }
    }
};

export const customEarthquakesStyle: Partial<WeatherLayerOptions> = {
    type: 'symbol' as LayerType,
    paint: {
        symbol: {
            shader: `
// https://www.shadertoy.com/view/ldycR3
#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform vec2 resolution;
uniform float dpr;
uniform float time;

varying vec2 vUv;
varying vec2 vPosition;
varying float vFactor;
varying float vRandom;

float saturate(float x) {
return clamp(x, 0.0, 1.0);
}

vec3 hsb2rgb(in vec3 c) {
vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,
             0.0,
             1.0);
rgb = rgb*rgb*(3.0-2.0*rgb);
return c.z * mix( vec3(1.0), rgb, c.y);
}

void main() {
vec2 pos = vUv;
float t = time;

float dist = length(2.0 * pos - 1.0) * 2.0;
vec2 p = vec2(dist);

float r = length(p) * 0.9;
vec3 color = hsb2rgb(vec3(0.03, 0.7, 0.6));

float a = pow(r, 3.0);
float b = sin(r * 1.8 - 1.6);
float c = sin(r - 0.010);
float s = sin(a - t * 2.0 + b) * c;

color *= abs(1.0 / (s * 1.8)) - 0.01;

float d = length(2.0 * pos - 1.0);
// float delta = fwidth(d);
float alpha = 1.0 - d;
// alpha *= min(1.0, 0.2 + vFactor);

gl_FragColor = vec4(color, alpha);
gl_FragColor.rgb *= gl_FragColor.a;
}
            `,
            animated: true,
            pitchWithMap: true,
            // blending: 2,
            size: (data: any) => {
                const mag = Math.max(data.report?.magnitude || 1) * 10;
                const size = 50 + (mag / 100);
                return { width: size, height: size };
            }
        }
    }
};

export const customLightningStyle: Partial<WeatherLayerOptions> = {
    type: 'symbol' as LayerType,
    paint: {
        symbol: {
            shader: `
#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform vec2 resolution;
uniform float dpr;
uniform float time;

varying vec2 vUv;
varying vec2 vPosition;
varying float vFactor;
varying float vRandom;

float rand(float x) {
return fract(sin(x)*75154.32912);
}

float rand3d(vec3 x) {
return fract(375.10297 * sin(dot(x, vec3(103.0139,227.0595,31.05914))));
}

float noise(float x) {
float i = floor(x);
float a = rand(i), b = rand(i+1.);
float f = x - i;
return mix(a,b,f);
}

float perlin(float x) {
float r=0.,s=1.,w=1.;
for (int i=0; i<6; i++) {
s *= 2.0;
w *= 0.5;
r += w * noise(s*x);
}
return r;
}

float noise3d(vec3 x) {
vec3 i = floor(x);
float i000 = rand3d(i+vec3(0.,0.,0.)), i001 = rand3d(i+vec3(0.,0.,1.));
float i010 = rand3d(i+vec3(0.,1.,0.)), i011 = rand3d(i+vec3(0.,1.,1.));
float i100 = rand3d(i+vec3(1.,0.,0.)), i101 = rand3d(i+vec3(1.,0.,1.));
float i110 = rand3d(i+vec3(1.,1.,0.)), i111 = rand3d(i+vec3(1.,1.,1.));
vec3 f = x - i;
return mix(mix(mix(i000,i001,f.z), mix(i010,i011,f.z), f.y),
       mix(mix(i100,i101,f.z), mix(i110,i111,f.z), f.y), f.x);
}

float perlin3d(vec3 x)
{
float r = 0.0;
float w = 1.0, s = 1.0;
for (int i=0; i<5; i++) {
w *= 0.5;
s *= 2.0;
r += w * noise3d(s * x);
}
return r;
}



#define COL1 vec4(0, 0, 0, 0) / 255.0
#define COL2 vec4(235, 241, 245, 255) / 255.0

#define SIZE 100
#define FLASH_POWER .8
#define RADIUS .01
#define SPEED .0018
#define SEED 

void main() {
    vec2 pos = vUv;

    float dist = length(2.0 * pos - 1.0) * 2.0;

    float x = time + 0.1;

    float m = 0.2 + 0.2 * vFactor; // max duration of strike
    float i = floor(x/m);
    float f = x/m - i;
    float k = vFactor; // frequency of strikes
    float n = noise(i);
    float t = ceil(n-k); // occurrence
    float d = max(0., n-k) / (1.-k); // duration
    float o = ceil(t - f - (1. - d)); // occurrence with duration

    float fx = 4.;
    if (o == 1.) {
        fx += 10. * vFactor;
    }

    fx = max(4., fx);
    float g = fx / (dist * (10. + 20.)) * FLASH_POWER; 

    float edgeFadeFactor = smoothstep(0.0, 1.0, dist);
    float invertedEdgeFadeFactor = 1.0 - edgeFadeFactor;

    vec4 color = mix(COL1, COL2, g);
    color.a *= min(1.0, 0.5 + vFactor) * invertedEdgeFadeFactor;

    gl_FragColor = color;
    gl_FragColor.rgb *= gl_FragColor.a;
}
            `,
            size: { width: 60, height: 60 },
            animated: true,
            blending: 2,
            pitchWithMap: true,
            factor: (data: any) => {
                const max = 200;
                return (200 - data.age) / 200;
            }
        }
    }
};
