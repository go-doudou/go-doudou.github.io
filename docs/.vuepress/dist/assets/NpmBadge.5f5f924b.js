import{d as p,c as t,o,a as d,b as g,u as c}from"./app.594cd40c.js";import{_ as l}from"./plugin-vue_export-helper.21dcd24c.js";const i=["href","title"],u=["src","alt"],_=p({props:{package:{type:String,required:!0},distTag:{type:String,required:!1,default:"next"}},setup(a){const e=a,r=t(()=>`https://www.npmjs.com/package/${e.package}`),n=t(()=>e.distTag?`${e.package}@${e.distTag}`:e.package),s=t(()=>`https://badgen.net/npm/v/${e.package}/${e.distTag}?label=${encodeURIComponent(n.value)}`);return(m,f)=>(o(),d("a",{class:"npm-badge",href:c(r),title:a.package,target:"_blank",rel:"noopener noreferrer"},[g("img",{src:c(s),alt:a.package},null,8,u)],8,i))}});var h=l(_,[["__scopeId","data-v-6c2ce24c"]]);export{h as default};
