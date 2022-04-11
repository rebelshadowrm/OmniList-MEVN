var X=Object.defineProperty,Z=Object.defineProperties;var ee=Object.getOwnPropertyDescriptors;var H=Object.getOwnPropertySymbols;var te=Object.prototype.hasOwnProperty,se=Object.prototype.propertyIsEnumerable;var z=(e,t,r)=>t in e?X(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,x=(e,t)=>{for(var r in t||(t={}))te.call(t,r)&&z(e,r,t[r]);if(H)for(var r of H(t))se.call(t,r)&&z(e,r,t[r]);return e},R=(e,t)=>Z(e,ee(t));import{r as oe,a as re,c as F,b as _,o as c,d as l,e as a,f as P,w as V,g,p as T,h as N,i as M,j as O,F as B,k as v,v as h,t as I,l as ne,m as J,n as ae,q as w,s as ie,u as ce,x as k,y as le,z as de,A as ue}from"./vendor.a9feca9c.js";const _e=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function r(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerpolicy&&(o.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?o.credentials="include":s.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=r(s);fetch(s.href,o)}};_e();class b{static getAccessToken(){return localStorage.getItem("access_token")}static setAccessToken(t){localStorage.setItem("access_token",t)}static setRefreshToken(t){localStorage.setItem("refresh_token",t)}static getRefreshToken(){return localStorage.getItem("refresh_token")}static clearTokens(){localStorage.removeItem("access_token"),localStorage.removeItem("refresh_token")}}const y=oe({userData:{user:null},isLoggedIn:!1,loading:!1,error:""}),me={getIsLoggedIn:()=>F(()=>y.isLoggedIn),getLoading:()=>F(()=>y.loading),getError:()=>F(()=>y.error),getUser:()=>F(()=>y.userData)},W={setUser:e=>{W.setIsLoggedIn(!0),y.userData.user=e},setIsLoggedIn:e=>{y.isLoggedIn=e,e===!1&&(y.userData.user=null,b.clearTokens())},setLoading:e=>{y.loading=e},setError:e=>{y.error=e}},pe={decodeJWT:e=>{try{return JSON.parse(atob(e.split(".")[1]))}catch{return null}}};var C=()=>x(x(x({state:re(y)},me),W),pe),ge="/assets/logo.03d6d6da.png";var u=(e,t)=>{const r=e.__vccOpts||e;for(const[i,s]of t)r[i]=s;return r};const ve={name:"Header",data(){return{isLoggedIn:!1}},props:{user:{}},async created(){const{getIsLoggedIn:e}=C();this.isLoggedIn=e(),console.log("something",this.user)}},fe=e=>(T("data-v-45a8efd3"),e=e(),N(),e),he={id:"nav"},ye=fe(()=>a("img",{class:"logo",src:ge,alt:""},null,-1)),$e={class:"nav-items"},we=M("Home"),Pe=M("About"),be=M("Profile"),xe=["src"];function ke(e,t,r,i,s,o){var d,m,p;const n=_("router-link");return c(),l("header",null,[a("nav",he,[ye,a("div",$e,[P(n,{to:"/"},{default:V(()=>[we]),_:1}),P(n,{to:"/about"},{default:V(()=>[Pe]),_:1}),P(n,{to:"/profile/"+((d=r.user)==null?void 0:d.userName)},{default:V(()=>[be]),_:1},8,["to"])]),s.isLoggedIn?(c(),l("img",{key:0,class:"user",src:(p=(m=r.user)==null?void 0:m.img)!=null?p:"https://picsum.photos/seed/user/50",alt:""},null,8,xe)):g("",!0)])])}var Ae=u(ve,[["render",ke],["__scopeId","data-v-45a8efd3"]]);const Ie={name:"Footer"},Se=e=>(T("data-v-328c9808"),e=e(),N(),e),Le=Se(()=>a("p",null,"OmniList \xA9 2022",-1)),Te=[Le];function Ne(e,t,r,i,s,o){return c(),l("footer",null,Te)}var Ue=u(Ie,[["render",Ne],["__scopeId","data-v-328c9808"]]);const f=O.create();f.interceptors.request.use(e=>{const t=b.getAccessToken();return t&&(e.headers.Authorization="Bearer "+t),e.headers["Content-Type"]="application/json",e},e=>{Promise.reject(e)});f.interceptors.response.use(async e=>e,async e=>{if(e.response&&e.response.status===403){console.log("token expired");const t=await Fe(e);return console.log("retrying request"),t}return Promise.reject(e)});let D=!1,j=[];async function Fe(e){try{const{response:t}=e,r=b.getRefreshToken();if(!r)return console.log("no refresh token"),Promise.reject(e);const i=new Promise(async s=>{await Ce(o=>{t.config.headers.Authorization="Bearer "+o,s(O(t.config))})});if(!D){console.log("fetching access token"),D=!0;const s=await O({method:"post",url:"/api/refresh",data:{token:r}});if(!s.data)return Promise.reject(e);const o=s.data.accessToken;b.setAccessToken(o),D=!1,await Me(o)}return i}catch(t){return Promise.reject(t)}}async function Me(e){j.forEach(t=>t(e)),j=[]}async function Ce(e){j.push(e)}const A="/api/";class L{static async getUsers(){return new Promise(async(t,r)=>{try{const s=(await f.get(`${A}user`)).data;t(s.map(o=>R(x({},o),{createdAt:new Date(o.createdAt),updatedAt:new Date(o.updatedAt)})))}catch(i){r(i.response)}})}static async getUser(t){try{return await f.get(`${A}user/${t}`)}catch(r){return r.response}}static async getUserByUsername(t){try{return await f.get(`${A}user/username/${t}`)}catch(r){return r.response}}static async registerUser(t){try{return await f.post(`${A}register`,t)}catch(r){return r.response}}static async loginUser(t){try{return await f.post(`${A}login`,t)}catch(r){return r.response}}static async logoutUser(t){try{return await f.post(`${A}logout`,t)}catch(r){return r.response}}}const Re={name:"App",components:{Header:Ae,Footer:Ue},data(){return{result:""}},async created(){try{const{setUser:e,decodeJWT:t,getUser:r}=C(),i=b.getAccessToken(),{user:s}=t(i),o=await L.getUser(s._id);o.status===200&&(e(o.data),this.result=r().value)}catch(e){console.log(e.message)}}};function Ve(e,t,r,i,s,o){var p;const n=_("Header"),d=_("router-view"),m=_("Footer");return c(),l(B,null,[P(n,{user:(p=s.result)==null?void 0:p.user},null,8,["user"]),a("main",null,[P(d)]),P(m)],64)}var De=u(Re,[["render",Ve]]);const E="/api/posts/";class S{static getPosts(){return new Promise(async(t,r)=>{try{const s=(await f.get(E)).data;t(s.map(o=>R(x({},o),{createdAt:new Date(o.createdAt)})))}catch(i){r(i)}})}static insertPost(t){return f.post(E,{text:t})}static deletePost(t){return f.delete(`${E}${t}`)}}const Ee={name:"PostComponent",data(){return{posts:[],error:"",text:""}},async created(){try{this.posts=await S.getPosts()}catch(e){this.error=e.message}},methods:{async createPost(){await S.insertPost(this.text),this.posts=await S.getPosts(),this.text=""},async deletePost(e){await S.deletePost(e),this.posts=await S.getPosts()}}},q=e=>(T("data-v-37eb1acf"),e=e(),N(),e),Oe={class:"container"},je=q(()=>a("h1",null,"Latest Posts",-1)),Be={class:"create-post"},qe=q(()=>a("label",{for:"create-post"},"Say something...",-1)),He=q(()=>a("hr",null,null,-1)),ze={key:0,class:"error"},Je={class:"posts-container"},We=["onDblclick"],Ke={class:"created-at"},Ye={class:"text"};function Ge(e,t,r,i,s,o){return c(),l("div",Oe,[je,a("div",Be,[qe,v(a("input",{type:"text",id:"create-post","onUpdate:modelValue":t[0]||(t[0]=n=>s.text=n),placeholder:"Create a post"},null,512),[[h,s.text]]),a("button",{onClick:t[1]||(t[1]=(...n)=>o.createPost&&o.createPost(...n))},"Post!")]),He,s.error?(c(),l("p",ze,I(s.error),1)):g("",!0),a("div",Je,[(c(!0),l(B,null,ne(s.posts,n=>(c(),l("div",{class:"post",key:n._id,onDblclick:d=>o.deletePost(n._id)},[a("div",Ke,I(`${n.createdAt.getDate()}/${n.createdAt.getMonth()}/${n.createdAt.getFullYear()}`),1),a("p",Ye,I(n.text),1)],40,We))),128))])])}var Qe=u(Ee,[["render",Ge],["__scopeId","data-v-37eb1acf"]]);const Xe={name:"Login",data(){return{email:"",password:"",errorMsg:""}},methods:{async login(){const{setUser:e,decodeJWT:t}=C();if(this.email.trim()!==""&&this.password.trim()!==""){const r={email:this.email,password:this.password},i=await L.loginUser(r);if(i.status===200){const{accessToken:s,refreshToken:o}=i.data,n=t(s);e(n),b.setAccessToken(s),b.setRefreshToken(o),this.email="",this.password=""}else this.errorMsg="Invalid login"}else this.errorMsg="Email and Password and required fields"},hasAccount(){this.$emit("toggle-form",!1)}}},U=e=>(T("data-v-5e209e2c"),e=e(),N(),e),Ze=U(()=>a("h1",null,"Login",-1)),et={key:0,class:"error"},tt={class:"input"},st=U(()=>a("label",{for:"email"},"email",-1)),ot={class:"input"},rt=U(()=>a("label",{for:"password"},"password",-1)),nt=U(()=>a("input",{type:"submit",value:"login"},null,-1)),at={class:"toggle"},it=U(()=>a("p",null,"Don't have an account?",-1));function ct(e,t,r,i,s,o){return c(),l("form",{onSubmit:t[3]||(t[3]=J((...n)=>o.login&&o.login(...n),["prevent"]))},[Ze,s.errorMsg.length>0?(c(),l("span",et,I(s.errorMsg),1)):g("",!0),a("div",tt,[st,v(a("input",{id:"email","onUpdate:modelValue":t[0]||(t[0]=n=>s.email=n),type:"text"},null,512),[[h,s.email]])]),a("div",ot,[rt,v(a("input",{id:"password","onUpdate:modelValue":t[1]||(t[1]=n=>s.password=n),type:"text"},null,512),[[h,s.password]])]),nt,a("div",at,[it,a("button",{onClick:t[2]||(t[2]=(...n)=>o.hasAccount&&o.hasAccount(...n))},"Register")])],32)}var lt=u(Xe,[["render",ct],["__scopeId","data-v-5e209e2c"]]);const dt={name:"Register",data(){return{email:"",password:"",repeatPassword:"",username:"",firstName:"",lastName:"",extraToggle:!1,errorMsg:""}},methods:{async onSubmit(e){this.errorMsg="",this.email.trim()!==""&&this.password.trim()!==""&&this.repeatPassword.trim()!==""?this.password.trim()===this.repeatPassword.trim()?await this.createUser(e):this.errorMsg="Passwords don't match":this.errorMsg="Email and Password are required!"},async createUser(e){const{email:t,password:r,username:i,firstName:s,lastName:o}=Object.fromEntries(new FormData(e.target)),n={username:i,password:r,firstName:s,lastName:o,email:t},d=await L.registerUser(n);d.status===201?(this.email="",this.password="",this.repeatPassword="",this.username="",this.firstName="",this.lastName="",this.errorMsg=""):d.status===422?this.errorMsg="Email already in use":this.errorMsg="Something went wrong, try again later"},hasAccount(){this.$emit("toggle-form",!0)}}},$=e=>(T("data-v-9807cb52"),e=e(),N(),e),ut=$(()=>a("h1",null,"Register",-1)),_t={key:0,class:"error"},mt={class:"input"},pt=$(()=>a("label",{for:"email"},"email",-1)),gt=$(()=>a("label",{class:"extra-details",for:"extraToggle"},"Extra details...",-1)),vt={class:"extra"},ft={class:"input"},ht=$(()=>a("label",{for:"username"},"username",-1)),yt={class:"input"},$t=$(()=>a("label",{for:"firstName"},"first",-1)),wt={class:"input"},Pt=$(()=>a("label",{for:"lastName"},"last",-1)),bt={class:"input"},xt=$(()=>a("label",{for:"password"},"password",-1)),kt={class:"input"},At=$(()=>a("label",{for:"repeatPassword"},"repeat password",-1)),It=$(()=>a("input",{type:"submit",value:"register"},null,-1)),St={class:"toggle"},Lt=$(()=>a("p",null,"Have an account?",-1));function Tt(e,t,r,i,s,o){return c(),l("form",{onSubmit:t[8]||(t[8]=J((...n)=>o.onSubmit&&o.onSubmit(...n),["prevent"]))},[ut,s.errorMsg.length>0?(c(),l("span",_t,I(s.errorMsg),1)):g("",!0),a("div",mt,[pt,v(a("input",{id:"email",name:"email","onUpdate:modelValue":t[0]||(t[0]=n=>s.email=n),type:"text"},null,512),[[h,s.email]])]),v(a("input",{id:"extraToggle",name:"extraToggle","onUpdate:modelValue":t[1]||(t[1]=n=>s.extraToggle=n),type:"checkbox"},null,512),[[ae,s.extraToggle]]),gt,a("div",vt,[a("div",ft,[ht,v(a("input",{id:"username",name:"username","onUpdate:modelValue":t[2]||(t[2]=n=>s.username=n),type:"text"},null,512),[[h,s.username]])]),a("div",yt,[$t,v(a("input",{id:"firstName",name:"firstName","onUpdate:modelValue":t[3]||(t[3]=n=>s.firstName=n),type:"text"},null,512),[[h,s.firstName]])]),a("div",wt,[Pt,v(a("input",{id:"lastName",name:"lastName","onUpdate:modelValue":t[4]||(t[4]=n=>s.lastName=n),type:"text"},null,512),[[h,s.lastName]])])]),a("div",bt,[xt,v(a("input",{id:"password",name:"password","onUpdate:modelValue":t[5]||(t[5]=n=>s.password=n),type:"text"},null,512),[[h,s.password]])]),a("div",kt,[At,v(a("input",{id:"repeatPassword",name:"repeatPassword","onUpdate:modelValue":t[6]||(t[6]=n=>s.repeatPassword=n),type:"text"},null,512),[[h,s.repeatPassword]])]),It,a("div",St,[Lt,a("button",{onClick:t[7]||(t[7]=(...n)=>o.hasAccount&&o.hasAccount(...n))},"Login")])],32)}var Nt=u(dt,[["render",Tt],["__scopeId","data-v-9807cb52"]]);const Ut={name:"Home",components:{PostComponent:Qe,Login:lt,Register:Nt},data(){return{isLoggedIn:!1,hasAccount:!1,users:[]}},async created(){const{getIsLoggedIn:e}=C();this.isLoggedIn=e()},methods:{toggleForm(e){this.hasAccount=e}}};function Ft(e,t,r,i,s,o){const n=_("PostComponent"),d=_("Login"),m=_("Register");return c(),l(B,null,[s.isLoggedIn===!0?(c(),w(n,{key:0})):g("",!0),s.hasAccount===!0&&s.isLoggedIn===!1?(c(),w(d,{key:1,onToggleForm:o.toggleForm},null,8,["onToggleForm"])):g("",!0),s.hasAccount===!1&&s.isLoggedIn===!1?(c(),w(m,{key:2,onToggleForm:o.toggleForm},null,8,["onToggleForm"])):g("",!0)],64)}var Mt=u(Ut,[["render",Ft]]),Ct="/assets/mongodb.e2bfe7d8.png",Rt="/assets/mongoose.e352560f.png",Vt="/assets/expressjs.40799037.svg",Dt="/assets/vue.77ba2af1.svg",Et="/assets/vite.17e50649.svg",Ot="/assets/node.a2054365.svg";const jt={name:"About"},Bt={class:"container"},qt=ie('<h1 data-v-0e84b287>About the project</h1><dl data-v-0e84b287><dt data-v-0e84b287><span class="mongo" data-v-0e84b287>M</span><span class="express" data-v-0e84b287>E</span><span class="vue" data-v-0e84b287>V</span><span class="node" data-v-0e84b287>N</span> Stack</dt><dd class="mongo" data-v-0e84b287><img alt="mongo" src="'+Ct+'" data-v-0e84b287>Mongo DB<span class="mongoose" data-v-0e84b287>+ Mongoose<img alt="mongoose" src="'+Rt+'" data-v-0e84b287></span></dd><dd class="express" data-v-0e84b287><img alt="express" src="'+Vt+'" data-v-0e84b287>Express.js</dd><dd class="vue" data-v-0e84b287><img alt="vue" src="'+Dt+'" data-v-0e84b287>Vue + Vite<img alt="vite" src="'+Et+'" data-v-0e84b287></dd><dd class="node" data-v-0e84b287><img alt="node" src="'+Ot+'" data-v-0e84b287>Node</dd></dl>',2),Ht=[qt];function zt(e,t,r,i,s,o){return c(),l("div",Bt,Ht)}var Jt=u(jt,[["render",zt],["__scopeId","data-v-0e84b287"]]);const Wt={name:"ProfileHeader",props:{username:String,img:String,imgAlt:String,backgroundImage:String},computed:{cssProps(){return{"--bgImg":"url("+this.backgroundImage+")"}}}},Kt={class:"hero"},Yt={class:"user"},Gt=["src","alt"];function Qt(e,t,r,i,s,o){return c(),l("div",{style:ce(o.cssProps)},[a("div",Kt,[a("div",Yt,[a("img",{src:r.img,alt:r.imgAlt},null,8,Gt),a("h1",null,I(r.username),1)])])],4)}var Xt=u(Wt,[["render",Qt],["__scopeId","data-v-0bd26600"]]);const Zt={name:"ProfileNav",data(){return{active:"overview"}},created(){this.$emit("active",this.active)},methods:{selected(e){this.active=e,this.$emit("active",e)}}},es={class:"profile-nav"};function ts(e,t,r,i,s,o){return c(),l("div",es,[a("button",{onClick:t[0]||(t[0]=n=>o.selected("overview")),class:k(s.active==="overview"?"active":"")},"Overview",2),a("button",{onClick:t[1]||(t[1]=n=>o.selected("animelist")),class:k(s.active==="animelist"?"active":"")},"AnimeList",2),a("button",{onClick:t[2]||(t[2]=n=>o.selected("favorites")),class:k(s.active==="favorites"?"active":"")},"Favorites",2),a("button",{onClick:t[3]||(t[3]=n=>o.selected("stats")),class:k(s.active==="stats"?"active":"")},"Stats",2),a("button",{onClick:t[4]||(t[4]=n=>o.selected("socials")),class:k(s.active==="socials"?"active":"")},"Socials",2),a("button",{onClick:t[5]||(t[5]=n=>o.selected("reviews")),class:k(s.active==="reviews"?"active":"")},"Reviews",2)])}var ss=u(Zt,[["render",ts],["__scopeId","data-v-4f775fac"]]);const os={name:"ProfileOverview",data(){return{color:""}},methods:{colorChange(e){const t=this.HexToHSL(e.target.value);document.documentElement.style.setProperty("--clr-primary-h",`${t.hue}deg`),document.documentElement.style.setProperty("--clr-primary-s",`${t.saturation}%`),console.log(t.hue)},HexToHSL(e){let t=0,r=0,i=0;e.length==4?(t=`0x${e[1]}${e[1]}`,r=`0x${e[2]}${e[2]}`,i=`0x${e[3]}${e[3]}`):e.length==7&&(t=`0x${e[1]}${e[2]}`,r=`0x${e[3]}${e[4]}`,i=`0x${e[5]}${e[6]}`),t/=255,r/=255,i/=255;let s=Math.min(t,r,i),o=Math.max(t,r,i),n=o-s,d=0,m=0,p=0;return n==0?d=0:o==t?d=(r-i)/n%6:o==r?d=(i-t)/n+2:d=(t-r)/n+4,d=Math.round(d*60),d<0&&(d+=360),p=(o+s)/2,m=n==0?0:n/(1-Math.abs(2*p-1)),m=+(m*100).toFixed(1),p=+(p*100).toFixed(1),{hue:d,saturation:m,lightness:p}}}},rs=M(" Overview ");function ns(e,t,r,i,s,o){return c(),l("div",null,[rs,v(a("input",{type:"color","onUpdate:modelValue":t[0]||(t[0]=n=>s.color=n),onInput:t[1]||(t[1]=(...n)=>o.colorChange&&o.colorChange(...n)),name:"colorPicker",id:"colorPicker"},null,544),[[h,s.color]])])}var as=u(os,[["render",ns]]);const is={name:"ProfileAnimeList"};function cs(e,t,r,i,s,o){return c(),l("div",null," Anime List ")}var ls=u(is,[["render",cs]]);const ds={name:"ProfileFavorites"};function us(e,t,r,i,s,o){return c(),l("div",null," Favorites ")}var _s=u(ds,[["render",us]]);const ms={name:"ProfileStats"};function ps(e,t,r,i,s,o){return c(),l("div",null," Stats ")}var gs=u(ms,[["render",ps]]);const vs={name:"ProfileSocials"};function fs(e,t,r,i,s,o){return c(),l("div",null," Socials ")}var hs=u(vs,[["render",fs]]);const ys={name:"ProfileReviews"};function $s(e,t,r,i,s,o){return c(),l("div",null," Reviews ")}var ws=u(ys,[["render",$s]]);const Ps={name:"Profile",components:{ProfileReviews:ws,ProfileSocials:hs,ProfileStats:gs,ProfileFavorites:_s,ProfileAnimeList:ls,ProfileOverview:as,ProfileHeader:Xt,ProfileNav:ss},props:{username:String},data(){return{user:{},email:"",name:"",first:"",last:"",img:"",imgAlt:"",bgImg:"",section:""}},async created(){if(this.$watch(async()=>this.$route.params,async e=>{const{username:t}=await e;if(t){const{data:r}=await L.getUserByUsername(t);await this.updateProfile(r)}}),this.username){const{data:e}=await L.getUserByUsername(this.username);await this.updateProfile(e)}},methods:{activeSection(e){this.section=e},async updateProfile(e){var t,r,i,s;this.email=e==null?void 0:e.email,this.name=(e==null?void 0:e.userName)===""?e==null?void 0:e.email:(t=e==null?void 0:e.userName)!=null?t:"Not Found",this.first=e==null?void 0:e.firstName,this.last=e==null?void 0:e.lastName,this.img=(r=e==null?void 0:e.img)!=null?r:`https://picsum.photos/seed/${this.name}/260/280`,this.imgAlt=(i=e==null?void 0:e.imgAlt)!=null?i:"profile image",this.bgImg=(s=e==null?void 0:e.bgImg)!=null?s:"https://picsum.photos/2000/400"}}},bs={class:"content"};function xs(e,t,r,i,s,o){const n=_("ProfileHeader"),d=_("ProfileNav"),m=_("ProfileOverview"),p=_("ProfileAnimeList"),K=_("ProfileFavorites"),Y=_("ProfileStats"),G=_("ProfileSocials"),Q=_("ProfileReviews");return c(),l("section",null,[a("header",null,[P(n,{username:s.name,img:s.img,"img-alt":s.imgAlt,"background-image":s.bgImg},null,8,["username","img","img-alt","background-image"]),P(d,{onActive:o.activeSection},null,8,["onActive"]),a("div",bs,[s.section==="overview"?(c(),w(m,{key:0})):g("",!0),s.section==="animelist"?(c(),w(p,{key:1})):g("",!0),s.section==="favorites"?(c(),w(K,{key:2})):g("",!0),s.section==="stats"?(c(),w(Y,{key:3})):g("",!0),s.section==="socials"?(c(),w(G,{key:4})):g("",!0),s.section==="reviews"?(c(),w(Q,{key:5})):g("",!0)])])])}var ks=u(Ps,[["render",xs],["__scopeId","data-v-3311a43c"]]);const As=[{path:"/",name:"Home",component:Mt},{path:"/about",name:"About",component:Jt},{path:"/profile/:username",name:"Profile",component:ks,props:!0}],Is=le({history:de("/"),routes:As,linkExactActiveClass:"active"});ue(De).use(Is).mount("#app");