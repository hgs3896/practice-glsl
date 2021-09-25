#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const float PI=acos(0.);

// Plot a line on Y using a value between 0.0-1.0
float plot(vec2 st){
    /*
    * 1 : abs(st.y - st.x) <= 0
    * 1~0 : 0 < abs(st.y - st.x) <= 0.02
    * 0 : abs(st.y - st.x) > 0.02
    */
    return smoothstep(.02,0.,abs(st.y-st.x));
}

float plot(vec2 st,float pct){
    return smoothstep(pct-.02,pct,st.y)-
    smoothstep(pct,pct+.02,st.y);
}

float blinnWyvillCosineApproximation(float x){
    float x2=x*x;
    float x4=x2*x2;
    float x6=x4*x2;
    
    float fa=(4./9.);
    float fb=(17./9.);
    float fc=(22./9.);
    
    float y=fa*x6-fb*x4+fc*x2;
    return y;
}

float quadraticBezier(float x,float a,float b){
    // adapted from BEZMATH.PS (1993)
    // by Don Lancaster, SYNERGETICS Inc.
    // http://www.tinaja.com/text/bezmath.html
    
    float epsilon=.00001;
    float _a=max(0.,min(1.,a));
    float _b=max(0.,min(1.,b));
    if(_a==.5){
        _a+=epsilon;
    }
    
    // solve t from x (an inverse operation)
    float om2a=1.-2.*_a;
    float t=(sqrt(_a*_a+om2a*x)-_a)/om2a;
    float y=(1.-2.*_b)*(t*t)+(2.*_b)*t;
    return y;
}

float sinc(float x,float k)
{
    float a=PI*(k*x-1.);
    return sin(a)/a;
}

float expImpulse(float x,float k)
{
    float h=k*x;
    return h*exp(1.-h);
}

vec4 getLine(vec2 st){
    float y=abs(sinc(st.x-u_time,3.)+.5);
    
    vec3 color=vec3(1.,1.,1.);
    vec3 colors[9];
    colors[0]=vec3(1.,0.,0.);
    colors[1]=vec3(1.,.4824,0.);
    colors[2]=vec3(.1686,1.,0.);
    colors[3]=vec3(0.,1.,.749);
    colors[4]=vec3(0.,.6353,1.);
    colors[5]=vec3(0.,.0667,1.);
    colors[6]=vec3(.298,0.,1.);
    colors[7]=vec3(.4471,.1294,.8118);
    colors[8]=vec3(.7176,0.,1.);

    // Plot a line
    float pct;
    for(int i=0;i<9;++i){
        float fi=float(i);
        pct=plot(st,y+.02*fi);
        color=mix(color,colors[i],pct);
    }
    
    return vec4(color,1.);
}

void main(){
    vec2 st=gl_FragCoord.xy/u_resolution;
    
    gl_FragColor=getLine(st);
}