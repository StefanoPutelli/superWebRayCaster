(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{5557:function(t,e,i){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return i(5420)}])},8737:function(t,e,i){"use strict";i.r(e),i.d(e,{default:function(){return r}});var s=i(5893),n=i(7294),o={src:"/_next/static/media/Red_Arrow.64a63167.png",height:600,width:600,blurDataURL:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAMAAADz0U65AAAAYFBMVEX+AAD9AAD+AAD9AAD+AAD+AAD9AAD+AAD+AAD+AAD9AAD+AAD9AAD+AAD9AAD+AAD+AAD+AAD9AAD9AAD+AAD+AAD+AAD+AAD+AAD+AAD9AAD+AAD9AAD+AAD+AAD9AAA6DdQGAAAAHnRSTlMAAAICAwQEBURFR1BSVlZvcHZ3oaO7vMHDy83e3/ieW/MdAAAAQElEQVR42g3GRwKAIBAEwV5EFHPODv//pdapgNxBO+OdETf1mFWH0h1oLunVaNTnnzQBFnelp8BnUK4agOCgWz51zgNXSGDkxwAAAABJRU5ErkJggg==",blurWidth:8,blurHeight:8};function r(t){return(0,n.useEffect)(()=>(document.addEventListener("contextmenu",t=>{t.preventDefault()}),()=>{document.removeEventListener("contextmenu",t=>{t.preventDefault()})})),(0,s.jsxs)("div",{style:{position:"absolute",left:"2vw",bottom:"2vw"},children:[(0,s.jsx)("img",{src:o.src,alt:"joystick",style:{display:"block",height:"10vh",transform:"rotate(90deg)"},onTouchStart:e=>{e.preventDefault(),t.key_pressed.current.w=!0},onTouchEnd:()=>{t.key_pressed.current.w=!1}}),(0,s.jsx)("img",{src:o.src,alt:"joystick",style:{display:"block",height:"10vh",transform:"rotate(-90deg)"},onTouchStart:e=>{e.preventDefault(),t.key_pressed.current.s=!0},onTouchEnd:()=>{t.key_pressed.current.s=!1}})]})}},5420:function(t,e,i){"use strict";i.r(e),i.d(e,{default:function(){return w}});var s=i(5893),n=i(6465),o=i.n(n),r=i(9008),c=i.n(r);class h{constructor(t,e){this.direction=0,this.position={x:0,y:0},this.position.x=t.x,this.position.y=t.y,this.direction=e}}var a=i(7294),l=i(8737),d=i(7676);let u={FOV:60,initial_direction:0,dimensions:{width:660,height:600},tile_size:1,max_fps:30,player_speed:.1},p=new class{setDimensions(){let t=0,e=0;return this.map2D.forEach((i,s)=>{i.length>t&&(t=i.length),s>e&&(e=s)}),{maxRowLenght:t,maxColLenght:e+=1}}printMap(){this.map2D.forEach(t=>{console.log(t.join(""))})}getMap(){return this.map2D}getDimensions(){return{height:this.height,width:this.width}}constructor(t){this.map2D=[],this.height=0,this.width=0;let e=t.split("\n").map(t=>t.split("")),i=0;for(let t=0;t<e.length;t++){let s=[];for(let n=0;n<e[t].length;n++)s.push({value:e[t][n],block_id:i++});this.map2D.push(s)}let s=this.setDimensions();this.height=s.maxColLenght,this.width=s.maxRowLenght}}("###############################\n#  #           #  #     #     #\n#  ####  ####  #  #  ####  ####\n#           #  #     #        #\n#  #############  #  ####  ####\n#  #     #  #  #  #        #  #\n#  #  ####  #  ####  ####  #  #\n#     #  #  #     ####  #     #\n#        #  ####        #  ####\n#  #     #                 #  #\n#  ##########  ####  #  ####  #\n#           #  #  #  #        #\n#           ####  #  #  ####  #\n#  #        #  #     #  #     #\n#  #                 ####  #  #\n#  #              #     #  #  #\n#  #     #######  #######  ####\n#  ####  #  #  #        #     #\n####     #        #######  #  #\n#        #        #        #  #\n###############################"),m=new class extends h{getDecimals(t){return t%1}setID(t){this.id=t,console.log("userID setted: "+this.id)}setDimensions(t,e,i){this.dimension.width=parseInt(t/i)*i,this.dimension.height=e,this.RESOLUTION=parseInt(this.dimension.width/this.FOV)}getPlayerPosition(){return this.position}findPlayer(){let t={x:0,y:0};return this.map2D.map2D.forEach((e,i)=>{e.forEach((e,s)=>{"P"===e&&(t.x=s,t.y=i)})}),t}getDirVars(t,e,i){return t<90?{x:this.tile_size-this.getDecimals(e),y:this.getDecimals(i)}:t<180?{x:this.getDecimals(e),y:this.getDecimals(i)}:t<270?{x:this.getDecimals(e),y:this.tile_size-this.getDecimals(i)}:{x:this.tile_size-this.getDecimals(e),y:this.tile_size-this.getDecimals(i)}}turn(t){if(t>0)this.direction=this.direction+t>=360?this.direction=0+this.direction+t-360:this.direction+t;else{if(!(t<0))return;this.direction=this.direction+t<0?this.direction=360+this.direction+t:this.direction+t}}move(t,e){let i=0,s=0;if(t.w&&(s+=-e*Math.sin(3.141592653589793*this.direction/180),i+=e*Math.cos(3.141592653589793*this.direction/180)),t.s&&(s+=e*Math.sin(3.141592653589793*this.direction/180),i+=-e*Math.cos(3.141592653589793*this.direction/180)),t.a&&(s+=-e*Math.cos(3.141592653589793*this.direction/180),i+=-e*Math.sin(3.141592653589793*this.direction/180)),t.d&&(s+=e*Math.cos(3.141592653589793*this.direction/180),i+=e*Math.sin(3.141592653589793*this.direction/180)),0!==i||0!==s){let t=this.position.x+i<0||this.position.x+i>=this.map_width,e=this.position.y+s<0||this.position.y+s>=this.map_height;t||e||"#"!==this.map2D.map2D[parseInt(this.position.y+s)][parseInt(this.position.x+i)].value||("#"===this.map2D.map2D[parseInt(this.position.y)][parseInt(this.position.x+i)].value&&(i=0),"#"!==this.map2D.map2D[parseInt(this.position.y+s)][parseInt(this.position.x)].value||(s=0)),this.position.x+=i,this.position.y+=s}}rayCastInTheFov(){let t=parseInt(this.direction-this.FOV/2),e=parseInt(this.direction+this.FOV/2),i=[];for(let s=e-1;s>=t;s--)for(let e=0;e<this.RESOLUTION;e++){let n=s%360-e/this.RESOLUTION,o=n<0?n+360:n,r=this.getDirVars(o,this.position.x,this.position.y),c=3.141592653589793*o/180,h=Math.sin(c),a=Math.cos(c),l=h>0?1:-1,d=a>0?1:-1,u=0,p=0,m=0,A=0;for(;;){A=0===o||180===o?2147483647:(r.y+p*this.tile_size)/Math.abs(h),m=90===o||270===o?2147483647:(r.x+u*this.tile_size)/Math.abs(a);let n=Math.cos((((s-t)*this.RESOLUTION-e)/this.RESOLUTION-this.FOV/2)*3.141592653589793/180);if(m<A){let t=parseInt(this.position.x+(m*a+this.tile_size/2*d)),e=parseInt(this.position.y-m*h);if(u+=1,e<0||e>this.map_height||t<0||t>this.map_width){i.push({distance:Math.abs(m*n),block_id:null,block_face:null});break}if("#"===this.map2D.map2D[e][t].value){i.push({distance:Math.abs(m*n),block_id:this.map2D.map2D[e][t].block_id,block_face:1===d?"W":"E"});break}}else{let t=parseInt(this.position.x+A*a),e=parseInt(this.position.y-(A*h+this.tile_size/2*l));if(p+=1,e<0||e>=this.map_height||t<0||t>=this.map_width){i.push({distance:Math.abs(A*n),block_id:null,block_face:null});break}if("#"===this.map2D.map2D[e][t].value){i.push({distance:Math.abs(A*n),block_id:this.map2D.map2D[e][t].block_id,block_face:1===l?"N":"S"});break}}}}return i}constructor(t,e,i,s){super({x:i.x,y:i.y},s),this.FOV=0,this.RESOLUTION=0,this.dimension={width:0,height:0},this.map2D=null,this.tile_size=0,this.map_height=0,this.map_width=0,this.id=null,this.FOV=t.FOV,this.direction=t.initial_direction,this.dimension.height=t.dimensions.height,this.dimension.width=parseInt(t.dimensions.width/t.FOV)*t.FOV,this.RESOLUTION=parseInt(this.dimension.width/this.FOV),this.map2D=e,this.tile_size=t.tile_size;let n=this.map2D.getDimensions();this.map_height=n.height,this.map_width=n.width,console.log("RayCaster constructor"),console.log("direction "+this.direction),console.log("position x "+this.position.x+" y "+this.position.y),console.log("FOV "+this.FOV),console.log("dimension height "+this.dimension.height+" width "+this.dimension.width),console.log("RESOLUTION "+this.RESOLUTION),console.log("tile_size "+this.tile_size),console.log("----------------------")}}(u,p,{x:2,y:2},0),A={},g=new class{drawScreen(t,e,i,s){let n=e.height/2;e.width=e.width;let o=(e.width-parseInt(e.width/s)*s)/2,r=i[0].block_id,c=i[0].block_face,h=0;for(let e=0;e<i.length-1;e++)(i[e+1].block_id!==r||i[e+1].block_face!==c||e+1===i.length-1)&&(t.beginPath(),t.moveTo(h+o,n+n/i[h].distance),t.lineTo(e+o,n+n/i[e].distance),t.lineTo(e+o,n-n/i[e].distance),t.lineTo(h+o,n-n/i[h].distance),t.closePath(),t.fillStyle=null===r?"rgba(0,0,0,0)":r.color,t.fill(),h=e+1,r=i[e+1].block_id,c=i[e+1].block_face)}drawMap(t,e,i,s,n,o,r){let c=i[0].length,h=i.length,a=.3*e.height/c;t.fillStyle="rgba(0,0,0,0)",t.fillRect(0,0,c*a,h*a);for(let e=0;e<h;e++)for(let s=0;s<c;s++)"#"===i[e][s].value?(t.fillStyle="rgba(255, 0, 0, 1)",t.fillRect(s*a,e*a,a,a)):"X"===i[e][s].value?(t.fillStyle="rgba(0, 0, 255, 1)",t.fillRect(s*a,e*a,a,a)):"Y"===i[e][s].value&&(t.fillStyle="rgba(0, 255, 255, 1)",t.fillRect(s*a,e*a,a,a));if(t.beginPath(),t.fillStyle="rgba(0, 255, 0, 1)",t.arc(s*a,n*a,a/2,0,2*Math.PI),t.fill(),null===o)return;let l=Object.keys(r);for(let e=0;e<l.length;e++){if(l[e]===o)continue;let i=r[l[e]].x,s=r[l[e]].y;t.beginPath(),t.fillStyle="rgba(0, 255, 255, 1)",t.arc(i*a,s*a,a/2,0,2*Math.PI),t.fill()}}};function f(t){let e=JSON.parse(t.data);if("userdisconnected"===e.type){delete A[e.userID];return}"playerupdate"===e.type?A[e.userID]=e.data:"userconnected"===e.type?console.log(e.data.username+" connected"):"selfconnected"===e.type&&m.setID(e.userID)}function w(){let{sendJsonMessage:t,readyState:e}=(0,d.ZP)("wss://stepo.cloud/ws",{onOpen:()=>console.log("connected"),onMessage:f,share:!0,filter:()=>!1,retryOnError:!0,shouldReconnect:()=>!0}),i=(0,a.useRef)(null),n=(0,a.useRef)(null),r=(0,a.useRef)({}),h=(0,a.useRef)(0),w=(0,a.useRef)(0);function D(t,e,s){i.current.width=e,i.current.height=t,n.current.imageSmoothingEnabled=!1,m.setDimensions(i.current.width,i.current.height,s)}return(0,a.useEffect)(()=>{async function e(){i.current.requestPointerLock=i.current.requestPointerLock||i.current.mozRequestPointerLock||i.current.webkitRequestPointerLock,i.current.requestPointerLock()}function s(){i.current=document.getElementById("canvas"),n.current=i.current.getContext("2d"),D(window.innerHeight,window.innerWidth,u.FOV),i.current.addEventListener("click",e),t({type:"userconnected",username:"guest"})}if("complete"!==document.readyState)return window.addEventListener("load",s),()=>document.removeEventListener("load",s);s()}),(0,a.useEffect)(()=>{window.addEventListener("resize",()=>{n.current&&i.current&&D(window.innerHeight,window.innerWidth,u.FOV)})}),(0,a.useEffect)(()=>{let t=t=>{n.current&&i.current&&(h.current+=-.1*t.movementX)},e=t=>{n.current&&i.current&&(r.current[t.key]=!0)},s=t=>{n.current&&i.current&&delete r.current[t.key]},o=t=>{t.preventDefault()},c=t=>{w.current=t.touches[0].clientX},a=t=>{h.current+=(t.touches[0].clientX-w.current)*.1,w.current=t.touches[0].clientX};return window.addEventListener("mousemove",t),window.addEventListener("keydown",e),window.addEventListener("keyup",s),window.addEventListener("scroll",o),window.addEventListener("touchstart",c),window.addEventListener("touchmove",a),()=>{window.removeEventListener("keyup",s),window.removeEventListener("mousemove",t),window.removeEventListener("keydown",e),window.removeEventListener("scroll",o),window.removeEventListener("touchstart",c),window.removeEventListener("touchmove",a)}}),(0,a.useEffect)(()=>{setInterval(()=>{t({type:"playerupdate",data:{username:"guest",x:m.position.x,y:m.position.y}})},20)}),(0,a.useEffect)(()=>{setInterval(()=>{if(!n.current||!i.current)return;let t=m.rayCastInTheFov();m.move(r.current,u.player_speed),m.turn(h.current),h.current=0,g.drawScreen(n.current,i.current,t,u.FOV),g.drawMap(n.current,i.current,p.map2D,m.position.x,m.position.y,m.id,A)},20)}),(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(c(),{children:[(0,s.jsx)("title",{className:"jsx-b26c0c98a18bc563",children:"Create Next App"}),(0,s.jsx)("link",{rel:"icon",href:"/favicon.ico",className:"jsx-b26c0c98a18bc563"}),(0,s.jsx)("meta",{name:"viewport",content:"width=device-width; initial-scale=1; maximum-scale=1; user-scalable=0;",className:"jsx-b26c0c98a18bc563"})]}),(0,s.jsx)("canvas",{id:"canvas",style:{height:"100svh",width:"100vw",position:"absolute",top:"0",left:"0",zIndex:"-1"},className:"jsx-b26c0c98a18bc563"}),(0,s.jsx)(l.default,{key_pressed:r}),(0,s.jsxs)("div",{style:{position:"absolute",right:"0",top:"0",color:"black"},className:"jsx-b26c0c98a18bc563",children:[(0,s.jsx)("p",{className:"jsx-b26c0c98a18bc563",children:"WASD to move"}),(0,s.jsx)("p",{className:"jsx-b26c0c98a18bc563",children:"Mouse to turn"}),(0,s.jsx)("p",{className:"jsx-b26c0c98a18bc563",children:"Click to lock mouse"})]}),(0,s.jsx)(o(),{id:"b26c0c98a18bc563",children:"body{-ms-scroll-chaining:none;overscroll-behavior:contain}"})]})}}},function(t){t.O(0,[774,920,888,179],function(){return t(t.s=5557)}),_N_E=t.O()}]);