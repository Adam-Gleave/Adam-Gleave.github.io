(this.webpackJsonpportfolio=this.webpackJsonpportfolio||[]).push([[0],{31:function(e,t,n){e.exports=n(43)},35:function(e,t,n){},37:function(e,t,n){},43:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(13),o=n.n(c),i=(n(35),n(5)),l=n(3),s=n(21),m=n(24),u=n(26),d=(n(37),Object(u.makeNoise2D)(Date.now()));function f(){return Object(s.c)().scene.fog=new l.Fog(1447455,10,100),r.a.createElement(r.a.Fragment,null,r.a.createElement("ambientLight",{intensity:.25}),r.a.createElement("spotLight",{position:[0,128,32],intensity:.75,castShadow:!0}),r.a.createElement(g,null))}function g(){var e=Object(a.useRef)();Object(a.useEffect)((function(){if(e.current){var t=new l.WireframeGeometry(e.current.geometry),n=new l.LineBasicMaterial({color:1447455}),a=new l.LineSegments(t,n);e.current.add(a),e.current.position.y-=10}})),Object(s.b)((function(){e.current}));var t=new l.PlaneGeometry(256,256,255,255);return t.rotateX(-89),t.vertices=t.vertices.map((function(e){return e.setY(function(e,t){var n=32,a=d(e*n,t*n);return a+=.5*d((e+=32)*(n*=2),t*n),a+=.35*d((e+=42)*(n*=2),t*n),a+=.25*d((e+=9973)*(n*=2),t*n),2.5*(a+=.065*d((e+=824)*(n*=2),t*n))}(e.x/256,e.z/256))})),r.a.createElement(r.a.Fragment,null,r.a.createElement("mesh",{geometry:t,ref:e},r.a.createElement("meshPhongMaterial",{attach:"material",color:new l.Color(2960699)})))}var h=function(e,t,n,a){return[-(t-a)/20,(e-n)/20,1.05]},p=function(e,t,n){return"perspective(1200px) rotateX(".concat(e,"deg) rotateY(").concat(t,"deg) scale(").concat(n,")")};function v(e,t){return{headerText:e,style:{backgroundImage:"url(".concat(t,")")}}}function E(e){var t=Object(m.b)((function(){return{xys:[0,0,1],config:{mass:5,tension:350,friction:40}}})),n=Object(i.a)(t,2),a=n[0],c=n[1];return r.a.createElement(m.a.div,{className:"card",style:{display:"absolute",transform:a.xys.interpolate(p)},onMouseMove:function(e){var t=e.clientX,n=e.clientY;return c({xys:h(t,n,.2*window.innerWidth,.6*window.innerHeight)})},onMouseLeave:function(){return c({xys:[0,0,1]})}},r.a.createElement("div",{className:"card-header"},e.headerText,r.a.createElement("hr",{className:"card-header-line"}),r.a.createElement("div",{className:"card-content",style:e.style})))}var w=function(){return r.a.createElement("div",{className:"main"},r.a.createElement("div",{className:"header"},"Adam Gleave"),r.a.createElement(s.a,null,r.a.createElement(f,null)),r.a.createElement("div",{className:"grid-container"},r.a.createElement("div",{className:"grid"},r.a.createElement(E,v("OpenMW","https://i.ytimg.com/vi/izlm2CAnCpY/maxresdefault.jpg")),r.a.createElement(E,v("OpenCK","https://imgur.com/Zfh3eDn.png")),r.a.createElement(E,v("Rustbucket","https://i.imgur.com/xCYk9h7.png")),r.a.createElement(E,v("Voxels","https://imgur.com/ucOoqnc.png")))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(w,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[31,1,2]]]);
//# sourceMappingURL=main.fec74dc4.chunk.js.map