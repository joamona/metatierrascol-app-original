"use strict";(self.webpackChunkLandSurvey=self.webpackChunkLandSurvey||[]).push([[899],{899:(y,u,i)=>{i.r(u),i.d(u,{PreferencesWeb:()=>f});var r=i(861),c=i(726);class f extends c.Uw{constructor(){super(...arguments),this.group="CapacitorStorage"}configure({group:e}){var t=this;return(0,r.Z)(function*(){"string"==typeof e&&(t.group=e)})()}get(e){var t=this;return(0,r.Z)(function*(){return{value:t.impl.getItem(t.applyPrefix(e.key))}})()}set(e){var t=this;return(0,r.Z)(function*(){t.impl.setItem(t.applyPrefix(e.key),e.value)})()}remove(e){var t=this;return(0,r.Z)(function*(){t.impl.removeItem(t.applyPrefix(e.key))})()}keys(){var e=this;return(0,r.Z)(function*(){return{keys:e.rawKeys().map(s=>s.substring(e.prefix.length))}})()}clear(){var e=this;return(0,r.Z)(function*(){for(const t of e.rawKeys())e.impl.removeItem(t)})()}migrate(){var e=this;return(0,r.Z)(function*(){var t;const s=[],n=[],p=Object.keys(e.impl).filter(o=>0===o.indexOf("_cap_"));for(const o of p){const a=o.substring(5),m=null!==(t=e.impl.getItem(o))&&void 0!==t?t:"",{value:h}=yield e.get({key:a});"string"==typeof h?n.push(a):(yield e.set({key:a,value:m}),s.push(a))}return{migrated:s,existing:n}})()}removeOld(){var e=this;return(0,r.Z)(function*(){const s=Object.keys(e.impl).filter(n=>0===n.indexOf("_cap_"));for(const n of s)e.impl.removeItem(n)})()}get impl(){return window.localStorage}get prefix(){return"NativeStorage"===this.group?"":`${this.group}.`}rawKeys(){return Object.keys(this.impl).filter(e=>0===e.indexOf(this.prefix))}applyPrefix(e){return this.prefix+e}}}}]);