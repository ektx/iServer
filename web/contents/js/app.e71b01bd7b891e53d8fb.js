webpackJsonp([1],{0:function(t,e,n){n("j1ja"),t.exports=n("NHnr")},"0s+B":function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("section",{staticClass:"v-breadcrumb-com"},[t.hasEvt?[n("a",{attrs:{href:"/"},on:{click:function(e){e.preventDefault(),t.breadcrumb_c("/")}}},[t._v(".")]),t._v(" "),t._l(t.hrefArr,function(e){return n("a",{attrs:{href:e.path},on:{click:function(n){n.preventDefault(),t.breadcrumb_c(e.path)}}},[t._v(t._s(e.name))])})]:[n("a",{attrs:{href:"/"}},[t._v(".")]),t._v(" "),t._l(t.hrefArr,function(e){return n("a",{attrs:{href:e.path}},[t._v(t._s(e.name))])})]],2)},r=[],i={render:a,staticRenderFns:r};e.a=i},"7Otq":function(t,e,n){t.exports=n.p+"contents/img/logo.82b9c7a.png"},AZrw:function(t,e,n){"use strict";function a(t){n("nnVg")}var r=n("yUll"),i=n("0s+B"),s=n("VU/8"),o=a,c=s(r.a,i.a,!1,o,null,null);e.a=c.exports},EMKr:function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"hello"},[a("img",{attrs:{src:n("7Otq")}}),t._v(" "),a("h1",[t._v(t._s(t.msg))])])},r=[],i={render:a,staticRenderFns:r};e.a=i},FP3a:function(t,e,n){"use strict";function a(t){n("L2ct")}var r=n("XQ5R"),i=n("j03H"),s=n("VU/8"),o=a,c=s(r.a,i.a,!1,o,"data-v-6fa026f9",null);e.a=c.exports},H3Ql:function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},r=[],i={render:a,staticRenderFns:r};e.a=i},L2ct:function(t,e){},M93x:function(t,e,n){"use strict";function a(t){n("TcwN")}var r=n("xJD8"),i=n("H3Ql"),s=n("VU/8"),o=a,c=s(r.a,i.a,!1,o,"data-v-75ad56d8",null);e.a=c.exports},NHnr:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n("7+uW"),r=n("M93x"),i=n("YaEn"),s=n("mtWM"),o=n.n(s);a.a.config.productionTip=!1,a.a.prototype.axios=o.a,new a.a({el:"#app",router:i.a,template:"<App/>",components:{App:r.a}})},TcwN:function(t,e){},XQ5R:function(t,e,n){"use strict";var a=n("usrL");e.a=a.a},YaEn:function(t,e,n){"use strict";var a=n("7+uW"),r=n("/ocq"),i=n("qSdX"),s=n("FP3a");a.a.use(r.a),e.a=new r.a({mode:"history",routes:[{path:"/",name:"",component:s.a,children:[{path:"*",name:"Hello",component:i.a}]}]})},j03H:function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("section",{staticClass:"main-app"},[n("header",[n("h1",{on:{click:function(e){t.getFiles_c("../",e)}}},[t._v("\n\t\t\t"+t._s(t.title)+"\n\t\t")])]),t._v(" "),n("main",[n("VBreadcrumb",{ref:"vbreadcrumb",on:{sendBreadCrumbEvt:t.emitBreadCrumbEvt}}),t._v(" "),n("ul",t._l(t.files,function(e){return n("li",[e.isDir?e.isDir?n("svg",{attrs:{"aria-hidden":"true",height:"16",version:"1.1",viewBox:"0 0 14 16",width:"14"}},[n("path",{attrs:{d:"M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM6 4H1V3h5v1z"}})]):t._e():n("svg",{attrs:{"aria-hidden":"true",height:"16",version:"1.1",viewBox:"0 0 12 16",width:"14"}},[n("path",{attrs:{d:"M6 5H2V4h4v1zM2 8h7V7H2v1zm0 2h7V9H2v1zm0 2h7v-1H2v1zm10-7.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v12h10V5z"}})]),t._v(" "),e.isDir?n("a",{attrs:{href:"#"},on:{click:function(n){n.preventDefault(),t.getFiles_c(e,n)}}},[t._v("\n\t\t\t\t\t"+t._s(e.file)+"\n\t\t\t\t")]):t._e(),t._v(" "),e.isDir?t._e():n("a",{attrs:{target:"_blank",href:"./"+e.file},on:{click:function(n){if(!n.shiftKey)return null;n.preventDefault(),t.askServerOpenDir(e)}}},[t._v(t._s(e.file))])])})),t._v(" "),n("p",[t._v("共有 "+t._s(t.files.length)+" 个文件")])],1)])},r=[],i={render:a,staticRenderFns:r};e.a=i},nnVg:function(t,e){},pMZz:function(t,e,n){"use strict";var a=n("mtWM"),r=n.n(a);e.a={name:"hello",data:function(){return{msg:""}},created:function(){var t=this;this.msg="vue is created!";var e=localStorage.SERVER_ENV?"/api/demo/helloworld.json":"/api/demo/helloworld";r.a.get(e).then(function(e){console.log(e),t.msg=e.data.data.name}).catch(function(t){console.log(t)})}}},qSdX:function(t,e,n){"use strict";function a(t){n("vNlK")}var r=n("pMZz"),i=n("EMKr"),s=n("VU/8"),o=a,c=s(r.a,i.a,!1,o,"data-v-7f7410aa",null);e.a=c.exports},usrL:function(t,e,n){"use strict";var a=n("AZrw");e.a={name:"home",components:{VBreadcrumb:a.a},data:function(){return{title:"",files:[]}},created:function(){var t=this;this.refreshFilesList(location.pathname),history.pushState?window.addEventListener("popstate",function(e){t.refreshFilesList(location.pathname)},!1):console.warn("您的浏览器不支持 History API，请升级您的浏览器！")},methods:{getFiles_c:function(t,e){var n="";if(e.shiftKey)return void this.askServerOpenDir(t);n="../"===t?""+location.pathname.split("/").slice(0,-2).join("/"):location.pathname+t.file,this.refreshFilesList(n),this.$refs.vbreadcrumb.update()},refreshFilesList:function(t){var e=this;t=t.endsWith("/")?t:t+"/";var n=decodeURI(t).split("/").slice(-2).shift();this.$router.push(t),this.title=n||"iTools",document.title=this.title,t="/api"+t,this.axios.get(t).then(function(t){e.files=t.data}).catch(function(t){console.error(t)})},emitBreadCrumbEvt:function(t){this.refreshFilesList(t.url)},askServerOpenDir:function(t){console.log("will do open dir",t),this.axios.post("/api/opendir",{path:t.path,name:t.file}).then(function(t){console.log(t)}).catch(function(t){console.error(t)})}}}},vNlK:function(t,e){},xJD8:function(t,e,n){"use strict";e.a={name:"app"}},yUll:function(t,e,n){"use strict";var a=n("fZjL"),r=n.n(a);e.a={name:"v-breadcrumb",data:function(){return{hrefArr:[],hasEvt:!1}},created:function(){var t=this;this.formatURL(location.pathname),this.hasEvt=r()(this.$listeners).length>0,history.pushState&&this.hasEvt&&window.addEventListener("popstate",function(e){t.formatURL(location.pathname)},!1)},methods:{breadcrumb_c:function(t){this.formatURL(t),this.hasEvt&&this.$emit("sendBreadCrumbEvt",{url:t})},formatURL:function(t){var e=this,n=decodeURI(t).slice(1,-1).split("/");e.hrefArr=[],n.forEach(function(t,n,a){e.hrefArr.push({name:t,path:"/"+a.slice(0,n+1).join("/")+"/"})})},update:function(){this.formatURL(location.pathname)}}}}},[0]);
//# sourceMappingURL=app.e71b01bd7b891e53d8fb.js.map