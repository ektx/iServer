(function(e){function t(t){for(var r,a,c=t[0],s=t[1],l=t[2],u=0,f=[];u<c.length;u++)a=c[u],i[a]&&f.push(i[a][0]),i[a]=0;for(r in s)Object.prototype.hasOwnProperty.call(s,r)&&(e[r]=s[r]);h&&h(t);while(f.length)f.shift()();return o.push.apply(o,l||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],r=!0,a=1;a<n.length;a++){var s=n[a];0!==i[s]&&(r=!1)}r&&(o.splice(t--,1),e=c(c.s=n[0]))}return e}var r={},i={app:0},o=[];function a(e){return c.p+"contents/js/"+({highlight:"highlight",marked:"marked"}[e]||e)+"."+{highlight:"ac4e1f6e",marked:"21d960dd"}[e]+".js"}function c(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,c),n.l=!0,n.exports}c.e=function(e){var t=[],n=i[e];if(0!==n)if(n)t.push(n[2]);else{var r=new Promise(function(t,r){n=i[e]=[t,r]});t.push(n[2]=r);var o,s=document.getElementsByTagName("head")[0],l=document.createElement("script");l.charset="utf-8",l.timeout=120,c.nc&&l.setAttribute("nonce",c.nc),l.src=a(e),o=function(t){l.onerror=l.onload=null,clearTimeout(u);var n=i[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src,a=new Error("Loading chunk "+e+" failed.\n("+r+": "+o+")");a.type=r,a.request=o,n[1](a)}i[e]=void 0}};var u=setTimeout(function(){o({type:"timeout",target:l})},12e4);l.onerror=l.onload=o,s.appendChild(l)}return Promise.all(t)},c.m=e,c.c=r,c.d=function(e,t,n){c.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},c.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.t=function(e,t){if(1&t&&(e=c(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(c.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)c.d(n,r,function(t){return e[t]}.bind(null,r));return n},c.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return c.d(t,"a",t),t},c.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},c.p="/@/",c.oe=function(e){throw console.error(e),e};var s=window["webpackJsonp"]=window["webpackJsonp"]||[],l=s.push.bind(s);s.push=t,s=s.slice();for(var u=0;u<s.length;u++)t(s[u]);var h=l;o.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"099b":function(e,t,n){"use strict";var r=n("479e"),i=n.n(r);i.a},"2a03":function(e,t,n){"use strict";var r=n("90c2"),i=n.n(r);i.a},"3f88":function(e,t,n){},"479e":function(e,t,n){},"56d7":function(e,t,n){"use strict";n.r(t);n("cadf"),n("551c"),n("097d");var r=n("2b0e"),i=n("bc3a"),o=n.n(i);o.a.interceptors.request.use(function(e){return e},function(e){return Promise.reject(e)}),o.a.interceptors.response.use(function(e){return e.data},function(e){return e.response,Promise.reject(e)});var a=o.a,c=n("a5f2"),s=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},l=[],u={name:"app"},h=u,f=(n("2a03"),n("2877")),d=Object(f["a"])(h,s,l,!1,null,"56a9c75a",null);d.options.__file="App.vue";var p=d.exports,m=n("8c4f"),v=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("section",{staticClass:"main-app"},[n("div",{staticClass:"file-list-box"},[n("header",[n("h1",[n("span",[e._v(e._s(e.title))])]),n("VBreadcrumb",{ref:"vbreadcrumb",on:{sendBreadCrumbEvt:e.emitBreadCrumbEvt}})],1),n("main",[n("List"),n("Article")],1),n("Footer")],1)])},g=[],b=n("c93e"),w=n("b6e5"),x=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("aside",[n("ul",{staticClass:"file-list",on:{scroll:function(t){e.listScroll(t)}}},e._l(e.files,function(t,r){return n("li",{key:t.file,class:t.classes},[t.isDir?t.isDir?n("svg",{attrs:{"aria-hidden":"true",version:"1.1",viewBox:"0 0 14 16"}},[n("path",{attrs:{d:"M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM6 4H1V3h5v1z"}})]):e._e():n("svg",{attrs:{"aria-hidden":"true",version:"1.1",viewBox:"0 0 12 16"}},[n("path",{attrs:{d:"M6 5H2V4h4v1zM2 8h7V7H2v1zm0 2h7V9H2v1zm0 2h7v-1H2v1zm10-7.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v12h10V5z"}})]),n("div",{on:{click:function(n){e.goFilePath(r,t,n)},contextmenu:function(n){n.preventDefault(),e.rightMenu(t,n)}}},[e._v(e._s(t.file))])])})),n("OverLayer",{ref:"overlayermod"})],1)},y=[],O=(n("a481"),n("aef6"),function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("transition",{attrs:{name:"show-layer"}},[n("div",{directives:[{name:"show",rawName:"v-show",value:e.show,expression:"show"}],staticClass:"over-layer",on:{click:function(t){if(t.target!==t.currentTarget)return null;e.show=!e.show}}},[n("transition",{attrs:{name:"show-qrcode"}},[n("section",{directives:[{name:"show",rawName:"v-show",value:e.show,expression:"show"}],staticClass:"ask-link-qrcode-mod"},[n("div",{attrs:{id:"ask-link-qrcode-box"}},[n("img",{attrs:{src:e.QRBox.img}})]),n("input",{attrs:{type:"text",readonly:""},domProps:{value:e.QRBox.text}})])])],1)])}),j=[],_=n("d055"),k=n.n(_),C={name:"overlayer",data:function(){return{show:!1,QRBox:{img:null,text:""}}},methods:{generateQRCode:function(e,t){var n=this;this.show=e,this.QRBox.text=t,k.a.toDataURL(t,{width:180*window.devicePixelRatio,margin:0}).then(function(e){n.QRBox.img=e}).catch(function(e){console.error(e)})}}},F=C,S=(n("099b"),Object(f["a"])(F,O,j,!1,null,"2921b41b",null));S.options.__file="index.vue";var T=S.exports,B=n("2f62"),R={name:"list-mod",components:{OverLayer:T},data:function(){return{scrollObj:{}}},computed:Object(b["a"])({},Object(B["d"])("home",["files","currentFile","isServer"])),mounted:function(){localStorage.scrollObj&&(this.scrollObj=JSON.parse(localStorage.scrollObj))},updated:function(){var e=this;if(location.href in this.scrollObj){var t=this.scrollObj[location.href];this.$nextTick(function(){e.$el.querySelector(".file-list").scrollTop=t})}},methods:Object(b["a"])({},Object(B["b"])("home",["getFileList","askServerOpenDir"]),Object(B["c"])("home",["setCurrentFile"]),{goFilePath:function(e,t,n){this.currentFile&&t.file===this.currentFile.file&&this.setCurrentFile({}),this.setCurrentFile(t),t.isDir&&(localStorage.scrollObj=JSON.stringify(this.scrollObj),this.getFileList("./"+t.file+"/"))},rightMenu:function(e,t){var n=this,r=[];this.isServer&&r.unshift({title:"在系统中打开",evt:function(){n.askServerOpenDir(e)}},{title:"复制当前路径",evt:function(){if(navigator.clipboard)navigator.clipboard.writeText(e.path).then(function(){console.log("Text copied to clipboard:",e.path)}).catch(function(e){console.error("Could not copy text: ".concat(e))});else{var t=document.createElement("input");document.body.appendChild(t),t.value=e.path,t.focus(),t.select();var n=document.execCommand("copy");"unsuccessful"===n?console.error("Faild to copy path"):document.body.removeChild(t)}}},{type:"separator"}),r.unshift({title:"二维码访问",evt:function(t,r){var i=function(t){t=t.endsWith("/")?t:"".concat(t,"/");var r=decodeURI(t+e.file);n.$refs.overlayermod.generateQRCode(!0,r)};"localhost"===location.hostname?fetch("/get-iserver-ip").then(function(e){return e.json()}).then(function(e){i(location.href.replace("localhost",e.mes.IPv4.public))}).catch(function(e){console.error(e)}):i(location.href)}},{type:"separator"}),this.$VContextmenu.show(r,t)},listScroll:function(e){this.scrollObj[location.href]=e.target.scrollTop}})},E=R,z=Object(f["a"])(E,x,y,!1,null,null,null);z.options.__file="list.vue";var I=z.exports,M=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("footer",[n("p",{staticClass:"folder-info"},[e._v("共有 "+e._s(e.files.length)+" 个文件")]),n("ul",{staticClass:"current-file-info"},[e.currentFile?[n("li",{staticClass:"path",on:{click:function(t){e.askServerOpenDir(e.currentFile)}}},[e._v(e._s(e.currentFile.path))]),n("li",{staticClass:"size"},[e._v(e._s(e._f("fileSize")(e.currentFile.stats.size)))]),n("li",{staticClass:"extname"},[e._v(e._s(e.currentFile.extname.slice(1).toUpperCase()))])]:e._e(),n("li",{staticClass:"face-box"},[n("a",{attrs:{href:"https://github.com/ektx/iServer",title:e.faceInfo,target:"_blank"}},[e.showFace?n("svg",{staticClass:"warn-ico",attrs:{viewBox:"0 0 1024 1024"}},[n("path",{attrs:{d:"M540.5696 161.28c-193.67936 0-350.72 157.02016-350.72 350.72s157.04064 350.72 350.72 350.72c193.72032 0 350.72-157.02016 350.72-350.72S734.28992 161.28 540.5696 161.28z m129.4336 233.92256a50.23744 50.23744 0 1 1 0 100.49536 50.23744 50.23744 0 0 1 0-100.49536z m-258.88768 0a50.23744 50.23744 0 1 1 0 100.49536 50.23744 50.23744 0 0 1 0-100.49536zM721.92 697.38496a30.72 30.72 0 0 1-42.72128-7.90528 168.28416 168.28416 0 0 0-138.6496-73.03168c-55.296 0-107.1104 27.29984-138.60864 73.03168a30.72 30.72 0 1 1-50.60608-34.85696 229.7856 229.7856 0 0 1 189.19424-99.6352c75.5712 0 146.3296 37.25312 189.25568 99.65568a30.69952 30.69952 0 0 1-7.86432 42.74176z"}})]):e._e(),e.showFace?e._e():n("svg",{staticClass:"normal-ico",attrs:{viewBox:"0 0 1024 1024"}},[n("path",{attrs:{d:"M540.5696 161.28c-193.67936 0-350.72 157.02016-350.72 350.72s157.04064 350.72 350.72 350.72c193.72032 0 350.72-157.02016 350.72-350.72s-156.99968-350.72-350.72-350.72z m129.4336 233.92256a50.23744 50.23744 0 1 1 0 100.49536 50.23744 50.23744 0 0 1 0-100.49536z m-258.88768 0a50.23744 50.23744 0 1 1 0 100.49536 50.23744 50.23744 0 0 1 0-100.49536z m318.68928 238.73536a229.84704 229.84704 0 0 1-189.2352 99.6352 229.70368 229.70368 0 0 1-189.2352-99.65568 30.72 30.72 0 1 1 50.62656-34.816c31.45728 45.73184 83.29216 73.03168 138.62912 73.03168s107.13088-27.29984 138.6496-73.03168a30.72 30.72 0 0 1 42.72128-7.8848c13.9264 9.6256 17.44896 28.73344 7.84384 42.72128z"}})])])])],2)])},$=[],L=n("49d5"),P=n.n(L),V={name:"footer-mod",data:function(){return{showFace:!1,faceInfo:"v 7.5.0",version:"7.5.0"}},filters:{fileSize:function(e){return P()(e)}},computed:Object(b["a"])({},Object(B["d"])("home",["files","currentFile"])),mounted:function(){this.getNewVersion()},methods:Object(b["a"])({},Object(B["b"])("home",["askServerOpenDir"]),{getNewVersion:function(){var e=this;navigator.onLine&&this.axios({url:"https://raw.githubusercontent.com/ektx/iServer/master/package.json",methods:"GET"}).then(function(t){t.version!==e.version&&(e.showFace=!0,e.faceInfo="您需要升级，目前版本是: v".concat(t.version))})}})},D=V,H=Object(f["a"])(D,M,$,!1,null,null,null);H.options.__file="footer.vue";var N=H.exports,q=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("article",{staticClass:"article-box"},[n("VCode",{directives:[{name:"show",rawName:"v-show",value:"code"===e.fileType,expression:"fileType === 'code'"}],ref:"code",attrs:{data:e.code,option:e.codeOption}}),"markdown"===e.fileType?n("div",{staticClass:"readme-box",domProps:{innerHTML:e._s(e.markdownInner)}}):"img"===e.fileType?n("div",{staticClass:"img-box"},[n("figure",{style:e.imgStyle})]):e._e()],1)},Q=[],W=(n("ac6a"),n("14b9"),n("f559"),n("a322")),A=(n("96cf"),n("3040")),U=(n("6762"),n("2fdb"),function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"v-code-moirror-box"})}),J=[],G=(n("f751"),n("6bde")),K=(n("efe0"),n("56b3")),X=n.n(K),Y=(n("f9d4"),n("d69f"),n("d5e0"),n("693d"),n("7b00"),n("a7be"),n("0109"),{name:"VCodeMirror",props:{data:{style:String,default:""},option:{style:Object}},data:function(){return{codeBox:"",myOption:{theme:"dracula"}}},watch:{data:function(e){"object"===Object(G["a"])(e)&&(e=JSON.stringify(e,"","\t")),this.codeBox.setValue(e)},option:{handler:function(e,t){for(var n in e)e[n]!=this.myOption[n]&&(this.codeBox.setOption(n,e[n]),this.myOption[n]=e[n])},deep:!0}},mounted:function(){this.myOption=Object.assign(this.myOption,this.option),this.codeBox=X()(this.$el,this.myOption)},methods:{}}),Z=Y,ee=(n("7475"),Object(f["a"])(Z,U,J,!1,null,"4a2e7448",null));ee.options.__file="index.vue";var te=ee.exports,ne={name:"article-mod",components:{VCode:te},data:function(){return{markdownInner:"",fileType:"text",code:"",codeOption:{lineNumbers:!0,readOnly:!0,mode:""},articleBCR:{},articleEle:{},imgStyle:{},pathname:""}},computed:Object(b["a"])({},Object(B["d"])("home",["currentFile"])),watch:{currentFile:function(e){e.isDir||(this.pathname=location.pathname.endsWith("/")?location.pathname:"".concat(location.pathname,"/"),this.catFileInner(e))}},mounted:function(){var e=this;this.articleEle=this.$el,history.pushState?window.addEventListener("popstate",function(t){if(e.$route.hash.length){if(location.hash){var n=document.getElementById(location.hash.slice(1));e.$el.scrollTop=n.offsetTop}}else e.getFileList(e.$route.path)},!1):console.warn("您的浏览器不支持 History API，请升级您的浏览器！")},methods:Object(b["a"])({},Object(B["b"])("home",["getFileList"]),{getFileMode:function(e){var t=e.extname,n=!1;return/\.png|jpg|gif/i.test(t)?(this.fileType="img",this.setImgStyle()):/\.(htm|ejs|xml|jade|pug|svg|php)/i.test(t)?(this.fileType="code",window.open("./".concat(e.file)),n="text/html"):/\.(md|markdown)/i.test(t)?(this.fileType="markdown",n="markdown"):/\.(js|jsx|json)/i.test(t)?(this.fileType="code",n="javascript"):/\.(css|less|scss|sass|style)/i.test(t)?(this.fileType="code",n="css"):/\.vue/i.test(t)?(this.fileType="code",n="text/x-vue"):/\.txt/i.test(t)?(this.fileType="code",n="text/plain"):[".gitignore",".eslintrc"].includes(e.file)?(this.fileType="code",n="bash"):(this.fileType="",window.open("./".concat(e.file)),n=!1),n},showMarked:function(){var e=Object(A["a"])(regeneratorRuntime.mark(function e(t){var r,i,o,a,c,s,l;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,n.e("marked").then(n.t.bind(null,"0e54",7));case 2:r=e.sent.default,i=new r.Renderer,o=[],a={},i.heading=function(e,t){t in a?a[t]+=1:a[t]=1;var n=encodeURI(e+"-"+a[t]);return o.push(Object(W["a"])({level:t,slug:n,text:e},"slug",n)),"<h".concat(t,' id="').concat(n,'">').concat(e,'<a href="#').concat(n,'" class="anchor"></a></h').concat(t,">")},i.link=function(e,t,n){var r="",i="";return e.startsWith("http")&&(r=' target="_blank" '),n.endsWith("  ")&&(i="<br/>"),'<a href="'.concat(e,'" ').concat(r,">").concat(n,"</a>").concat(i)},i.paragraph=function(e){var t="";return t=/\[toc\]/i.test(e)?e:e.endsWith("  ")?"".concat(e,"<br/>"):"<p>".concat(e,"</p>"),t},c=r(t,{renderer:i}),s="",l=0,o.forEach(function(e){l<e.level?s+="<ul>":e.level===l?s+="</li>":e.level<l&&(s+="</li></ul>".repeat(l-e.level)),s+='<li><a href="#'.concat(e.slug,'">').concat(e.text,"</a>"),l=e.level}),s+="</li></ul>".repeat(l),this.markdownInner=c.replace(/\[toc\]/i,s),this.$nextTick(Object(A["a"])(regeneratorRuntime.mark(function e(){var t,r;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t=document.querySelectorAll("pre code"),e.next=3,n.e("highlight").then(n.t.bind(null,"1487",7));case 3:r=e.sent,t.forEach(function(e){r.highlightBlock(e)});case 5:case"end":return e.stop()}},e,this)})));case 16:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}(),catFileInner:function(){var e=Object(A["a"])(regeneratorRuntime.mark(function e(t){var n,r=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(n="",n=this.getFileMode(t),"boolean"!==typeof n||n){e.next=4;break}return e.abrupt("return");case 4:this.axios({url:this.pathname+t.file,method:"GET"}).then(function(e){"markdown"===n?r.showMarked(e):(r.code=e,r.codeOption.mode=n)}).catch(function(e){r.code=e.response.data,r.codeOption.mode="text/plain"});case 5:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}(),setImgStyle:function(){var e=this;this.articleBCR=this.articleEle.getBoundingClientRect();var t=new Image,n="".concat(this.pathname+this.currentFile.file);t.onload=function(){var r=t.width,i=t.height;(i>e.articleBCR.height||r>e.articleBCR.width)&&(i>r?(r/=i/e.articleBCR.height,i=e.articleBCR.height):(i/=r/e.articleBCR.width,r=e.articleBCR.width)),e.imgStyle={background:"url(".concat(n,") 50% 50% / 100% 100%"),width:"".concat(r,"px"),height:"".concat(i,"px")}},t.onerror=function(){console.warn("图片处理时出现错误")},t.src=n}})},re=ne,ie=Object(f["a"])(re,q,Q,!1,null,null,null);ie.options.__file="article.vue";var oe=ie.exports,ae={name:"home",components:{VBreadcrumb:w["a"],List:I,Footer:N,Article:oe},data:function(){return{}},computed:Object(b["a"])({},Object(B["d"])("home",["files","title"])),created:function(){this.getFileList(location.pathname)},methods:Object(b["a"])({},Object(B["b"])("home",["getFileList"]),{emitBreadCrumbEvt:function(e){this.getFileList(e.url)}}),beforeRouteUpdate:function(e,t,n){n(),this.$refs.vbreadcrumb&&this.$refs.vbreadcrumb.update()}},ce=ae,se=(n("d13f"),n("c861"),Object(f["a"])(ce,v,g,!1,null,null,null));se.options.__file="index.vue";var le=se.exports;r["a"].use(m["a"]);var ue=new m["a"]({mode:"history",routes:[{path:"*",name:"home",component:le}]}),he=(n("28a5"),n("4f7f"),n("8afe")),fe=(n("55dd"),{namespaced:!0,state:{title:"iServer",files:[],isServer:!1,currentFile:null},mutations:{setFiles:function(e,t){var n=[],r=[],i=function(e){return e.sort(function(e,t){return new Intl.Collator(navigator.language,{caseFirst:"lower"}).compare(e.file,t.file)})};t.forEach(function(t){t.classes=[],t.isDir?r.push(t):(n.push(t),/readme\.(md|markdown)/i.test(t.file)&&(t.classes=["current"],e.currentFile=t))}),r=i(r),n=i(n),e.files=Object(he["a"])(r).concat(Object(he["a"])(n))},setIsServer:function(e,t){e.isServer=t},setCurrentFile:function(e,t){e.currentFile&&(e.currentFile.classes=[]),t.classes=["current"],e.currentFile=t},setTitle:function(e){var t=Object(he["a"])(new Set(decodeURI(location.pathname).split("/"))).pop();e.title=t||"iServer",document.title=e.title}},actions:{getFileList:function(e,t){var n=location.pathname;n=n.endsWith("/")?n:"".concat(n,"/"),t.startsWith("./")&&(t=n+t.slice(2)),ue.push(t),e.commit("setTitle"),a("/api".concat(t)).then(function(t){e.commit("setFiles",t.data),e.commit("setIsServer",t.server)}).catch(function(e){console.error(e)})},askServerOpenDir:function(e,t){if(e.state.isServer){var n=t.path;t.isDir||(n=n.replace(t.file,"")),a({url:"/api/opendir",method:"POST",data:{path:n,name:t.file}}).then(function(e){console.log(e)}).catch(function(e){console.error(e)})}}}});r["a"].use(B["a"]);var de=new B["a"].Store({state:{},modules:{home:fe}});n("215f");r["a"].config.productionTip=!1,r["a"].use(c["a"]),r["a"].prototype.axios=a,new r["a"]({store:de,router:ue,render:function(e){return e(p)}}).$mount("#app")},"6d73":function(e,t,n){},7475:function(e,t,n){"use strict";var r=n("c8cf"),i=n.n(r);i.a},"90c2":function(e,t,n){},c861:function(e,t,n){"use strict";var r=n("6d73"),i=n.n(r);i.a},c8cf:function(e,t,n){},d13f:function(e,t,n){"use strict";var r=n("3f88"),i=n.n(r);i.a}});