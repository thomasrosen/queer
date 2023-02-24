(this.webpackJsonpqueer=this.webpackJsonpqueer||[]).push([[0],{35:function(e,t){function n(e){var t="string"===typeof e?function(e){if(e.startsWith("#")&&(e=e.substring(1)),3===e.length)e=e.charAt(0)+e.charAt(0)+e.charAt(1)+e.charAt(1)+e.charAt(2)+e.charAt(2);else if(6!==e.length)throw new Error("Invalid hex color: "+e);for(var t=[],n=0;n<=2;n++)t[n]=parseInt(e.substr(2*n,2),16);return t}(e):e;return.2126*t[0]+.7152*t[1]+.0722*t[2]}e.exports={getContrastingColorFromHex:function(e){return n(e)>=165?"#000":"#fff"},string2color:function(e){for(var t=0,n=0;n<e.length;n++)t=e.charCodeAt(n)+((t<<5)-t);for(var r="#",c=0;c<3;c++){r+=("00"+(t>>8*c&255).toString(16)).substr(-2)}return r}}},38:function(e,t,n){},39:function(e,t,n){},40:function(e,t,n){},48:function(e,t,n){},57:function(e,t,n){"use strict";n.r(t);var r=n(0),c=n.n(r),a=n(25),o=n.n(a),s=(n(48),n(26)),l=n(4),i=(n(38),n(39),n(40),n(3)),u=n(15),d=n(41),j=n(35),h=n(2),b=["tag","style"];function g(e){var t=e.tag,n=e.style,r=Object(d.a)(e,b),c=Object(j.string2color)(t),a=Object(j.getContrastingColorFromHex)(c);return Object(h.jsx)("button",Object(u.a)(Object(u.a)({},r),{},{style:Object(u.a)(Object(u.a)({},n),{},{backgroundColor:c,color:a}),children:t}))}var f=n(10),O=n(9),p=n(16);function x(e){var t=new URL(window.location),n=t.searchParams.toString(),r=new URLSearchParams([].concat(Object(O.a)(Array.from(t.searchParams.entries()).filter((function(t){var n=Object(l.a)(t,1)[0];return!e.has(n)}))),Object(O.a)(Object(O.a)(e.entries()).filter((function(e){var t=Object(l.a)(e,2)[1];return String(t).length>0})))).sort((function(e,t){var n=Object(l.a)(e,1)[0],r=Object(l.a)(t,1)[0];return n.localeCompare(r)}))).toString();n!==r&&(t=new URL("".concat(t.origin).concat(t.pathname).concat(r.length>0?"?"+r:"")),window.history.pushState({},"",t))}var m=Object(p.c)({name:"filter",initialState:{tags:[],selectedTags:[],queryText:"",latitude:0,longitude:0},reducers:{setTags:function(e,t){e.tags=t.payload},setSelectedTags:function(e,t){e.selectedTags=t.payload},toggleTag:function(e,t){e.selectedTags.includes(t.payload)?e.selectedTags=e.selectedTags.filter((function(e){return e!==t.payload})):e.selectedTags.push(t.payload),e.selectedTags=e.selectedTags.filter(Boolean),0===e.selectedTags.length?x(new URLSearchParams([["tags",""]])):x(new URLSearchParams([["tags",e.selectedTags.join(",")]]))},setQueryText:function(e,t){e.queryText=t.payload,0===e.queryText.length?x(new URLSearchParams([["q",""]])):x(new URLSearchParams([["q",e.queryText]]))},setGeoLocation:function(e,t){e.latitude=t.payload.latitude,e.longitude=t.payload.longitude,x(new URLSearchParams([["lat",e.latitude],["lon",e.longitude]]))},clearGeoLocation:function(e){e.latitude=null,e.longitude=null,x(new URLSearchParams([["lat",""],["lon",""]]))}}}),w=m.actions,v=w.setTags,y=w.setSelectedTags,S=w.toggleTag,T=w.setQueryText,C=w.setGeoLocation,k=w.clearGeoLocation,L=function(e){return e.filter.tags},R=function(e){return e.filter.selectedTags.filter(Boolean)},q=function(e){return e.filter.queryText},P=function(e){return{latitude:e.filter.latitude,longitude:e.filter.longitude}},_=m.reducer,U=n(5),A=n(8),E=Object(p.c)({name:"resources",initialState:{resources:[]},reducers:{setResources:function(e,t){e.resources=t.payload}}}),N=E.actions.setResources,F=Object(p.b)("resources/fetchResources",function(){var e=Object(A.a)(Object(U.a)().mark((function e(t,n){var r,c,a,o,s,l,i,u,d,j,h,b,g,f;return Object(U.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:console.log("fetchResources"),c=(r=n||{}).dispatch,a=r.getState,o=a(),s=o.filter,i=(l=s||{}).latitude,u=l.longitude,d=l.selectedTags,j=l.queryText,h={},null!==i&&String(i).length>0&&null!==u&&String(u).length>0&&(h.lat=i,h.lon=u),b=d.filter(Boolean),Array.isArray(b)&&b.length>0&&(h.tags=b.join(",")),"string"===typeof j&&j.length>0&&(h.q=j),g=new URLSearchParams(h).toString(),f="".concat(window.urls.api,"resources.json").concat(g.length>0?"?"+g:""),console.log("url",f),fetch(f).then((function(e){return e.json()})).then((function(e){console.log("data",e),c(N(e.resources))}));case 13:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}()),G=function(e){return e.resources.resources},B=E.reducer;function Q(e){var t=e.onError,n=void 0===t?function(){}:t,r=Object(f.b)(),a=Object(f.c)(L),o=Object(f.c)(R),s=Object(f.c)(q),l=Object(f.c)(P),i=l.latitude,u=l.longitude,d=Object(f.c)(G),j=c.a.useCallback((function(){r(F())}),[r]),b=c.a.useCallback((function(){var e=new URL(window.location),t=e.searchParams.get("lat")||"",n=e.searchParams.get("lon")||"",c={};"string"===typeof t&&t.length>0&&"string"===typeof n&&n.length>0&&(c.lat=t,c.lon=n);var a=new URLSearchParams(c).toString(),o="".concat(window.urls.api,"tags.json").concat(a.length>0?"?"+a:"");fetch(o).then((function(e){return e.json()})).then((function(e){r(v(e.tags)),j()}))}),[r,j]),O=c.a.useCallback((function(){navigator.geolocation?navigator.geolocation.getCurrentPosition((function(e){n(""),r(C({latitude:e.coords.latitude,longitude:e.coords.longitude})),b(),j()}),(function(e){n(e.message)})):n("Geolocation is not supported by this browser.")}),[r,n,b,j]),p=c.a.useCallback((function(){r(k()),b(),j()}),[r,b,j]),x=c.a.useCallback((function(e){r(S(e)),j()}),[r,j]),m=c.a.useCallback((function(e){e&&(r(T(e.target.value)),j())}),[r,j]);return c.a.useEffect((function(){function e(){var e=new URL(window.location),t=e.searchParams.get("lat")||"",n=e.searchParams.get("lon")||"";r(C({latitude:t,longitude:n}));var c=(e.searchParams.get("tags")||"").split(",");r(y(c));var a=e.searchParams.get("q")||"";r(T(a)),j()}return e(),window.addEventListener("popstate",e),function(){window.removeEventListener("popstate",e)}}),[r,j]),c.a.useEffect((function(){b()}),[b,i,u]),Object(h.jsxs)("div",{children:[Object(h.jsx)("h2",{children:"Filter for resources in your area:"}),Object(h.jsxs)("div",{className:"tag_row",children:[Object(h.jsx)("button",{onClick:O,children:"Get my Location"}),i&&u?Object(h.jsx)("button",{onClick:p,children:"Clear Location"}):null]}),i&&u?Object(h.jsxs)("p",{children:["Your Location: ",i," / ",u]}):null,Object(h.jsx)("br",{}),Object(h.jsx)("h2",{children:"Filter by tag:"}),Object(h.jsx)("div",{className:"tag_row",children:a&&a.map((function(e){return Object(h.jsx)(g,{tag:e,"data-selected":o.includes(e)?"true":"false",onClick:function(){return x(e)}},e)}))}),Object(h.jsx)("br",{}),Object(h.jsx)("h2",{children:"Search:"}),Object(h.jsx)("input",{style:{margin:"20px 0"},type:"search",placeholder:"Search\u2026",defaultValue:s,onChange:m}),Object(h.jsx)("br",{}),Object(h.jsx)("br",{}),Object(h.jsx)("h2",{children:"Result Summary:"}),Object(h.jsx)("br",{}),0===d.length?Object(h.jsx)("p",{children:"No resources found."}):null,1===d.length?Object(h.jsx)("p",{children:"One resources found."}):null,d.length>1?Object(h.jsxs)("p",{children:[d.length," resources found."]}):null]})}function I(){var e=Object(f.b)(),t=Object(f.c)(G),n=Object(f.c)(R),r=c.a.useCallback((function(t){e(S(t)),e(F())}),[e]),a=c.a.useState(!1),o=Object(l.a)(a,2),s=o[0],u=o[1],d=c.a.useState(null),j=Object(l.a)(d,2),b=j[0],O=j[1],p=function(){u((function(e){return!e}))};return Object(h.jsxs)("div",{className:"app_wrapper ".concat(!0===s?"show_filters":"hide_filters"),children:[Object(h.jsxs)("header",{children:[!0===s?Object(h.jsx)("button",{className:"hide_on_large_screens",onClick:p,children:"Close Filters"}):null,Object(h.jsx)("h1",{children:"\ud83c\udff3\ufe0f\u200d\ud83c\udf08 QR"}),Object(h.jsx)("a",{href:"https://github.com/thomasrosen/queer",target:"_blank",rel:"noreferrer",children:"Sourcecode"})]}),Object(h.jsx)("nav",{children:Object(h.jsx)(Q,{onError:O})}),Object(h.jsxs)("main",{children:[Object(h.jsx)("h1",{children:"\ud83c\udff3\ufe0f\u200d\ud83c\udf08 Queer Resources"}),Object(h.jsx)("br",{}),Object(h.jsx)("p",{children:"A collection of resources for queer people. You're of course also welcome to look through the information if you are an ally."}),Object(h.jsx)("p",{children:"You can filter the links via your location and some tags."}),Object(h.jsxs)("p",{children:["The website is maintained by ",Object(h.jsx)("a",{href:"https://thomasrosen.me/",target:"_blank",rel:"noreferrer",children:"Thomas Rosen"}),".",Object(h.jsx)("br",{}),"Send an email to ",Object(h.jsx)("a",{href:"mailto:queer@thomasrosen.me",children:"queer@thomasrosen.me"})," if you want to add a resource."]}),Object(h.jsxs)("div",{className:"hide_on_large_screens",children:[Object(h.jsx)("br",{}),Object(h.jsx)("button",{onClick:p,children:!0===s?"Close Filters":"Open Filters"}),Object(h.jsx)("br",{})]}),Object(h.jsx)("br",{}),Object(h.jsx)("br",{}),b&&Object(h.jsxs)("p",{children:["Error: ",b]}),t&&t.map((function(e){return Object(h.jsxs)("div",{children:[Object(h.jsx)("h3",{children:Object(h.jsx)("a",{href:e.link,target:"_blank",rel:"noreferrer",children:e.title})}),e.description&&e.description.length>0?Object(h.jsx)("p",{children:e.description}):null,Object(h.jsx)("div",{className:"tag_row small",children:e.tags.map((function(e){return Object(h.jsx)(g,{className:"small",tag:e,"data-selected":n.includes(e)?"true":"false",onClick:function(){return r(e)}},e)}))}),Object(h.jsx)("br",{})]},JSON.stringify(e))})),t&&0===t.length?Object(h.jsx)("p",{children:"No resources found."}):null,t?null:Object(h.jsx)("p",{children:"Loading..."}),Object(h.jsx)(i.a,{})]})]})}function J(){return Object(h.jsx)("div",{})}var Y=Object(s.a)([{path:"/",element:Object(h.jsx)(I,{}),children:[{path:"/",element:Object(h.jsx)(J,{})},{path:"*",element:Object(h.jsx)(J,{})}]}]),H=Object(p.a)({reducer:{filter:_,resources:B}}),M=Boolean("0.0.0.0"===window.location.hostname||"localhost"===window.location.hostname||"[::1]"===window.location.hostname);window.env=!0===M?"dev":"prod",window.urls={frontend:"https://queer.thomasrosen.me/",api:"https://queer.thomasrosen.me/api/"},"dev"===window.env&&(window.urls.frontend="http://0.0.0.0:3000/",window.urls.api="http://0.0.0.0:17215/api/"),o.a.render(Object(h.jsx)(c.a.StrictMode,{children:Object(h.jsx)(f.a,{store:H,children:Object(h.jsx)(i.c,{router:Y,fallbackElement:"Loading\u2026"})})}),document.getElementById("root"))}},[[57,1,2]]]);
//# sourceMappingURL=main.4c4b7baf.chunk.js.map