"use strict";(self.webpackChunkMetaTierrasCol=self.webpackChunkMetaTierrasCol||[]).push([[516],{516:(u,a,t)=>{t.r(a),t.d(a,{Network:()=>l,NetworkWeb:()=>i});var c=t(861),r=t(726);function s(){const o=window.navigator.connection||window.navigator.mozConnection||window.navigator.webkitConnection;let n="unknown";const e=o?o.type||o.effectiveType:null;if(e&&"string"==typeof e)switch(e){case"bluetooth":case"cellular":case"slow-2g":case"2g":case"3g":n="cellular";break;case"none":n="none";break;case"ethernet":case"wifi":case"wimax":case"4g":n="wifi";break;case"other":case"unknown":n="unknown"}return n}class i extends r.Uw{constructor(){super(),this.handleOnline=()=>{const e={connected:!0,connectionType:s()};this.notifyListeners("networkStatusChange",e)},this.handleOffline=()=>{this.notifyListeners("networkStatusChange",{connected:!1,connectionType:"none"})},typeof window<"u"&&(window.addEventListener("online",this.handleOnline),window.addEventListener("offline",this.handleOffline))}getStatus(){var n=this;return(0,c.Z)(function*(){if(!window.navigator)throw n.unavailable("Browser does not support the Network Information API");const e=window.navigator.onLine,w=s();return{connected:e,connectionType:e?w:"none"}})()}}const l=new i}}]);