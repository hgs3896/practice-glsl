#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
float speed=3.;
const float PI=acos(.0);

float max_dist=distance(vec2(.0,.0),vec2(.5,.5))/4.;

float gain(float x,float k){
    float a=.5*pow(2.*((x<.5)?x:1.-x),k);
    return(x<.5)?a:1.-a;
}

float plot(vec2 st,vec2 mt,float dist){
    float freq=.5*PI/max_dist;
    return 1.-smoothstep(0.,max_dist,max_dist*max(.01,abs(cos(freq*(dist-u_time)))));
}

void main(){
    vec2 st=gl_FragCoord.xy/u_resolution.xy;
    vec2 mt=u_mouse.xy/u_resolution.xy;
    float dist=clamp(distance(mt,st),.0,max_dist);
    
    float sx=st.x;
    vec3 bgcolor=vec3(1.,1.,1.);
    vec3 linecolor=vec3(1.,0.,0.);
    
    float pct=plot(st,mt,dist);
    vec3 color=dist<max_dist?pct*linecolor+(1.-pct)*bgcolor:bgcolor;
    
    gl_FragColor=vec4(color,1.);
}