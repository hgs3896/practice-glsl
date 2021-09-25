#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float PI=acos(0.);

vec4 getPattern(vec2 st){
    vec3 c;
    float l,z=u_time;
    for(int i=0;i<3;i++){
        vec2 uv,p=st;
        uv=p;
        p-=.5;
        p.x*=u_resolution.x/u_resolution.y;
        z+=.07;
        l=length(p);
        uv+=p/l*(sin(z)+1.)*abs(sin(l*9.-z*2.));
        c[i]=.01/length(abs(mod(uv,1.)-.5));
    }
    return vec4(c/l,u_time);
}

void main(){
    vec2 st=gl_FragCoord.xy/u_resolution;
    
    gl_FragColor=getPattern(st);
}