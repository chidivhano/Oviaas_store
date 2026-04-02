import{r as t,j as o}from"./index-P-MRB-Z7.js";import{ar as w,ah as m,ai as S,g as j,C as M,as as C,V as E,S as I,am as A,an as D,ap as P,aq as F}from"./Environment-C9JuO_jy.js";const R=()=>parseInt(w.replace(/\D+/g,"")),T=R();var V=`#define GLSLIFY 1
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}float snoise(vec3 v){const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}`;class L extends j{constructor(e={}){super(e),this.setValues(e),this._time={value:0},this._distort={value:.4},this._radius={value:1}}onBeforeCompile(e){e.uniforms.time=this._time,e.uniforms.radius=this._radius,e.uniforms.distort=this._distort,e.vertexShader=`
      uniform float time;
      uniform float radius;
      uniform float distort;
      ${V}
      ${e.vertexShader}
    `,e.vertexShader=e.vertexShader.replace("#include <begin_vertex>",`
        float updateTime = time / 50.0;
        float noise = snoise(vec3(position / 2.0 + updateTime * 5.0));
        vec3 transformed = vec3(position * (noise * pow(distort, 2.0) + radius));
        `)}get time(){return this._time.value}set time(e){this._time.value=e}get distort(){return this._distort.value}set distort(e){this._distort.value=e}get radius(){return this._radius.value}set radius(e){this._radius.value=e}}const k=t.forwardRef(({speed:r=1,...e},i)=>{const[a]=t.useState(()=>new L);return m(s=>a&&(a.time=s.clock.elapsedTime*r)),t.createElement("primitive",S({object:a,ref:i,attach:"material"},e))});class q extends A{constructor(){super({uniforms:{time:{value:0},fade:{value:1}},vertexShader:`
      uniform float time;
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 0.5);
        gl_PointSize = size * (30.0 / -mvPosition.z) * (3.0 + sin(time + 100.0));
        gl_Position = projectionMatrix * mvPosition;
      }`,fragmentShader:`
      uniform sampler2D pointTexture;
      uniform float fade;
      varying vec3 vColor;
      void main() {
        float opacity = 1.0;
        if (fade == 1.0) {
          float d = distance(gl_PointCoord, vec2(0.5, 0.5));
          opacity = 1.0 / (1.0 + exp(16.0 * (d - 0.25)));
        }
        gl_FragColor = vec4(vColor, opacity);

        #include <tonemapping_fragment>
	      #include <${T>=154?"colorspace_fragment":"encodings_fragment"}>
      }`})}}const G=r=>new E().setFromSpherical(new I(r,Math.acos(1-Math.random()*2),Math.random()*2*Math.PI)),$=t.forwardRef(({radius:r=100,depth:e=50,count:i=5e3,saturation:a=0,factor:s=4,fade:d=!1,speed:f=1},p)=>{const l=t.useRef(null),[y,h,g]=t.useMemo(()=>{const n=[],x=[],_=Array.from({length:i},()=>(.5+.5*Math.random())*s),c=new M;let u=r+e;const b=e/i;for(let v=0;v<i;v++)u-=b*Math.random(),n.push(...G(u).toArray()),c.setHSL(v/i,a,.9),x.push(c.r,c.g,c.b);return[new Float32Array(n),new Float32Array(x),new Float32Array(_)]},[i,e,s,r,a]);m(n=>l.current&&(l.current.uniforms.time.value=n.clock.elapsedTime*f));const[z]=t.useState(()=>new q);return t.createElement("points",{ref:p},t.createElement("bufferGeometry",null,t.createElement("bufferAttribute",{attach:"attributes-position",args:[y,3]}),t.createElement("bufferAttribute",{attach:"attributes-color",args:[h,3]}),t.createElement("bufferAttribute",{attach:"attributes-size",args:[g,1]})),t.createElement("primitive",{ref:l,object:z,attach:"material",blending:C,"uniforms-fade-value":d,depthWrite:!1,transparent:!0,vertexColors:!0}))});function B(){const r=t.useRef(null);return m(e=>{r.current&&(r.current.rotation.x=e.clock.elapsedTime*.2,r.current.rotation.y=e.clock.elapsedTime*.3)}),o.jsx(F,{speed:2,rotationIntensity:1,floatIntensity:2,children:o.jsxs("mesh",{ref:r,scale:1.5,children:[o.jsx("torusKnotGeometry",{args:[1,.3,64,20]}),o.jsx(k,{color:"#b026ff",emissive:"#b026ff",emissiveIntensity:.5,wireframe:!0,distort:.4,speed:2})]})})}function N(){return o.jsxs(D,{camera:{position:[0,0,5],fov:50},dpr:[1,1.5],gl:{powerPreference:"high-performance"},children:[o.jsx("ambientLight",{intensity:.5}),o.jsx("directionalLight",{position:[10,10,5],intensity:1}),o.jsx($,{radius:100,depth:50,count:1500,factor:4,saturation:0,fade:!0,speed:1}),o.jsx(B,{}),o.jsx(P,{preset:"city"})]})}export{N as default};
