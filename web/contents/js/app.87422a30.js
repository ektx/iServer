(function(e){function t(t){for(var i,s,a=t[0],c=t[1],l=t[2],f=0,h=[];f<a.length;f++)s=a[f],r[s]&&h.push(r[s][0]),r[s]=0;for(i in c)Object.prototype.hasOwnProperty.call(c,i)&&(e[i]=c[i]);u&&u(t);while(h.length)h.shift()();return o.push.apply(o,l||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],i=!0,a=1;a<n.length;a++){var c=n[a];0!==r[c]&&(i=!1)}i&&(o.splice(t--,1),e=s(s.s=n[0]))}return e}var i={},r={app:0},o=[];function s(t){if(i[t])return i[t].exports;var n=i[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=e,s.c=i,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)s.d(n,i,function(t){return e[t]}.bind(null,i));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="/@/";var a=window["webpackJsonp"]=window["webpackJsonp"]||[],c=a.push.bind(a);a.push=t,a=a.slice();for(var l=0;l<a.length;l++)t(a[l]);var u=c;o.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"099b":function(e,t,n){"use strict";var i=n("479e"),r=n.n(i);r.a},"2a03":function(e,t,n){"use strict";var i=n("90c2"),r=n.n(i);r.a},"3f88":function(e,t,n){},"479e":function(e,t,n){},"56d7":function(e,t,n){"use strict";n.r(t);n("cadf"),n("551c"),n("097d");var i=n("2b0e"),r=n("2f62"),o=(n("a481"),n("bc3a")),s=n.n(o);s.a.interceptors.request.use(function(e){return e.url=e.url.replace(":8080",":8080/api"),e},function(e){return Promise.reject(e)}),s.a.interceptors.response.use(function(e){return e.data},function(e){return e.response,Promise.reject(e)});var a=s.a,c=n("2a21"),l=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},u=[],f={name:"app"},h=f,d=(n("2a03"),n("2877")),p=Object(d["a"])(h,l,u,!1,null,"56a9c75a",null);p.options.__file="App.vue";var v=p.exports,m=n("8c4f"),g=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("section",{staticClass:"main-app"},[n("div",{staticClass:"file-list-box"},[n("header",[n("h1",[n("span",{on:{click:function(t){e.getFiles_c("../",t)}}},[e._v(e._s(e.title))])]),n("VBreadcrumb",{ref:"vbreadcrumb",on:{sendBreadCrumbEvt:e.emitBreadCrumbEvt}})],1),n("main",[n("aside",[n("ul",{staticClass:"file-list",on:{scroll:function(t){e.listScroll(t)}}},e._l(e.files,function(t,i){return n("li",{key:t.file,class:t.classes},[t.isDir?t.isDir?n("svg",{attrs:{"aria-hidden":"true",version:"1.1",viewBox:"0 0 14 16"}},[n("path",{attrs:{d:"M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM6 4H1V3h5v1z"}})]):e._e():n("svg",{attrs:{"aria-hidden":"true",version:"1.1",viewBox:"0 0 12 16"}},[n("path",{attrs:{d:"M6 5H2V4h4v1zM2 8h7V7H2v1zm0 2h7V9H2v1zm0 2h7v-1H2v1zm10-7.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v12h10V5z"}})]),n("div",{on:{click:[function(n){e.goFilePath(i,t,n)},function(n){if(!n.shiftKey)return null;n.preventDefault(),e.askServerOpenDir(t)}],contextmenu:function(n){n.preventDefault(),e.rightMenu(t,n)}}},[e._v(e._s(t.file))])])}))]),n("article",{staticClass:"article-box"},[n("VCode",{directives:[{name:"show",rawName:"v-show",value:"code"===e.fileType,expression:"fileType === 'code'"}],ref:"code",attrs:{data:e.code,option:e.codeOption}}),"markdown"===e.fileType?n("div",{staticClass:"readme-box",domProps:{innerHTML:e._s(e.markdownInner)}}):"img"===e.fileType?n("div",{staticClass:"img-box"},[n("figure",{style:e.imgStyle})]):e._e()],1)]),n("footer",[n("p",{staticClass:"folder-info"},[e._v("共有 "+e._s(e.files.length)+" 个文件")]),n("ul",{staticClass:"current-file-info"},[e.currentFile?[n("li",{staticClass:"path",on:{click:function(t){e.askServerOpenDir(e.currentFile)}}},[e._v(e._s(e.currentFile.path))]),n("li",{staticClass:"size"},[e._v(e._s(e._f("fileSize")(e.currentFile.stats.size)))]),n("li",{staticClass:"extname"},[e._v(e._s(e.currentFile.extname.slice(1).toUpperCase()))])]:e._e(),n("li",{staticClass:"face-box"},[n("a",{attrs:{href:"https://github.com/ektx/iServer",title:e.faceInfo,target:"_blank"}},[e.showFace?n("svg",{staticClass:"warn-ico",attrs:{viewBox:"0 0 1024 1024"}},[n("path",{attrs:{d:"M540.5696 161.28c-193.67936 0-350.72 157.02016-350.72 350.72s157.04064 350.72 350.72 350.72c193.72032 0 350.72-157.02016 350.72-350.72S734.28992 161.28 540.5696 161.28z m129.4336 233.92256a50.23744 50.23744 0 1 1 0 100.49536 50.23744 50.23744 0 0 1 0-100.49536z m-258.88768 0a50.23744 50.23744 0 1 1 0 100.49536 50.23744 50.23744 0 0 1 0-100.49536zM721.92 697.38496a30.72 30.72 0 0 1-42.72128-7.90528 168.28416 168.28416 0 0 0-138.6496-73.03168c-55.296 0-107.1104 27.29984-138.60864 73.03168a30.72 30.72 0 1 1-50.60608-34.85696 229.7856 229.7856 0 0 1 189.19424-99.6352c75.5712 0 146.3296 37.25312 189.25568 99.65568a30.69952 30.69952 0 0 1-7.86432 42.74176z"}})]):e._e(),e.showFace?e._e():n("svg",{staticClass:"normal-ico",attrs:{viewBox:"0 0 1024 1024"}},[n("path",{attrs:{d:"M540.5696 161.28c-193.67936 0-350.72 157.02016-350.72 350.72s157.04064 350.72 350.72 350.72c193.72032 0 350.72-157.02016 350.72-350.72s-156.99968-350.72-350.72-350.72z m129.4336 233.92256a50.23744 50.23744 0 1 1 0 100.49536 50.23744 50.23744 0 0 1 0-100.49536z m-258.88768 0a50.23744 50.23744 0 1 1 0 100.49536 50.23744 50.23744 0 0 1 0-100.49536z m318.68928 238.73536a229.84704 229.84704 0 0 1-189.2352 99.6352 229.70368 229.70368 0 0 1-189.2352-99.65568 30.72 30.72 0 1 1 50.62656-34.816c31.45728 45.73184 83.29216 73.03168 138.62912 73.03168s107.13088-27.29984 138.6496-73.03168a30.72 30.72 0 0 1 42.72128-7.8848c13.9264 9.6256 17.44896 28.73344 7.84384 42.72128z"}})])])])],2)])]),n("VContextmenus"),n("OverLayer",{ref:"overlayermod"})],1)},w=[],b=(n("ac6a"),n("55dd"),n("aef6"),n("28a5"),n("49d5")),x=n.n(b),y=n("b6e5"),C=n("ad9b"),O=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("transition",{attrs:{name:"show-layer"}},[n("div",{directives:[{name:"show",rawName:"v-show",value:e.show,expression:"show"}],staticClass:"over-layer",on:{click:function(t){if(t.target!==t.currentTarget)return null;e.show=!e.show}}},[n("transition",{attrs:{name:"show-qrcode"}},[n("section",{directives:[{name:"show",rawName:"v-show",value:e.show,expression:"show"}],staticClass:"ask-link-qrcode-mod"},[n("div",{attrs:{id:"ask-link-qrcode-box"}},[n("img",{attrs:{src:e.QRBox.img}})]),n("input",{attrs:{type:"text",readonly:""},domProps:{value:e.QRBox.text}})])])],1)])},_=[],S=n("d055"),j=n.n(S),k={name:"overlayer",data:function(){return{show:!1,QRBox:{img:null,text:""}}},methods:{generateQRCode:function(e,t){var n=this;this.show=e,this.QRBox.text=t,j.a.toDataURL(t,{width:180*window.devicePixelRatio,margin:0}).then(function(e){n.QRBox.img=e}).catch(function(e){console.error(e)})}}},F=k,B=(n("099b"),Object(d["a"])(F,O,_,!1,null,"2921b41b",null));B.options.__file="index.vue";var T=B.exports,z=n("0e54"),R=n.n(z),V=n("1487"),M=n.n(V),I=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"v-code-moirror-box"})},$=[],E=(n("f751"),n("6bde")),P=(n("efe0"),n("56b3")),L=n.n(P),D=(n("f9d4"),n("d69f"),n("d5e0"),n("693d"),n("7b00"),n("a7be"),n("0109"),{name:"VCodeMirror",props:{data:{style:String,default:""},option:{style:Object}},data:function(){return{codeBox:"",myOption:{theme:"dracula"}}},watch:{data:function(e){"object"===Object(E["a"])(e)&&(e=JSON.stringify(e,"","\t")),this.codeBox.setValue(e)},option:{handler:function(e,t){for(var n in e)e[n]!=this.myOption[n]&&(this.codeBox.setOption(n,e[n]),this.myOption[n]=e[n])},deep:!0}},mounted:function(){this.myOption=Object.assign(this.myOption,this.option),this.codeBox=L()(this.$el,this.myOption)},methods:{}}),H=D,N=(n("7475"),Object(d["a"])(H,I,$,!1,null,"4a2e7448",null));N.options.__file="index.vue";var q=N.exports,Q={name:"home",components:{VBreadcrumb:y["a"],VContextmenus:C["a"],OverLayer:T,VCode:q},data:function(){return{title:"",files:[],currentFile:null,onServer:!0,fileType:"text",markdownInner:"",code:"",codeOption:{lineNumbers:!0,readOnly:!0,mode:""},imgStyle:{},articleEle:{},articleBCR:{},showFace:!1,faceInfo:"v 7.2.0",version:"7.2.0",scrollObj:{}}},created:function(){var e=this;this.refreshFilesList(location.pathname),history.pushState?window.addEventListener("popstate",function(t){e.refreshFilesList(location.pathname)},!1):console.warn("您的浏览器不支持 History API，请升级您的浏览器！")},filters:{fileSize:function(e){return x()(e)}},watch:{currentFile:function(e,t){t&&t.classes&&(t.classes=[]),e.classes=["current"]}},mounted:function(){localStorage.scrollObj&&(this.scrollObj=JSON.parse(localStorage.scrollObj)),this.articleEle=this.$el.querySelector(".article-box"),this.getNewVersion()},methods:{getFiles_c:function(e,t){var n="";if(t.shiftKey)return this.askServerOpenDir(e);n="../"===e?"".concat(location.pathname.split("/").slice(0,-2).join("/")):location.pathname+e.file,this.refreshFilesList(n),this.$refs.vbreadcrumb.update()},refreshFilesList:function(e){var t=this;e=e.endsWith("/")?e:"".concat(e,"/");var n=decodeURI(e).split("/").slice(-2).shift();this.$router.push(e),this.title=n||"iServer",document.title=this.title,fetch("/api".concat(e)).then(function(e){return e.json()}).then(function(e){if(t.files=t.formatFileList(e.data),t.onServer=e.server,location.href in t.scrollObj){var n=t.scrollObj[location.href];t.$nextTick(function(){t.$el.querySelector(".file-list").scrollTop=n})}}).catch(function(e){console.error(e)})},emitBreadCrumbEvt:function(e){this.refreshFilesList(e.url)},askServerOpenDir:function(e){var t=e.path;e.isDir||(t=t.replace(e.file,"")),this.axios({url:"/api/opendir",method:"POST",data:{path:t,name:e.file}}).then(function(e){console.log(e)})},rightMenu:function(e,t){var n=this,i={el:e,data:[{title:"下载",disabled:!0}],evt:t};this.currentFile=e,this.onServer&&i.data.unshift({title:"在系统中打开",evt:function(){n.askServerOpenDir(e),n.$store.commit("setContextmenu",{show:!1})}},{title:"复制当前路径",evt:function(){if(navigator.clipboard)navigator.clipboard.writeText(e.path).then(function(){console.log("Text copied to clipboard:",e.path)}).catch(function(e){console.error("Could not copy text: ".concat(e))});else{var t=document.createElement("input");document.body.appendChild(t),t.value=e.path,t.focus(),t.select();var i=document.execCommand("copy");"unsuccessful"===i?console.error("Faild to copy path"):document.body.removeChild(t)}n.$store.commit("setContextmenu",{show:!1})}},{type:"separator"}),i.data.unshift({title:"二维码访问",evt:function(t,i){var r=function(t){var i=decodeURI(t+e.file);n.$refs.overlayermod.generateQRCode(!0,i)};"localhost"===location.hostname?fetch("/get-iserver-ip").then(function(e){return e.json()}).then(function(e){r(location.href.replace("localhost",e.mes.IPv4.public))}).catch(function(e){console.error(e)}):r(location.href),n.$store.commit("setContextmenu",{show:!1})}},{type:"separator"}),n.$store.commit("setContextmenu",i)},sortArr:function(e){return e.sort(function(e,t){return new Intl.Collator(navigator.language,{caseFirst:"lower"}).compare(e.file,t.file)})},formatFileList:function(e){var t=this,n=[],i=[];return e.forEach(function(e){e.isDir?i.push(e):(n.push(e),/readme\.(md|markdown)/i.test(e.file)&&(e.classes=["current"],t.currentFile=e,t.catFileInner(e)))}),i=this.sortArr(i),n=this.sortArr(n),i.concat(n)},catFileInner:function(e){var t=this,n="";n=this.getFileMode(e),("boolean"!==typeof n||n)&&this.axios({url:location.href+e.file,method:"GET"}).then(function(e){"markdown"===n?(t.markdownInner=R()(e),t.$nextTick(function(){var e=document.querySelectorAll("pre code");e.forEach(function(e){M.a.highlightBlock(e)})})):(t.code=e,t.codeOption.mode=n)})},goFilePath:function(e,t,n){this.currentFile=t,t.isDir?(localStorage.scrollObj=JSON.stringify(this.scrollObj),this.getFiles_c(t,n)):this.catFileInner(t)},getFileMode:function(e){var t=e.extname,n=!1;return/\.png|jpg|gif/i.test(t)?(this.fileType="img",this.setImgStyle()):/\.(html|htm|ejs|xml)/i.test(t)?(this.fileType="code",window.open("./".concat(e.file)),n="text/html"):/\.(md|markdown)/i.test(t)?(this.fileType="markdown",n="markdown"):/\.(js|jsx|json)/i.test(t)?(this.fileType="code",n="javascript"):/\.(css|less|scss|sass|style)/i.test(t)?(this.fileType="code",n="css"):/\.vue/i.test(t)?(this.fileType="code",n="text/x-vue"):/\.vue/i.test(t)?(this.fileType="code",n="text/x-vue"):".gitignore"===e.file?(this.fileType="code",n="bash"):(this.fileType="",window.open("./".concat(e.file)),n=!1),n},setImgStyle:function(){var e=this;this.articleBCR=this.articleEle.getBoundingClientRect();var t=new Image,n="./".concat(this.currentFile.file);t.onload=function(){var i=t.width,r=t.height;(r>e.articleBCR.height||i>e.articleBCR.width)&&(r>i?(i/=r/e.articleBCR.height,r=e.articleBCR.height):(r/=i/e.articleBCR.width,i=e.articleBCR.width)),e.imgStyle={background:"url(".concat(n,") 50% 50% / 100% 100%"),width:"".concat(i,"px"),height:"".concat(r,"px")}},t.onerror=function(){console.warn("图片处理时出现错误")},t.src=n},getNewVersion:function(){var e=this;navigator.onLine&&this.axios({url:"https://raw.githubusercontent.com/ektx/iServer/master/package.json",methods:"GET"}).then(function(t){t.version!==e.version&&(e.showFace=!0,e.faceInfo="您需要升级，目前版本是: v".concat(t.version))})},listScroll:function(e){this.scrollObj[location.href]=e.target.scrollTop}}},A=Q,J=(n("d13f"),n("c861"),Object(d["a"])(A,g,w,!1,null,null,null));J.options.__file="index.vue";var U=J.exports;i["a"].use(m["a"]);var G=new m["a"]({mode:"history",routes:[{path:"*",name:"home",component:U}]});i["a"].config.productionTip=!1,i["a"].use(r["a"]),i["a"].prototype.axios=a;var K=new r["a"].Store({state:{},mutations:{},modules:{VContextmenu:c["a"]}});new i["a"]({router:G,store:K,render:function(e){return e(v)}}).$mount("#app")},"6d73":function(e,t,n){},7475:function(e,t,n){"use strict";var i=n("c8cf"),r=n.n(i);r.a},"90c2":function(e,t,n){},c861:function(e,t,n){"use strict";var i=n("6d73"),r=n.n(i);r.a},c8cf:function(e,t,n){},d13f:function(e,t,n){"use strict";var i=n("3f88"),r=n.n(i);r.a}});