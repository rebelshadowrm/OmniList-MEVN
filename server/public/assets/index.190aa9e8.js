var le=Object.defineProperty,de=Object.defineProperties;var ue=Object.getOwnPropertyDescriptors;var re=Object.getOwnPropertySymbols;var _e=Object.prototype.hasOwnProperty,me=Object.prototype.propertyIsEnumerable;var ae=(e,t,n)=>t in e?le(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,U=(e,t)=>{for(var n in t||(t={}))_e.call(t,n)&&ae(e,n,t[n]);if(re)for(var n of re(t))me.call(t,n)&&ae(e,n,t[n]);return e},z=(e,t)=>de(e,ue(t));import{r as pe,a as ve,c as B,b as m,o as c,d as l,e as r,f as $,w as E,u as M,t as v,g as u,p as T,h as L,i as D,j as Y,F as k,k as f,v as h,l as O,m as q,n as ge,q as b,s as ne,x as fe,y as F,z as he,A as ye,B as Ce}from"./vendor.74a59342.js";const $e=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerpolicy&&(a.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?a.credentials="include":s.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=n(s);fetch(s.href,a)}};$e();var we="/assets/logo.aa4ae05b.png";class N{static getAccessToken(){return localStorage.getItem("access_token")}static setAccessToken(t){localStorage.setItem("access_token",t)}static setRefreshToken(t){localStorage.setItem("refresh_token",t)}static getRefreshToken(){return localStorage.getItem("refresh_token")}static clearTokens(){localStorage.removeItem("access_token"),localStorage.removeItem("refresh_token")}}const w=pe({userData:{user:null},isLoggedIn:!1,loading:!1,error:""}),Pe={getIsLoggedIn:()=>B(()=>w.isLoggedIn),getLoading:()=>B(()=>w.loading),getError:()=>B(()=>w.error),getUser:()=>B(()=>w.userData)},ie={setUser:e=>{ie.setIsLoggedIn(!0),w.userData.user=e},setIsLoggedIn:e=>{w.isLoggedIn=e,e===!1&&(w.userData.user=null,N.clearTokens())},setLoading:e=>{w.loading=e},setError:e=>{w.error=e}},be={decodeJWT:e=>{try{return JSON.parse(atob(e.split(".")[1]))}catch{return null}}};var J=()=>U(U(U({state:ve(w)},Pe),ie),be);var _=(e,t)=>{const n=e.__vccOpts||e;for(const[i,s]of t)n[i]=s;return n};const ce=e=>(T("data-v-657fa080"),e=e(),L(),e),ke={id:"nav"},xe=ce(()=>r("img",{class:"logo",src:we,alt:"omni list logo"},null,-1)),Se=ce(()=>r("span",null,"OmniList",-1)),Ae={class:"nav-items"},Ie=D("Home"),Ne=D("About"),Te=D("Profile"),Le={key:0,class:"username"},Ue=["src"],Fe={name:"Header"},Ve=Object.assign(Fe,{setup(e){const{getIsLoggedIn:t,getUser:n}=J(),i=t(),s=n();return(a,o)=>{var p,g,x,S,A,I;const d=m("router-link");return c(),l("header",null,[r("nav",ke,[$(d,{class:"logo-link",to:"/"},{default:E(()=>[xe,Se]),_:1}),r("div",Ae,[$(d,{to:"/"},{default:E(()=>[Ie]),_:1}),$(d,{to:"/about"},{default:E(()=>[Ne]),_:1}),$(d,{to:"/profile/"+((p=M(s).user)==null?void 0:p.userName)},{default:E(()=>[Te]),_:1},8,["to"])]),M(i)?(c(),l("p",Le,v((S=(x=(g=M(s))==null?void 0:g.user)==null?void 0:x.userName)!=null?S:""),1)):u("",!0),M(i)?(c(),l("img",{key:1,class:"user",src:(I=(A=M(s).user)==null?void 0:A.img)!=null?I:"https://picsum.photos/seed/user/50",alt:""},null,8,Ue)):u("",!0)])])}}});var Oe=_(Ve,[["__scopeId","data-v-657fa080"]]);const Me={name:"Footer"},Re=e=>(T("data-v-328c9808"),e=e(),L(),e),Ee=Re(()=>r("p",null,"OmniList \xA9 2022",-1)),He=[Ee];function De(e,t,n,i,s,a){return c(),l("footer",null,He)}var je=_(Me,[["render",De],["__scopeId","data-v-328c9808"]]);const C=Y.create();C.interceptors.request.use(e=>{const t=N.getAccessToken();return t&&(e.headers.Authorization="Bearer "+t),e.headers["Content-Type"]="application/json",e},e=>{Promise.reject(e)});C.interceptors.response.use(async e=>e,async e=>{if(e.response&&e.response.status===403){console.log("token expired");const t=await Be(e);return console.log("retrying request"),t}return Promise.reject(e)});let W=!1,G=[];async function Be(e){try{const{response:t}=e,n=N.getRefreshToken();if(!n)return console.log("no refresh token"),Promise.reject(e);const i=new Promise(async s=>{await Je(a=>{t.config.headers.Authorization="Bearer "+a,s(Y(t.config))})});if(!W){console.log("fetching access token"),W=!0;const s=await Y({method:"post",url:"/api/refresh",data:{token:n}});if(!s.data)return Promise.reject(e);const a=s.data.accessToken;N.setAccessToken(a),W=!1,await qe(a)}return i}catch(t){return Promise.reject(t)}}async function qe(e){G.forEach(t=>t(e)),G=[]}async function Je(e){G.push(e)}const V="/api/";class H{static async getUsers(){return new Promise(async(t,n)=>{try{const s=(await C.get(`${V}user`)).data;t(s.map(a=>z(U({},a),{createdAt:new Date(a.createdAt),updatedAt:new Date(a.updatedAt)})))}catch(i){n(i.response)}})}static async getUser(t){try{return await C.get(`${V}user/${t}`)}catch(n){return n.response}}static async getUserByUsername(t){try{return await C.get(`${V}user/username/${t}`)}catch(n){return n.response}}static async registerUser(t){try{return await C.post(`${V}register`,t)}catch(n){return n.response}}static async loginUser(t){try{return await C.post(`${V}login`,t)}catch(n){return n.response}}static async logoutUser(t){try{return await C.post(`${V}logout`,t)}catch(n){return n.response}}}const ze={name:"App",components:{Header:Oe,Footer:je},async beforeCreate(){try{const{setUser:e,decodeJWT:t}=J(),n=N.getAccessToken();if(n){const{_id:i}=t(n).user,s=await H.getUser(i);s.status===200&&(console.log(s.data),e(s.data))}}catch(e){console.log(e.message)}}};function We(e,t,n,i,s,a){const o=m("Header"),d=m("router-view"),p=m("Footer");return c(),l(k,null,[$(o),r("main",null,[$(d)]),$(p)],64)}var Ke=_(ze,[["render",We]]);const K="/api/posts/";class R{static getPosts(){return new Promise(async(t,n)=>{try{const s=(await C.get(K)).data;t(s.map(a=>z(U({},a),{createdAt:new Date(a.createdAt)})))}catch(i){n(i)}})}static insertPost(t){return C.post(K,{text:t})}static deletePost(t){return C.delete(`${K}${t}`)}}const Ye={name:"PostComponent",data(){return{posts:[],error:"",text:""}},async created(){try{this.posts=await R.getPosts()}catch(e){this.error=e.message}},methods:{async createPost(){await R.insertPost(this.text),this.posts=await R.getPosts(),this.text=""},async deletePost(e){await R.deletePost(e),this.posts=await R.getPosts()}}},Q=e=>(T("data-v-0584bba0"),e=e(),L(),e),Ge={class:"container"},Qe=Q(()=>r("h1",null,"Latest Posts",-1)),Xe={class:"create-post"},Ze=Q(()=>r("label",{for:"create-post"},"Say something...",-1)),et=Q(()=>r("hr",null,null,-1)),tt={key:0,class:"error"},st={class:"posts-container"},ot=["onDblclick"],rt={class:"created-at"},at={class:"text"};function nt(e,t,n,i,s,a){return c(),l("div",Ge,[Qe,r("div",Xe,[Ze,f(r("input",{type:"text",id:"create-post","onUpdate:modelValue":t[0]||(t[0]=o=>s.text=o),placeholder:"Create a post"},null,512),[[h,s.text]]),r("button",{onClick:t[1]||(t[1]=(...o)=>a.createPost&&a.createPost(...o))},"Post!")]),et,s.error?(c(),l("p",tt,v(s.error),1)):u("",!0),r("div",st,[(c(!0),l(k,null,O(s.posts,o=>(c(),l("div",{class:"post",key:o._id,onDblclick:d=>a.deletePost(o._id)},[r("div",rt,v(`${o.createdAt.getMonth()}/${o.createdAt.getDate()}//${o.createdAt.getFullYear()}`),1),r("p",at,v(o.text),1)],40,ot))),128))])])}var it=_(Ye,[["render",nt],["__scopeId","data-v-0584bba0"]]);const ct={name:"Login",data(){return{email:"",password:"",errorMsg:""}},methods:{async login(){const{setUser:e,decodeJWT:t}=J();if(this.email.trim()!==""&&this.password.trim()!==""){const n={email:this.email,password:this.password},i=await H.loginUser(n);if(i.status===200){const{accessToken:s,refreshToken:a}=i.data,o=t(s).user;e(o),N.setAccessToken(s),N.setRefreshToken(a),this.email="",this.password=""}else this.errorMsg="Invalid login"}else this.errorMsg="Email and Password and required fields"},hasAccount(){this.$emit("toggle-form",!1)}}},j=e=>(T("data-v-2d81a68a"),e=e(),L(),e),lt=j(()=>r("h1",null,"Login",-1)),dt={key:0,class:"error"},ut={class:"input"},_t=j(()=>r("label",{for:"email"},"email",-1)),mt={class:"input"},pt=j(()=>r("label",{for:"password"},"password",-1)),vt=j(()=>r("input",{type:"submit",value:"login"},null,-1)),gt={class:"toggle"},ft=j(()=>r("p",null,"Don't have an account?",-1));function ht(e,t,n,i,s,a){return c(),l("form",{onSubmit:t[3]||(t[3]=q((...o)=>a.login&&a.login(...o),["prevent"]))},[lt,s.errorMsg.length>0?(c(),l("span",dt,v(s.errorMsg),1)):u("",!0),r("div",ut,[_t,f(r("input",{id:"email","onUpdate:modelValue":t[0]||(t[0]=o=>s.email=o),type:"text"},null,512),[[h,s.email]])]),r("div",mt,[pt,f(r("input",{id:"password","onUpdate:modelValue":t[1]||(t[1]=o=>s.password=o),type:"text"},null,512),[[h,s.password]])]),vt,r("div",gt,[ft,r("button",{onClick:t[2]||(t[2]=(...o)=>a.hasAccount&&a.hasAccount(...o))},"Register")])],32)}var yt=_(ct,[["render",ht],["__scopeId","data-v-2d81a68a"]]);const Ct={name:"Register",data(){return{email:"",password:"",repeatPassword:"",username:"",firstName:"",lastName:"",extraToggle:!1,errorMsg:""}},methods:{async onSubmit(e){this.errorMsg="",this.email.trim()!==""&&this.password.trim()!==""&&this.repeatPassword.trim()!==""?this.password.trim()===this.repeatPassword.trim()?await this.createUser(e):this.errorMsg="Passwords don't match":this.errorMsg="Email and Password are required!"},async createUser(e){const{email:t,password:n,username:i,firstName:s,lastName:a}=Object.fromEntries(new FormData(e.target)),o={username:i,password:n,firstName:s,lastName:a,email:t},d=await H.registerUser(o);d.status===201?(this.email="",this.password="",this.repeatPassword="",this.username="",this.firstName="",this.lastName="",this.errorMsg=""):d.status===422?this.errorMsg="Email already in use":this.errorMsg="Something went wrong, try again later"},hasAccount(){this.$emit("toggle-form",!0)}}},P=e=>(T("data-v-9807cb52"),e=e(),L(),e),$t=P(()=>r("h1",null,"Register",-1)),wt={key:0,class:"error"},Pt={class:"input"},bt=P(()=>r("label",{for:"email"},"email",-1)),kt=P(()=>r("label",{class:"extra-details",for:"extraToggle"},"Extra details...",-1)),xt={class:"extra"},St={class:"input"},At=P(()=>r("label",{for:"username"},"username",-1)),It={class:"input"},Nt=P(()=>r("label",{for:"firstName"},"first",-1)),Tt={class:"input"},Lt=P(()=>r("label",{for:"lastName"},"last",-1)),Ut={class:"input"},Ft=P(()=>r("label",{for:"password"},"password",-1)),Vt={class:"input"},Ot=P(()=>r("label",{for:"repeatPassword"},"repeat password",-1)),Mt=P(()=>r("input",{type:"submit",value:"register"},null,-1)),Rt={class:"toggle"},Et=P(()=>r("p",null,"Have an account?",-1));function Ht(e,t,n,i,s,a){return c(),l("form",{onSubmit:t[8]||(t[8]=q((...o)=>a.onSubmit&&a.onSubmit(...o),["prevent"]))},[$t,s.errorMsg.length>0?(c(),l("span",wt,v(s.errorMsg),1)):u("",!0),r("div",Pt,[bt,f(r("input",{id:"email",name:"email","onUpdate:modelValue":t[0]||(t[0]=o=>s.email=o),type:"text"},null,512),[[h,s.email]])]),f(r("input",{id:"extraToggle",name:"extraToggle","onUpdate:modelValue":t[1]||(t[1]=o=>s.extraToggle=o),type:"checkbox"},null,512),[[ge,s.extraToggle]]),kt,r("div",xt,[r("div",St,[At,f(r("input",{id:"username",name:"username","onUpdate:modelValue":t[2]||(t[2]=o=>s.username=o),type:"text"},null,512),[[h,s.username]])]),r("div",It,[Nt,f(r("input",{id:"firstName",name:"firstName","onUpdate:modelValue":t[3]||(t[3]=o=>s.firstName=o),type:"text"},null,512),[[h,s.firstName]])]),r("div",Tt,[Lt,f(r("input",{id:"lastName",name:"lastName","onUpdate:modelValue":t[4]||(t[4]=o=>s.lastName=o),type:"text"},null,512),[[h,s.lastName]])])]),r("div",Ut,[Ft,f(r("input",{id:"password",name:"password","onUpdate:modelValue":t[5]||(t[5]=o=>s.password=o),type:"text"},null,512),[[h,s.password]])]),r("div",Vt,[Ot,f(r("input",{id:"repeatPassword",name:"repeatPassword","onUpdate:modelValue":t[6]||(t[6]=o=>s.repeatPassword=o),type:"text"},null,512),[[h,s.repeatPassword]])]),Mt,r("div",Rt,[Et,r("button",{onClick:t[7]||(t[7]=(...o)=>a.hasAccount&&a.hasAccount(...o))},"Login")])],32)}var Dt=_(Ct,[["render",Ht],["__scopeId","data-v-9807cb52"]]);const jt={name:"Home",components:{PostComponent:it,Login:yt,Register:Dt},data(){return{isLoggedIn:!1,hasAccount:!1,users:[]}},async created(){const{getIsLoggedIn:e}=J();this.isLoggedIn=e()},methods:{toggleForm(e){this.hasAccount=e}}};function Bt(e,t,n,i,s,a){const o=m("PostComponent"),d=m("Login"),p=m("Register");return c(),l(k,null,[s.isLoggedIn===!0?(c(),b(o,{key:0})):u("",!0),s.hasAccount===!0&&s.isLoggedIn===!1?(c(),b(d,{key:1,onToggleForm:a.toggleForm},null,8,["onToggleForm"])):u("",!0),s.hasAccount===!1&&s.isLoggedIn===!1?(c(),b(p,{key:2,onToggleForm:a.toggleForm},null,8,["onToggleForm"])):u("",!0)],64)}var qt=_(jt,[["render",Bt]]),Jt="/assets/mongodb.e2bfe7d8.png",zt="/assets/mongoose.e352560f.png",Wt="/assets/expressjs.40799037.svg",Kt="/assets/vue.77ba2af1.svg",Yt="/assets/vite.17e50649.svg",Gt="/assets/node.a2054365.svg";const Qt={name:"About"},Xt={class:"container"},Zt=ne('<h1 data-v-0e84b287>About the project</h1><dl data-v-0e84b287><dt data-v-0e84b287><span class="mongo" data-v-0e84b287>M</span><span class="express" data-v-0e84b287>E</span><span class="vue" data-v-0e84b287>V</span><span class="node" data-v-0e84b287>N</span> Stack</dt><dd class="mongo" data-v-0e84b287><img alt="mongo" src="'+Jt+'" data-v-0e84b287>Mongo DB<span class="mongoose" data-v-0e84b287>+ Mongoose<img alt="mongoose" src="'+zt+'" data-v-0e84b287></span></dd><dd class="express" data-v-0e84b287><img alt="express" src="'+Wt+'" data-v-0e84b287>Express.js</dd><dd class="vue" data-v-0e84b287><img alt="vue" src="'+Kt+'" data-v-0e84b287>Vue + Vite<img alt="vite" src="'+Yt+'" data-v-0e84b287></dd><dd class="node" data-v-0e84b287><img alt="node" src="'+Gt+'" data-v-0e84b287>Node</dd></dl>',2),es=[Zt];function ts(e,t,n,i,s,a){return c(),l("div",Xt,es)}var ss=_(Qt,[["render",ts],["__scopeId","data-v-0e84b287"]]);const os={name:"ProfileHeader",props:{username:String,img:String,imgAlt:String,backgroundImage:String},computed:{cssProps(){return{"--bgImg":"url("+this.backgroundImage+")"}}}},rs={class:"hero"},as={class:"user"},ns=["src","alt"];function is(e,t,n,i,s,a){return c(),l("div",{style:fe(a.cssProps)},[r("div",rs,[r("div",as,[r("img",{src:n.img,alt:n.imgAlt},null,8,ns),r("h1",null,v(n.username),1)])])],4)}var cs=_(os,[["render",is],["__scopeId","data-v-0bd26600"]]);const ls={name:"ProfileNav",data(){return{active:"overview"}},created(){this.$emit("active",this.active)},methods:{selected(e){this.active=e,this.$emit("active",e)}}},ds={class:"profile-nav"};function us(e,t,n,i,s,a){return c(),l("div",ds,[r("button",{onClick:t[0]||(t[0]=o=>a.selected("overview")),class:F(s.active==="overview"?"active":"")},"Overview",2),r("button",{onClick:t[1]||(t[1]=o=>a.selected("animelist")),class:F(s.active==="animelist"?"active":"")},"AnimeList",2),r("button",{onClick:t[2]||(t[2]=o=>a.selected("favorites")),class:F(s.active==="favorites"?"active":"")},"Favorites",2),r("button",{onClick:t[3]||(t[3]=o=>a.selected("stats")),class:F(s.active==="stats"?"active":"")},"Stats",2),r("button",{onClick:t[4]||(t[4]=o=>a.selected("socials")),class:F(s.active==="socials"?"active":"")},"Socials",2),r("button",{onClick:t[5]||(t[5]=o=>a.selected("reviews")),class:F(s.active==="reviews"?"active":"")},"Reviews",2)])}var _s=_(ls,[["render",us],["__scopeId","data-v-0ef9f7b6"]]);const ms={name:"ProfileColorPicker",data(){return{primaryColor:"#000000",secondaryColor:"#000000",accentColor:"#000000",optionalColors:!1}},created(){var n,i,s,a;const e=this.getColor();this.primaryColor=(n=e==null?void 0:e.primaryColor)!=null?n:"#ff0000",this.secondaryColor=(i=e==null?void 0:e.secondaryColor)!=null?i:"#000000",this.accentColor=(s=e==null?void 0:e.accentColor)!=null?s:"#000000";const t=this.HexToHSL((a=e==null?void 0:e.primaryColor)!=null?a:"#ff0000");if(this.setPrimaryColor(t),e!=null&&e.secondaryColor){const o=this.HexToHSL(e.secondaryColor);this.setSecondaryColor(o)}if(e!=null&&e.accentColor){const o=this.HexToHSL(e.accentColor);this.setAccentColor(o)}},methods:{setColor(e){var n,i,s,a;const t=this.getColor();if(t)t.primaryColor=(n=e==null?void 0:e.primaryColor)!=null?n:t.primaryColor,t.secondaryColor=(i=e==null?void 0:e.secondaryColor)!=null?i:t.secondaryColor,t.accentColor=(s=e==null?void 0:e.accentColor)!=null?s:t.accentColor,localStorage.setItem("color",JSON.stringify(t));else{const o={primaryColor:(a=e==null?void 0:e.primaryColor)!=null?a:"#ff0000",secondaryColor:e==null?void 0:e.secondaryColor,accentColor:e==null?void 0:e.accentColor};localStorage.setItem("color",JSON.stringify(o))}},getColor(){return JSON.parse(localStorage.getItem("color"))},colorOnChange(e){const t=this.HexToHSL(e.target.value),n=e.target.dataset.type,i=e.target.value;n==="primaryColor"&&this.setPrimaryColor(t),n==="secondaryColor"&&this.setSecondaryColor(t),n==="accentColor"&&this.setAccentColor(t);const s={[n]:i};this.setColor(s)},setPrimaryColor(e){document.documentElement.style.setProperty("--clr-primary-h",`${e.hue}deg`),document.documentElement.style.setProperty("--clr-primary-s",`${e.saturation}%`)},setSecondaryColor(e){document.documentElement.style.setProperty("--clr-secondary-h",`${e.hue}deg`),document.documentElement.style.setProperty("--clr-secondary-s",`${e.saturation}%`)},setAccentColor(e){document.documentElement.style.setProperty("--clr-accent-h",`${e.hue}deg`),document.documentElement.style.setProperty("--clr-accent-s",`${e.saturation}%`)},unsetColor(e){const t=e.target.dataset.type,n=this.getColor();t==="secondaryColor"&&(n.secondaryColor="",this.secondaryColor="#000000",document.documentElement.style.removeProperty("--clr-secondary-h"),document.documentElement.style.removeProperty("--clr-secondary-s")),t==="accentColor"&&(n.accentColor="",this.accentColor="#000000",document.documentElement.style.removeProperty("--clr-accent-h"),document.documentElement.style.removeProperty("--clr-accent-s")),this.setColor(n)},HexToHSL(e){let t=0,n=0,i=0;e.length==4?(t=`0x${e[1]}${e[1]}`,n=`0x${e[2]}${e[2]}`,i=`0x${e[3]}${e[3]}`):e.length==7&&(t=`0x${e[1]}${e[2]}`,n=`0x${e[3]}${e[4]}`,i=`0x${e[5]}${e[6]}`),t/=255,n/=255,i/=255;let s=Math.min(t,n,i),a=Math.max(t,n,i),o=a-s,d=0,p=0,g=0;return o==0?d=0:a==t?d=(n-i)/o%6:a==n?d=(i-t)/o+2:d=(t-n)/o+4,d=Math.round(d*60),d<0&&(d+=360),g=(a+s)/2,p=o==0?0:o/(1-Math.abs(2*g-1)),p=+(p*100).toFixed(1),g=+(g*100).toFixed(1),{hue:d,saturation:p,lightness:g}}}},X=e=>(T("data-v-1e11420a"),e=e(),L(),e),ps={class:"color-pickers"},vs={class:"color-picker"},gs=X(()=>r("h2",{class:"primaryColor"},"Primary Color",-1)),fs={key:0,class:"optional-colors"},hs={class:"color-picker"},ys=X(()=>r("h2",{class:"secondaryColor"},"Secondary Color",-1)),Cs={class:"color-picker"},$s=X(()=>r("h2",{class:"accentColor"},"Accent Color",-1));function ws(e,t,n,i,s,a){return c(),l("div",ps,[r("div",vs,[f(r("input",{type:"color","data-type":"primaryColor","onUpdate:modelValue":t[0]||(t[0]=o=>s.primaryColor=o),onInput:t[1]||(t[1]=(...o)=>a.colorOnChange&&a.colorOnChange(...o)),name:"primaryColor",id:"primaryColor"},null,544),[[h,s.primaryColor]]),gs]),r("button",{class:"more-options-btn",onClick:t[2]||(t[2]=o=>s.optionalColors=!s.optionalColors)},"more color options"),s.optionalColors?(c(),l("div",fs,[r("div",hs,[f(r("input",{type:"color","data-type":"secondaryColor","onUpdate:modelValue":t[3]||(t[3]=o=>s.secondaryColor=o),onInput:t[4]||(t[4]=(...o)=>a.colorOnChange&&a.colorOnChange(...o)),name:"secondaryColor",id:"secondaryColor"},null,544),[[h,s.secondaryColor]]),ys,r("button",{class:"unset-btn",onClick:t[5]||(t[5]=(...o)=>a.unsetColor&&a.unsetColor(...o)),"data-type":"secondaryColor"},"reset")]),r("div",Cs,[f(r("input",{type:"color","data-type":"accentColor","onUpdate:modelValue":t[6]||(t[6]=o=>s.accentColor=o),onInput:t[7]||(t[7]=(...o)=>a.colorOnChange&&a.colorOnChange(...o)),name:"accentColor",id:"accentColor"},null,544),[[h,s.accentColor]]),$s,r("button",{class:"unset-btn",onClick:t[8]||(t[8]=(...o)=>a.unsetColor&&a.unsetColor(...o)),"data-type":"accentColor"},"reset")])])):u("",!0)])}var Ps=_(ms,[["render",ws],["__scopeId","data-v-1e11420a"]]);const bs={name:"ProfileOverview",components:{ProfileColorPicker:Ps}},ks=D(" Overview ");function xs(e,t,n,i,s,a){const o=m("ProfileColorPicker");return c(),l("div",null,[ks,$(o)])}var Ss=_(bs,[["render",xs]]);const As={name:"ProfileAnimeList"};function Is(e,t,n,i,s,a){return c(),l("div",null," Anime List ")}var Ns=_(As,[["render",Is]]);const Ts={name:"ProfileFavorites",data(){return{favorites:[]}},created(){this.favorites={anime:[{title:"anime title",img:"https://picsum.photos/seed/anime/50",imgAlt:"anime picture"}],characters:[{name:"character name",img:"https://picsum.photos/seed/character/50",imgAlt:"character picture"}],staff:[{name:"staff name",img:"https://picsum.photos/seed/staff/50",imgAlt:"staff picture"}]}}},Z=e=>(T("data-v-38653f71"),e=e(),L(),e),Ls={class:"favorites"},Us={class:"favorite-section"},Fs={class:"header"},Vs=Z(()=>r("h2",null,"Anime",-1)),Os={key:0,class:"reorder"},Ms={class:"favorite-collection"},Rs=["src","alt"],Es={key:1},Hs={class:"favorite-section"},Ds={class:"header"},js=Z(()=>r("h2",null,"Characters",-1)),Bs={key:0,class:"reorder"},qs={class:"favorite-collection"},Js=["src","alt"],zs={key:1},Ws={class:"favorite-section"},Ks={class:"header"},Ys=Z(()=>r("h2",null,"Staff",-1)),Gs={key:0,class:"reorder"},Qs={class:"favorite-collection"},Xs=["src","alt"],Zs={key:1};function eo(e,t,n,i,s,a){var o,d,p,g,x,S,A,I,ee,te,se,oe;return c(),l("div",Ls,[r("div",Us,[r("div",Fs,[Vs,((o=s.favorites)==null?void 0:o.anime)!==void 0&&((d=s.favorites)==null?void 0:d.anime.length)>0?(c(),l("button",Os,"Reorder")):u("",!0)]),r("div",Ms,[((p=s.favorites)==null?void 0:p.anime)!==void 0&&((g=s.favorites)==null?void 0:g.anime.length)>0?(c(!0),l(k,{key:0},O(s.favorites.anime,y=>(c(),l("div",{key:y.id,class:"favorite"},[r("img",{src:y.img,alt:y.alt},null,8,Rs)]))),128)):(c(),l("p",Es,"No favorites yet..."))])]),r("div",Hs,[r("div",Ds,[js,((x=s.favorites)==null?void 0:x.characters)!==void 0&&((S=s.favorites)==null?void 0:S.characters.length)>0?(c(),l("button",Bs,"Reorder")):u("",!0)]),r("div",qs,[((A=s.favorites)==null?void 0:A.characters)!==void 0&&((I=s.favorites)==null?void 0:I.characters.length)>0?(c(!0),l(k,{key:0},O(s.favorites.characters,y=>(c(),l("div",{key:y.id,class:"favorite"},[r("img",{src:y.img,alt:y.alt},null,8,Js)]))),128)):(c(),l("p",zs,"No favorites yet..."))])]),r("div",Ws,[r("div",Ks,[Ys,((ee=s.favorites)==null?void 0:ee.staff)!==void 0&&((te=s.favorites)==null?void 0:te.staff.length)>0?(c(),l("button",Gs,"Reorder")):u("",!0)]),r("div",Qs,[((se=s.favorites)==null?void 0:se.staff)!==void 0&&((oe=s.favorites)==null?void 0:oe.staff.length)>0?(c(!0),l(k,{key:0},O(s.favorites.staff,y=>(c(),l("div",{key:y.id,class:"favorite"},[r("img",{src:y.img,alt:y.alt},null,8,Xs)]))),128)):(c(),l("p",Zs,"No favorites yet..."))])])])}var to=_(Ts,[["render",eo],["__scopeId","data-v-38653f71"]]);const so={name:"ProfileStats"};function oo(e,t,n,i,s,a){return c(),l("div",null," Stats ")}var ro=_(so,[["render",oo]]);const ao={name:"ProfileSocials",data(){return{socials:[],socialForm:!1}},created(){this.socials=[{socialName:"ex. Email",socialType:"mailto:",socialValue:"email@email.com"},{socialName:"ex. Phone",socialType:"tel:",socialValue:"8675309"}]},methods:{toggleForm(){this.socialForm=!this.socialForm},async addSocial(e){}}},no={class:"socials"},io=ne('<div class="input" data-v-2a377e0a><label for="socialName" data-v-2a377e0a>Social</label><input type="text" name="socialName" id="socialName" data-v-2a377e0a></div><div class="input" data-v-2a377e0a><label for="socialType" data-v-2a377e0a>Type</label><select id="socialType" name="socialType" data-v-2a377e0a><option value="" data-v-2a377e0a>link</option><option value="tel:" data-v-2a377e0a>phone</option><option value="mailto:" data-v-2a377e0a>email</option><option value="other" data-v-2a377e0a>Other</option></select></div><div class="input" data-v-2a377e0a><label for="socialValue" data-v-2a377e0a>Value</label><input type="text" name="socialValue" id="socialValue" data-v-2a377e0a></div>',3),co=[io],lo={class:"social-label"},uo=D("\xA0 "),_o={key:0},mo=["href"];function po(e,t,n,i,s,a){return c(),l("div",no,[r("button",{onClick:t[0]||(t[0]=q((...o)=>a.toggleForm&&a.toggleForm(...o),["prevent"])),class:"addSocial"},"Add Social"),s.socialForm?(c(),l("form",{key:0,onSubmit:t[1]||(t[1]=q((...o)=>a.addSocial&&a.addSocial(...o),["prevent"]))},co,32)):u("",!0),(c(!0),l(k,null,O(s.socials,o=>(c(),l("div",{class:"social-links",key:o.id},[r("p",lo,v(o==null?void 0:o.socialName),1),uo,(o==null?void 0:o.socialType)==="other"?(c(),l("p",_o,v(o==null?void 0:o.socialValue),1)):(c(),l("a",{key:1,href:(o==null?void 0:o.socialType)+(o==null?void 0:o.socialValue),class:"social-value"},v(o==null?void 0:o.socialValue),9,mo))]))),128))])}var vo=_(ao,[["render",po],["__scopeId","data-v-2a377e0a"]]);const go={name:"ProfileReviews",data(){return{reviews:[]}},created(){this.reviews=[{anime:"Some_Longer_Anime_Title_Here",reviewId:12345,reviewName:"Anime Review Title",author:"Mr.Joe Blow",comments:[{userId:"0123",userName:"username",comment:"I agree with your review"},{userId:"0124",userName:"username2",comment:"I disagree with your review"}]}]}},fo={class:"reviews-container"},ho={class:"review-card"},yo={class:"review-info"},Co={class:"title"},$o={class:"anime"},wo={class:"comments"},Po={class:"review-author"};function bo(e,t,n,i,s,a){const o=m("router-link");return c(),l("div",fo,[s.reviews.length>0?(c(!0),l(k,{key:0},O(s.reviews,d=>(c(),l("div",{key:d.id,class:"review"},[$(o,{to:"/anime/"+d.anime+"/reviews/"+d.reviewId},{default:E(()=>[r("div",ho,[r("div",yo,[r("p",Co,v(d.reviewName),1),r("p",$o,v(d.anime),1),r("p",wo,"comments: "+v(d.comments.length),1)]),r("div",Po,[r("p",null,v(d.author),1)])])]),_:2},1032,["to"])]))),128)):u("",!0)])}var ko=_(go,[["render",bo],["__scopeId","data-v-8e3e8d9c"]]);const xo={name:"Profile",components:{ProfileReviews:ko,ProfileSocials:vo,ProfileStats:ro,ProfileFavorites:to,ProfileAnimeList:Ns,ProfileOverview:Ss,ProfileHeader:cs,ProfileNav:_s},props:{username:String},data(){return{user:{},email:"",name:"",first:"",last:"",img:"",imgAlt:"",bgImg:"",section:""}},async created(){if(this.$watch(async()=>this.$route.params,async e=>{const{username:t}=await e;if(t){const{data:n}=await H.getUserByUsername(t);await this.updateProfile(n)}}),this.username){const{data:e}=await H.getUserByUsername(this.username);await this.updateProfile(e)}},methods:{activeSection(e){this.section=e},async updateProfile(e){var t,n,i,s;this.email=e==null?void 0:e.email,this.name=(e==null?void 0:e.userName)===""?e==null?void 0:e.email:(t=e==null?void 0:e.userName)!=null?t:"Not Found",this.first=e==null?void 0:e.firstName,this.last=e==null?void 0:e.lastName,this.img=(n=e==null?void 0:e.img)!=null?n:`https://picsum.photos/seed/${this.name}/260/280`,this.imgAlt=(i=e==null?void 0:e.imgAlt)!=null?i:"profile image",this.bgImg=(s=e==null?void 0:e.bgImg)!=null?s:"https://picsum.photos/2000/400"}}},So={class:"content"};function Ao(e,t,n,i,s,a){const o=m("ProfileHeader"),d=m("ProfileNav"),p=m("ProfileOverview"),g=m("ProfileAnimeList"),x=m("ProfileFavorites"),S=m("ProfileStats"),A=m("ProfileSocials"),I=m("ProfileReviews");return c(),l("section",null,[r("header",null,[$(o,{username:s.name,img:s.img,"img-alt":s.imgAlt,"background-image":s.bgImg},null,8,["username","img","img-alt","background-image"]),$(d,{onActive:a.activeSection},null,8,["onActive"]),r("div",So,[s.section==="overview"?(c(),b(p,{key:0})):u("",!0),s.section==="animelist"?(c(),b(g,{key:1})):u("",!0),s.section==="favorites"?(c(),b(x,{key:2})):u("",!0),s.section==="stats"?(c(),b(S,{key:3})):u("",!0),s.section==="socials"?(c(),b(A,{key:4})):u("",!0),s.section==="reviews"?(c(),b(I,{key:5})):u("",!0)])])])}var Io=_(xo,[["render",Ao],["__scopeId","data-v-3311a43c"]]);const No=[{path:"/",name:"Home",component:qt},{path:"/about",name:"About",component:ss},{path:"/profile/:username",name:"Profile",component:Io,props:!0}],To=he({history:ye("/"),routes:No,linkExactActiveClass:"active"});Ce(Ke).use(To).mount("#app");