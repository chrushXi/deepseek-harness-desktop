"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[194],{7194:function(e,t,i){let a,r;i.d(t,{G8:function(){return nk},LZ:function(){return nL},iJ:function(){return nM},UU:function(){return nD},DD:function(){return nR},Dc:function(){return nC},IJ:function(){return nO}});var s,n,o,l,d,u,h,c,m,p,E,v,b,g,A,f,_,T,I,y,w,S,L,k,M,R,D,C,O,N,U,P,x,V,H,W,F,$,B,G,K,q,Q,Y,j,Z,z,X,J,ee,et,ei,ea,er,es,en,eo,el,ed,eu,eh,ec,em,ep,eE,ev,eb,eg,eA,ef,e_,eT,eI,ey,ew,eS,eL,ek,eM,eR,eD,eC,eO,eN,eU,eP,ex,eV,eH,eW,eF,e$,eB,eG,eK,eq,eQ,eY,ej,eZ,ez,eX,eJ,e0,e1,e2,e5,e3,e4,e7,e8,e9,e6,te,tt,ti,ta,tr,ts,tn,to,tl,td,tu,th,tc,tm,tp,tE,tv,tb,tg,tA,tf,t_,tT,tI,ty,tw,tS,tL,tk,tM,tR,tD,tC,tO,tN,tU,tP,tx,tV=i(9512);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Modified version of `@lit/react` for vanilla custom elements with support for SSR.
 */let tH=new Set(["style","children","ref","key","suppressContentEditableWarning","suppressHydrationWarning","dangerouslySetInnerHTML"]),tW={className:"class",htmlFor:"for"};function tF(e){return e.toLowerCase()}function t$(e){return"boolean"==typeof e?e?"":void 0:"function"==typeof e?void 0:"object"!=typeof e||null===e?e:void 0}function tB({react:e,tagName:t,elementClass:i,events:a,displayName:r,defaultProps:s,toAttributeName:n=tF,toAttributeValue:o=t$}){let l=Number.parseInt(e.version)>=19,d=e.forwardRef((r,d)=>{let u=e.useRef(null),h=e.useRef(new Map),c={},m={},p={},E={};for(let[e,t]of Object.entries(r)){if(tH.has(e)){p[e]=t;continue}let a=n(tW[e]??e);if(i.prototype&&e in i.prototype&&!(e in(globalThis.HTMLElement?.prototype??{}))&&!i.observedAttributes?.some(e=>e===a)){E[e]=t;continue}if(e.startsWith("on")){c[e]=t;continue}let r=o(t);if(a&&null!=r&&(m[a]=String(r),l||(p[a]=r)),a&&l){let e=t$(t);r!==e?p[a]=r:p[a]=t}}if("undefined"!=typeof window){for(let t in c){let i=c[t],r=t.endsWith("Capture"),s=(a?.[t]??t.slice(2).toLowerCase()).slice(0,r?-7:void 0);e.useLayoutEffect(()=>{let e=u?.current;if(e&&"function"==typeof i)return e.addEventListener(s,i,r),()=>{e.removeEventListener(s,i,r)}},[u?.current,i])}e.useLayoutEffect(()=>{if(null===u.current)return;let e=new Map;for(let t in E)tG(u.current,t,E[t]),h.current.delete(t),e.set(t,E[t]);for(let[e,t]of h.current)tG(u.current,e,void 0);h.current=e})}if("undefined"==typeof window&&i?.getTemplateHTML&&i?.shadowRootOptions){let{mode:t,delegatesFocus:a}=i.shadowRootOptions,s=e.createElement("template",{shadowrootmode:t,shadowrootdelegatesfocus:a,dangerouslySetInnerHTML:{__html:i.getTemplateHTML(m,r)},key:"ce-la-react-ssr-template-shadow-root"});p.children=[s,p.children]}return e.createElement(t,{...s,...p,ref:e.useCallback(e=>{u.current=e,"function"==typeof d?d(e):null!==d&&(d.current=e)},[d])},p.children)});return d.displayName=r??i.name,d}function tG(e,t,i){e[t]=i,null==i&&t in(globalThis.HTMLElement?.prototype??{})&&e.removeAttribute(t)}let tK={MEDIA_PLAY_REQUEST:"mediaplayrequest",MEDIA_PAUSE_REQUEST:"mediapauserequest",MEDIA_MUTE_REQUEST:"mediamuterequest",MEDIA_UNMUTE_REQUEST:"mediaunmuterequest",MEDIA_LOOP_REQUEST:"medialooprequest",MEDIA_VOLUME_REQUEST:"mediavolumerequest",MEDIA_SEEK_REQUEST:"mediaseekrequest",MEDIA_AIRPLAY_REQUEST:"mediaairplayrequest",MEDIA_ENTER_FULLSCREEN_REQUEST:"mediaenterfullscreenrequest",MEDIA_EXIT_FULLSCREEN_REQUEST:"mediaexitfullscreenrequest",MEDIA_PREVIEW_REQUEST:"mediapreviewrequest",MEDIA_ENTER_PIP_REQUEST:"mediaenterpiprequest",MEDIA_EXIT_PIP_REQUEST:"mediaexitpiprequest",MEDIA_ENTER_CAST_REQUEST:"mediaentercastrequest",MEDIA_EXIT_CAST_REQUEST:"mediaexitcastrequest",MEDIA_SHOW_TEXT_TRACKS_REQUEST:"mediashowtexttracksrequest",MEDIA_HIDE_TEXT_TRACKS_REQUEST:"mediahidetexttracksrequest",MEDIA_SHOW_SUBTITLES_REQUEST:"mediashowsubtitlesrequest",MEDIA_DISABLE_SUBTITLES_REQUEST:"mediadisablesubtitlesrequest",MEDIA_TOGGLE_SUBTITLES_REQUEST:"mediatogglesubtitlesrequest",MEDIA_PLAYBACK_RATE_REQUEST:"mediaplaybackraterequest",MEDIA_RENDITION_REQUEST:"mediarenditionrequest",MEDIA_AUDIO_TRACK_REQUEST:"mediaaudiotrackrequest",MEDIA_SEEK_TO_LIVE_REQUEST:"mediaseektoliverequest",REGISTER_MEDIA_STATE_RECEIVER:"registermediastatereceiver",UNREGISTER_MEDIA_STATE_RECEIVER:"unregistermediastatereceiver"},tq={MEDIA_CHROME_ATTRIBUTES:"mediachromeattributes",MEDIA_CONTROLLER:"mediacontroller"},tQ={MEDIA_AIRPLAY_UNAVAILABLE:"mediaAirplayUnavailable",MEDIA_AUDIO_TRACK_ENABLED:"mediaAudioTrackEnabled",MEDIA_AUDIO_TRACK_LIST:"mediaAudioTrackList",MEDIA_AUDIO_TRACK_UNAVAILABLE:"mediaAudioTrackUnavailable",MEDIA_BUFFERED:"mediaBuffered",MEDIA_CAST_UNAVAILABLE:"mediaCastUnavailable",MEDIA_CHAPTERS_CUES:"mediaChaptersCues",MEDIA_CURRENT_TIME:"mediaCurrentTime",MEDIA_DURATION:"mediaDuration",MEDIA_ENDED:"mediaEnded",MEDIA_ERROR:"mediaError",MEDIA_ERROR_CODE:"mediaErrorCode",MEDIA_ERROR_MESSAGE:"mediaErrorMessage",MEDIA_FULLSCREEN_UNAVAILABLE:"mediaFullscreenUnavailable",MEDIA_HAS_PLAYED:"mediaHasPlayed",MEDIA_HEIGHT:"mediaHeight",MEDIA_IS_AIRPLAYING:"mediaIsAirplaying",MEDIA_IS_CASTING:"mediaIsCasting",MEDIA_IS_FULLSCREEN:"mediaIsFullscreen",MEDIA_IS_PIP:"mediaIsPip",MEDIA_LOADING:"mediaLoading",MEDIA_MUTED:"mediaMuted",MEDIA_LOOP:"mediaLoop",MEDIA_PAUSED:"mediaPaused",MEDIA_PIP_UNAVAILABLE:"mediaPipUnavailable",MEDIA_PLAYBACK_RATE:"mediaPlaybackRate",MEDIA_PREVIEW_CHAPTER:"mediaPreviewChapter",MEDIA_PREVIEW_COORDS:"mediaPreviewCoords",MEDIA_PREVIEW_IMAGE:"mediaPreviewImage",MEDIA_PREVIEW_TIME:"mediaPreviewTime",MEDIA_RENDITION_LIST:"mediaRenditionList",MEDIA_RENDITION_SELECTED:"mediaRenditionSelected",MEDIA_RENDITION_UNAVAILABLE:"mediaRenditionUnavailable",MEDIA_SEEKABLE:"mediaSeekable",MEDIA_STREAM_TYPE:"mediaStreamType",MEDIA_SUBTITLES_LIST:"mediaSubtitlesList",MEDIA_SUBTITLES_SHOWING:"mediaSubtitlesShowing",MEDIA_TARGET_LIVE_WINDOW:"mediaTargetLiveWindow",MEDIA_TIME_IS_LIVE:"mediaTimeIsLive",MEDIA_VOLUME:"mediaVolume",MEDIA_VOLUME_LEVEL:"mediaVolumeLevel",MEDIA_VOLUME_UNAVAILABLE:"mediaVolumeUnavailable",MEDIA_LANG:"mediaLang",MEDIA_WIDTH:"mediaWidth"},tY=Object.entries(tQ),tj=tY.reduce((e,[t,i])=>(e[t]=i.toLowerCase(),e),{}),tZ=tY.reduce((e,[t,i])=>(e[t]=i.toLowerCase(),e),{USER_INACTIVE_CHANGE:"userinactivechange",BREAKPOINTS_CHANGE:"breakpointchange",BREAKPOINTS_COMPUTED:"breakpointscomputed"});Object.entries(tZ).reduce((e,[t,i])=>{let a=tj[t];return a&&(e[i]=a),e},{userinactivechange:"userinactive"});let tz=Object.entries(tj).reduce((e,[t,i])=>{let a=tZ[t];return a&&(e[i]=a),e},{userinactive:"userinactivechange"}),tX={SUBTITLES:"subtitles",CAPTIONS:"captions",CHAPTERS:"chapters",METADATA:"metadata"},tJ={DISABLED:"disabled",SHOWING:"showing"},t0={MOUSE:"mouse",PEN:"pen",TOUCH:"touch"},t1={UNAVAILABLE:"unavailable",UNSUPPORTED:"unsupported"},t2={LIVE:"live",ON_DEMAND:"on-demand",UNKNOWN:"unknown"},t5={FULLSCREEN:"fullscreen"};function t3(e){if(e){let{id:t,width:i,height:a}=e;return[t,i,a].filter(e=>null!=e).join(":")}}function t4(e){if(e){let{id:t,kind:i,language:a,label:r}=e;return[t,i,a,r].filter(e=>null!=e).join(":")}}function t7(e){return"number"==typeof e&&!Number.isNaN(e)&&Number.isFinite(e)}let t8=e=>new Promise(t=>setTimeout(t,e)),t9={en:{"Start airplay":"Start airplay","Stop airplay":"Stop airplay",Audio:"Audio",Captions:"Captions","Enable captions":"Enable captions","Disable captions":"Disable captions","Start casting":"Start casting","Stop casting":"Stop casting","Enter fullscreen mode":"Enter fullscreen mode","Exit fullscreen mode":"Exit fullscreen mode",Mute:"Mute",Unmute:"Unmute",Loop:"Loop","Enter picture in picture mode":"Enter picture in picture mode","Exit picture in picture mode":"Exit picture in picture mode",Play:"Play",Pause:"Pause","Playback rate":"Playback rate","Playback rate {playbackRate}":"Playback rate {playbackRate}",Quality:"Quality","Seek backward":"Seek backward","Seek forward":"Seek forward",Settings:"Settings",Auto:"Auto","audio player":"audio player","video player":"video player",volume:"volume",seek:"seek","closed captions":"closed captions","current playback rate":"current playback rate","playback time":"playback time","media loading":"media loading",settings:"settings","audio tracks":"audio tracks",quality:"quality",play:"play",pause:"pause",mute:"mute",unmute:"unmute","chapter: {chapterName}":"chapter: {chapterName}",live:"live",Off:"Off","start airplay":"start airplay","stop airplay":"stop airplay","start casting":"start casting","stop casting":"stop casting","enter fullscreen mode":"enter fullscreen mode","exit fullscreen mode":"exit fullscreen mode","enter picture in picture mode":"enter picture in picture mode","exit picture in picture mode":"exit picture in picture mode","seek to live":"seek to live","playing live":"playing live","seek back {seekOffset} seconds":"seek back {seekOffset} seconds","seek forward {seekOffset} seconds":"seek forward {seekOffset} seconds","Network Error":"Network Error","Decode Error":"Decode Error","Source Not Supported":"Source Not Supported","Encryption Error":"Encryption Error","A network error caused the media download to fail.":"A network error caused the media download to fail.","A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.":"A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.","An unsupported error occurred. The server or network failed, or your browser does not support this format.":"An unsupported error occurred. The server or network failed, or your browser does not support this format.","The media is encrypted and there are no keys to decrypt it.":"The media is encrypted and there are no keys to decrypt it.",hour:"hour",hours:"hours",minute:"minute",minutes:"minutes",second:"second",seconds:"seconds","{time} remaining":"{time} remaining","{currentTime} of {totalTime}":"{currentTime} of {totalTime}","video not loaded, unknown time.":"video not loaded, unknown time."}},t6=(null==(s=globalThis.navigator)?void 0:s.language)||"en",ie=e=>{t6=e},it=e=>{var t,i,a;let[r]=t6.split("-");return(null==(t=t9[t6])?void 0:t[e])||(null==(i=t9[r])?void 0:i[e])||(null==(a=t9.en)?void 0:a[e])||e},ii=()=>{let[e]=t6.split("-");return t9[t6]?t6:t9[e]?e:"en"},ia=(e,t={})=>it(e).replace(/\{(\w+)\}/g,(e,i)=>i in t?String(t[i]):`{${i}}`),ir=[{singular:"hour",plural:"hours"},{singular:"minute",plural:"minutes"},{singular:"second",plural:"seconds"}],is=(e,t)=>{let i=1===e?ia(ir[t].singular):ia(ir[t].plural);return`${e} ${i}`},io=e=>{if(!t7(e))return"";let t=Math.abs(e),i=t!==e,a=new Date(0,0,0,0,0,t,0),r=[a.getHours(),a.getMinutes(),a.getSeconds()],s=r.map((e,t)=>e&&is(e,t)).filter(e=>e).join(", ");return i?ia("{time} remaining",{time:s}):s};function il(e,t){let i=!1;e<0&&(i=!0,e=0-e);let a=Math.floor((e=e<0?0:e)%60),r=Math.floor(e/60%60),s=Math.floor(e/3600);return(isNaN(e)||e===1/0)&&(s=r=a="0"),r=(((s=s>0||Math.floor(t/3600)>0?s+":":"")||Math.floor(t/60%60)>=10)&&r<10?"0"+r:r)+":",(i?"-":"")+s+r+(a=a<10?"0"+a:a)}Object.freeze({length:0,start(e){let t=e>>>0;if(t>=this.length)throw new DOMException(`Failed to execute 'start' on 'TimeRanges': The index provided (${t}) is greater than or equal to the maximum bound (${this.length}).`);return 0},end(e){let t=e>>>0;if(t>=this.length)throw new DOMException(`Failed to execute 'end' on 'TimeRanges': The index provided (${t}) is greater than or equal to the maximum bound (${this.length}).`);return 0}});class EventTarget{addEventListener(){}removeEventListener(){}dispatchEvent(){return!0}}class Node extends EventTarget{}class Element extends Node{constructor(){super(...arguments),this.role=null}}class ResizeObserver{observe(){}unobserve(){}disconnect(){}}let id={createElement:function(){return new iu.HTMLElement},createElementNS:function(){return new iu.HTMLElement},addEventListener(){},removeEventListener(){},dispatchEvent:e=>!1},iu={ResizeObserver,document:id,Node,Element,HTMLElement:class extends Element{constructor(){super(...arguments),this.innerHTML=""}get content(){return new iu.DocumentFragment}},DocumentFragment:class extends EventTarget{},customElements:{get:function(){},define:function(){},whenDefined:function(){}},localStorage:{getItem:e=>null,setItem(e,t){},removeItem(e){}},CustomEvent:function(){},getComputedStyle:function(){},navigator:{languages:[],get userAgent(){return""}},matchMedia:e=>({matches:!1,media:e}),DOMParser:class{parseFromString(e,t){return{body:{textContent:e}}}}},ih="global"in globalThis&&(null==globalThis?void 0:globalThis.global)===globalThis||"undefined"==typeof window||void 0===window.customElements,ic=Object.keys(iu).every(e=>e in globalThis),im=ih&&!ic?iu:globalThis,ip=ih&&!ic?id:globalThis.document,iE=new WeakMap,iv=e=>{let t=iE.get(e);return t||iE.set(e,t=new Set),t},ib=new im.ResizeObserver(e=>{for(let t of e)for(let e of iv(t.target))e(t)});function ig(e,t){iv(e).add(t),ib.observe(e)}function iA(e,t){let i=iv(e);i.delete(t),i.size||ib.unobserve(e)}function i_(e){let t={};for(let i of e)t[i.name]=i.value;return t}let iT=(e,t,i=".value")=>{let a=e.querySelector(i);a&&(a.textContent=t)},iI=(e,t)=>{let i=`slot[name="${t}"]`,a=e.shadowRoot.querySelector(i);return a?a.children:[]},iy=(e,t)=>iI(e,t)[0],iw=(e,t)=>!!e&&!!t&&(null!=e&&!!e.contains(t)||iw(e,t.getRootNode().host)),iS=(e,t)=>{if(!e)return null;let i=e.closest(t);return i||iS(e.getRootNode().host,t)};function iL(e,{depth:t=3,checkOpacity:i=!0,checkVisibilityCSS:a=!0}={}){if(e.checkVisibility)return e.checkVisibility({checkOpacity:i,checkVisibilityCSS:a});let r=e;for(;r&&t>0;){let e=getComputedStyle(r);if(i&&"0"===e.opacity||a&&"hidden"===e.visibility||"none"===e.display)return!1;r=r.parentElement,t--}return!0}function ik(e,t){let i=function(e,t){var i,a;let r;for(r of null!=(i=e.querySelectorAll("style:not([media])"))?i:[]){let e;try{e=null==(a=r.sheet)?void 0:a.cssRules}catch{continue}for(let i of null!=e?e:[])if(t(i.selectorText))return i}}(e,e=>e===t);return i||iM(e,t)}function iM(e,t){var i,a;let r=null!=(i=e.querySelectorAll("style:not([media])"))?i:[],s=null==r?void 0:r[r.length-1];if(!(null==s?void 0:s.sheet))return console.warn("Media Chrome: No style sheet found on style tag of",e),{style:{setProperty:()=>{},removeProperty:()=>"",getPropertyValue:()=>""}};let n=null==s?void 0:s.sheet.insertRule(`${t}{}`,s.sheet.cssRules.length);return null==(a=s.sheet.cssRules)?void 0:a[n]}function iR(e,t,i=Number.NaN){let a=e.getAttribute(t);return null!=a?+a:i}function iD(e,t,i){let a=+i;if(null==i||Number.isNaN(a)){e.hasAttribute(t)&&e.removeAttribute(t);return}iR(e,t,void 0)!==a&&e.setAttribute(t,`${a}`)}function iC(e,t){return e.hasAttribute(t)}function iO(e,t,i){if(null==i){e.hasAttribute(t)&&e.removeAttribute(t);return}iC(e,t)!=i&&e.toggleAttribute(t,i)}function iN(e,t,i=null){var a;return null!=(a=e.getAttribute(t))?a:i}function iU(e,t,i){if(null==i){e.hasAttribute(t)&&e.removeAttribute(t);return}let a=`${i}`;iN(e,t,void 0)!==a&&e.setAttribute(t,a)}var iP=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},ix=(e,t,i)=>(iP(e,t,"read from private field"),i?i.call(e):t.get(e)),iV=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},iH=(e,t,i,a)=>(iP(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class iW extends im.HTMLElement{constructor(){if(super(),iV(this,n,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=i_(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[tq.MEDIA_CONTROLLER,tj.MEDIA_PAUSED]}attributeChangedCallback(e,t,i){var a,r,s,o,l;e===tq.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=ix(this,n))?void 0:a.unassociateElement)||r.call(a,this),iH(this,n,null)),i&&this.isConnected&&(iH(this,n,null==(s=this.getRootNode())?void 0:s.getElementById(i)),null==(l=null==(o=ix(this,n))?void 0:o.associateElement)||l.call(o,this)))}connectedCallback(){var e,t;this.tabIndex=-1,this.setAttribute("aria-hidden","true"),iH(this,n,function(e){var t;let i=e.getAttribute(tq.MEDIA_CONTROLLER);return i?null==(t=e.getRootNode())?void 0:t.getElementById(i):iS(e,"media-controller")}(this)),this.getAttribute(tq.MEDIA_CONTROLLER)&&(null==(t=null==(e=ix(this,n))?void 0:e.associateElement)||t.call(e,this)),ix(this,n)&&(ix(this,n).addEventListener("pointerdown",this),ix(this,n).addEventListener("click",this),ix(this,n).hasAttribute("tabindex")||(ix(this,n).tabIndex=0))}disconnectedCallback(){var e,t,i,a;this.getAttribute(tq.MEDIA_CONTROLLER)&&(null==(t=null==(e=ix(this,n))?void 0:e.unassociateElement)||t.call(e,this)),null==(i=ix(this,n))||i.removeEventListener("pointerdown",this),null==(a=ix(this,n))||a.removeEventListener("click",this),iH(this,n,null)}handleEvent(e){var t;let i=null==(t=e.composedPath())?void 0:t[0];if(["video","media-controller"].includes(null==i?void 0:i.localName)){if("pointerdown"===e.type)this._pointerType=e.pointerType;else if("click"===e.type){let{clientX:t,clientY:i}=e,{left:a,top:r,width:s,height:n}=this.getBoundingClientRect(),o=t-a,l=i-r;if(o<0||l<0||o>s||l>n||0===s&&0===n)return;let d=this._pointerType||"mouse";if(this._pointerType=void 0,d===t0.TOUCH){this.handleTap(e);return}if(d===t0.MOUSE||d===t0.PEN){this.handleMouseClick(e);return}}}}get mediaPaused(){return iC(this,tj.MEDIA_PAUSED)}set mediaPaused(e){iO(this,tj.MEDIA_PAUSED,e)}handleTap(e){}handleMouseClick(e){let t=this.mediaPaused?tK.MEDIA_PLAY_REQUEST:tK.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new im.CustomEvent(t,{composed:!0,bubbles:!0}))}}n=new WeakMap,iW.shadowRootOptions={mode:"open"},iW.getTemplateHTML=function(e){return`
    <style>
      :host {
        display: var(--media-control-display, var(--media-gesture-receiver-display, inline-block));
        box-sizing: border-box;
      }
    </style>
  `},im.customElements.get("media-gesture-receiver")||im.customElements.define("media-gesture-receiver",iW);var iF=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},i$=(e,t,i)=>(iF(e,t,"read from private field"),i?i.call(e):t.get(e)),iB=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},iG=(e,t,i,a)=>(iF(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),iK=(e,t,i)=>(iF(e,t,"access private method"),i);let iq={AUDIO:"audio",AUTOHIDE:"autohide",BREAKPOINTS:"breakpoints",GESTURES_DISABLED:"gesturesdisabled",KEYBOARD_CONTROL:"keyboardcontrol",NO_AUTOHIDE:"noautohide",USER_INACTIVE:"userinactive",AUTOHIDE_OVER_CONTROLS:"autohideovercontrols"},iQ=Object.values(tj);function iY(e,t){var i;if(!e.isConnected)return;let a=null!=(i=e.getAttribute(iq.BREAKPOINTS))?i:"sm:384 md:576 lg:768 xl:960",r=function(e){let t=e.split(/\s+/);return Object.fromEntries(t.map(e=>e.split(":")))}(a),s=Object.keys(r).filter(e=>t>=parseInt(r[e])),n=!1;if(Object.keys(r).forEach(t=>{if(s.includes(t)){e.hasAttribute(`breakpoint${t}`)||(e.setAttribute(`breakpoint${t}`,""),n=!0);return}e.hasAttribute(`breakpoint${t}`)&&(e.removeAttribute(`breakpoint${t}`),n=!0)}),n){let t=new CustomEvent(tZ.BREAKPOINTS_CHANGE,{detail:s});e.dispatchEvent(t)}e.breakpointsComputed||(e.breakpointsComputed=!0,e.dispatchEvent(new CustomEvent(tZ.BREAKPOINTS_COMPUTED,{bubbles:!0,composed:!0})))}class ij extends im.HTMLElement{constructor(){if(super(),iB(this,E),iB(this,b),iB(this,A),iB(this,_),iB(this,I),iB(this,o,void 0),iB(this,l,0),iB(this,d,null),iB(this,u,null),iB(this,h,void 0),this.breakpointsComputed=!1,iB(this,c,e=>{let t=this.media;for(let i of e){if("childList"!==i.type)continue;let e=i.removedNodes;for(let a of e){if("media"!=a.slot||i.target!=this)continue;let e=i.previousSibling&&i.previousSibling.previousElementSibling;if(e&&t){let t="media"!==e.slot;for(;null!==(e=e.previousSibling);)"media"==e.slot&&(t=!1);t&&this.mediaUnsetCallback(a)}else this.mediaUnsetCallback(a)}if(t)for(let e of i.addedNodes)e===t&&this.handleMediaUpdated(t)}}),iB(this,m,!1),iB(this,p,e=>{i$(this,m)||(setTimeout(()=>{iY(e.target,e.contentRect.width),iG(this,m,!1)},0),iG(this,m,!0))}),iB(this,w,void 0),iB(this,S,()=>{let e=i$(this,w).assignedElements({flatten:!0});if(!e.length){i$(this,d)&&this.mediaUnsetCallback(i$(this,d));return}this.handleMediaUpdated(this.media)}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=i_(this.attributes),t=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(t):this.shadowRoot.innerHTML=t}iG(this,o,new MutationObserver(i$(this,c)))}static get observedAttributes(){return[iq.AUTOHIDE,iq.GESTURES_DISABLED].concat(iQ).filter(e=>![tj.MEDIA_RENDITION_LIST,tj.MEDIA_AUDIO_TRACK_LIST,tj.MEDIA_CHAPTERS_CUES,tj.MEDIA_WIDTH,tj.MEDIA_HEIGHT,tj.MEDIA_ERROR,tj.MEDIA_ERROR_MESSAGE].includes(e))}attributeChangedCallback(e,t,i){e.toLowerCase()==iq.AUTOHIDE&&(this.autohide=i)}get media(){let e=this.querySelector(":scope > [slot=media]");return(null==e?void 0:e.nodeName)=="SLOT"&&(e=e.assignedElements({flatten:!0})[0]),e}async handleMediaUpdated(e){e&&(iG(this,d,e),e.localName.includes("-")&&await im.customElements.whenDefined(e.localName),this.mediaSetCallback(e))}connectedCallback(){var e;i$(this,o).observe(this,{childList:!0,subtree:!0}),ig(this,i$(this,p));let t=null!=this.getAttribute(iq.AUDIO),i=t?ia("audio player"):ia("video player");this.setAttribute("role","region"),this.setAttribute("aria-label",i),this.handleMediaUpdated(this.media),this.setAttribute(iq.USER_INACTIVE,""),iY(this,this.getBoundingClientRect().width);let a=this.querySelector(":scope > slot[slot=media]");a&&(iG(this,w,a),i$(this,w).addEventListener("slotchange",i$(this,S))),this.addEventListener("pointerdown",this),this.addEventListener("pointermove",this),this.addEventListener("pointerup",this),this.addEventListener("mouseleave",this),this.addEventListener("keyup",this),null==(e=im.window)||e.addEventListener("mouseup",this)}disconnectedCallback(){var e;iA(this,i$(this,p)),clearTimeout(i$(this,u)),i$(this,o).disconnect(),this.media&&this.mediaUnsetCallback(this.media),null==(e=im.window)||e.removeEventListener("mouseup",this),this.removeEventListener("pointerdown",this),this.removeEventListener("pointermove",this),this.removeEventListener("pointerup",this),this.removeEventListener("mouseleave",this),this.removeEventListener("keyup",this),i$(this,w)&&(i$(this,w).removeEventListener("slotchange",i$(this,S)),iG(this,w,null)),iG(this,m,!1)}mediaSetCallback(e){}mediaUnsetCallback(e){iG(this,d,null)}handleEvent(e){switch(e.type){case"pointerdown":iG(this,l,e.timeStamp);break;case"pointermove":iK(this,E,v).call(this,e);break;case"pointerup":iK(this,b,g).call(this,e);break;case"mouseleave":iK(this,A,f).call(this);break;case"mouseup":this.removeAttribute(iq.KEYBOARD_CONTROL);break;case"keyup":iK(this,I,y).call(this),this.setAttribute(iq.KEYBOARD_CONTROL,"")}}set autohide(e){let t=Number(e);iG(this,h,isNaN(t)?0:t)}get autohide(){return(void 0===i$(this,h)?2:i$(this,h)).toString()}get breakpoints(){return iN(this,iq.BREAKPOINTS)}set breakpoints(e){iU(this,iq.BREAKPOINTS,e)}get audio(){return iC(this,iq.AUDIO)}set audio(e){iO(this,iq.AUDIO,e)}get gesturesDisabled(){return iC(this,iq.GESTURES_DISABLED)}set gesturesDisabled(e){iO(this,iq.GESTURES_DISABLED,e)}get keyboardControl(){return iC(this,iq.KEYBOARD_CONTROL)}set keyboardControl(e){iO(this,iq.KEYBOARD_CONTROL,e)}get noAutohide(){return iC(this,iq.NO_AUTOHIDE)}set noAutohide(e){iO(this,iq.NO_AUTOHIDE,e)}get autohideOverControls(){return iC(this,iq.AUTOHIDE_OVER_CONTROLS)}set autohideOverControls(e){iO(this,iq.AUTOHIDE_OVER_CONTROLS,e)}get userInteractive(){return iC(this,iq.USER_INACTIVE)}set userInteractive(e){iO(this,iq.USER_INACTIVE,e)}}o=new WeakMap,l=new WeakMap,d=new WeakMap,u=new WeakMap,h=new WeakMap,c=new WeakMap,m=new WeakMap,p=new WeakMap,E=new WeakSet,v=function(e){if("mouse"!==e.pointerType&&e.timeStamp-i$(this,l)<250)return;iK(this,_,T).call(this),clearTimeout(i$(this,u));let t=this.hasAttribute(iq.AUTOHIDE_OVER_CONTROLS);([this,this.media].includes(e.target)||t)&&iK(this,I,y).call(this)},b=new WeakSet,g=function(e){if("touch"===e.pointerType){let t=!this.hasAttribute(iq.USER_INACTIVE);[this,this.media].includes(e.target)&&t?iK(this,A,f).call(this):iK(this,I,y).call(this)}else e.composedPath().some(e=>["media-play-button","media-fullscreen-button"].includes(null==e?void 0:e.localName))&&iK(this,I,y).call(this)},A=new WeakSet,f=function(){if(0>i$(this,h)||this.hasAttribute(iq.USER_INACTIVE))return;this.setAttribute(iq.USER_INACTIVE,"");let e=new im.CustomEvent(tZ.USER_INACTIVE_CHANGE,{composed:!0,bubbles:!0,detail:!0});this.dispatchEvent(e)},_=new WeakSet,T=function(){if(!this.hasAttribute(iq.USER_INACTIVE))return;this.removeAttribute(iq.USER_INACTIVE);let e=new im.CustomEvent(tZ.USER_INACTIVE_CHANGE,{composed:!0,bubbles:!0,detail:!1});this.dispatchEvent(e)},I=new WeakSet,y=function(){iK(this,_,T).call(this),clearTimeout(i$(this,u));let e=parseInt(this.autohide);e<0||iG(this,u,setTimeout(()=>{iK(this,A,f).call(this)},1e3*e))},w=new WeakMap,S=new WeakMap,ij.shadowRootOptions={mode:"open"},ij.getTemplateHTML=function(e){return`
    <style>
      
      :host([${tj.MEDIA_IS_FULLSCREEN}]) ::slotted([slot=media]) {
        outline: none;
      }

      :host {
        box-sizing: border-box;
        position: relative;
        display: inline-block;
        line-height: 0;
        background-color: var(--media-background-color, #000);
        overflow: hidden;
      }

      :host(:not([${iq.AUDIO}])) [part~=layer]:not([part~=media-layer]) {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        display: flex;
        flex-flow: column nowrap;
        align-items: start;
        pointer-events: none;
        background: none;
      }

      slot[name=media] {
        display: var(--media-slot-display, contents);
      }

      
      :host([${iq.AUDIO}]) slot[name=media] {
        display: var(--media-slot-display, none);
      }

      
      :host([${iq.AUDIO}]) [part~=layer][part~=gesture-layer] {
        height: 0;
        display: block;
      }

      
      :host(:not([${iq.AUDIO}])[${iq.GESTURES_DISABLED}]) ::slotted([slot=gestures-chrome]),
          :host(:not([${iq.AUDIO}])[${iq.GESTURES_DISABLED}]) media-gesture-receiver[slot=gestures-chrome] {
        display: none;
      }

      
      ::slotted(:not([slot=media]):not([slot=poster]):not(media-loading-indicator):not([role=dialog]):not([hidden])) {
        pointer-events: auto;
      }

      :host(:not([${iq.AUDIO}])) *[part~=layer][part~=centered-layer] {
        align-items: center;
        justify-content: center;
      }

      :host(:not([${iq.AUDIO}])) ::slotted(media-gesture-receiver[slot=gestures-chrome]),
      :host(:not([${iq.AUDIO}])) media-gesture-receiver[slot=gestures-chrome] {
        align-self: stretch;
        flex-grow: 1;
      }

      slot[name=middle-chrome] {
        display: inline;
        flex-grow: 1;
        pointer-events: none;
        background: none;
      }

      
      ::slotted([slot=media]),
      ::slotted([slot=poster]) {
        width: 100%;
        height: 100%;
      }

      
      :host(:not([${iq.AUDIO}])) .spacer {
        flex-grow: 1;
      }

      
      :host(:-webkit-full-screen) {
        
        width: 100% !important;
        height: 100% !important;
      }

      
      ::slotted(:not([slot=media]):not([slot=poster]):not([${iq.NO_AUTOHIDE}]):not([hidden]):not([role=dialog])) {
        opacity: 1;
        transition: var(--media-control-transition-in, opacity 0.25s);
      }

      
      :host([${iq.USER_INACTIVE}]:not([${tj.MEDIA_PAUSED}]):not([${tj.MEDIA_IS_AIRPLAYING}]):not([${tj.MEDIA_IS_CASTING}]):not([${iq.AUDIO}])) ::slotted(:not([slot=media]):not([slot=poster]):not([${iq.NO_AUTOHIDE}]):not([role=dialog])) {
        opacity: 0;
        transition: var(--media-control-transition-out, opacity 1s);
      }

      :host([${iq.USER_INACTIVE}]:not([${iq.NO_AUTOHIDE}]):not([${tj.MEDIA_PAUSED}]):not([${tj.MEDIA_IS_CASTING}]):not([${iq.AUDIO}])) ::slotted([slot=media]) {
        cursor: none;
      }

      :host([${iq.USER_INACTIVE}][${iq.AUTOHIDE_OVER_CONTROLS}]:not([${iq.NO_AUTOHIDE}]):not([${tj.MEDIA_PAUSED}]):not([${tj.MEDIA_IS_CASTING}]):not([${iq.AUDIO}])) * {
        --media-cursor: none;
        cursor: none;
      }


      ::slotted(media-control-bar)  {
        align-self: stretch;
      }

      
      :host(:not([${iq.AUDIO}])[${tj.MEDIA_HAS_PLAYED}]) slot[name=poster] {
        display: none;
      }

      ::slotted([role=dialog]) {
        width: 100%;
        height: 100%;
        align-self: center;
      }

      ::slotted([role=menu]) {
        align-self: end;
      }
    </style>

    <slot name="media" part="layer media-layer"></slot>
    <slot name="poster" part="layer poster-layer"></slot>
    <slot name="gestures-chrome" part="layer gesture-layer">
      <media-gesture-receiver slot="gestures-chrome">
        <template shadowrootmode="${iW.shadowRootOptions.mode}">
          ${iW.getTemplateHTML({})}
        </template>
      </media-gesture-receiver>
    </slot>
    <span part="layer vertical-layer">
      <slot name="top-chrome" part="top chrome"></slot>
      <slot name="middle-chrome" part="middle chrome"></slot>
      <slot name="centered-chrome" part="layer centered-layer center centered chrome"></slot>
      
      <slot part="bottom chrome"></slot>
    </span>
    <slot name="dialog" part="layer dialog-layer"></slot>
  `},im.customElements.get("media-container")||im.customElements.define("media-container",ij);var iZ=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},iz=(e,t,i)=>(iZ(e,t,"read from private field"),i?i.call(e):t.get(e)),iX=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},iJ=(e,t,i,a)=>(iZ(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class i0{constructor(e,t,{defaultValue:i}={defaultValue:void 0}){iX(this,D),iX(this,L,void 0),iX(this,k,void 0),iX(this,M,void 0),iX(this,R,new Set),iJ(this,L,e),iJ(this,k,t),iJ(this,M,new Set(i))}[Symbol.iterator](){return iz(this,D,C).values()}get length(){return iz(this,D,C).size}get value(){var e;return null!=(e=[...iz(this,D,C)].join(" "))?e:""}set value(e){var t;e!==this.value&&(iJ(this,R,new Set),this.add(...null!=(t=null==e?void 0:e.split(" "))?t:[]))}toString(){return this.value}item(e){return[...iz(this,D,C)][e]}values(){return iz(this,D,C).values()}forEach(e,t){iz(this,D,C).forEach(e,t)}add(...e){var t,i;e.forEach(e=>iz(this,R).add(e)),(""!==this.value||(null==(t=iz(this,L))?void 0:t.hasAttribute(`${iz(this,k)}`)))&&(null==(i=iz(this,L))||i.setAttribute(`${iz(this,k)}`,`${this.value}`))}remove(...e){var t;e.forEach(e=>iz(this,R).delete(e)),null==(t=iz(this,L))||t.setAttribute(`${iz(this,k)}`,`${this.value}`)}contains(e){return iz(this,D,C).has(e)}toggle(e,t){return void 0!==t?t?(this.add(e),!0):(this.remove(e),!1):this.contains(e)?(this.remove(e),!1):(this.add(e),!0)}replace(e,t){return this.remove(e),this.add(t),e===t}}L=new WeakMap,k=new WeakMap,M=new WeakMap,R=new WeakMap,D=new WeakSet,C=function(){return iz(this,R).size?iz(this,R):iz(this,M)};let i1=(e="")=>e.split(/\s+/),i2=(e="")=>{let[t,i,a]=e.split(":"),r=a?decodeURIComponent(a):void 0;return{kind:"cc"===t?tX.CAPTIONS:tX.SUBTITLES,language:i,label:r}},i5=(e="",t={})=>i1(e).map(e=>{let i=i2(e);return{...t,...i}}),i3=e=>e?Array.isArray(e)?e.map(e=>"string"==typeof e?i2(e):e):"string"==typeof e?i5(e):[e]:[],i4=({kind:e,label:t,language:i}={kind:"subtitles"})=>t?`${"captions"===e?"cc":"sb"}:${i}:${encodeURIComponent(t)}`:i,i7=(e=[])=>Array.prototype.map.call(e,i4).join(" "),i8=(e,t)=>i=>i[e]===t,i9=e=>{let t=Object.entries(e).map(([e,t])=>i8(e,t));return e=>t.every(t=>t(e))},i6=(e,t=[],i=[])=>{let a=i3(i).map(i9);Array.from(t).filter(e=>a.some(t=>t(e))).forEach(t=>{t.mode=e})},ae=(e,t=()=>!0)=>{if(!(null==e?void 0:e.textTracks))return[];let i="function"==typeof t?t:i9(t);return Array.from(e.textTracks).filter(i)},at=e=>{var t;let i=!!(null==(t=e.mediaSubtitlesShowing)?void 0:t.length)||e.hasAttribute(tj.MEDIA_SUBTITLES_SHOWING);return i},ai=e=>{var t;let{media:i,fullscreenElement:a}=e;try{let e=a&&"requestFullscreen"in a?"requestFullscreen":a&&"webkitRequestFullScreen"in a?"webkitRequestFullScreen":void 0;if(e){let i=null==(t=a[e])?void 0:t.call(a);if(i instanceof Promise)return i.catch(()=>{})}else(null==i?void 0:i.webkitEnterFullscreen)?i.webkitEnterFullscreen():(null==i?void 0:i.requestFullscreen)&&i.requestFullscreen()}catch(e){console.error(e)}},aa="exitFullscreen"in ip?"exitFullscreen":"webkitExitFullscreen"in ip?"webkitExitFullscreen":"webkitCancelFullScreen"in ip?"webkitCancelFullScreen":void 0,ar=e=>{var t;let{documentElement:i}=e;if(aa){let e=null==(t=null==i?void 0:i[aa])?void 0:t.call(i);if(e instanceof Promise)return e.catch(()=>{})}},as="fullscreenElement"in ip?"fullscreenElement":"webkitFullscreenElement"in ip?"webkitFullscreenElement":void 0,an=e=>{let{documentElement:t,media:i}=e,a=null==t?void 0:t[as];return!a&&"webkitDisplayingFullscreen"in i&&"webkitPresentationMode"in i&&i.webkitDisplayingFullscreen&&i.webkitPresentationMode===t5.FULLSCREEN?i:a},ao=e=>{var t;let{media:i,documentElement:a,fullscreenElement:r=i}=e;if(!i||!a)return!1;let s=an(e);if(!s)return!1;if(s===r||s===i)return!0;if(s.localName.includes("-")){let e=s.shadowRoot;if(!(as in e))return iw(s,r);for(;null==e?void 0:e[as];){if(e[as]===r)return!0;e=null==(t=e[as])?void 0:t.shadowRoot}}return!1},al="fullscreenEnabled"in ip?"fullscreenEnabled":"webkitFullscreenEnabled"in ip?"webkitFullscreenEnabled":void 0,ad=e=>{let{documentElement:t,media:i}=e;return!!(null==t?void 0:t[al])||i&&"webkitSupportsFullscreen"in i},au=()=>{var e;return a||(a=null==(e=null==ip?void 0:ip.createElement)?void 0:e.call(ip,"video"))},ah=async(e=au())=>{if(!e)return!1;let t=e.volume;e.volume=t/2+.1;let i=new AbortController,a=await Promise.race([ac(e,i.signal),am(e,t)]);return i.abort(),a},ac=(e,t)=>new Promise(i=>{e.addEventListener("volumechange",()=>i(!0),{signal:t})}),am=async(e,t)=>{for(let i=0;i<10;i++){if(e.volume===t)return!1;await t8(10)}return e.volume!==t},ap=/.*Version\/.*Safari\/.*/.test(im.navigator.userAgent),aE=(e=au())=>(!im.matchMedia("(display-mode: standalone)").matches||!ap)&&"function"==typeof(null==e?void 0:e.requestPictureInPicture),av=(e=au())=>ad({documentElement:ip,media:e}),ab=av(),ag=aE(),aA=!!im.WebKitPlaybackTargetAvailabilityEvent,af=!!im.chrome,a_=e=>ae(e.media,e=>[tX.SUBTITLES,tX.CAPTIONS].includes(e.kind)).sort((e,t)=>e.kind>=t.kind?1:-1),aT=e=>ae(e.media,e=>e.mode===tJ.SHOWING&&[tX.SUBTITLES,tX.CAPTIONS].includes(e.kind)),aI=(e,t)=>{let i=a_(e),a=aT(e),r=!!a.length;if(i.length){if(!1===t||r&&!0!==t)i6(tJ.DISABLED,i,a);else if(!0===t||!r&&!1!==t){let t=i[0],{options:r}=e;if(!(null==r?void 0:r.noSubtitlesLangPref)){let e=im.localStorage.getItem("media-chrome-pref-subtitles-lang"),a=e?[e,...im.navigator.languages]:im.navigator.languages,r=i.filter(e=>a.some(t=>e.language.toLowerCase().startsWith(t.split("-")[0]))).sort((e,t)=>{let i=a.findIndex(t=>e.language.toLowerCase().startsWith(t.split("-")[0])),r=a.findIndex(e=>t.language.toLowerCase().startsWith(e.split("-")[0]));return i-r});r[0]&&(t=r[0])}let{language:s,label:n,kind:o}=t;i6(tJ.DISABLED,i,a),i6(tJ.SHOWING,i,[{language:s,label:n,kind:o}])}}},ay=(e,t)=>e===t||null!=e&&null!=t&&typeof e==typeof t&&(!!("number"==typeof e&&Number.isNaN(e)&&Number.isNaN(t))||"object"==typeof e&&(Array.isArray(e)?aw(e,t):Object.entries(e).every(([e,i])=>e in t&&ay(i,t[e])))),aw=(e,t)=>{let i=Array.isArray(e),a=Array.isArray(t);return i===a&&(!i&&!a||e.length===t.length&&e.every((e,i)=>ay(e,t[i])))},aS=Object.values(t2),aL=ah().then(e=>r=e),ak=async(...e)=>{await Promise.all(e.filter(e=>e).map(async e=>{if(!("localName"in e&&e instanceof im.HTMLElement))return;let t=e.localName;if(!t.includes("-"))return;let i=im.customElements.get(t);i&&e instanceof i||(await im.customElements.whenDefined(t),im.customElements.upgrade(e))}))},aM=new im.DOMParser,aR=e=>e&&aM.parseFromString(e,"text/html").body.textContent||e,aD={mediaError:{get(e,t){let{media:i}=e;if((null==t?void 0:t.type)!=="playing")return null==i?void 0:i.error},mediaEvents:["emptied","error","playing"]},mediaErrorCode:{get(e,t){var i;let{media:a}=e;if((null==t?void 0:t.type)!=="playing")return null==(i=null==a?void 0:a.error)?void 0:i.code},mediaEvents:["emptied","error","playing"]},mediaErrorMessage:{get(e,t){var i,a;let{media:r}=e;if((null==t?void 0:t.type)!=="playing")return null!=(a=null==(i=null==r?void 0:r.error)?void 0:i.message)?a:""},mediaEvents:["emptied","error","playing"]},mediaWidth:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.videoWidth)?t:0},mediaEvents:["resize"]},mediaHeight:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.videoHeight)?t:0},mediaEvents:["resize"]},mediaPaused:{get(e){var t;let{media:i}=e;return null==(t=null==i?void 0:i.paused)||t},set(e,t){var i;let{media:a}=t;a&&(e?a.pause():null==(i=a.play())||i.catch(()=>{}))},mediaEvents:["play","playing","pause","emptied"]},mediaHasPlayed:{get(e,t){let{media:i}=e;return!!i&&(t?"playing"===t.type:!i.paused)},mediaEvents:["playing","emptied"]},mediaEnded:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.ended)&&t},mediaEvents:["seeked","ended","emptied"]},mediaPlaybackRate:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.playbackRate)?t:1},set(e,t){let{media:i}=t;i&&Number.isFinite(+e)&&(i.playbackRate=+e)},mediaEvents:["ratechange","loadstart"]},mediaMuted:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.muted)&&t},set(e,t){let{media:i,options:{noMutedPref:a}={}}=t;if(i){i.muted=e;try{let t=null!==im.localStorage.getItem("media-chrome-pref-muted"),r=i.hasAttribute("muted");if(a){t&&im.localStorage.removeItem("media-chrome-pref-muted");return}if(r&&!t)return;im.localStorage.setItem("media-chrome-pref-muted",e?"true":"false")}catch(e){console.debug("Error setting muted pref",e)}}},mediaEvents:["volumechange"],stateOwnersUpdateHandlers:[(e,t)=>{let{options:{noMutedPref:i}}=t,{media:a}=t;if(a&&!a.muted&&!i)try{let i="true"===im.localStorage.getItem("media-chrome-pref-muted");aD.mediaMuted.set(i,t),e(i)}catch(e){console.debug("Error getting muted pref",e)}}]},mediaLoop:{get(e){let{media:t}=e;return null==t?void 0:t.loop},set(e,t){let{media:i}=t;i&&(i.loop=e)},mediaEvents:["medialooprequest"]},mediaVolume:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.volume)?t:1},set(e,t){let{media:i,options:{noVolumePref:a}={}}=t;if(i){try{null==e?im.localStorage.removeItem("media-chrome-pref-volume"):i.hasAttribute("muted")||a||im.localStorage.setItem("media-chrome-pref-volume",e.toString())}catch(e){console.debug("Error setting volume pref",e)}Number.isFinite(+e)&&(i.volume=+e)}},mediaEvents:["volumechange"],stateOwnersUpdateHandlers:[(e,t)=>{let{options:{noVolumePref:i}}=t;if(!i)try{let{media:i}=t;if(!i)return;let a=im.localStorage.getItem("media-chrome-pref-volume");if(null==a)return;aD.mediaVolume.set(+a,t),e(+a)}catch(e){console.debug("Error getting volume pref",e)}}]},mediaVolumeLevel:{get(e){let{media:t}=e;return void 0===(null==t?void 0:t.volume)?"high":t.muted||0===t.volume?"off":t.volume<.5?"low":t.volume<.75?"medium":"high"},mediaEvents:["volumechange"]},mediaCurrentTime:{get(e){var t;let{media:i}=e;return null!=(t=null==i?void 0:i.currentTime)?t:0},set(e,t){let{media:i}=t;i&&t7(e)&&(i.currentTime=e)},mediaEvents:["timeupdate","loadedmetadata"]},mediaDuration:{get(e){let{media:t,options:{defaultDuration:i}={}}=e;return i&&(!t||!t.duration||Number.isNaN(t.duration)||!Number.isFinite(t.duration))?i:Number.isFinite(null==t?void 0:t.duration)?t.duration:Number.NaN},mediaEvents:["durationchange","loadedmetadata","emptied"]},mediaLoading:{get(e){let{media:t}=e;return(null==t?void 0:t.readyState)<3},mediaEvents:["waiting","playing","emptied"]},mediaSeekable:{get(e){var t;let{media:i}=e;if(!(null==(t=null==i?void 0:i.seekable)?void 0:t.length))return;let a=i.seekable.start(0),r=i.seekable.end(i.seekable.length-1);if(a||r)return[Number(a.toFixed(3)),Number(r.toFixed(3))]},mediaEvents:["loadedmetadata","emptied","progress","seekablechange"]},mediaBuffered:{get(e){var t;let{media:i}=e,a=null!=(t=null==i?void 0:i.buffered)?t:[];return Array.from(a).map((e,t)=>[Number(a.start(t).toFixed(3)),Number(a.end(t).toFixed(3))])},mediaEvents:["progress","emptied"]},mediaStreamType:{get(e){let{media:t,options:{defaultStreamType:i}={}}=e,a=[t2.LIVE,t2.ON_DEMAND].includes(i)?i:void 0;if(!t)return a;let{streamType:r}=t;if(aS.includes(r))return r===t2.UNKNOWN?a:r;let s=t.duration;return s===1/0?t2.LIVE:Number.isFinite(s)?t2.ON_DEMAND:a},mediaEvents:["emptied","durationchange","loadedmetadata","streamtypechange"]},mediaTargetLiveWindow:{get(e){let{media:t}=e;if(!t)return Number.NaN;let{targetLiveWindow:i}=t,a=aD.mediaStreamType.get(e);return(null==i||Number.isNaN(i))&&a===t2.LIVE?0:i},mediaEvents:["emptied","durationchange","loadedmetadata","streamtypechange","targetlivewindowchange"]},mediaTimeIsLive:{get(e){let{media:t,options:{liveEdgeOffset:i=10}={}}=e;if(!t)return!1;if("number"==typeof t.liveEdgeStart)return!Number.isNaN(t.liveEdgeStart)&&t.currentTime>=t.liveEdgeStart;let a=aD.mediaStreamType.get(e)===t2.LIVE;if(!a)return!1;let r=t.seekable;if(!r)return!0;if(!r.length)return!1;let s=r.end(r.length-1)-i;return t.currentTime>=s},mediaEvents:["playing","timeupdate","progress","waiting","emptied"]},mediaSubtitlesList:{get:e=>a_(e).map(({kind:e,label:t,language:i})=>({kind:e,label:t,language:i})),mediaEvents:["loadstart"],textTracksEvents:["addtrack","removetrack"]},mediaSubtitlesShowing:{get:e=>aT(e).map(({kind:e,label:t,language:i})=>({kind:e,label:t,language:i})),mediaEvents:["loadstart"],textTracksEvents:["addtrack","removetrack","change"],stateOwnersUpdateHandlers:[(e,t)=>{var i,a;let{media:r,options:s}=t;if(!r)return;let n=e=>{var i;if(!s.defaultSubtitles)return;let a=e&&![tX.CAPTIONS,tX.SUBTITLES].includes(null==(i=null==e?void 0:e.track)?void 0:i.kind);a||aI(t,!0)};return r.addEventListener("loadstart",n),null==(i=r.textTracks)||i.addEventListener("addtrack",n),null==(a=r.textTracks)||a.addEventListener("removetrack",n),()=>{var e,t;r.removeEventListener("loadstart",n),null==(e=r.textTracks)||e.removeEventListener("addtrack",n),null==(t=r.textTracks)||t.removeEventListener("removetrack",n)}}]},mediaChaptersCues:{get(e){var t;let{media:i}=e;if(!i)return[];let[a]=ae(i,{kind:tX.CHAPTERS});return Array.from(null!=(t=null==a?void 0:a.cues)?t:[]).map(({text:e,startTime:t,endTime:i})=>({text:aR(e),startTime:t,endTime:i}))},mediaEvents:["loadstart","loadedmetadata"],textTracksEvents:["addtrack","removetrack","change"],stateOwnersUpdateHandlers:[(e,t)=>{var i;let{media:a}=t;if(!a)return;let r=a.querySelector('track[kind="chapters"][default][src]'),s=null==(i=a.shadowRoot)?void 0:i.querySelector(':is(video,audio) > track[kind="chapters"][default][src]');return null==r||r.addEventListener("load",e),null==s||s.addEventListener("load",e),()=>{null==r||r.removeEventListener("load",e),null==s||s.removeEventListener("load",e)}}]},mediaIsPip:{get(e){var t,i;let{media:a,documentElement:r}=e;if(!a||!r||!r.pictureInPictureElement)return!1;if(r.pictureInPictureElement===a)return!0;if(r.pictureInPictureElement instanceof HTMLMediaElement)return null!=(t=a.localName)&&!!t.includes("-")&&iw(a,r.pictureInPictureElement);if(r.pictureInPictureElement.localName.includes("-")){let e=r.pictureInPictureElement.shadowRoot;for(;null==e?void 0:e.pictureInPictureElement;){if(e.pictureInPictureElement===a)return!0;e=null==(i=e.pictureInPictureElement)?void 0:i.shadowRoot}}return!1},set(e,t){let{media:i}=t;if(i){if(e){if(!ip.pictureInPictureEnabled){console.warn("MediaChrome: Picture-in-picture is not enabled");return}if(!i.requestPictureInPicture){console.warn("MediaChrome: The current media does not support picture-in-picture");return}let e=()=>{console.warn("MediaChrome: The media is not ready for picture-in-picture. It must have a readyState > 0.")};i.requestPictureInPicture().catch(t=>{if(11===t.code){if(!i.src){console.warn("MediaChrome: The media is not ready for picture-in-picture. It must have a src set.");return}if(0===i.readyState&&"none"===i.preload){let t=()=>{i.removeEventListener("loadedmetadata",a),i.preload="none"},a=()=>{i.requestPictureInPicture().catch(e),t()};i.addEventListener("loadedmetadata",a),i.preload="metadata",setTimeout(()=>{0===i.readyState&&e(),t()},1e3)}else throw t}else throw t})}else ip.pictureInPictureElement&&ip.exitPictureInPicture()}},mediaEvents:["enterpictureinpicture","leavepictureinpicture"]},mediaRenditionList:{get(e){var t;let{media:i}=e;return[...null!=(t=null==i?void 0:i.videoRenditions)?t:[]].map(e=>({...e}))},mediaEvents:["emptied","loadstart"],videoRenditionsEvents:["addrendition","removerendition"]},mediaRenditionSelected:{get(e){var t,i,a;let{media:r}=e;return null==(a=null==(i=null==r?void 0:r.videoRenditions)?void 0:i[null==(t=r.videoRenditions)?void 0:t.selectedIndex])?void 0:a.id},set(e,t){let{media:i}=t;if(!(null==i?void 0:i.videoRenditions)){console.warn("MediaController: Rendition selection not supported by this media.");return}let a=Array.prototype.findIndex.call(i.videoRenditions,t=>t.id==e);i.videoRenditions.selectedIndex!=a&&(i.videoRenditions.selectedIndex=a)},mediaEvents:["emptied"],videoRenditionsEvents:["addrendition","removerendition","change"]},mediaAudioTrackList:{get(e){var t;let{media:i}=e;return[...null!=(t=null==i?void 0:i.audioTracks)?t:[]]},mediaEvents:["emptied","loadstart"],audioTracksEvents:["addtrack","removetrack"]},mediaAudioTrackEnabled:{get(e){var t,i;let{media:a}=e;return null==(i=[...null!=(t=null==a?void 0:a.audioTracks)?t:[]].find(e=>e.enabled))?void 0:i.id},set(e,t){let{media:i}=t;if(!(null==i?void 0:i.audioTracks)){console.warn("MediaChrome: Audio track selection not supported by this media.");return}for(let t of i.audioTracks)t.enabled=e==t.id},mediaEvents:["emptied"],audioTracksEvents:["addtrack","removetrack","change"]},mediaIsFullscreen:{get:e=>ao(e),set(e,t,i){var a,r;if(e){ai(t);let e=i.detail;!e||(null==(a=t.media)?void 0:a.inert)||null==(r=t.media)||r.focus()}else ar(t)},rootEvents:["fullscreenchange","webkitfullscreenchange"],mediaEvents:["webkitbeginfullscreen","webkitendfullscreen","webkitpresentationmodechanged"]},mediaIsCasting:{get(e){var t;let{media:i}=e;return null!=i&&!!i.remote&&(null==(t=i.remote)?void 0:t.state)!=="disconnected"&&"connected"===i.remote.state},set(e,t){var i,a;let{media:r}=t;if(r&&(!e||(null==(i=r.remote)?void 0:i.state)==="disconnected")&&(e||(null==(a=r.remote)?void 0:a.state)==="connected")){if("function"!=typeof r.remote.prompt){console.warn("MediaChrome: Casting is not supported in this environment");return}r.remote.prompt().catch(()=>{})}},remoteEvents:["connect","connecting","disconnect"]},mediaIsAirplaying:{get:()=>!1,set(e,t){let{media:i}=t;if(i){if(!(i.webkitShowPlaybackTargetPicker&&im.WebKitPlaybackTargetAvailabilityEvent)){console.error("MediaChrome: received a request to select AirPlay but AirPlay is not supported in this environment");return}i.webkitShowPlaybackTargetPicker()}},mediaEvents:["webkitcurrentplaybacktargetiswirelesschanged"]},mediaFullscreenUnavailable:{get(e){let{media:t}=e;if(!ab||!av(t))return t1.UNSUPPORTED}},mediaPipUnavailable:{get(e){let{media:t}=e;return ag&&aE(t)?(null==t?void 0:t.disablePictureInPicture)?t1.UNAVAILABLE:void 0:t1.UNSUPPORTED}},mediaVolumeUnavailable:{get(e){let{media:t}=e;if(!1===r||(null==t?void 0:t.volume)==void 0)return t1.UNSUPPORTED},stateOwnersUpdateHandlers:[e=>{null==r&&aL.then(t=>e(t?void 0:t1.UNSUPPORTED))}]},mediaCastUnavailable:{get(e,{availability:t="not-available"}={}){var i;let{media:a}=e;return af&&(null==(i=null==a?void 0:a.remote)?void 0:i.state)?null!=t&&"available"!==t?t1.UNAVAILABLE:void 0:t1.UNSUPPORTED},stateOwnersUpdateHandlers:[(e,t)=>{var i;let{media:a}=t;if(!a)return;let r=a.disableRemotePlayback||a.hasAttribute("disableremoteplayback");return r||null==(i=null==a?void 0:a.remote)||i.watchAvailability(t=>{e({availability:t?"available":"not-available"})}).catch(t=>{"NotSupportedError"===t.name?e({availability:null}):e({availability:"not-available"})}),()=>{var e;null==(e=null==a?void 0:a.remote)||e.cancelWatchAvailability().catch(()=>{})}}]},mediaAirplayUnavailable:{get:(e,t)=>aA?(null==t?void 0:t.availability)==="not-available"?t1.UNAVAILABLE:void 0:t1.UNSUPPORTED,mediaEvents:["webkitplaybacktargetavailabilitychanged"],stateOwnersUpdateHandlers:[(e,t)=>{var i;let{media:a}=t;if(!a)return;let r=a.disableRemotePlayback||a.hasAttribute("disableremoteplayback");return r||null==(i=null==a?void 0:a.remote)||i.watchAvailability(t=>{e({availability:t?"available":"not-available"})}).catch(t=>{"NotSupportedError"===t.name?e({availability:null}):e({availability:"not-available"})}),()=>{var e;null==(e=null==a?void 0:a.remote)||e.cancelWatchAvailability().catch(()=>{})}}]},mediaRenditionUnavailable:{get(e){var t;let{media:i}=e;return(null==i?void 0:i.videoRenditions)?(null==(t=i.videoRenditions)?void 0:t.length)?void 0:t1.UNAVAILABLE:t1.UNSUPPORTED},mediaEvents:["emptied","loadstart"],videoRenditionsEvents:["addrendition","removerendition"]},mediaAudioTrackUnavailable:{get(e){var t,i;let{media:a}=e;return(null==a?void 0:a.audioTracks)?(null!=(i=null==(t=a.audioTracks)?void 0:t.length)?i:0)<=1?t1.UNAVAILABLE:void 0:t1.UNSUPPORTED},mediaEvents:["emptied","loadstart"],audioTracksEvents:["addtrack","removetrack"]},mediaLang:{get(e){let{options:{mediaLang:t}={}}=e;return null!=t?t:"en"}}},aC={[tK.MEDIA_PREVIEW_REQUEST](e,t,{detail:i}){var a,r,s;let n,o;let{media:l}=t,d=null!=i?i:void 0;if(l&&null!=d){let[e]=ae(l,{kind:tX.METADATA,label:"thumbnails"}),t=Array.prototype.find.call(null!=(a=null==e?void 0:e.cues)?a:[],(e,t,i)=>0===t?e.endTime>d:t===i.length-1?e.startTime<=d:e.startTime<=d&&e.endTime>d);if(t){let e=/'^(?:[a-z]+:)?\/\//i.test(t.text)?void 0:null==(r=null==l?void 0:l.querySelector('track[label="thumbnails"]'))?void 0:r.src,i=new URL(t.text,e),a=new URLSearchParams(i.hash).get("#xywh");o=a.split(",").map(e=>+e),n=i.href}}let u=e.mediaDuration.get(t),h=e.mediaChaptersCues.get(t),c=null==(s=h.find((e,t,i)=>t===i.length-1&&u===e.endTime?e.startTime<=d&&e.endTime>=d:e.startTime<=d&&e.endTime>d))?void 0:s.text;return null!=i&&null==c&&(c=""),{mediaPreviewTime:d,mediaPreviewImage:n,mediaPreviewCoords:o,mediaPreviewChapter:c}},[tK.MEDIA_PAUSE_REQUEST](e,t){e.mediaPaused.set(!0,t)},[tK.MEDIA_PLAY_REQUEST](e,t){var i,a,r,s;let n=e.mediaStreamType.get(t)===t2.LIVE,o=!(null==(i=t.options)?void 0:i.noAutoSeekToLive),l=e.mediaTargetLiveWindow.get(t)>0;if(n&&o&&!l){let i=null==(a=e.mediaSeekable.get(t))?void 0:a[1];if(i){let a=null!=(s=null==(r=t.options)?void 0:r.seekToLiveOffset)?s:0;e.mediaCurrentTime.set(i-a,t)}}e.mediaPaused.set(!1,t)},[tK.MEDIA_PLAYBACK_RATE_REQUEST](e,t,{detail:i}){e.mediaPlaybackRate.set(i,t)},[tK.MEDIA_MUTE_REQUEST](e,t){e.mediaMuted.set(!0,t)},[tK.MEDIA_UNMUTE_REQUEST](e,t){e.mediaVolume.get(t)||e.mediaVolume.set(.25,t),e.mediaMuted.set(!1,t)},[tK.MEDIA_LOOP_REQUEST](e,t,{detail:i}){let a=!!i;return e.mediaLoop.set(a,t),{mediaLoop:a}},[tK.MEDIA_VOLUME_REQUEST](e,t,{detail:i}){i&&e.mediaMuted.get(t)&&e.mediaMuted.set(!1,t),e.mediaVolume.set(i,t)},[tK.MEDIA_SEEK_REQUEST](e,t,{detail:i}){e.mediaCurrentTime.set(i,t)},[tK.MEDIA_SEEK_TO_LIVE_REQUEST](e,t){var i,a,r;let s=null==(i=e.mediaSeekable.get(t))?void 0:i[1];if(Number.isNaN(Number(s)))return;let n=null!=(r=null==(a=t.options)?void 0:a.seekToLiveOffset)?r:0;e.mediaCurrentTime.set(s-n,t)},[tK.MEDIA_SHOW_SUBTITLES_REQUEST](e,t,{detail:i}){var a;let{options:r}=t,s=a_(t),n=i3(i),o=null==(a=n[0])?void 0:a.language;o&&!r.noSubtitlesLangPref&&im.localStorage.setItem("media-chrome-pref-subtitles-lang",o),i6(tJ.SHOWING,s,n)},[tK.MEDIA_DISABLE_SUBTITLES_REQUEST](e,t,{detail:i}){let a=a_(t);i6(tJ.DISABLED,a,null!=i?i:[])},[tK.MEDIA_TOGGLE_SUBTITLES_REQUEST](e,t,{detail:i}){aI(t,i)},[tK.MEDIA_RENDITION_REQUEST](e,t,{detail:i}){e.mediaRenditionSelected.set(i,t)},[tK.MEDIA_AUDIO_TRACK_REQUEST](e,t,{detail:i}){e.mediaAudioTrackEnabled.set(i,t)},[tK.MEDIA_ENTER_PIP_REQUEST](e,t){e.mediaIsFullscreen.get(t)&&e.mediaIsFullscreen.set(!1,t),e.mediaIsPip.set(!0,t)},[tK.MEDIA_EXIT_PIP_REQUEST](e,t){e.mediaIsPip.set(!1,t)},[tK.MEDIA_ENTER_FULLSCREEN_REQUEST](e,t,i){e.mediaIsPip.get(t)&&e.mediaIsPip.set(!1,t),e.mediaIsFullscreen.set(!0,t,i)},[tK.MEDIA_EXIT_FULLSCREEN_REQUEST](e,t){e.mediaIsFullscreen.set(!1,t)},[tK.MEDIA_ENTER_CAST_REQUEST](e,t){e.mediaIsFullscreen.get(t)&&e.mediaIsFullscreen.set(!1,t),e.mediaIsCasting.set(!0,t)},[tK.MEDIA_EXIT_CAST_REQUEST](e,t){e.mediaIsCasting.set(!1,t)},[tK.MEDIA_AIRPLAY_REQUEST](e,t){e.mediaIsAirplaying.set(!0,t)}},aO=({media:e,fullscreenElement:t,documentElement:i,stateMediator:a=aD,requestMap:r=aC,options:s={},monitorStateOwnersOnlyWithSubscriptions:n=!0})=>{let o;let l=[],d={options:{...s}},u=Object.freeze({mediaPreviewTime:void 0,mediaPreviewImage:void 0,mediaPreviewCoords:void 0,mediaPreviewChapter:void 0}),h=e=>{void 0==e||ay(e,u)||(u=Object.freeze({...u,...e}),l.forEach(e=>e(u)))},c=()=>{let e=Object.entries(a).reduce((e,[t,{get:i}])=>(e[t]=i(d),e),{});h(e)},m={},p=async(e,t)=>{var i,r,s,u,p,E,v,b,g,A,f,_,T,I,y,w;let S=!!o;if(o={...d,...null!=o?o:{},...e},S)return;await ak(...Object.values(e));let L=l.length>0&&0===t&&n,k=d.media!==o.media,M=(null==(i=d.media)?void 0:i.textTracks)!==(null==(r=o.media)?void 0:r.textTracks),R=(null==(s=d.media)?void 0:s.videoRenditions)!==(null==(u=o.media)?void 0:u.videoRenditions),D=(null==(p=d.media)?void 0:p.audioTracks)!==(null==(E=o.media)?void 0:E.audioTracks),C=(null==(v=d.media)?void 0:v.remote)!==(null==(b=o.media)?void 0:b.remote),O=d.documentElement!==o.documentElement,N=!!d.media&&(k||L),U=!!(null==(g=d.media)?void 0:g.textTracks)&&(M||L),P=!!(null==(A=d.media)?void 0:A.videoRenditions)&&(R||L),x=!!(null==(f=d.media)?void 0:f.audioTracks)&&(D||L),V=!!(null==(_=d.media)?void 0:_.remote)&&(C||L),H=!!d.documentElement&&(O||L),W=N||U||P||x||V||H,F=0===l.length&&1===t&&n,$=!!o.media&&(k||F),B=!!(null==(T=o.media)?void 0:T.textTracks)&&(M||F),G=!!(null==(I=o.media)?void 0:I.videoRenditions)&&(R||F),K=!!(null==(y=o.media)?void 0:y.audioTracks)&&(D||F),q=!!(null==(w=o.media)?void 0:w.remote)&&(C||F),Q=!!o.documentElement&&(O||F),Y=$||B||G||K||q||Q;if(!(W||Y)){Object.entries(o).forEach(([e,t])=>{d[e]=t}),c(),o=void 0;return}Object.entries(a).forEach(([e,{get:t,mediaEvents:i=[],textTracksEvents:a=[],videoRenditionsEvents:r=[],audioTracksEvents:s=[],remoteEvents:n=[],rootEvents:l=[],stateOwnersUpdateHandlers:u=[]}])=>{let c;m[e]||(m[e]={});let p=i=>{let a=t(d,i);h({[e]:a})};c=m[e].mediaEvents,i.forEach(t=>{c&&N&&(d.media.removeEventListener(t,c),m[e].mediaEvents=void 0),$&&(o.media.addEventListener(t,p),m[e].mediaEvents=p)}),c=m[e].textTracksEvents,a.forEach(t=>{var i,a;c&&U&&(null==(i=d.media.textTracks)||i.removeEventListener(t,c),m[e].textTracksEvents=void 0),B&&(null==(a=o.media.textTracks)||a.addEventListener(t,p),m[e].textTracksEvents=p)}),c=m[e].videoRenditionsEvents,r.forEach(t=>{var i,a;c&&P&&(null==(i=d.media.videoRenditions)||i.removeEventListener(t,c),m[e].videoRenditionsEvents=void 0),G&&(null==(a=o.media.videoRenditions)||a.addEventListener(t,p),m[e].videoRenditionsEvents=p)}),c=m[e].audioTracksEvents,s.forEach(t=>{var i,a;c&&x&&(null==(i=d.media.audioTracks)||i.removeEventListener(t,c),m[e].audioTracksEvents=void 0),K&&(null==(a=o.media.audioTracks)||a.addEventListener(t,p),m[e].audioTracksEvents=p)}),c=m[e].remoteEvents,n.forEach(t=>{var i,a;c&&V&&(null==(i=d.media.remote)||i.removeEventListener(t,c),m[e].remoteEvents=void 0),q&&(null==(a=o.media.remote)||a.addEventListener(t,p),m[e].remoteEvents=p)}),c=m[e].rootEvents,l.forEach(t=>{c&&H&&(d.documentElement.removeEventListener(t,c),m[e].rootEvents=void 0),Q&&(o.documentElement.addEventListener(t,p),m[e].rootEvents=p)});let E=m[e].stateOwnersUpdateHandlers;if(E&&W){let e=Array.isArray(E)?E:[E];e.forEach(e=>{"function"==typeof e&&e()})}if(Y){let t=u.map(e=>e(p,o)).filter(e=>"function"==typeof e);m[e].stateOwnersUpdateHandlers=1===t.length?t[0]:t}else W&&(m[e].stateOwnersUpdateHandlers=void 0)}),Object.entries(o).forEach(([e,t])=>{d[e]=t}),c(),o=void 0};return p({media:e,fullscreenElement:t,documentElement:i,options:s}),{dispatch(e){let{type:t,detail:i}=e;if(r[t]&&null==u.mediaErrorCode){h(r[t](a,d,e));return}"mediaelementchangerequest"===t?p({media:i}):"fullscreenelementchangerequest"===t?p({fullscreenElement:i}):"documentelementchangerequest"===t?p({documentElement:i}):"optionschangerequest"===t&&(Object.entries(null!=i?i:{}).forEach(([e,t])=>{d.options[e]=t}),c())},getState:()=>u,subscribe:e=>(p({},l.length+1),l.push(e),e(u),()=>{let t=l.indexOf(e);t>=0&&(p({},l.length-1),l.splice(t,1))})}};var aN=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},aU=(e,t,i)=>(aN(e,t,"read from private field"),i?i.call(e):t.get(e)),aP=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},ax=(e,t,i,a)=>(aN(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),aV=(e,t,i)=>(aN(e,t,"access private method"),i);let aH=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Enter"," ","f","m","k","c","l","j",">","<","p"],aW={DEFAULT_SUBTITLES:"defaultsubtitles",DEFAULT_STREAM_TYPE:"defaultstreamtype",DEFAULT_DURATION:"defaultduration",FULLSCREEN_ELEMENT:"fullscreenelement",HOTKEYS:"hotkeys",KEYBOARD_BACKWARD_SEEK_OFFSET:"keyboardbackwardseekoffset",KEYBOARD_FORWARD_SEEK_OFFSET:"keyboardforwardseekoffset",KEYBOARD_DOWN_VOLUME_STEP:"keyboarddownvolumestep",KEYBOARD_UP_VOLUME_STEP:"keyboardupvolumestep",KEYS_USED:"keysused",LANG:"lang",LOOP:"loop",LIVE_EDGE_OFFSET:"liveedgeoffset",NO_AUTO_SEEK_TO_LIVE:"noautoseektolive",NO_DEFAULT_STORE:"nodefaultstore",NO_HOTKEYS:"nohotkeys",NO_MUTED_PREF:"nomutedpref",NO_SUBTITLES_LANG_PREF:"nosubtitleslangpref",NO_VOLUME_PREF:"novolumepref",SEEK_TO_LIVE_OFFSET:"seektoliveoffset"};class aF extends ij{constructor(){super(),aP(this,F),aP(this,G),aP(this,q),this.mediaStateReceivers=[],this.associatedElementSubscriptions=new Map,aP(this,O,new i0(this,aW.HOTKEYS)),aP(this,N,void 0),aP(this,U,void 0),aP(this,P,null),aP(this,x,void 0),aP(this,V,void 0),aP(this,H,e=>{var t;null==(t=aU(this,U))||t.dispatch(e)}),aP(this,W,void 0),aP(this,B,e=>{let{key:t,shiftKey:i}=e,a=i&&("/"===t||"?"===t),r=a||aH.includes(t);if(!r){this.removeEventListener("keyup",aU(this,B));return}this.keyboardShortcutHandler(e)}),this.associateElement(this);let e={};ax(this,x,t=>{Object.entries(t).forEach(([t,i])=>{if(t in e&&e[t]===i)return;this.propagateMediaState(t,i);let a=t.toLowerCase(),r=new im.CustomEvent(tz[a],{composed:!0,detail:i});this.dispatchEvent(r)}),e=t})}static get observedAttributes(){return super.observedAttributes.concat(aW.NO_HOTKEYS,aW.HOTKEYS,aW.DEFAULT_STREAM_TYPE,aW.DEFAULT_SUBTITLES,aW.DEFAULT_DURATION,aW.NO_MUTED_PREF,aW.NO_VOLUME_PREF,aW.LANG,aW.LOOP,aW.LIVE_EDGE_OFFSET,aW.SEEK_TO_LIVE_OFFSET,aW.NO_AUTO_SEEK_TO_LIVE)}get mediaStore(){return aU(this,U)}set mediaStore(e){var t,i;if(aU(this,U)&&(null==(t=aU(this,V))||t.call(this),ax(this,V,void 0)),ax(this,U,e),!aU(this,U)&&!this.hasAttribute(aW.NO_DEFAULT_STORE)){aV(this,F,$).call(this);return}ax(this,V,null==(i=aU(this,U))?void 0:i.subscribe(aU(this,x)))}get fullscreenElement(){var e;return null!=(e=aU(this,N))?e:this}set fullscreenElement(e){var t;this.hasAttribute(aW.FULLSCREEN_ELEMENT)&&this.removeAttribute(aW.FULLSCREEN_ELEMENT),ax(this,N,e),null==(t=aU(this,U))||t.dispatch({type:"fullscreenelementchangerequest",detail:this.fullscreenElement})}get defaultSubtitles(){return iC(this,aW.DEFAULT_SUBTITLES)}set defaultSubtitles(e){iO(this,aW.DEFAULT_SUBTITLES,e)}get defaultStreamType(){return iN(this,aW.DEFAULT_STREAM_TYPE)}set defaultStreamType(e){iU(this,aW.DEFAULT_STREAM_TYPE,e)}get defaultDuration(){return iR(this,aW.DEFAULT_DURATION)}set defaultDuration(e){iD(this,aW.DEFAULT_DURATION,e)}get noHotkeys(){return iC(this,aW.NO_HOTKEYS)}set noHotkeys(e){iO(this,aW.NO_HOTKEYS,e)}get keysUsed(){return iN(this,aW.KEYS_USED)}set keysUsed(e){iU(this,aW.KEYS_USED,e)}get liveEdgeOffset(){return iR(this,aW.LIVE_EDGE_OFFSET)}set liveEdgeOffset(e){iD(this,aW.LIVE_EDGE_OFFSET,e)}get noAutoSeekToLive(){return iC(this,aW.NO_AUTO_SEEK_TO_LIVE)}set noAutoSeekToLive(e){iO(this,aW.NO_AUTO_SEEK_TO_LIVE,e)}get noVolumePref(){return iC(this,aW.NO_VOLUME_PREF)}set noVolumePref(e){iO(this,aW.NO_VOLUME_PREF,e)}get noMutedPref(){return iC(this,aW.NO_MUTED_PREF)}set noMutedPref(e){iO(this,aW.NO_MUTED_PREF,e)}get noSubtitlesLangPref(){return iC(this,aW.NO_SUBTITLES_LANG_PREF)}set noSubtitlesLangPref(e){iO(this,aW.NO_SUBTITLES_LANG_PREF,e)}get noDefaultStore(){return iC(this,aW.NO_DEFAULT_STORE)}set noDefaultStore(e){iO(this,aW.NO_DEFAULT_STORE,e)}get resolvedLang(){return ii()}attributeChangedCallback(e,t,i){var a,r,s,n,o,l,d,u,h,c,m,p;if(super.attributeChangedCallback(e,t,i),e===aW.NO_HOTKEYS)i!==t&&""===i?(this.hasAttribute(aW.HOTKEYS)&&console.warn("Media Chrome: Both `hotkeys` and `nohotkeys` have been set. All hotkeys will be disabled."),this.disableHotkeys()):i!==t&&null===i&&this.enableHotkeys();else if(e===aW.HOTKEYS)aU(this,O).value=i;else if(e===aW.DEFAULT_SUBTITLES&&i!==t)null==(a=aU(this,U))||a.dispatch({type:"optionschangerequest",detail:{defaultSubtitles:this.hasAttribute(aW.DEFAULT_SUBTITLES)}});else if(e===aW.DEFAULT_STREAM_TYPE)null==(s=aU(this,U))||s.dispatch({type:"optionschangerequest",detail:{defaultStreamType:null!=(r=this.getAttribute(aW.DEFAULT_STREAM_TYPE))?r:void 0}});else if(e===aW.LIVE_EDGE_OFFSET&&i!==t)null==(n=aU(this,U))||n.dispatch({type:"optionschangerequest",detail:{liveEdgeOffset:this.hasAttribute(aW.LIVE_EDGE_OFFSET)?+this.getAttribute(aW.LIVE_EDGE_OFFSET):void 0,seekToLiveOffset:this.hasAttribute(aW.SEEK_TO_LIVE_OFFSET)?+this.getAttribute(aW.SEEK_TO_LIVE_OFFSET):this.hasAttribute(aW.LIVE_EDGE_OFFSET)?+this.getAttribute(aW.LIVE_EDGE_OFFSET):void 0}});else if(e===aW.SEEK_TO_LIVE_OFFSET&&i!==t)null==(o=aU(this,U))||o.dispatch({type:"optionschangerequest",detail:{seekToLiveOffset:this.hasAttribute(aW.SEEK_TO_LIVE_OFFSET)?+this.getAttribute(aW.SEEK_TO_LIVE_OFFSET):this.hasAttribute(aW.LIVE_EDGE_OFFSET)?+this.getAttribute(aW.LIVE_EDGE_OFFSET):void 0}});else if(e===aW.NO_AUTO_SEEK_TO_LIVE)null==(l=aU(this,U))||l.dispatch({type:"optionschangerequest",detail:{noAutoSeekToLive:this.hasAttribute(aW.NO_AUTO_SEEK_TO_LIVE)}});else if(e===aW.FULLSCREEN_ELEMENT){let e=i?null==(d=this.getRootNode())?void 0:d.getElementById(i):void 0;ax(this,N,e),null==(u=aU(this,U))||u.dispatch({type:"fullscreenelementchangerequest",detail:this.fullscreenElement})}else e===aW.LANG&&i!==t?(ie(i),null==(h=aU(this,U))||h.dispatch({type:"optionschangerequest",detail:{mediaLang:i}})):e===aW.LOOP&&i!==t?null==(c=aU(this,U))||c.dispatch({type:tK.MEDIA_LOOP_REQUEST,detail:null!=i}):e===aW.NO_VOLUME_PREF&&i!==t?null==(m=aU(this,U))||m.dispatch({type:"optionschangerequest",detail:{noVolumePref:this.hasAttribute(aW.NO_VOLUME_PREF)}}):e===aW.NO_MUTED_PREF&&i!==t&&(null==(p=aU(this,U))||p.dispatch({type:"optionschangerequest",detail:{noMutedPref:this.hasAttribute(aW.NO_MUTED_PREF)}}))}connectedCallback(){var e,t,i;this.associateElement(this),aU(this,U)||this.hasAttribute(aW.NO_DEFAULT_STORE)||aV(this,F,$).call(this),null==(e=aU(this,U))||e.dispatch({type:"documentelementchangerequest",detail:ip}),null==(t=aU(this,U))||t.dispatch({type:"fullscreenelementchangerequest",detail:this.fullscreenElement}),super.connectedCallback(),aU(this,U)&&!aU(this,V)&&ax(this,V,null==(i=aU(this,U))?void 0:i.subscribe(aU(this,x))),void 0!==aU(this,W)&&aU(this,U)&&this.media&&setTimeout(()=>{var e,t,i;(null==(t=null==(e=this.media)?void 0:e.textTracks)?void 0:t.length)&&(null==(i=aU(this,U))||i.dispatch({type:tK.MEDIA_TOGGLE_SUBTITLES_REQUEST,detail:aU(this,W)}))},0),this.hasAttribute(aW.NO_HOTKEYS)?this.disableHotkeys():this.enableHotkeys()}disconnectedCallback(){var e,t,i,a,r,s;if(null==(e=super.disconnectedCallback)||e.call(this),this.disableHotkeys(),aU(this,U)){let e=aU(this,U).getState();ax(this,W,!!(null==(t=e.mediaSubtitlesShowing)?void 0:t.length)),null==(i=aU(this,U))||i.dispatch({type:"fullscreenelementchangerequest",detail:void 0}),null==(a=aU(this,U))||a.dispatch({type:"documentelementchangerequest",detail:void 0}),null==(r=aU(this,U))||r.dispatch({type:tK.MEDIA_TOGGLE_SUBTITLES_REQUEST,detail:!1})}aU(this,V)&&(null==(s=aU(this,V))||s.call(this),ax(this,V,void 0)),this.unassociateElement(this),aU(this,P)&&(aU(this,P).remove(),ax(this,P,null))}mediaSetCallback(e){var t;super.mediaSetCallback(e),null==(t=aU(this,U))||t.dispatch({type:"mediaelementchangerequest",detail:e}),e.hasAttribute("tabindex")||(e.tabIndex=-1)}mediaUnsetCallback(e){var t;super.mediaUnsetCallback(e),null==(t=aU(this,U))||t.dispatch({type:"mediaelementchangerequest",detail:void 0})}propagateMediaState(e,t){aX(this.mediaStateReceivers,e,t)}associateElement(e){if(!e)return;let{associatedElementSubscriptions:t}=this;if(t.has(e))return;let i=this.registerMediaStateReceiver.bind(this),a=this.unregisterMediaStateReceiver.bind(this),r=aJ(e,i,a);Object.values(tK).forEach(t=>{e.addEventListener(t,aU(this,H))}),t.set(e,r)}unassociateElement(e){if(!e)return;let{associatedElementSubscriptions:t}=this;if(!t.has(e))return;let i=t.get(e);i(),t.delete(e),Object.values(tK).forEach(t=>{e.removeEventListener(t,aU(this,H))})}registerMediaStateReceiver(e){if(!e)return;let t=this.mediaStateReceivers,i=t.indexOf(e);!(i>-1)&&(t.push(e),aU(this,U)&&Object.entries(aU(this,U).getState()).forEach(([t,i])=>{aX([e],t,i)}))}unregisterMediaStateReceiver(e){let t=this.mediaStateReceivers,i=t.indexOf(e);i<0||t.splice(i,1)}enableHotkeys(){this.addEventListener("keydown",aV(this,G,K))}disableHotkeys(){this.removeEventListener("keydown",aV(this,G,K)),this.removeEventListener("keyup",aU(this,B))}get hotkeys(){return aU(this,O)}set hotkeys(e){iU(this,aW.HOTKEYS,e)}keyboardShortcutHandler(e){var t,i,a,r,s,n,o,l,d;let u,h,c;let m=e.target,p=(null!=(a=null!=(i=null==(t=m.getAttribute(aW.KEYS_USED))?void 0:t.split(" "))?i:null==m?void 0:m.keysUsed)?a:[]).map(e=>"Space"===e?" ":e).filter(Boolean);if(p.includes(e.key)||aU(this,O).contains(`no${e.key.toLowerCase()}`)||" "===e.key&&aU(this,O).contains("nospace"))return;let E=e.shiftKey&&("/"===e.key||"?"===e.key);if(!(E&&aU(this,O).contains("noshift+/")))switch(e.key){case" ":case"k":u=aU(this,U).getState().mediaPaused?tK.MEDIA_PLAY_REQUEST:tK.MEDIA_PAUSE_REQUEST,this.dispatchEvent(new im.CustomEvent(u,{composed:!0,bubbles:!0}));break;case"m":u="off"===this.mediaStore.getState().mediaVolumeLevel?tK.MEDIA_UNMUTE_REQUEST:tK.MEDIA_MUTE_REQUEST,this.dispatchEvent(new im.CustomEvent(u,{composed:!0,bubbles:!0}));break;case"f":u=this.mediaStore.getState().mediaIsFullscreen?tK.MEDIA_EXIT_FULLSCREEN_REQUEST:tK.MEDIA_ENTER_FULLSCREEN_REQUEST,this.dispatchEvent(new im.CustomEvent(u,{composed:!0,bubbles:!0}));break;case"c":this.dispatchEvent(new im.CustomEvent(tK.MEDIA_TOGGLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0}));break;case"ArrowLeft":case"j":{let e=this.hasAttribute(aW.KEYBOARD_BACKWARD_SEEK_OFFSET)?+this.getAttribute(aW.KEYBOARD_BACKWARD_SEEK_OFFSET):10;h=Math.max((null!=(r=this.mediaStore.getState().mediaCurrentTime)?r:0)-e,0),c=new im.CustomEvent(tK.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:h}),this.dispatchEvent(c);break}case"ArrowRight":case"l":{let e=this.hasAttribute(aW.KEYBOARD_FORWARD_SEEK_OFFSET)?+this.getAttribute(aW.KEYBOARD_FORWARD_SEEK_OFFSET):10;h=Math.max((null!=(s=this.mediaStore.getState().mediaCurrentTime)?s:0)+e,0),c=new im.CustomEvent(tK.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:h}),this.dispatchEvent(c);break}case"ArrowUp":{let e=this.hasAttribute(aW.KEYBOARD_UP_VOLUME_STEP)?+this.getAttribute(aW.KEYBOARD_UP_VOLUME_STEP):.025;h=Math.min((null!=(n=this.mediaStore.getState().mediaVolume)?n:1)+e,1),c=new im.CustomEvent(tK.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:h}),this.dispatchEvent(c);break}case"ArrowDown":{let e=this.hasAttribute(aW.KEYBOARD_DOWN_VOLUME_STEP)?+this.getAttribute(aW.KEYBOARD_DOWN_VOLUME_STEP):.025;h=Math.max((null!=(o=this.mediaStore.getState().mediaVolume)?o:1)-e,0),c=new im.CustomEvent(tK.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:h}),this.dispatchEvent(c);break}case"<":{let e=null!=(l=this.mediaStore.getState().mediaPlaybackRate)?l:1;h=Math.max(e-.25,.25).toFixed(2),c=new im.CustomEvent(tK.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:h}),this.dispatchEvent(c);break}case">":{let e=null!=(d=this.mediaStore.getState().mediaPlaybackRate)?d:1;h=Math.min(e+.25,2).toFixed(2),c=new im.CustomEvent(tK.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:h}),this.dispatchEvent(c);break}case"/":case"?":e.shiftKey&&aV(this,q,Q).call(this);break;case"p":u=this.mediaStore.getState().mediaIsPip?tK.MEDIA_EXIT_PIP_REQUEST:tK.MEDIA_ENTER_PIP_REQUEST,c=new im.CustomEvent(u,{composed:!0,bubbles:!0}),this.dispatchEvent(c)}}}O=new WeakMap,N=new WeakMap,U=new WeakMap,P=new WeakMap,x=new WeakMap,V=new WeakMap,H=new WeakMap,W=new WeakMap,F=new WeakSet,$=function(){var e;this.mediaStore=aO({media:this.media,fullscreenElement:this.fullscreenElement,options:{defaultSubtitles:this.hasAttribute(aW.DEFAULT_SUBTITLES),defaultDuration:this.hasAttribute(aW.DEFAULT_DURATION)?+this.getAttribute(aW.DEFAULT_DURATION):void 0,defaultStreamType:null!=(e=this.getAttribute(aW.DEFAULT_STREAM_TYPE))?e:void 0,liveEdgeOffset:this.hasAttribute(aW.LIVE_EDGE_OFFSET)?+this.getAttribute(aW.LIVE_EDGE_OFFSET):void 0,seekToLiveOffset:this.hasAttribute(aW.SEEK_TO_LIVE_OFFSET)?+this.getAttribute(aW.SEEK_TO_LIVE_OFFSET):this.hasAttribute(aW.LIVE_EDGE_OFFSET)?+this.getAttribute(aW.LIVE_EDGE_OFFSET):void 0,noAutoSeekToLive:this.hasAttribute(aW.NO_AUTO_SEEK_TO_LIVE),noVolumePref:this.hasAttribute(aW.NO_VOLUME_PREF),noMutedPref:this.hasAttribute(aW.NO_MUTED_PREF),noSubtitlesLangPref:this.hasAttribute(aW.NO_SUBTITLES_LANG_PREF)}})},B=new WeakMap,G=new WeakSet,K=function(e){var t;let{metaKey:i,altKey:a,key:r,shiftKey:s}=e,n=s&&("/"===r||"?"===r);if(n&&(null==(t=aU(this,P))?void 0:t.open)||i||a||!n&&!aH.includes(r)){this.removeEventListener("keyup",aU(this,B));return}let o=e.target,l=o instanceof HTMLElement&&("media-volume-range"===o.tagName.toLowerCase()||"media-time-range"===o.tagName.toLowerCase());![" ","ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(r)||aU(this,O).contains(`no${r.toLowerCase()}`)||" "===r&&aU(this,O).contains("nospace")||l||e.preventDefault(),this.addEventListener("keyup",aU(this,B),{once:!0})},q=new WeakSet,Q=function(){aU(this,P)||(ax(this,P,ip.createElement("media-keyboard-shortcuts-dialog")),this.appendChild(aU(this,P))),aU(this,P).open=!0};let a$=Object.values(tj),aB=Object.values(tQ),aG=e=>{var t,i,a,r;let{observedAttributes:s}=e.constructor;!s&&(null==(t=e.nodeName)?void 0:t.includes("-"))&&(im.customElements.upgrade(e),{observedAttributes:s}=e.constructor);let n=null==(r=null==(a=null==(i=null==e?void 0:e.getAttribute)?void 0:i.call(e,tq.MEDIA_CHROME_ATTRIBUTES))?void 0:a.split)?void 0:r.call(a,/\s+/);return Array.isArray(s||n)?(s||n).filter(e=>a$.includes(e)):[]},aK=e=>{var t,i;return(null==(t=e.nodeName)?void 0:t.includes("-"))&&im.customElements.get(null==(i=e.nodeName)?void 0:i.toLowerCase())&&!(e instanceof im.customElements.get(e.nodeName.toLowerCase()))&&im.customElements.upgrade(e),aB.some(t=>t in e)},aq=e=>aK(e)||!!aG(e).length,aQ=e=>{var t;return null==(t=null==e?void 0:e.join)?void 0:t.call(e,":")},aY={[tj.MEDIA_SUBTITLES_LIST]:i7,[tj.MEDIA_SUBTITLES_SHOWING]:i7,[tj.MEDIA_SEEKABLE]:aQ,[tj.MEDIA_BUFFERED]:e=>null==e?void 0:e.map(aQ).join(" "),[tj.MEDIA_PREVIEW_COORDS]:e=>null==e?void 0:e.join(" "),[tj.MEDIA_RENDITION_LIST]:function(e){return null==e?void 0:e.map(t3).join(" ")},[tj.MEDIA_AUDIO_TRACK_LIST]:function(e){return null==e?void 0:e.map(t4).join(" ")}},aj=async(e,t,i)=>{var a,r;if(e.isConnected||await t8(0),"boolean"==typeof i||null==i)return iO(e,t,i);if("number"==typeof i)return iD(e,t,i);if("string"==typeof i)return iU(e,t,i);if(Array.isArray(i)&&!i.length)return e.removeAttribute(t);let s=null!=(r=null==(a=aY[t])?void 0:a.call(aY,i))?r:i;return e.setAttribute(t,s)},aZ=e=>{var t;return!!(null==(t=e.closest)?void 0:t.call(e,'*[slot="media"]'))},az=(e,t)=>{if(aZ(e))return;let i=(e,t)=>{var i,a;aq(e)&&t(e);let{children:r=[]}=null!=e?e:{},s=null!=(a=null==(i=null==e?void 0:e.shadowRoot)?void 0:i.children)?a:[],n=[...r,...s];n.forEach(e=>az(e,t))},a=null==e?void 0:e.nodeName.toLowerCase();if(a.includes("-")&&!aq(e)){im.customElements.whenDefined(a).then(()=>{i(e,t)});return}i(e,t)},aX=(e,t,i)=>{e.forEach(e=>{if(t in e){e[t]=i;return}let a=aG(e),r=t.toLowerCase();a.includes(r)&&aj(e,r,i)})},aJ=(e,t,i)=>{az(e,t);let a=e=>{var i;let a=null!=(i=null==e?void 0:e.composedPath()[0])?i:e.target;t(a)},r=e=>{var t;let a=null!=(t=null==e?void 0:e.composedPath()[0])?t:e.target;i(a)};e.addEventListener(tK.REGISTER_MEDIA_STATE_RECEIVER,a),e.addEventListener(tK.UNREGISTER_MEDIA_STATE_RECEIVER,r);let s=[],n=e=>{let a=e.target;"media"!==a.name&&(s.forEach(e=>az(e,i)),(s=[...a.assignedElements({flatten:!0})]).forEach(e=>az(e,t)))};e.addEventListener("slotchange",n);let o=new MutationObserver(e=>{e.forEach(e=>{let{addedNodes:a=[],removedNodes:r=[],type:s,target:n,attributeName:o}=e;"childList"===s?(Array.prototype.forEach.call(a,e=>az(e,t)),Array.prototype.forEach.call(r,e=>az(e,i))):"attributes"===s&&o===tq.MEDIA_CHROME_ATTRIBUTES&&(aq(n)?t(n):i(n))})});return o.observe(e,{childList:!0,attributes:!0,subtree:!0}),()=>{az(e,i),e.removeEventListener("slotchange",n),o.disconnect(),e.removeEventListener(tK.REGISTER_MEDIA_STATE_RECEIVER,a),e.removeEventListener(tK.UNREGISTER_MEDIA_STATE_RECEIVER,r)}};im.customElements.get("media-controller")||im.customElements.define("media-controller",aF);let a0={PLACEMENT:"placement",BOUNDS:"bounds"};class a1 extends im.HTMLElement{constructor(){if(super(),this.updateXOffset=()=>{var e,t;if(!iL(this,{checkOpacity:!1,checkVisibilityCSS:!1}))return;let i=this.placement;if("left"===i||"right"===i){this.style.removeProperty("--media-tooltip-offset-x");return}let a=getComputedStyle(this),r=null!=(e=iS(this,"#"+this.bounds))?e:null!=(t=function(e){var t;let{MEDIA_CONTROLLER:i}=tq,a=e.getAttribute(i);if(a)return null==(t=function(e){var t;let i=null==(t=null==e?void 0:e.getRootNode)?void 0:t.call(e);return i instanceof ShadowRoot||i instanceof Document?i:null}(e))?void 0:t.getElementById(a)}(this))?t:iS(this,"media-controller");if(!r)return;let{x:s,width:n}=r.getBoundingClientRect(),{x:o,width:l}=this.getBoundingClientRect(),d=a.getPropertyValue("--media-tooltip-offset-x"),u=d?parseFloat(d.replace("px","")):0,h=a.getPropertyValue("--media-tooltip-container-margin"),c=h?parseFloat(h.replace("px","")):0,m=o-s+u-c,p=o+l-(s+n)+u+c;if(m<0){this.style.setProperty("--media-tooltip-offset-x",`${m}px`);return}if(p>0){this.style.setProperty("--media-tooltip-offset-x",`${p}px`);return}this.style.removeProperty("--media-tooltip-offset-x")},!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=i_(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}if(this.arrowEl=this.shadowRoot.querySelector("#arrow"),Object.prototype.hasOwnProperty.call(this,"placement")){let e=this.placement;delete this.placement,this.placement=e}}static get observedAttributes(){return[a0.PLACEMENT,a0.BOUNDS]}get placement(){return iN(this,a0.PLACEMENT)}set placement(e){iU(this,a0.PLACEMENT,e)}get bounds(){return iN(this,a0.BOUNDS)}set bounds(e){iU(this,a0.BOUNDS,e)}}a1.shadowRootOptions={mode:"open"},a1.getTemplateHTML=function(e){return`
    <style>
      :host {
        --_tooltip-background-color: var(--media-tooltip-background-color, var(--media-secondary-color, rgba(20, 20, 30, .7)));
        --_tooltip-background: var(--media-tooltip-background, var(--_tooltip-background-color));
        --_tooltip-arrow-half-width: calc(var(--media-tooltip-arrow-width, 12px) / 2);
        --_tooltip-arrow-height: var(--media-tooltip-arrow-height, 5px);
        --_tooltip-arrow-background: var(--media-tooltip-arrow-color, var(--_tooltip-background-color));
        position: relative;
        pointer-events: none;
        display: var(--media-tooltip-display, inline-flex);
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        z-index: var(--media-tooltip-z-index, 1);
        background: var(--_tooltip-background);
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        font: var(--media-font,
          var(--media-font-weight, 400)
          var(--media-font-size, 13px) /
          var(--media-text-content-height, var(--media-control-height, 18px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        padding: var(--media-tooltip-padding, .35em .7em);
        border: var(--media-tooltip-border, none);
        border-radius: var(--media-tooltip-border-radius, 5px);
        filter: var(--media-tooltip-filter, drop-shadow(0 0 4px rgba(0, 0, 0, .2)));
        white-space: var(--media-tooltip-white-space, nowrap);
      }

      :host([hidden]) {
        display: none;
      }

      img, svg {
        display: inline-block;
      }

      #arrow {
        position: absolute;
        width: 0px;
        height: 0px;
        border-style: solid;
        display: var(--media-tooltip-arrow-display, block);
      }

      :host(:not([placement])),
      :host([placement="top"]) {
        position: absolute;
        bottom: calc(100% + var(--media-tooltip-distance, 12px));
        left: 50%;
        transform: translate(calc(-50% - var(--media-tooltip-offset-x, 0px)), 0);
      }
      :host(:not([placement])) #arrow,
      :host([placement="top"]) #arrow {
        top: 100%;
        left: 50%;
        border-width: var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width) 0 var(--_tooltip-arrow-half-width);
        border-color: var(--_tooltip-arrow-background) transparent transparent transparent;
        transform: translate(calc(-50% + var(--media-tooltip-offset-x, 0px)), 0);
      }

      :host([placement="right"]) {
        position: absolute;
        left: calc(100% + var(--media-tooltip-distance, 12px));
        top: 50%;
        transform: translate(0, -50%);
      }
      :host([placement="right"]) #arrow {
        top: 50%;
        right: 100%;
        border-width: var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width) 0;
        border-color: transparent var(--_tooltip-arrow-background) transparent transparent;
        transform: translate(0, -50%);
      }

      :host([placement="bottom"]) {
        position: absolute;
        top: calc(100% + var(--media-tooltip-distance, 12px));
        left: 50%;
        transform: translate(calc(-50% - var(--media-tooltip-offset-x, 0px)), 0);
      }
      :host([placement="bottom"]) #arrow {
        bottom: 100%;
        left: 50%;
        border-width: 0 var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width);
        border-color: transparent transparent var(--_tooltip-arrow-background) transparent;
        transform: translate(calc(-50% + var(--media-tooltip-offset-x, 0px)), 0);
      }

      :host([placement="left"]) {
        position: absolute;
        right: calc(100% + var(--media-tooltip-distance, 12px));
        top: 50%;
        transform: translate(0, -50%);
      }
      :host([placement="left"]) #arrow {
        top: 50%;
        left: 100%;
        border-width: var(--_tooltip-arrow-half-width) 0 var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height);
        border-color: transparent transparent transparent var(--_tooltip-arrow-background);
        transform: translate(0, -50%);
      }
      
      :host([placement="none"]) #arrow {
        display: none;
      }
    </style>
    <slot></slot>
    <div id="arrow"></div>
  `},im.customElements.get("media-tooltip")||im.customElements.define("media-tooltip",a1);var a2=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},a5=(e,t,i)=>(a2(e,t,"read from private field"),i?i.call(e):t.get(e)),a3=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},a4=(e,t,i,a)=>(a2(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),a7=(e,t,i)=>(a2(e,t,"access private method"),i);let a8={TOOLTIP_PLACEMENT:"tooltipplacement",DISABLED:"disabled",NO_TOOLTIP:"notooltip"};class a9 extends im.HTMLElement{constructor(){if(super(),a3(this,J),a3(this,Y,void 0),this.preventClick=!1,this.tooltipEl=null,a3(this,j,e=>{this.preventClick||this.handleClick(e),setTimeout(a5(this,Z),0)}),a3(this,Z,()=>{var e,t;null==(t=null==(e=this.tooltipEl)?void 0:e.updateXOffset)||t.call(e)}),a3(this,z,e=>{let{key:t}=e;if(!this.keysUsed.includes(t)){this.removeEventListener("keyup",a5(this,z));return}this.preventClick||this.handleClick(e)}),a3(this,X,e=>{let{metaKey:t,altKey:i,key:a}=e;if(t||i||!this.keysUsed.includes(a)){this.removeEventListener("keyup",a5(this,z));return}this.addEventListener("keyup",a5(this,z),{once:!0})}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=i_(this.attributes),t=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(t):this.shadowRoot.innerHTML=t}this.tooltipEl=this.shadowRoot.querySelector("media-tooltip")}static get observedAttributes(){return["disabled",a8.TOOLTIP_PLACEMENT,tq.MEDIA_CONTROLLER,tj.MEDIA_LANG]}enable(){this.addEventListener("click",a5(this,j)),this.addEventListener("keydown",a5(this,X)),this.tabIndex=0}disable(){this.removeEventListener("click",a5(this,j)),this.removeEventListener("keydown",a5(this,X)),this.removeEventListener("keyup",a5(this,z)),this.tabIndex=-1}attributeChangedCallback(e,t,i){var a,r,s,n,o;e===tq.MEDIA_CONTROLLER?(t&&(null==(r=null==(a=a5(this,Y))?void 0:a.unassociateElement)||r.call(a,this),a4(this,Y,null)),i&&this.isConnected&&(a4(this,Y,null==(s=this.getRootNode())?void 0:s.getElementById(i)),null==(o=null==(n=a5(this,Y))?void 0:n.associateElement)||o.call(n,this))):"disabled"===e&&i!==t?null==i?this.enable():this.disable():e===a8.TOOLTIP_PLACEMENT&&this.tooltipEl&&i!==t?this.tooltipEl.placement=i:e===tj.MEDIA_LANG&&(this.shadowRoot.querySelector('slot[name="tooltip-content"]').innerHTML=this.constructor.getTooltipContentHTML()),a5(this,Z).call(this)}connectedCallback(){var e,t,i;let{style:a}=ik(this.shadowRoot,":host");a.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`),this.hasAttribute("disabled")?this.disable():this.enable(),this.setAttribute("role","button");let r=this.getAttribute(tq.MEDIA_CONTROLLER);r&&(a4(this,Y,null==(e=this.getRootNode())?void 0:e.getElementById(r)),null==(i=null==(t=a5(this,Y))?void 0:t.associateElement)||i.call(t,this)),im.customElements.whenDefined("media-tooltip").then(()=>a7(this,J,ee).call(this))}disconnectedCallback(){var e,t;this.disable(),null==(t=null==(e=a5(this,Y))?void 0:e.unassociateElement)||t.call(e,this),a4(this,Y,null),this.removeEventListener("mouseenter",a5(this,Z)),this.removeEventListener("focus",a5(this,Z)),this.removeEventListener("click",a5(this,j))}get keysUsed(){return["Enter"," "]}get tooltipPlacement(){return iN(this,a8.TOOLTIP_PLACEMENT)}set tooltipPlacement(e){iU(this,a8.TOOLTIP_PLACEMENT,e)}get mediaController(){return iN(this,tq.MEDIA_CONTROLLER)}set mediaController(e){iU(this,tq.MEDIA_CONTROLLER,e)}get disabled(){return iC(this,a8.DISABLED)}set disabled(e){iO(this,a8.DISABLED,e)}get noTooltip(){return iC(this,a8.NO_TOOLTIP)}set noTooltip(e){iO(this,a8.NO_TOOLTIP,e)}handleClick(e){}}Y=new WeakMap,j=new WeakMap,Z=new WeakMap,z=new WeakMap,X=new WeakMap,J=new WeakSet,ee=function(){this.addEventListener("mouseenter",a5(this,Z)),this.addEventListener("focus",a5(this,Z)),this.addEventListener("click",a5(this,j));let e=this.tooltipPlacement;e&&this.tooltipEl&&(this.tooltipEl.placement=e)},a9.shadowRootOptions={mode:"open"},a9.getTemplateHTML=function(e,t={}){return`
    <style>
      :host {
        position: relative;
        font: var(--media-font,
          var(--media-font-weight, bold)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        padding: var(--media-button-padding, var(--media-control-padding, 10px));
        justify-content: var(--media-button-justify-content, center);
        display: inline-flex;
        align-items: center;
        vertical-align: middle;
        box-sizing: border-box;
        transition: background .15s linear;
        pointer-events: auto;
        cursor: var(--media-cursor, pointer);
        -webkit-tap-highlight-color: transparent;
      }

      
      :host(:focus-visible) {
        box-shadow: var(--media-focus-box-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        outline: 0;
      }
      
      :host(:where(:focus)) {
        box-shadow: none;
        outline: 0;
      }

      :host(:hover) {
        background: var(--media-control-hover-background, rgba(50 50 70 / .7));
      }

      slot[name="icon"] {
        display: inline-flex;
        align-items: center;
      }

      svg, img, ::slotted(svg), ::slotted(img) {
        width: var(--media-button-icon-width);
        height: var(--media-button-icon-height, var(--media-control-height, 24px));
        transform: var(--media-button-icon-transform);
        transition: var(--media-button-icon-transition);
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        vertical-align: middle;
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
      }

      media-tooltip {
        
        max-width: 0;
        overflow-x: clip;
        opacity: 0;
        transition: opacity .3s, max-width 0s 9s;
      }

      :host(:hover) media-tooltip,
      :host(:focus-visible) media-tooltip {
        max-width: 100vw;
        opacity: 1;
        transition: opacity .3s;
      }

      :host([notooltip]) slot[name="tooltip"] {
        display: none;
      }
    </style>

    ${this.getSlotTemplateHTML(e,t)}

    <slot name="tooltip">
      <media-tooltip part="tooltip" aria-hidden="true">
        <template shadowrootmode="${a1.shadowRootOptions.mode}">
          ${a1.getTemplateHTML({})}
        </template>
        <slot name="tooltip-content">
          ${this.getTooltipContentHTML(e)}
        </slot>
      </media-tooltip>
    </slot>
  `},a9.getSlotTemplateHTML=function(e,t){return`
    <slot></slot>
  `},a9.getTooltipContentHTML=function(){return""},im.customElements.get("media-chrome-button")||im.customElements.define("media-chrome-button",a9);let a6=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.13 3H3.87a.87.87 0 0 0-.87.87v13.26a.87.87 0 0 0 .87.87h3.4L9 16H5V5h16v11h-4l1.72 2h3.4a.87.87 0 0 0 .87-.87V3.87a.87.87 0 0 0-.86-.87Zm-8.75 11.44a.5.5 0 0 0-.76 0l-4.91 5.73a.5.5 0 0 0 .38.83h9.82a.501.501 0 0 0 .38-.83l-4.91-5.73Z"/>
</svg>
`,re=e=>{let t=e.mediaIsAirplaying?ia("stop airplay"):ia("start airplay");e.setAttribute("aria-label",t)};class rt extends a9{static get observedAttributes(){return[...super.observedAttributes,tj.MEDIA_IS_AIRPLAYING,tj.MEDIA_AIRPLAY_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),re(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tj.MEDIA_IS_AIRPLAYING&&re(this)}get mediaIsAirplaying(){return iC(this,tj.MEDIA_IS_AIRPLAYING)}set mediaIsAirplaying(e){iO(this,tj.MEDIA_IS_AIRPLAYING,e)}get mediaAirplayUnavailable(){return iN(this,tj.MEDIA_AIRPLAY_UNAVAILABLE)}set mediaAirplayUnavailable(e){iU(this,tj.MEDIA_AIRPLAY_UNAVAILABLE,e)}handleClick(){let e=new im.CustomEvent(tK.MEDIA_AIRPLAY_REQUEST,{composed:!0,bubbles:!0});this.dispatchEvent(e)}}rt.getSlotTemplateHTML=function(e){return`
    <style>
      :host([${tj.MEDIA_IS_AIRPLAYING}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${tj.MEDIA_IS_AIRPLAYING}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${tj.MEDIA_IS_AIRPLAYING}]) slot[name=tooltip-enter],
      :host(:not([${tj.MEDIA_IS_AIRPLAYING}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${a6}</slot>
      <slot name="exit">${a6}</slot>
    </slot>
  `},rt.getTooltipContentHTML=function(){return`
    <slot name="tooltip-enter">${ia("start airplay")}</slot>
    <slot name="tooltip-exit">${ia("stop airplay")}</slot>
  `},im.customElements.get("media-airplay-button")||im.customElements.define("media-airplay-button",rt);let ri=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
</svg>`,ra=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M17.73 14.09a1.4 1.4 0 0 1-1 .37 1.579 1.579 0 0 1-1.27-.58A3 3 0 0 1 15 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34A2.89 2.89 0 0 0 19 9.07a3 3 0 0 0-2.14-.78 3.14 3.14 0 0 0-2.42 1 3.91 3.91 0 0 0-.93 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.17 3.17 0 0 0 1.07-1.74l-1.4-.45c-.083.43-.3.822-.62 1.12Zm-7.22 0a1.43 1.43 0 0 1-1 .37 1.58 1.58 0 0 1-1.27-.58A3 3 0 0 1 7.76 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34a2.81 2.81 0 0 0-.74-1.32 2.94 2.94 0 0 0-2.13-.78 3.18 3.18 0 0 0-2.43 1 4 4 0 0 0-.92 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.23 3.23 0 0 0 1.07-1.74l-1.4-.45a2.06 2.06 0 0 1-.6 1.07Zm12.32-8.41a2.59 2.59 0 0 0-2.3-2.51C18.72 3.05 15.86 3 13 3c-2.86 0-5.72.05-7.53.17a2.59 2.59 0 0 0-2.3 2.51c-.23 4.207-.23 8.423 0 12.63a2.57 2.57 0 0 0 2.3 2.5c1.81.13 4.67.19 7.53.19 2.86 0 5.72-.06 7.53-.19a2.57 2.57 0 0 0 2.3-2.5c.23-4.207.23-8.423 0-12.63Zm-1.49 12.53a1.11 1.11 0 0 1-.91 1.11c-1.67.11-4.45.18-7.43.18-2.98 0-5.76-.07-7.43-.18a1.11 1.11 0 0 1-.91-1.11c-.21-4.14-.21-8.29 0-12.43a1.11 1.11 0 0 1 .91-1.11C7.24 4.56 10 4.49 13 4.49s5.76.07 7.43.18a1.11 1.11 0 0 1 .91 1.11c.21 4.14.21 8.29 0 12.43Z"/>
</svg>`,rr=e=>{e.setAttribute("aria-checked",at(e).toString())};class rs extends a9{static get observedAttributes(){return[...super.observedAttributes,tj.MEDIA_SUBTITLES_LIST,tj.MEDIA_SUBTITLES_SHOWING]}connectedCallback(){super.connectedCallback(),this.setAttribute("role","button"),this.setAttribute("aria-label",ia("closed captions")),rr(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tj.MEDIA_SUBTITLES_SHOWING&&rr(this)}get mediaSubtitlesList(){return rn(this,tj.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){ro(this,tj.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return rn(this,tj.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){ro(this,tj.MEDIA_SUBTITLES_SHOWING,e)}handleClick(){this.dispatchEvent(new im.CustomEvent(tK.MEDIA_TOGGLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0}))}}rs.getSlotTemplateHTML=function(e){return`
    <style>
      :host([aria-checked="true"]) slot[name=off] {
        display: none !important;
      }

      
      :host(:not([aria-checked="true"])) slot[name=on] {
        display: none !important;
      }

      :host([aria-checked="true"]) slot[name=tooltip-enable],
      :host(:not([aria-checked="true"])) slot[name=tooltip-disable] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="on">${ri}</slot>
      <slot name="off">${ra}</slot>
    </slot>
  `},rs.getTooltipContentHTML=function(){return`
    <slot name="tooltip-enable">${ia("Enable captions")}</slot>
    <slot name="tooltip-disable">${ia("Disable captions")}</slot>
  `};let rn=(e,t)=>{let i=e.getAttribute(t);return i?i5(i):[]},ro=(e,t,i)=>{if(!(null==i?void 0:i.length)){e.removeAttribute(t);return}let a=i7(i),r=e.getAttribute(t);r!==a&&e.setAttribute(t,a)};im.customElements.get("media-captions-button")||im.customElements.define("media-captions-button",rs);let rl=e=>{let t=e.mediaIsCasting?ia("stop casting"):ia("start casting");e.setAttribute("aria-label",t)};class rd extends a9{static get observedAttributes(){return[...super.observedAttributes,tj.MEDIA_IS_CASTING,tj.MEDIA_CAST_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),rl(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tj.MEDIA_IS_CASTING&&rl(this)}get mediaIsCasting(){return iC(this,tj.MEDIA_IS_CASTING)}set mediaIsCasting(e){iO(this,tj.MEDIA_IS_CASTING,e)}get mediaCastUnavailable(){return iN(this,tj.MEDIA_CAST_UNAVAILABLE)}set mediaCastUnavailable(e){iU(this,tj.MEDIA_CAST_UNAVAILABLE,e)}handleClick(){let e=this.mediaIsCasting?tK.MEDIA_EXIT_CAST_REQUEST:tK.MEDIA_ENTER_CAST_REQUEST;this.dispatchEvent(new im.CustomEvent(e,{composed:!0,bubbles:!0}))}}rd.getSlotTemplateHTML=function(e){return`
    <style>
      :host([${tj.MEDIA_IS_CASTING}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${tj.MEDIA_IS_CASTING}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${tj.MEDIA_IS_CASTING}]) slot[name=tooltip-enter],
      :host(:not([${tj.MEDIA_IS_CASTING}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter"><svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/></g></svg></slot>
      <slot name="exit"><svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/><path class="cast_caf_icon_boxfill" d="M5,7 L5,8.63 C8,8.6 13.37,14 13.37,17 L19,17 L19,7 Z"/></g></svg></slot>
    </slot>
  `},rd.getTooltipContentHTML=function(){return`
    <slot name="tooltip-enter">${ia("Start casting")}</slot>
    <slot name="tooltip-exit">${ia("Stop casting")}</slot>
  `},im.customElements.get("media-cast-button")||im.customElements.define("media-cast-button",rd);var ru=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},rh=(e,t,i)=>(ru(e,t,"read from private field"),i?i.call(e):t.get(e)),rc=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},rm=(e,t,i,a)=>(ru(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),rp=(e,t,i)=>(ru(e,t,"access private method"),i);let rE={OPEN:"open",ANCHOR:"anchor"};class rv extends im.HTMLElement{constructor(){super(),rc(this,er),rc(this,en),rc(this,el),rc(this,eu),rc(this,ec),rc(this,ep),rc(this,et,!1),rc(this,ei,null),rc(this,ea,null)}static get observedAttributes(){return[rE.OPEN,rE.ANCHOR]}get open(){return iC(this,rE.OPEN)}set open(e){iO(this,rE.OPEN,e)}handleEvent(e){switch(e.type){case"invoke":rp(this,eu,eh).call(this,e);break;case"focusout":rp(this,ec,em).call(this,e);break;case"keydown":rp(this,ep,eE).call(this,e)}}connectedCallback(){rp(this,er,es).call(this),this.role||(this.role="dialog"),this.addEventListener("invoke",this),this.addEventListener("focusout",this),this.addEventListener("keydown",this)}disconnectedCallback(){this.removeEventListener("invoke",this),this.removeEventListener("focusout",this),this.removeEventListener("keydown",this)}attributeChangedCallback(e,t,i){rp(this,er,es).call(this),e===rE.OPEN&&i!==t&&(this.open?rp(this,en,eo).call(this):rp(this,el,ed).call(this))}focus(){rm(this,ei,function e(t=document){var i;let a=null==t?void 0:t.activeElement;return a?null!=(i=e(a.shadowRoot))?i:a:null}());let e=!this.dispatchEvent(new Event("focus",{composed:!0,cancelable:!0})),t=!this.dispatchEvent(new Event("focusin",{composed:!0,bubbles:!0,cancelable:!0}));if(e||t)return;let i=this.querySelector('[autofocus], [tabindex]:not([tabindex="-1"]), [role="menu"]');null==i||i.focus()}get keysUsed(){return["Escape","Tab"]}}et=new WeakMap,ei=new WeakMap,ea=new WeakMap,er=new WeakSet,es=function(){if(!rh(this,et)&&(rm(this,et,!0),!this.shadowRoot)){this.attachShadow(this.constructor.shadowRootOptions);let e=i_(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e),queueMicrotask(()=>{let{style:e}=ik(this.shadowRoot,":host");e.setProperty("transition","display .15s, visibility .15s, opacity .15s ease-in, transform .15s ease-in")})}},en=new WeakSet,eo=function(){var e;null==(e=rh(this,ea))||e.setAttribute("aria-expanded","true"),this.dispatchEvent(new Event("open",{composed:!0,bubbles:!0})),this.addEventListener("transitionend",()=>this.focus(),{once:!0})},el=new WeakSet,ed=function(){var e;null==(e=rh(this,ea))||e.setAttribute("aria-expanded","false"),this.dispatchEvent(new Event("close",{composed:!0,bubbles:!0}))},eu=new WeakSet,eh=function(e){rm(this,ea,e.relatedTarget),iw(this,e.relatedTarget)||(this.open=!this.open)},ec=new WeakSet,em=function(e){var t;!iw(this,e.relatedTarget)&&(null==(t=rh(this,ei))||t.focus(),rh(this,ea)&&rh(this,ea)!==e.relatedTarget&&this.open&&(this.open=!1))},ep=new WeakSet,eE=function(e){var t,i,a,r,s;let{key:n,ctrlKey:o,altKey:l,metaKey:d}=e;!o&&!l&&!d&&this.keysUsed.includes(n)&&(e.preventDefault(),e.stopPropagation(),"Tab"===n?(e.shiftKey?null==(i=null==(t=this.previousElementSibling)?void 0:t.focus)||i.call(t):null==(r=null==(a=this.nextElementSibling)?void 0:a.focus)||r.call(a),this.blur()):"Escape"===n&&(null==(s=rh(this,ei))||s.focus(),this.open=!1))},rv.shadowRootOptions={mode:"open"},rv.getTemplateHTML=function(e){return`
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        display: var(--media-dialog-display, inline-flex);
        justify-content: center;
        align-items: center;
        
        transition-behavior: allow-discrete;
        visibility: hidden;
        opacity: 0;
        transform: translateY(2px) scale(.99);
        pointer-events: none;
      }

      :host([open]) {
        transition: display .2s, visibility 0s, opacity .2s ease-out, transform .15s ease-out;
        visibility: visible;
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      #content {
        display: flex;
        position: relative;
        box-sizing: border-box;
        width: min(320px, 100%);
        word-wrap: break-word;
        max-height: 100%;
        overflow: auto;
        text-align: center;
        line-height: 1.4;
      }
    </style>
    ${this.getSlotTemplateHTML(e)}
  `},rv.getSlotTemplateHTML=function(e){return`
    <slot id="content"></slot>
  `},im.customElements.get("media-chrome-dialog")||im.customElements.define("media-chrome-dialog",rv);var rb=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},rg=(e,t,i)=>(rb(e,t,"read from private field"),i?i.call(e):t.get(e)),rA=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},rf=(e,t,i,a)=>(rb(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),r_=(e,t,i)=>(rb(e,t,"access private method"),i);class rT extends im.HTMLElement{constructor(){if(super(),rA(this,ew),rA(this,eL),rA(this,eM),rA(this,eD),rA(this,eO),rA(this,eU),rA(this,ex),rA(this,eH),rA(this,ev,void 0),rA(this,eb,void 0),rA(this,eg,void 0),rA(this,eA,void 0),rA(this,ef,{}),rA(this,e_,[]),rA(this,eT,()=>{if(this.range.matches(":focus-visible")){let{style:e}=ik(this.shadowRoot,":host");e.setProperty("--_focus-visible-box-shadow","var(--_focus-box-shadow)")}}),rA(this,eI,()=>{let{style:e}=ik(this.shadowRoot,":host");e.removeProperty("--_focus-visible-box-shadow")}),rA(this,ey,()=>{let e=this.shadowRoot.querySelector("#segments-clipping");e&&e.parentNode.append(e)}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=i_(this.attributes),t=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(t):this.shadowRoot.innerHTML=t}this.container=this.shadowRoot.querySelector("#container"),rf(this,eg,this.shadowRoot.querySelector("#startpoint")),rf(this,eA,this.shadowRoot.querySelector("#endpoint")),this.range=this.shadowRoot.querySelector("#range"),this.appearance=this.shadowRoot.querySelector("#appearance")}static get observedAttributes(){return["disabled","aria-disabled",tq.MEDIA_CONTROLLER]}attributeChangedCallback(e,t,i){var a,r,s,n,o;e===tq.MEDIA_CONTROLLER?(t&&(null==(r=null==(a=rg(this,ev))?void 0:a.unassociateElement)||r.call(a,this),rf(this,ev,null)),i&&this.isConnected&&(rf(this,ev,null==(s=this.getRootNode())?void 0:s.getElementById(i)),null==(o=null==(n=rg(this,ev))?void 0:n.associateElement)||o.call(n,this))):("disabled"===e||"aria-disabled"===e&&t!==i)&&(null==i?(this.range.removeAttribute(e),r_(this,eL,ek).call(this)):(this.range.setAttribute(e,i),r_(this,eM,eR).call(this)))}connectedCallback(){var e,t,i;let{style:a}=ik(this.shadowRoot,":host");a.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`),rg(this,ef).pointer=ik(this.shadowRoot,"#pointer"),rg(this,ef).progress=ik(this.shadowRoot,"#progress"),rg(this,ef).thumb=ik(this.shadowRoot,'#thumb, ::slotted([slot="thumb"])'),rg(this,ef).activeSegment=ik(this.shadowRoot,"#segments-clipping rect:nth-child(0)");let r=this.getAttribute(tq.MEDIA_CONTROLLER);r&&(rf(this,ev,null==(e=this.getRootNode())?void 0:e.getElementById(r)),null==(i=null==(t=rg(this,ev))?void 0:t.associateElement)||i.call(t,this)),this.updateBar(),this.shadowRoot.addEventListener("focusin",rg(this,eT)),this.shadowRoot.addEventListener("focusout",rg(this,eI)),r_(this,eL,ek).call(this),ig(this.container,rg(this,ey))}disconnectedCallback(){var e,t;r_(this,eM,eR).call(this),null==(t=null==(e=rg(this,ev))?void 0:e.unassociateElement)||t.call(e,this),rf(this,ev,null),this.shadowRoot.removeEventListener("focusin",rg(this,eT)),this.shadowRoot.removeEventListener("focusout",rg(this,eI)),iA(this.container,rg(this,ey))}updatePointerBar(e){var t;null==(t=rg(this,ef).pointer)||t.style.setProperty("width",`${100*this.getPointerRatio(e)}%`)}updateBar(){var e,t;let i=100*this.range.valueAsNumber;null==(e=rg(this,ef).progress)||e.style.setProperty("width",`${i}%`),null==(t=rg(this,ef).thumb)||t.style.setProperty("left",`${i}%`)}updateSegments(e){let t=this.shadowRoot.querySelector("#segments-clipping");if(t.textContent="",this.container.classList.toggle("segments",!!(null==e?void 0:e.length)),!(null==e?void 0:e.length))return;let i=[...new Set([+this.range.min,...e.flatMap(e=>[e.start,e.end]),+this.range.max])];rf(this,e_,[...i]);let a=i.pop();for(let[e,r]of i.entries()){let[s,n]=[0===e,e===i.length-1],o=s?"calc(var(--segments-gap) / -1)":`${100*r}%`,l=n?a:i[e+1],d=`calc(${(l-r)*100}%${s||n?"":" - var(--segments-gap)"})`,u=ip.createElementNS("http://www.w3.org/2000/svg","rect"),h=iM(this.shadowRoot,`#segments-clipping rect:nth-child(${e+1})`);h.style.setProperty("x",o),h.style.setProperty("width",d),t.append(u)}}getPointerRatio(e){return function(e,t,i,a){let r=a.x-i.x,s=a.y-i.y,n=r*r+s*s;if(0===n)return 0;let o=((e-i.x)*r+(t-i.y)*s)/n;return Math.max(0,Math.min(1,o))}(e.clientX,e.clientY,rg(this,eg).getBoundingClientRect(),rg(this,eA).getBoundingClientRect())}get dragging(){return this.hasAttribute("dragging")}handleEvent(e){switch(e.type){case"pointermove":r_(this,eH,eW).call(this,e);break;case"input":this.updateBar();break;case"pointerenter":r_(this,eO,eN).call(this,e);break;case"pointerdown":r_(this,eD,eC).call(this,e);break;case"pointerup":r_(this,eU,eP).call(this);break;case"pointerleave":r_(this,ex,eV).call(this)}}get keysUsed(){return["ArrowUp","ArrowRight","ArrowDown","ArrowLeft"]}}ev=new WeakMap,eb=new WeakMap,eg=new WeakMap,eA=new WeakMap,ef=new WeakMap,e_=new WeakMap,eT=new WeakMap,eI=new WeakMap,ey=new WeakMap,ew=new WeakSet,eS=function(e){let t=rg(this,ef).activeSegment;if(!t)return;let i=this.getPointerRatio(e),a=rg(this,e_).findIndex((e,t,a)=>{let r=a[t+1];return null!=r&&i>=e&&i<=r}),r=`#segments-clipping rect:nth-child(${a+1})`;t.selectorText==r&&t.style.transform||(t.selectorText=r,t.style.setProperty("transform","var(--media-range-segment-hover-transform, scaleY(2))"))},eL=new WeakSet,ek=function(){!this.hasAttribute("disabled")&&this.isConnected&&(this.addEventListener("input",this),this.addEventListener("pointerdown",this),this.addEventListener("pointerenter",this))},eM=new WeakSet,eR=function(){var e,t;this.removeEventListener("input",this),this.removeEventListener("pointerdown",this),this.removeEventListener("pointerenter",this),this.removeEventListener("pointerleave",this),null==(e=im.window)||e.removeEventListener("pointerup",this),null==(t=im.window)||t.removeEventListener("pointermove",this)},eD=new WeakSet,eC=function(e){var t;rf(this,eb,e.composedPath().includes(this.range)),null==(t=im.window)||t.addEventListener("pointerup",this,{once:!0})},eO=new WeakSet,eN=function(e){var t;"mouse"!==e.pointerType&&r_(this,eD,eC).call(this,e),this.addEventListener("pointerleave",this,{once:!0}),null==(t=im.window)||t.addEventListener("pointermove",this)},eU=new WeakSet,eP=function(){var e;null==(e=im.window)||e.removeEventListener("pointerup",this),this.toggleAttribute("dragging",!1),this.range.disabled=this.hasAttribute("disabled")},ex=new WeakSet,eV=function(){var e,t;this.removeEventListener("pointerleave",this),null==(e=im.window)||e.removeEventListener("pointermove",this),this.toggleAttribute("dragging",!1),this.range.disabled=this.hasAttribute("disabled"),null==(t=rg(this,ef).activeSegment)||t.style.removeProperty("transform")},eH=new WeakSet,eW=function(e){("pen"!==e.pointerType||0!==e.buttons)&&(this.toggleAttribute("dragging",1===e.buttons||"mouse"!==e.pointerType),this.updatePointerBar(e),r_(this,ew,eS).call(this,e),this.dragging&&("mouse"!==e.pointerType||!rg(this,eb))&&(this.range.disabled=!0,this.range.valueAsNumber=this.getPointerRatio(e),this.range.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))))},rT.shadowRootOptions={mode:"open"},rT.getTemplateHTML=function(e){return`
    <style>
      :host {
        --_focus-box-shadow: var(--media-focus-box-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        --_media-range-padding: var(--media-range-padding, var(--media-control-padding, 10px));

        box-shadow: var(--_focus-visible-box-shadow, none);
        background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        height: calc(var(--media-control-height, 24px) + 2 * var(--_media-range-padding));
        display: inline-flex;
        align-items: center;
        
        vertical-align: middle;
        box-sizing: border-box;
        position: relative;
        width: 100px;
        transition: background .15s linear;
        cursor: var(--media-cursor, pointer);
        pointer-events: auto;
        touch-action: none; 
      }

      
      input[type=range]:focus {
        outline: 0;
      }
      input[type=range]:focus::-webkit-slider-runnable-track {
        outline: 0;
      }

      :host(:hover) {
        background: var(--media-control-hover-background, rgb(50 50 70 / .7));
      }

      #leftgap {
        padding-left: var(--media-range-padding-left, var(--_media-range-padding));
      }

      #rightgap {
        padding-right: var(--media-range-padding-right, var(--_media-range-padding));
      }

      #startpoint,
      #endpoint {
        position: absolute;
      }

      #endpoint {
        right: 0;
      }

      #container {
        
        width: var(--media-range-track-width, 100%);
        transform: translate(var(--media-range-track-translate-x, 0px), var(--media-range-track-translate-y, 0px));
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
        min-width: 40px;
      }

      #range {
        
        display: var(--media-time-range-hover-display, block);
        bottom: var(--media-time-range-hover-bottom, 0);
        height: var(--media-time-range-hover-height, max(100% , 25px));
        width: 100%;
        position: absolute;
        cursor: var(--media-cursor, pointer);

        -webkit-appearance: none; 
        -webkit-tap-highlight-color: transparent;
        background: transparent; 
        margin: 0;
        z-index: 1;
      }

      @media (hover: hover) {
        #range {
          bottom: var(--media-time-range-hover-bottom, 0);
          height: var(--media-time-range-hover-height, max(100%, 20px));
        }
      }

      
      
      #range::-webkit-slider-thumb {
        -webkit-appearance: none;
        background: transparent;
        width: .1px;
        height: .1px;
      }

      
      #range::-moz-range-thumb {
        background: transparent;
        border: transparent;
        width: .1px;
        height: .1px;
      }

      #appearance {
        height: var(--media-range-track-height, 4px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        position: absolute;
        
        will-change: transform;
      }

      #track {
        background: var(--media-range-track-background, rgb(255 255 255 / .2));
        border-radius: var(--media-range-track-border-radius, 1px);
        border: var(--media-range-track-border, none);
        outline: var(--media-range-track-outline);
        outline-offset: var(--media-range-track-outline-offset);
        backdrop-filter: var(--media-range-track-backdrop-filter);
        -webkit-backdrop-filter: var(--media-range-track-backdrop-filter);
        box-shadow: var(--media-range-track-box-shadow, none);
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      #progress,
      #pointer {
        position: absolute;
        height: 100%;
        will-change: width;
      }

      #progress {
        background: var(--media-range-bar-color, var(--media-primary-color, rgb(238 238 238)));
        transition: var(--media-range-track-transition);
      }

      #pointer {
        background: var(--media-range-track-pointer-background);
        border-right: var(--media-range-track-pointer-border-right);
        transition: visibility .25s, opacity .25s;
        visibility: hidden;
        opacity: 0;
      }

      @media (hover: hover) {
        :host(:hover) #pointer {
          transition: visibility .5s, opacity .5s;
          visibility: visible;
          opacity: 1;
        }
      }

      #thumb,
      ::slotted([slot=thumb]) {
        width: var(--media-range-thumb-width, 10px);
        height: var(--media-range-thumb-height, 10px);
        transition: var(--media-range-thumb-transition);
        transform: var(--media-range-thumb-transform, none);
        opacity: var(--media-range-thumb-opacity, 1);
        translate: -50%;
        position: absolute;
        left: 0;
        cursor: var(--media-cursor, pointer);
      }

      #thumb {
        border-radius: var(--media-range-thumb-border-radius, 10px);
        background: var(--media-range-thumb-background, var(--media-primary-color, rgb(238 238 238)));
        box-shadow: var(--media-range-thumb-box-shadow, 1px 1px 1px transparent);
        border: var(--media-range-thumb-border, none);
      }

      :host([disabled]) #thumb {
        background-color: #777;
      }

      .segments #appearance {
        height: var(--media-range-segment-hover-height, 7px);
      }

      #track {
        clip-path: url(#segments-clipping);
      }

      #segments {
        --segments-gap: var(--media-range-segments-gap, 2px);
        position: absolute;
        width: 100%;
        height: 100%;
      }

      #segments-clipping {
        transform: translateX(calc(var(--segments-gap) / 2));
      }

      #segments-clipping:empty {
        display: none;
      }

      #segments-clipping rect {
        height: var(--media-range-track-height, 4px);
        y: calc((var(--media-range-segment-hover-height, 7px) - var(--media-range-track-height, 4px)) / 2);
        transition: var(--media-range-segment-transition, transform .1s ease-in-out);
        transform: var(--media-range-segment-transform, scaleY(1));
        transform-origin: center;
      }

      /* Visible label for accessibility - positioned off-screen but technically visible (Firefox requires visible labels) */
      #range-label {
        position: absolute;
        left: -10000px;
        background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        pointer-events: none;
      }
    </style>
    <div id="leftgap"></div>
    <div id="container">
      <div id="startpoint"></div>
      <div id="endpoint"></div>
      <div id="appearance">
        <div id="track" part="track">
          <div id="pointer"></div>
          <div id="progress" part="progress"></div>
        </div>
        <slot name="thumb">
          <div id="thumb" part="thumb"></div>
        </slot>
        <svg id="segments" aria-hidden="true"><clipPath id="segments-clipping"></clipPath></svg>
      </div>
        <input id="range" type="range" min="0" max="1" step="any" value="0">
        <label for="range" id="range-label"></label>

      ${this.getContainerTemplateHTML(e)}
    </div>
    <div id="rightgap"></div>
  `},rT.getContainerTemplateHTML=function(e){return""},im.customElements.get("media-chrome-range")||im.customElements.define("media-chrome-range",rT);var rI=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},ry=(e,t,i)=>(rI(e,t,"read from private field"),i?i.call(e):t.get(e)),rw=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},rS=(e,t,i,a)=>(rI(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class rL extends im.HTMLElement{constructor(){if(super(),rw(this,eF,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=i_(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[tq.MEDIA_CONTROLLER]}attributeChangedCallback(e,t,i){var a,r,s,n,o;e===tq.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=ry(this,eF))?void 0:a.unassociateElement)||r.call(a,this),rS(this,eF,null)),i&&this.isConnected&&(rS(this,eF,null==(s=this.getRootNode())?void 0:s.getElementById(i)),null==(o=null==(n=ry(this,eF))?void 0:n.associateElement)||o.call(n,this)))}connectedCallback(){var e,t,i;let a=this.getAttribute(tq.MEDIA_CONTROLLER);a&&(rS(this,eF,null==(e=this.getRootNode())?void 0:e.getElementById(a)),null==(i=null==(t=ry(this,eF))?void 0:t.associateElement)||i.call(t,this))}disconnectedCallback(){var e,t;null==(t=null==(e=ry(this,eF))?void 0:e.unassociateElement)||t.call(e,this),rS(this,eF,null)}}eF=new WeakMap,rL.shadowRootOptions={mode:"open"},rL.getTemplateHTML=function(e){return`
    <style>
      :host {
        
        box-sizing: border-box;
        display: var(--media-control-display, var(--media-control-bar-display, inline-flex));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        --media-loading-indicator-icon-height: 44px;
      }

      ::slotted(media-time-range),
      ::slotted(media-volume-range) {
        min-height: 100%;
      }

      ::slotted(media-time-range),
      ::slotted(media-clip-selector) {
        flex-grow: 1;
      }

      ::slotted([role="menu"]) {
        position: absolute;
      }
    </style>

    <slot></slot>
  `},im.customElements.get("media-control-bar")||im.customElements.define("media-control-bar",rL);var rk=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},rM=(e,t,i)=>(rk(e,t,"read from private field"),i?i.call(e):t.get(e)),rR=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},rD=(e,t,i,a)=>(rk(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class rC extends im.HTMLElement{constructor(){if(super(),rR(this,e$,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=i_(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[tq.MEDIA_CONTROLLER]}attributeChangedCallback(e,t,i){var a,r,s,n,o;e===tq.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=rM(this,e$))?void 0:a.unassociateElement)||r.call(a,this),rD(this,e$,null)),i&&this.isConnected&&(rD(this,e$,null==(s=this.getRootNode())?void 0:s.getElementById(i)),null==(o=null==(n=rM(this,e$))?void 0:n.associateElement)||o.call(n,this)))}connectedCallback(){var e,t,i;let{style:a}=ik(this.shadowRoot,":host");a.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`);let r=this.getAttribute(tq.MEDIA_CONTROLLER);r&&(rD(this,e$,null==(e=this.getRootNode())?void 0:e.getElementById(r)),null==(i=null==(t=rM(this,e$))?void 0:t.associateElement)||i.call(t,this))}disconnectedCallback(){var e,t;null==(t=null==(e=rM(this,e$))?void 0:e.unassociateElement)||t.call(e,this),rD(this,e$,null)}}e$=new WeakMap,rC.shadowRootOptions={mode:"open"},rC.getTemplateHTML=function(e,t={}){return`
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        background: var(--media-text-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7))));
        padding: var(--media-control-padding, 10px);
        display: inline-flex;
        justify-content: center;
        align-items: center;
        vertical-align: middle;
        box-sizing: border-box;
        text-align: center;
        pointer-events: auto;
      }

      
      :host(:focus-visible) {
        box-shadow: var(--media-focus-box-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        outline: 0;
      }

      
      :host(:where(:focus)) {
        box-shadow: none;
        outline: 0;
      }
    </style>

    ${this.getSlotTemplateHTML(e,t)}
  `},rC.getSlotTemplateHTML=function(e,t){return`
    <slot></slot>
  `},im.customElements.get("media-text-display")||im.customElements.define("media-text-display",rC);var rO=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},rN=(e,t,i)=>(rO(e,t,"read from private field"),i?i.call(e):t.get(e)),rU=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},rP=(e,t,i,a)=>(rO(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class rx extends rC{constructor(){var e;super(),rU(this,eB,void 0),rP(this,eB,this.shadowRoot.querySelector("slot")),rN(this,eB).textContent=il(null!=(e=this.mediaDuration)?e:0)}static get observedAttributes(){return[...super.observedAttributes,tj.MEDIA_DURATION]}attributeChangedCallback(e,t,i){e===tj.MEDIA_DURATION&&(rN(this,eB).textContent=il(+i)),super.attributeChangedCallback(e,t,i)}get mediaDuration(){return iR(this,tj.MEDIA_DURATION)}set mediaDuration(e){iD(this,tj.MEDIA_DURATION,e)}}eB=new WeakMap,rx.getSlotTemplateHTML=function(e,t){return`
    <slot>${il(t.mediaDuration)}</slot>
  `},im.customElements.get("media-duration-display")||im.customElements.define("media-duration-display",rx);let rV={2:ia("Network Error"),3:ia("Decode Error"),4:ia("Source Not Supported"),5:ia("Encryption Error")},rH={2:ia("A network error caused the media download to fail."),3:ia("A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format."),4:ia("An unsupported error occurred. The server or network failed, or your browser does not support this format."),5:ia("The media is encrypted and there are no keys to decrypt it.")},rW=e=>{var t,i;return 1===e.code?null:{title:null!=(t=rV[e.code])?t:`Error ${e.code}`,message:null!=(i=rH[e.code])?i:e.message}};var rF=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},r$=(e,t,i)=>(rF(e,t,"read from private field"),i?i.call(e):t.get(e)),rB=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},rG=(e,t,i,a)=>(rF(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);function rK(e){var t;let{title:i,message:a}=null!=(t=rW(e))?t:{},r="";return i&&(r+=`<slot name="error-${e.code}-title"><h3>${i}</h3></slot>`),a&&(r+=`<slot name="error-${e.code}-message"><p>${a}</p></slot>`),r}let rq=[tj.MEDIA_ERROR_CODE,tj.MEDIA_ERROR_MESSAGE];class rQ extends rv{constructor(){super(...arguments),rB(this,eG,null)}static get observedAttributes(){return[...super.observedAttributes,...rq]}formatErrorMessage(e){return this.constructor.formatErrorMessage(e)}attributeChangedCallback(e,t,i){var a;if(super.attributeChangedCallback(e,t,i),!rq.includes(e))return;let r=null!=(a=this.mediaError)?a:{code:this.mediaErrorCode,message:this.mediaErrorMessage};if(this.open=r.code&&null!==rW(r),this.open&&(this.shadowRoot.querySelector("slot").name=`error-${this.mediaErrorCode}`,this.shadowRoot.querySelector("#content").innerHTML=this.formatErrorMessage(r),!this.hasAttribute("aria-label"))){let{title:e}=rW(r);e&&this.setAttribute("aria-label",e)}}get mediaError(){return r$(this,eG)}set mediaError(e){rG(this,eG,e)}get mediaErrorCode(){return iR(this,"mediaerrorcode")}set mediaErrorCode(e){iD(this,"mediaerrorcode",e)}get mediaErrorMessage(){return iN(this,"mediaerrormessage")}set mediaErrorMessage(e){iU(this,"mediaerrormessage",e)}}eG=new WeakMap,rQ.getSlotTemplateHTML=function(e){return`
    <style>
      :host {
        background: rgb(20 20 30 / .8);
      }

      #content {
        display: block;
        padding: 1.2em 1.5em;
      }

      h3,
      p {
        margin-block: 0 .3em;
      }
    </style>
    <slot name="error-${e.mediaerrorcode}" id="content">
      ${rK({code:+e.mediaerrorcode,message:e.mediaerrormessage})}
    </slot>
  `},rQ.formatErrorMessage=rK,im.customElements.get("media-error-dialog")||im.customElements.define("media-error-dialog",rQ);var rY=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},rj=(e,t,i)=>(rY(e,t,"read from private field"),i?i.call(e):t.get(e)),rZ=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)};class rz extends rv{constructor(){super(...arguments),rZ(this,eK,e=>{var t;if(!this.open)return;let i=null==(t=this.shadowRoot)?void 0:t.querySelector("#content");if(!i)return;let a=e.composedPath(),r=a[0]===this||a.includes(this),s=a.includes(i);r&&!s&&(this.open=!1)}),rZ(this,eq,e=>{if(!this.open)return;let t=e.shiftKey&&("/"===e.key||"?"===e.key);"Escape"!==e.key&&!t||e.ctrlKey||e.altKey||e.metaKey||(this.open=!1,e.preventDefault(),e.stopPropagation())})}connectedCallback(){super.connectedCallback(),this.open&&(this.addEventListener("click",rj(this,eK)),document.addEventListener("keydown",rj(this,eq)))}disconnectedCallback(){this.removeEventListener("click",rj(this,eK)),document.removeEventListener("keydown",rj(this,eq))}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),"open"===e&&(this.open?(this.addEventListener("click",rj(this,eK)),document.addEventListener("keydown",rj(this,eq))):(this.removeEventListener("click",rj(this,eK)),document.removeEventListener("keydown",rj(this,eq))))}}eK=new WeakMap,eq=new WeakMap,rz.getSlotTemplateHTML=function(e){return`
    <style>
      :host {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        background: rgb(20 20 30 / .8);
        backdrop-filter: blur(10px);
      }

      #content {
        display: block;
        width: clamp(400px, 40vw, 700px);
        max-width: 90vw;
        text-align: left;
      }

      h2 {
        margin: 0 0 1.5rem 0;
        font-size: 1.5rem;
        font-weight: 500;
        text-align: center;
      }

      .shortcuts-table {
        width: 100%;
        border-collapse: collapse;
      }

      .shortcuts-table tr {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .shortcuts-table tr:last-child {
        border-bottom: none;
      }

      .shortcuts-table td {
        padding: 0.75rem 0.5rem;
      }

      .shortcuts-table td:first-child {
        text-align: right;
        padding-right: 1rem;
        width: 40%;
        min-width: 120px;
      }

      .shortcuts-table td:last-child {
        padding-left: 1rem;
      }

      .key {
        display: inline-block;
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        padding: 0.25rem 0.5rem;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        font-weight: 500;
        min-width: 1.5rem;
        text-align: center;
        margin: 0 0.2rem;
      }

      .description {
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.95rem;
      }

      .key-combo {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.3rem;
      }

      .key-separator {
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.9rem;
      }
    </style>
    <slot id="content">
      ${function(){let e=[{keys:["Space","k"],description:"Toggle Playback"},{keys:["m"],description:"Toggle mute"},{keys:["f"],description:"Toggle fullscreen"},{keys:["c"],description:"Toggle captions or subtitles, if available"},{keys:["p"],description:"Toggle Picture in Picture"},{keys:["←","j"],description:"Seek back 10s"},{keys:["→","l"],description:"Seek forward 10s"},{keys:["↑"],description:"Turn volume up"},{keys:["↓"],description:"Turn volume down"},{keys:["< (SHIFT+,)"],description:"Decrease playback rate"},{keys:["> (SHIFT+.)"],description:"Increase playback rate"}].map(({keys:e,description:t})=>{let i=e.map((e,t)=>t>0?`<span class="key-separator">or</span><span class="key">${e}</span>`:`<span class="key">${e}</span>`).join("");return`
      <tr>
        <td>
          <div class="key-combo">${i}</div>
        </td>
        <td class="description">${t}</td>
      </tr>
    `}).join("");return`
    <h2>Keyboard Shortcuts</h2>
    <table class="shortcuts-table">${e}</table>
  `}()}
    </slot>
  `},im.customElements.get("media-keyboard-shortcuts-dialog")||im.customElements.define("media-keyboard-shortcuts-dialog",rz);var rX=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},rJ=(e,t,i)=>(rX(e,t,"read from private field"),i?i.call(e):t.get(e)),r0=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},r1=(e,t,i,a)=>(rX(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);let r2=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M16 3v2.5h3.5V9H22V3h-6ZM4 9h2.5V5.5H10V3H4v6Zm15.5 9.5H16V21h6v-6h-2.5v3.5ZM6.5 15H4v6h6v-2.5H6.5V15Z"/>
</svg>`,r5=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M18.5 6.5V3H16v6h6V6.5h-3.5ZM16 21h2.5v-3.5H22V15h-6v6ZM4 17.5h3.5V21H10v-6H4v2.5Zm3.5-11H4V9h6V3H7.5v3.5Z"/>
</svg>`,r3=e=>{let t=e.mediaIsFullscreen?ia("exit fullscreen mode"):ia("enter fullscreen mode");e.setAttribute("aria-label",t)};class r4 extends a9{constructor(){super(...arguments),r0(this,eQ,null)}static get observedAttributes(){return[...super.observedAttributes,tj.MEDIA_IS_FULLSCREEN,tj.MEDIA_FULLSCREEN_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),r3(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tj.MEDIA_IS_FULLSCREEN&&r3(this)}get mediaFullscreenUnavailable(){return iN(this,tj.MEDIA_FULLSCREEN_UNAVAILABLE)}set mediaFullscreenUnavailable(e){iU(this,tj.MEDIA_FULLSCREEN_UNAVAILABLE,e)}get mediaIsFullscreen(){return iC(this,tj.MEDIA_IS_FULLSCREEN)}set mediaIsFullscreen(e){iO(this,tj.MEDIA_IS_FULLSCREEN,e)}handleClick(e){r1(this,eQ,e);let t=rJ(this,eQ) instanceof PointerEvent,i=this.mediaIsFullscreen?new im.CustomEvent(tK.MEDIA_EXIT_FULLSCREEN_REQUEST,{composed:!0,bubbles:!0}):new im.CustomEvent(tK.MEDIA_ENTER_FULLSCREEN_REQUEST,{composed:!0,bubbles:!0,detail:t});this.dispatchEvent(i)}}eQ=new WeakMap,r4.getSlotTemplateHTML=function(e){return`
    <style>
      :host([${tj.MEDIA_IS_FULLSCREEN}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${tj.MEDIA_IS_FULLSCREEN}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${tj.MEDIA_IS_FULLSCREEN}]) slot[name=tooltip-enter],
      :host(:not([${tj.MEDIA_IS_FULLSCREEN}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${r2}</slot>
      <slot name="exit">${r5}</slot>
    </slot>
  `},r4.getTooltipContentHTML=function(){return`
    <slot name="tooltip-enter">${ia("Enter fullscreen mode")}</slot>
    <slot name="tooltip-exit">${ia("Exit fullscreen mode")}</slot>
  `},im.customElements.get("media-fullscreen-button")||im.customElements.define("media-fullscreen-button",r4);let{MEDIA_TIME_IS_LIVE:r7,MEDIA_PAUSED:r8}=tj,{MEDIA_SEEK_TO_LIVE_REQUEST:r9,MEDIA_PLAY_REQUEST:r6}=tK,se=e=>{var t;let i=e.mediaPaused||!e.mediaTimeIsLive,a=i?ia("seek to live"):ia("playing live");e.setAttribute("aria-label",a);let r=null==(t=e.shadowRoot)?void 0:t.querySelector('slot[name="text"]');r&&(r.textContent=ia("live")),i?e.removeAttribute("aria-disabled"):e.setAttribute("aria-disabled","true")};class st extends a9{static get observedAttributes(){return[...super.observedAttributes,r7,r8]}connectedCallback(){super.connectedCallback(),se(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),se(this)}get mediaPaused(){return iC(this,tj.MEDIA_PAUSED)}set mediaPaused(e){iO(this,tj.MEDIA_PAUSED,e)}get mediaTimeIsLive(){return iC(this,tj.MEDIA_TIME_IS_LIVE)}set mediaTimeIsLive(e){iO(this,tj.MEDIA_TIME_IS_LIVE,e)}handleClick(){(this.mediaPaused||!this.mediaTimeIsLive)&&(this.dispatchEvent(new im.CustomEvent(r9,{composed:!0,bubbles:!0})),this.hasAttribute(r8)&&this.dispatchEvent(new im.CustomEvent(r6,{composed:!0,bubbles:!0})))}}st.getSlotTemplateHTML=function(e){return`
    <style>
      :host { --media-tooltip-display: none; }
      
      slot[name=indicator] > *,
      :host ::slotted([slot=indicator]) {
        
        min-width: auto;
        fill: var(--media-live-button-icon-color, rgb(140, 140, 140));
        color: var(--media-live-button-icon-color, rgb(140, 140, 140));
      }

      :host([${r7}]:not([${r8}])) slot[name=indicator] > *,
      :host([${r7}]:not([${r8}])) ::slotted([slot=indicator]) {
        fill: var(--media-live-button-indicator-color, rgb(255, 0, 0));
        color: var(--media-live-button-indicator-color, rgb(255, 0, 0));
      }

      :host([${r7}]:not([${r8}])) {
        cursor: var(--media-cursor, not-allowed);
      }

      slot[name=text]{
        text-transform: uppercase;
      }

    </style>

    <slot name="indicator"><svg viewBox="0 0 6 12" aria-hidden="true"><circle cx="3" cy="6" r="2"></circle></svg></slot>
    
    <slot name="spacer">&nbsp;</slot><slot name="text">${ia("live")}</slot>
  `},im.customElements.get("media-live-button")||im.customElements.define("media-live-button",st);var si=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},sa=(e,t,i)=>(si(e,t,"read from private field"),i?i.call(e):t.get(e)),sr=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},ss=(e,t,i,a)=>(si(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);let sn={LOADING_DELAY:"loadingdelay",NO_AUTOHIDE:"noautohide"},so=`
<svg aria-hidden="true" viewBox="0 0 100 100">
  <path d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
    <animateTransform
       attributeName="transform"
       attributeType="XML"
       type="rotate"
       dur="1s"
       from="0 50 50"
       to="360 50 50"
       repeatCount="indefinite" />
  </path>
</svg>
`;class sl extends im.HTMLElement{constructor(){if(super(),sr(this,eY,void 0),sr(this,ej,500),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=i_(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[tq.MEDIA_CONTROLLER,tj.MEDIA_PAUSED,tj.MEDIA_LOADING,sn.LOADING_DELAY]}attributeChangedCallback(e,t,i){var a,r,s,n,o;e===sn.LOADING_DELAY&&t!==i?this.loadingDelay=Number(i):e===tq.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=sa(this,eY))?void 0:a.unassociateElement)||r.call(a,this),ss(this,eY,null)),i&&this.isConnected&&(ss(this,eY,null==(s=this.getRootNode())?void 0:s.getElementById(i)),null==(o=null==(n=sa(this,eY))?void 0:n.associateElement)||o.call(n,this)))}connectedCallback(){var e,t,i;let a=this.getAttribute(tq.MEDIA_CONTROLLER);a&&(ss(this,eY,null==(e=this.getRootNode())?void 0:e.getElementById(a)),null==(i=null==(t=sa(this,eY))?void 0:t.associateElement)||i.call(t,this))}disconnectedCallback(){var e,t;null==(t=null==(e=sa(this,eY))?void 0:e.unassociateElement)||t.call(e,this),ss(this,eY,null)}get loadingDelay(){return sa(this,ej)}set loadingDelay(e){ss(this,ej,e);let{style:t}=ik(this.shadowRoot,":host");t.setProperty("--_loading-indicator-delay",`var(--media-loading-indicator-transition-delay, ${e}ms)`)}get mediaPaused(){return iC(this,tj.MEDIA_PAUSED)}set mediaPaused(e){iO(this,tj.MEDIA_PAUSED,e)}get mediaLoading(){return iC(this,tj.MEDIA_LOADING)}set mediaLoading(e){iO(this,tj.MEDIA_LOADING,e)}get mediaController(){return iN(this,tq.MEDIA_CONTROLLER)}set mediaController(e){iU(this,tq.MEDIA_CONTROLLER,e)}get noAutohide(){return iC(this,sn.NO_AUTOHIDE)}set noAutohide(e){iO(this,sn.NO_AUTOHIDE,e)}}eY=new WeakMap,ej=new WeakMap,sl.shadowRootOptions={mode:"open"},sl.getTemplateHTML=function(e){return`
    <style>
      :host {
        display: var(--media-control-display, var(--media-loading-indicator-display, inline-block));
        vertical-align: middle;
        box-sizing: border-box;
        --_loading-indicator-delay: var(--media-loading-indicator-transition-delay, 500ms);
      }

      #status {
        color: rgba(0,0,0,0);
        width: 0px;
        height: 0px;
      }

      :host slot[name=icon] > *,
      :host ::slotted([slot=icon]) {
        opacity: var(--media-loading-indicator-opacity, 0);
        transition: opacity 0.15s;
      }

      :host([${tj.MEDIA_LOADING}]:not([${tj.MEDIA_PAUSED}])) slot[name=icon] > *,
      :host([${tj.MEDIA_LOADING}]:not([${tj.MEDIA_PAUSED}])) ::slotted([slot=icon]) {
        opacity: var(--media-loading-indicator-opacity, 1);
        transition: opacity 0.15s var(--_loading-indicator-delay);
      }

      :host #status {
        visibility: var(--media-loading-indicator-opacity, hidden);
        transition: visibility 0.15s;
      }

      :host([${tj.MEDIA_LOADING}]:not([${tj.MEDIA_PAUSED}])) #status {
        visibility: var(--media-loading-indicator-opacity, visible);
        transition: visibility 0.15s var(--_loading-indicator-delay);
      }

      svg, img, ::slotted(svg), ::slotted(img) {
        width: var(--media-loading-indicator-icon-width);
        height: var(--media-loading-indicator-icon-height, 100px);
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        vertical-align: middle;
      }
    </style>

    <slot name="icon">${so}</slot>
    <div id="status" role="status" aria-live="polite">${ia("media loading")}</div>
  `},im.customElements.get("media-loading-indicator")||im.customElements.define("media-loading-indicator",sl);let sd=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M16.5 12A4.5 4.5 0 0 0 14 8v2.18l2.45 2.45a4.22 4.22 0 0 0 .05-.63Zm2.5 0a6.84 6.84 0 0 1-.54 2.64L20 16.15A8.8 8.8 0 0 0 21 12a9 9 0 0 0-7-8.77v2.06A7 7 0 0 1 19 12ZM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25A6.92 6.92 0 0 1 14 18.7v2.06A9 9 0 0 0 17.69 19l2 2.05L21 19.73l-9-9L4.27 3ZM12 4 9.91 6.09 12 8.18V4Z"/>
</svg>`,su=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4Z"/>
</svg>`,sh=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4ZM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54Z"/>
</svg>`,sc=e=>{let t="off"===e.mediaVolumeLevel,i=t?ia("unmute"):ia("mute");e.setAttribute("aria-label",i)};class sm extends a9{static get observedAttributes(){return[...super.observedAttributes,tj.MEDIA_VOLUME_LEVEL]}connectedCallback(){super.connectedCallback(),sc(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tj.MEDIA_VOLUME_LEVEL&&sc(this)}get mediaVolumeLevel(){return iN(this,tj.MEDIA_VOLUME_LEVEL)}set mediaVolumeLevel(e){iU(this,tj.MEDIA_VOLUME_LEVEL,e)}handleClick(){let e="off"===this.mediaVolumeLevel?tK.MEDIA_UNMUTE_REQUEST:tK.MEDIA_MUTE_REQUEST;this.dispatchEvent(new im.CustomEvent(e,{composed:!0,bubbles:!0}))}}sm.getSlotTemplateHTML=function(e){return`
    <style>
      :host(:not([${tj.MEDIA_VOLUME_LEVEL}])) slot[name=icon] slot:not([name=high]),
      :host([${tj.MEDIA_VOLUME_LEVEL}=high]) slot[name=icon] slot:not([name=high]) {
        display: none !important;
      }

      :host([${tj.MEDIA_VOLUME_LEVEL}=off]) slot[name=icon] slot:not([name=off]) {
        display: none !important;
      }

      :host([${tj.MEDIA_VOLUME_LEVEL}=low]) slot[name=icon] slot:not([name=low]) {
        display: none !important;
      }

      :host([${tj.MEDIA_VOLUME_LEVEL}=medium]) slot[name=icon] slot:not([name=medium]) {
        display: none !important;
      }

      :host(:not([${tj.MEDIA_VOLUME_LEVEL}=off])) slot[name=tooltip-unmute],
      :host([${tj.MEDIA_VOLUME_LEVEL}=off]) slot[name=tooltip-mute] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="off">${sd}</slot>
      <slot name="low">${su}</slot>
      <slot name="medium">${su}</slot>
      <slot name="high">${sh}</slot>
    </slot>
  `},sm.getTooltipContentHTML=function(){return`
    <slot name="tooltip-mute">${ia("Mute")}</slot>
    <slot name="tooltip-unmute">${ia("Unmute")}</slot>
  `},im.customElements.get("media-mute-button")||im.customElements.define("media-mute-button",sm);let sp=`<svg aria-hidden="true" viewBox="0 0 28 24">
  <path d="M24 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Zm-1 16H5V5h18v14Zm-3-8h-7v5h7v-5Z"/>
</svg>`,sE=e=>{let t=e.mediaIsPip?ia("exit picture in picture mode"):ia("enter picture in picture mode");e.setAttribute("aria-label",t)};class sv extends a9{static get observedAttributes(){return[...super.observedAttributes,tj.MEDIA_IS_PIP,tj.MEDIA_PIP_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),sE(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tj.MEDIA_IS_PIP&&sE(this)}get mediaPipUnavailable(){return iN(this,tj.MEDIA_PIP_UNAVAILABLE)}set mediaPipUnavailable(e){iU(this,tj.MEDIA_PIP_UNAVAILABLE,e)}get mediaIsPip(){return iC(this,tj.MEDIA_IS_PIP)}set mediaIsPip(e){iO(this,tj.MEDIA_IS_PIP,e)}handleClick(){let e=this.mediaIsPip?tK.MEDIA_EXIT_PIP_REQUEST:tK.MEDIA_ENTER_PIP_REQUEST;this.dispatchEvent(new im.CustomEvent(e,{composed:!0,bubbles:!0}))}}sv.getSlotTemplateHTML=function(e){return`
    <style>
      :host([${tj.MEDIA_IS_PIP}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      :host(:not([${tj.MEDIA_IS_PIP}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${tj.MEDIA_IS_PIP}]) slot[name=tooltip-enter],
      :host(:not([${tj.MEDIA_IS_PIP}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${sp}</slot>
      <slot name="exit">${sp}</slot>
    </slot>
  `},sv.getTooltipContentHTML=function(){return`
    <slot name="tooltip-enter">${ia("Enter picture in picture mode")}</slot>
    <slot name="tooltip-exit">${ia("Exit picture in picture mode")}</slot>
  `},im.customElements.get("media-pip-button")||im.customElements.define("media-pip-button",sv);var sb=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},sg=(e,t,i)=>(sb(e,t,"read from private field"),i?i.call(e):t.get(e)),sA=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)};let sf={RATES:"rates"},s_=[1,1.2,1.5,1.7,2];function sT(e){return Math.round(100*e)/100}class sI extends a9{constructor(){var e;super(),sA(this,eZ,new i0(this,sf.RATES,{defaultValue:s_})),this.container=this.shadowRoot.querySelector('slot[name="icon"]'),this.container.innerHTML=`${sT(null!=(e=this.mediaPlaybackRate)?e:1)}x`}static get observedAttributes(){return[...super.observedAttributes,tj.MEDIA_PLAYBACK_RATE,sf.RATES]}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),e===sf.RATES&&(sg(this,eZ).value=i),e===tj.MEDIA_PLAYBACK_RATE){let e=i?+i:Number.NaN,t=sT(Number.isNaN(e)?1:e);this.container.innerHTML=`${t}x`,this.setAttribute("aria-label",ia("Playback rate {playbackRate}",{playbackRate:t}))}}get rates(){return sg(this,eZ)}set rates(e){e?Array.isArray(e)?sg(this,eZ).value=e.join(" "):"string"==typeof e&&(sg(this,eZ).value=e):sg(this,eZ).value=""}get mediaPlaybackRate(){return iR(this,tj.MEDIA_PLAYBACK_RATE,1)}set mediaPlaybackRate(e){iD(this,tj.MEDIA_PLAYBACK_RATE,e)}handleClick(){var e,t;let i=Array.from(sg(this,eZ).values(),e=>+e).sort((e,t)=>e-t),a=null!=(t=null!=(e=i.find(e=>e>this.mediaPlaybackRate))?e:i[0])?t:1,r=new im.CustomEvent(tK.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:a});this.dispatchEvent(r)}}eZ=new WeakMap,sI.getSlotTemplateHTML=function(e){let t=e.mediaplaybackrate?sT(+e.mediaplaybackrate):1;return`
    <style>
      :host {
        min-width: 5ch;
        padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
      }
    </style>
    <slot name="icon">${t}x</slot>
  `},sI.getTooltipContentHTML=function(){return ia("Playback rate")},im.customElements.get("media-playback-rate-button")||im.customElements.define("media-playback-rate-button",sI);let sy=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="m6 21 15-9L6 3v18Z"/>
</svg>`,sw=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M6 20h4V4H6v16Zm8-16v16h4V4h-4Z"/>
</svg>`,sS=e=>{let t=e.mediaPaused?ia("play"):ia("pause");e.setAttribute("aria-label",t)};class sL extends a9{static get observedAttributes(){return[...super.observedAttributes,tj.MEDIA_PAUSED,tj.MEDIA_ENDED]}connectedCallback(){super.connectedCallback(),sS(this)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),(e===tj.MEDIA_PAUSED||e===tj.MEDIA_LANG)&&sS(this)}get mediaPaused(){return iC(this,tj.MEDIA_PAUSED)}set mediaPaused(e){iO(this,tj.MEDIA_PAUSED,e)}handleClick(){let e=this.mediaPaused?tK.MEDIA_PLAY_REQUEST:tK.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new im.CustomEvent(e,{composed:!0,bubbles:!0}))}}sL.getSlotTemplateHTML=function(e){return`
    <style>
      :host([${tj.MEDIA_PAUSED}]) slot[name=pause],
      :host(:not([${tj.MEDIA_PAUSED}])) slot[name=play] {
        display: none !important;
      }

      :host([${tj.MEDIA_PAUSED}]) slot[name=tooltip-pause],
      :host(:not([${tj.MEDIA_PAUSED}])) slot[name=tooltip-play] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="play">${sy}</slot>
      <slot name="pause">${sw}</slot>
    </slot>
  `},sL.getTooltipContentHTML=function(){return`
    <slot name="tooltip-play">${ia("Play")}</slot>
    <slot name="tooltip-pause">${ia("Pause")}</slot>
  `},im.customElements.get("media-play-button")||im.customElements.define("media-play-button",sL);let sk={PLACEHOLDER_SRC:"placeholdersrc",SRC:"src"},sM=e=>{e.style.removeProperty("background-image")},sR=(e,t)=>{e.style["background-image"]=`url('${t}')`};class sD extends im.HTMLElement{static get observedAttributes(){return[sk.PLACEHOLDER_SRC,sk.SRC]}constructor(){if(super(),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=i_(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}this.image=this.shadowRoot.querySelector("#image")}attributeChangedCallback(e,t,i){e===sk.SRC&&(null==i?this.image.removeAttribute(sk.SRC):this.image.setAttribute(sk.SRC,i)),e===sk.PLACEHOLDER_SRC&&(null==i?sM(this.image):sR(this.image,i))}get placeholderSrc(){return iN(this,sk.PLACEHOLDER_SRC)}set placeholderSrc(e){iU(this,sk.SRC,e)}get src(){return iN(this,sk.SRC)}set src(e){iU(this,sk.SRC,e)}}sD.shadowRootOptions={mode:"open"},sD.getTemplateHTML=function(e){return`
    <style>
      :host {
        pointer-events: none;
        display: var(--media-poster-image-display, inline-block);
        box-sizing: border-box;
      }

      img {
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
        min-height: 100%;
        background-repeat: no-repeat;
        background-position: var(--media-poster-image-background-position, var(--media-object-position, center));
        background-size: var(--media-poster-image-background-size, var(--media-object-fit, contain));
        object-fit: var(--media-object-fit, contain);
        object-position: var(--media-object-position, center);
      }
    </style>

    <img part="poster img" aria-hidden="true" id="image"/>
  `},im.customElements.get("media-poster-image")||im.customElements.define("media-poster-image",sD);var sC=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},sO=(e,t,i)=>(sC(e,t,"read from private field"),i?i.call(e):t.get(e)),sN=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},sU=(e,t,i,a)=>(sC(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class sP extends rC{constructor(){super(),sN(this,ez,void 0),sU(this,ez,this.shadowRoot.querySelector("slot"))}static get observedAttributes(){return[...super.observedAttributes,tj.MEDIA_PREVIEW_CHAPTER,tj.MEDIA_LANG]}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),(e===tj.MEDIA_PREVIEW_CHAPTER||e===tj.MEDIA_LANG)&&i!==t&&null!=i){if(sO(this,ez).textContent=i,""!==i){let e=ia("chapter: {chapterName}",{chapterName:i});this.setAttribute("aria-valuetext",e)}else this.removeAttribute("aria-valuetext")}}get mediaPreviewChapter(){return iN(this,tj.MEDIA_PREVIEW_CHAPTER)}set mediaPreviewChapter(e){iU(this,tj.MEDIA_PREVIEW_CHAPTER,e)}}ez=new WeakMap,im.customElements.get("media-preview-chapter-display")||im.customElements.define("media-preview-chapter-display",sP);var sx=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},sV=(e,t,i)=>(sx(e,t,"read from private field"),i?i.call(e):t.get(e)),sH=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},sW=(e,t,i,a)=>(sx(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class sF extends im.HTMLElement{constructor(){if(super(),sH(this,eX,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=i_(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[tq.MEDIA_CONTROLLER,tj.MEDIA_PREVIEW_IMAGE,tj.MEDIA_PREVIEW_COORDS]}connectedCallback(){var e,t,i;let a=this.getAttribute(tq.MEDIA_CONTROLLER);a&&(sW(this,eX,null==(e=this.getRootNode())?void 0:e.getElementById(a)),null==(i=null==(t=sV(this,eX))?void 0:t.associateElement)||i.call(t,this))}disconnectedCallback(){var e,t;null==(t=null==(e=sV(this,eX))?void 0:e.unassociateElement)||t.call(e,this),sW(this,eX,null)}attributeChangedCallback(e,t,i){var a,r,s,n,o;[tj.MEDIA_PREVIEW_IMAGE,tj.MEDIA_PREVIEW_COORDS].includes(e)&&this.update(),e===tq.MEDIA_CONTROLLER&&(t&&(null==(r=null==(a=sV(this,eX))?void 0:a.unassociateElement)||r.call(a,this),sW(this,eX,null)),i&&this.isConnected&&(sW(this,eX,null==(s=this.getRootNode())?void 0:s.getElementById(i)),null==(o=null==(n=sV(this,eX))?void 0:n.associateElement)||o.call(n,this)))}get mediaPreviewImage(){return iN(this,tj.MEDIA_PREVIEW_IMAGE)}set mediaPreviewImage(e){iU(this,tj.MEDIA_PREVIEW_IMAGE,e)}get mediaPreviewCoords(){let e=this.getAttribute(tj.MEDIA_PREVIEW_COORDS);if(e)return e.split(/\s+/).map(e=>+e)}set mediaPreviewCoords(e){if(!e){this.removeAttribute(tj.MEDIA_PREVIEW_COORDS);return}this.setAttribute(tj.MEDIA_PREVIEW_COORDS,e.join(" "))}update(){let e,t;let i=this.mediaPreviewCoords,a=this.mediaPreviewImage;if(!(i&&a))return;let[r,s,n,o]=i,l=a.split("#")[0],d=getComputedStyle(this),{maxWidth:u,maxHeight:h,minWidth:c,minHeight:m}=d,p=d.getPropertyValue("--media-preview-thumbnail-object-fit").trim()||"contain";if("fill"===p){let i=parseInt(u)/n,a=parseInt(h)/o,r=parseInt(c)/n,s=parseInt(m)/o;e=i<1?i:Math.max(i,r),t=a<1?a:Math.max(a,s)}else{let i=Math.min(parseInt(u)/n,parseInt(h)/o),a=Math.max(parseInt(c)/n,parseInt(m)/o),r=i<1?i:a>1?a:1;e=r,t=r}let{style:E}=ik(this.shadowRoot,":host"),v=ik(this.shadowRoot,"img").style,b=this.shadowRoot.querySelector("img"),g=1>Math.min(e,t),A=g?"min":"max";E.setProperty(`${A}-width`,"initial","important"),E.setProperty(`${A}-height`,"initial","important"),E.width=`${n*e}px`,E.height=`${o*t}px`;let f=()=>{v.width=`${this.imgWidth*e}px`,v.height=`${this.imgHeight*t}px`,v.display="block"};b.src!==l&&(b.onload=()=>{this.imgWidth=b.naturalWidth,this.imgHeight=b.naturalHeight,f(),b.onload=null},b.src=l,f()),f(),v.transform=`translate(-${r*e}px, -${s*t}px)`}}eX=new WeakMap,sF.shadowRootOptions={mode:"open"},sF.getTemplateHTML=function(e){return`
    <style>
      :host {
        box-sizing: border-box;
        display: var(--media-control-display, var(--media-preview-thumbnail-display, inline-block));
        overflow: hidden;
      }

      img {
        display: none;
        position: relative;
      }
    </style>
    <img crossorigin loading="eager" decoding="async">
  `},im.customElements.get("media-preview-thumbnail")||im.customElements.define("media-preview-thumbnail",sF);var s$=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},sB=(e,t,i)=>(s$(e,t,"read from private field"),i?i.call(e):t.get(e)),sG=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},sK=(e,t,i,a)=>(s$(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i);class sq extends rC{constructor(){super(),sG(this,eJ,void 0),sK(this,eJ,this.shadowRoot.querySelector("slot")),sB(this,eJ).textContent=il(0)}static get observedAttributes(){return[...super.observedAttributes,tj.MEDIA_PREVIEW_TIME]}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tj.MEDIA_PREVIEW_TIME&&null!=i&&(sB(this,eJ).textContent=il(parseFloat(i)))}get mediaPreviewTime(){return iR(this,tj.MEDIA_PREVIEW_TIME)}set mediaPreviewTime(e){iD(this,tj.MEDIA_PREVIEW_TIME,e)}}eJ=new WeakMap,im.customElements.get("media-preview-time-display")||im.customElements.define("media-preview-time-display",sq);let sQ={SEEK_OFFSET:"seekoffset"},sY=e=>`
  <svg aria-hidden="true" viewBox="0 0 20 24">
    <defs>
      <style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style>
    </defs>
    <text class="text value" transform="translate(2.18 19.87)">${e}</text>
    <path d="M10 6V3L4.37 7 10 10.94V8a5.54 5.54 0 0 1 1.9 10.48v2.12A7.5 7.5 0 0 0 10 6Z"/>
  </svg>`,sj=(e,t)=>{e.setAttribute("aria-label",ia("seek back {seekOffset} seconds",{seekOffset:t}))};class sZ extends a9{static get observedAttributes(){return[...super.observedAttributes,tj.MEDIA_CURRENT_TIME,sQ.SEEK_OFFSET]}connectedCallback(){super.connectedCallback(),this.seekOffset=iR(this,sQ.SEEK_OFFSET,30)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),sj(this,this.seekOffset),e===sQ.SEEK_OFFSET&&(this.seekOffset=iR(this,sQ.SEEK_OFFSET,30))}get seekOffset(){return iR(this,sQ.SEEK_OFFSET,30)}set seekOffset(e){iD(this,sQ.SEEK_OFFSET,e),this.setAttribute("aria-label",ia("seek back {seekOffset} seconds",{seekOffset:this.seekOffset})),iT(iy(this,"icon"),this.seekOffset)}get mediaCurrentTime(){return iR(this,tj.MEDIA_CURRENT_TIME,0)}set mediaCurrentTime(e){iD(this,tj.MEDIA_CURRENT_TIME,e)}handleClick(){let e=Math.max(this.mediaCurrentTime-this.seekOffset,0),t=new im.CustomEvent(tK.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(t)}}sZ.getSlotTemplateHTML=function(e,t){return`
    <slot name="icon">${sY(t.seekOffset)}</slot>
  `},sZ.getTooltipContentHTML=function(){return ia("Seek backward")},im.customElements.get("media-seek-backward-button")||im.customElements.define("media-seek-backward-button",sZ);let sz={SEEK_OFFSET:"seekoffset"},sX=e=>`
  <svg aria-hidden="true" viewBox="0 0 20 24">
    <defs>
      <style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style>
    </defs>
    <text class="text value" transform="translate(8.9 19.87)">${e}</text>
    <path d="M10 6V3l5.61 4L10 10.94V8a5.54 5.54 0 0 0-1.9 10.48v2.12A7.5 7.5 0 0 1 10 6Z"/>
  </svg>`,sJ=(e,t)=>{e.setAttribute("aria-label",ia("seek forward {seekOffset} seconds",{seekOffset:t}))};class s0 extends a9{static get observedAttributes(){return[...super.observedAttributes,tj.MEDIA_CURRENT_TIME,sz.SEEK_OFFSET]}connectedCallback(){super.connectedCallback(),this.seekOffset=iR(this,sz.SEEK_OFFSET,30)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),sJ(this,this.seekOffset),e===sz.SEEK_OFFSET&&(this.seekOffset=iR(this,sz.SEEK_OFFSET,30))}get seekOffset(){return iR(this,sz.SEEK_OFFSET,30)}set seekOffset(e){iD(this,sz.SEEK_OFFSET,e),this.setAttribute("aria-label",ia("seek forward {seekOffset} seconds",{seekOffset:this.seekOffset})),iT(iy(this,"icon"),this.seekOffset)}get mediaCurrentTime(){return iR(this,tj.MEDIA_CURRENT_TIME,0)}set mediaCurrentTime(e){iD(this,tj.MEDIA_CURRENT_TIME,e)}handleClick(){let e=this.mediaCurrentTime+this.seekOffset,t=new im.CustomEvent(tK.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(t)}}s0.getSlotTemplateHTML=function(e,t){return`
    <slot name="icon">${sX(t.seekOffset)}</slot>
  `},s0.getTooltipContentHTML=function(){return ia("Seek forward")},im.customElements.get("media-seek-forward-button")||im.customElements.define("media-seek-forward-button",s0);var s1=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},s2=(e,t,i)=>(s1(e,t,"read from private field"),i?i.call(e):t.get(e)),s5=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},s3=(e,t,i,a)=>(s1(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),s4=(e,t,i)=>(s1(e,t,"access private method"),i);let s7={REMAINING:"remaining",SHOW_DURATION:"showduration",NO_TOGGLE:"notoggle"},s8=[...Object.values(s7),tj.MEDIA_CURRENT_TIME,tj.MEDIA_DURATION,tj.MEDIA_SEEKABLE],s9=["Enter"," "],s6="&nbsp;/&nbsp;",ne=(e,{timesSep:t=s6}={})=>{var i,a;let r=null!=(i=e.mediaCurrentTime)?i:0,[,s]=null!=(a=e.mediaSeekable)?a:[],n=0;Number.isFinite(e.mediaDuration)?n=e.mediaDuration:Number.isFinite(s)&&(n=s);let o=e.remaining?il(0-(n-r)):il(r);return e.showDuration?`${o}${t}${il(n)}`:o},nt=e=>{var t;let i=e.mediaCurrentTime,[,a]=null!=(t=e.mediaSeekable)?t:[],r=null;if(Number.isFinite(e.mediaDuration)?r=e.mediaDuration:Number.isFinite(a)&&(r=a),null==i||null===r){e.setAttribute("aria-description",ia("video not loaded, unknown time."));return}let s=e.remaining?io(0-(r-i)):io(i);if(!e.showDuration){e.setAttribute("aria-description",s);return}let n=io(r),o=ia("{currentTime} of {totalTime}",{currentTime:s,totalTime:n});e.setAttribute("aria-description",o)},ni=e=>{e.setAttribute("aria-label",ia("playback time"))};class na extends rC{constructor(){super(),s5(this,e5),s5(this,e4),s5(this,e8),s5(this,e6),s5(this,e0,void 0),s5(this,e1,null),s5(this,e2,e=>{let{metaKey:t,altKey:i,key:a}=e;if(t||i||!s9.includes(a)){this.removeEventListener("keyup",s2(this,e1));return}this.addEventListener("keyup",s2(this,e1))}),s3(this,e0,this.shadowRoot.querySelector("slot")),s2(this,e0).innerHTML=`${ne(this)}`}static get observedAttributes(){return[...super.observedAttributes,...s8,"disabled"]}connectedCallback(){let{style:e}=ik(this.shadowRoot,":host(:hover:not([notoggle]))");e.setProperty("cursor","var(--media-cursor, pointer)"),e.setProperty("background","var(--media-control-hover-background, rgba(50 50 70 / .7))"),this.setAttribute("aria-label",ia("playback time")),s4(this,e8,e9).call(this),super.connectedCallback()}toggleTimeDisplay(){this.noToggle||(this.hasAttribute("remaining")?this.removeAttribute("remaining"):this.setAttribute("remaining",""))}disconnectedCallback(){this.disable(),s4(this,e4,e7).call(this),super.disconnectedCallback()}attributeChangedCallback(e,t,i){ni(this),s8.includes(e)?this.update():"disabled"===e&&i!==t?null==i?s4(this,e8,e9).call(this):s4(this,e6,te).call(this):e===s7.NO_TOGGLE&&i!==t&&(this.noToggle?s4(this,e6,te).call(this):s4(this,e8,e9).call(this)),super.attributeChangedCallback(e,t,i)}enable(){this.noToggle||(this.tabIndex=0)}disable(){this.tabIndex=-1}get remaining(){return iC(this,s7.REMAINING)}set remaining(e){iO(this,s7.REMAINING,e)}get showDuration(){return iC(this,s7.SHOW_DURATION)}set showDuration(e){iO(this,s7.SHOW_DURATION,e)}get noToggle(){return iC(this,s7.NO_TOGGLE)}set noToggle(e){iO(this,s7.NO_TOGGLE,e)}get mediaDuration(){return iR(this,tj.MEDIA_DURATION)}set mediaDuration(e){iD(this,tj.MEDIA_DURATION,e)}get mediaCurrentTime(){return iR(this,tj.MEDIA_CURRENT_TIME)}set mediaCurrentTime(e){iD(this,tj.MEDIA_CURRENT_TIME,e)}get mediaSeekable(){let e=this.getAttribute(tj.MEDIA_SEEKABLE);if(e)return e.split(":").map(e=>+e)}set mediaSeekable(e){if(null==e){this.removeAttribute(tj.MEDIA_SEEKABLE);return}this.setAttribute(tj.MEDIA_SEEKABLE,e.join(":"))}update(){let e=ne(this);nt(this),e!==s2(this,e0).innerHTML&&(s2(this,e0).innerHTML=e)}}e0=new WeakMap,e1=new WeakMap,e2=new WeakMap,e5=new WeakSet,e3=function(){s2(this,e1)||(s3(this,e1,e=>{let{key:t}=e;if(!s9.includes(t)){this.removeEventListener("keyup",s2(this,e1));return}this.toggleTimeDisplay()}),this.addEventListener("keydown",s2(this,e2)),this.addEventListener("click",this.toggleTimeDisplay))},e4=new WeakSet,e7=function(){s2(this,e1)&&(this.removeEventListener("keyup",s2(this,e1)),this.removeEventListener("keydown",s2(this,e2)),this.removeEventListener("click",this.toggleTimeDisplay),s3(this,e1,null))},e8=new WeakSet,e9=function(){this.noToggle||this.hasAttribute("disabled")||(this.setAttribute("role","button"),this.enable(),s4(this,e5,e3).call(this))},e6=new WeakSet,te=function(){this.removeAttribute("role"),this.disable(),s4(this,e4,e7).call(this)},na.getSlotTemplateHTML=function(e,t){return`
    <slot>${ne(t)}</slot>
  `},im.customElements.get("media-time-display")||im.customElements.define("media-time-display",na);var nr=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},ns=(e,t,i)=>(nr(e,t,"read from private field"),i?i.call(e):t.get(e)),nn=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},no=(e,t,i,a)=>(nr(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),nl=(e,t,i,a)=>({set _(value){no(e,t,value,i)},get _(){return ns(e,t,a)}});class nd{constructor(e,t,i){nn(this,tt,void 0),nn(this,ti,void 0),nn(this,ta,void 0),nn(this,tr,void 0),nn(this,ts,void 0),nn(this,tn,void 0),nn(this,to,void 0),nn(this,tl,void 0),nn(this,td,0),nn(this,tu,(e=performance.now())=>{no(this,td,requestAnimationFrame(ns(this,tu))),no(this,tr,performance.now()-ns(this,ta));let t=1e3/this.fps;if(ns(this,tr)>t){no(this,ta,e-ns(this,tr)%t);let i=1e3/((e-ns(this,ti))/++nl(this,ts)._),a=(e-ns(this,tn))/1e3/this.duration,r=ns(this,to)+a*this.playbackRate,s=r-ns(this,tt).valueAsNumber;s>0?no(this,tl,this.playbackRate/this.duration/i):(no(this,tl,.995*ns(this,tl)),r=ns(this,tt).valueAsNumber+ns(this,tl)),this.callback(r)}}),no(this,tt,e),this.callback=t,this.fps=i}start(){0===ns(this,td)&&(no(this,ta,performance.now()),no(this,ti,ns(this,ta)),no(this,ts,0),ns(this,tu).call(this))}stop(){0!==ns(this,td)&&(cancelAnimationFrame(ns(this,td)),no(this,td,0))}update({start:e,duration:t,playbackRate:i}){let a=e-ns(this,tt).valueAsNumber,r=Math.abs(t-this.duration);(a>0||a<-.03||r>=.5)&&this.callback(e),no(this,to,e),no(this,tn,performance.now()),this.duration=t,this.playbackRate=i}}tt=new WeakMap,ti=new WeakMap,ta=new WeakMap,tr=new WeakMap,ts=new WeakMap,tn=new WeakMap,to=new WeakMap,tl=new WeakMap,td=new WeakMap,tu=new WeakMap;var nu=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},nh=(e,t,i)=>(nu(e,t,"read from private field"),i?i.call(e):t.get(e)),nc=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},nm=(e,t,i,a)=>(nu(e,t,"write to private field"),a?a.call(e,i):t.set(e,i),i),np=(e,t,i)=>(nu(e,t,"access private method"),i);let nE=e=>{let t=e.range,i=io(+nb(e)),a=io(+e.mediaSeekableEnd),r=i&&a?ia("{currentTime} of {totalTime}",{currentTime:i,totalTime:a}):ia("video not loaded, unknown time.");t.setAttribute("aria-valuetext",r)},nv=(e,t=e.mediaCurrentTime)=>{let i=Number.isFinite(e.mediaSeekableStart)?e.mediaSeekableStart:0,a=Number.isFinite(e.mediaDuration)?e.mediaDuration:e.mediaSeekableEnd;return Number.isNaN(a)?0:Math.max(0,Math.min((t-i)/(a-i),1))},nb=(e,t=e.range.valueAsNumber)=>{let i=Number.isFinite(e.mediaSeekableStart)?e.mediaSeekableStart:0,a=Number.isFinite(e.mediaDuration)?e.mediaDuration:e.mediaSeekableEnd;return Number.isNaN(a)?0:t*(a-i)+i};class ng extends rT{constructor(){super(),nc(this,tT),nc(this,tw),nc(this,tL),nc(this,tM),nc(this,tD),nc(this,tO),nc(this,tU),nc(this,th,null),nc(this,tc,void 0),nc(this,tm,void 0),nc(this,tp,void 0),nc(this,tE,void 0),nc(this,tv,void 0),nc(this,tb,void 0),nc(this,tg,void 0),nc(this,tA,void 0),nc(this,tf,void 0),nc(this,t_,()=>{np(this,tT,tI).call(this)?nh(this,tc).start():nh(this,tc).stop()}),nc(this,ty,e=>{this.dragging||(t7(e)&&(this.range.valueAsNumber=e),nh(this,tf)||this.updateBar())});let e=this.shadowRoot.querySelector("#track");e.insertAdjacentHTML("afterbegin",'<div id="buffered" part="buffered"></div>'),nm(this,tm,this.shadowRoot.querySelectorAll('[part~="box"]')),nm(this,tE,this.shadowRoot.querySelector('[part~="preview-box"]')),nm(this,tv,this.shadowRoot.querySelector('[part~="current-box"]'));let t=getComputedStyle(this);nm(this,tb,parseInt(t.getPropertyValue("--media-box-padding-left"))),nm(this,tg,parseInt(t.getPropertyValue("--media-box-padding-right"))),nm(this,tc,new nd(this.range,nh(this,ty),60))}static get observedAttributes(){return[...super.observedAttributes,tj.MEDIA_PAUSED,tj.MEDIA_DURATION,tj.MEDIA_SEEKABLE,tj.MEDIA_CURRENT_TIME,tj.MEDIA_PREVIEW_IMAGE,tj.MEDIA_PREVIEW_TIME,tj.MEDIA_PREVIEW_CHAPTER,tj.MEDIA_BUFFERED,tj.MEDIA_PLAYBACK_RATE,tj.MEDIA_LOADING,tj.MEDIA_ENDED]}connectedCallback(){var e;super.connectedCallback(),this.range.setAttribute("aria-label",ia("seek")),nh(this,t_).call(this),nm(this,th,this.getRootNode()),null==(e=nh(this,th))||e.addEventListener("transitionstart",this)}disconnectedCallback(){var e;super.disconnectedCallback(),nh(this,tc).stop(),null==(e=nh(this,th))||e.removeEventListener("transitionstart",this),nm(this,th,null)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),t!=i&&(e===tj.MEDIA_CURRENT_TIME||e===tj.MEDIA_PAUSED||e===tj.MEDIA_ENDED||e===tj.MEDIA_LOADING||e===tj.MEDIA_DURATION||e===tj.MEDIA_SEEKABLE?(nh(this,tc).update({start:nv(this),duration:this.mediaSeekableEnd-this.mediaSeekableStart,playbackRate:this.mediaPlaybackRate}),nh(this,t_).call(this),nE(this)):e===tj.MEDIA_BUFFERED&&this.updateBufferedBar(),(e===tj.MEDIA_DURATION||e===tj.MEDIA_SEEKABLE)&&(this.mediaChaptersCues=nh(this,tA),this.updateBar()))}get mediaChaptersCues(){return nh(this,tA)}set mediaChaptersCues(e){var t;nm(this,tA,e),this.updateSegments(null==(t=nh(this,tA))?void 0:t.map(e=>({start:nv(this,e.startTime),end:nv(this,e.endTime)})))}get mediaPaused(){return iC(this,tj.MEDIA_PAUSED)}set mediaPaused(e){iO(this,tj.MEDIA_PAUSED,e)}get mediaLoading(){return iC(this,tj.MEDIA_LOADING)}set mediaLoading(e){iO(this,tj.MEDIA_LOADING,e)}get mediaDuration(){return iR(this,tj.MEDIA_DURATION)}set mediaDuration(e){iD(this,tj.MEDIA_DURATION,e)}get mediaCurrentTime(){return iR(this,tj.MEDIA_CURRENT_TIME)}set mediaCurrentTime(e){iD(this,tj.MEDIA_CURRENT_TIME,e)}get mediaPlaybackRate(){return iR(this,tj.MEDIA_PLAYBACK_RATE,1)}set mediaPlaybackRate(e){iD(this,tj.MEDIA_PLAYBACK_RATE,e)}get mediaBuffered(){let e=this.getAttribute(tj.MEDIA_BUFFERED);return e?e.split(" ").map(e=>e.split(":").map(e=>+e)):[]}set mediaBuffered(e){if(!e){this.removeAttribute(tj.MEDIA_BUFFERED);return}let t=e.map(e=>e.join(":")).join(" ");this.setAttribute(tj.MEDIA_BUFFERED,t)}get mediaSeekable(){let e=this.getAttribute(tj.MEDIA_SEEKABLE);if(e)return e.split(":").map(e=>+e)}set mediaSeekable(e){if(null==e){this.removeAttribute(tj.MEDIA_SEEKABLE);return}this.setAttribute(tj.MEDIA_SEEKABLE,e.join(":"))}get mediaSeekableEnd(){var e;let[,t=this.mediaDuration]=null!=(e=this.mediaSeekable)?e:[];return t}get mediaSeekableStart(){var e;let[t=0]=null!=(e=this.mediaSeekable)?e:[];return t}get mediaPreviewImage(){return iN(this,tj.MEDIA_PREVIEW_IMAGE)}set mediaPreviewImage(e){iU(this,tj.MEDIA_PREVIEW_IMAGE,e)}get mediaPreviewTime(){return iR(this,tj.MEDIA_PREVIEW_TIME)}set mediaPreviewTime(e){iD(this,tj.MEDIA_PREVIEW_TIME,e)}get mediaEnded(){return iC(this,tj.MEDIA_ENDED)}set mediaEnded(e){iO(this,tj.MEDIA_ENDED,e)}updateBar(){super.updateBar(),this.updateBufferedBar(),this.updateCurrentBox()}updateBufferedBar(){var e;let t;let i=this.mediaBuffered;if(!i.length)return;if(this.mediaEnded)t=1;else{let a=this.mediaCurrentTime,[,r=this.mediaSeekableStart]=null!=(e=i.find(([e,t])=>e<=a&&a<=t))?e:[];t=nv(this,r)}let{style:a}=ik(this.shadowRoot,"#buffered");a.setProperty("width",`${100*t}%`)}updateCurrentBox(){let e=this.shadowRoot.querySelector('slot[name="current"]');if(!e.assignedElements().length)return;let t=ik(this.shadowRoot,"#current-rail"),i=ik(this.shadowRoot,'[part~="current-box"]'),a=np(this,tw,tS).call(this,nh(this,tv)),r=np(this,tL,tk).call(this,a,this.range.valueAsNumber),s=np(this,tM,tR).call(this,a,this.range.valueAsNumber);t.style.transform=`translateX(${r})`,t.style.setProperty("--_range-width",`${a.range.width}`),i.style.setProperty("--_box-shift",`${s}`),i.style.setProperty("--_box-width",`${a.box.width}px`),i.style.setProperty("visibility","initial")}handleEvent(e){switch(super.handleEvent(e),e.type){case"input":np(this,tU,tP).call(this);break;case"pointermove":np(this,tD,tC).call(this,e);break;case"pointerup":nh(this,tf)&&nm(this,tf,!1);break;case"pointerdown":nm(this,tf,!0);break;case"pointerleave":np(this,tO,tN).call(this,null);break;case"transitionstart":iw(e.target,this)&&setTimeout(()=>nh(this,t_).call(this),0)}}}th=new WeakMap,tc=new WeakMap,tm=new WeakMap,tp=new WeakMap,tE=new WeakMap,tv=new WeakMap,tb=new WeakMap,tg=new WeakMap,tA=new WeakMap,tf=new WeakMap,t_=new WeakMap,tT=new WeakSet,tI=function(){return this.isConnected&&!this.mediaPaused&&!this.mediaLoading&&!this.mediaEnded&&this.mediaSeekableEnd>0&&iL(this)},ty=new WeakMap,tw=new WeakSet,tS=function(e){var t;let i=null!=(t=this.getAttribute("bounds")?iS(this,`#${this.getAttribute("bounds")}`):this.parentElement)?t:this,a=i.getBoundingClientRect(),r=this.range.getBoundingClientRect(),s=e.offsetWidth,n=-(r.left-a.left-s/2),o=a.right-r.left-s/2;return{box:{width:s,min:n,max:o},bounds:a,range:r}},tL=new WeakSet,tk=function(e,t){let i=`${100*t}%`,{width:a,min:r,max:s}=e.box;if(!a)return i;if(!Number.isNaN(r)){let e=`calc(1 / var(--_range-width) * 100 * ${r}% + var(--media-box-padding-left))`;i=`max(${e}, ${i})`}if(!Number.isNaN(s)){let e=`calc(1 / var(--_range-width) * 100 * ${s}% - var(--media-box-padding-right))`;i=`min(${i}, ${e})`}return i},tM=new WeakSet,tR=function(e,t){let{width:i,min:a,max:r}=e.box,s=t*e.range.width;if(s<a+nh(this,tb)){let t=e.range.left-e.bounds.left-nh(this,tb);return`${s-i/2+t}px`}if(s>r-nh(this,tg)){let t=e.bounds.right-e.range.right-nh(this,tg);return`${s+i/2-t-e.range.width}px`}return 0},tD=new WeakSet,tC=function(e){let t=[...nh(this,tm)].some(t=>e.composedPath().includes(t));if(!this.dragging&&(t||!e.composedPath().includes(this))){np(this,tO,tN).call(this,null);return}let i=this.mediaSeekableEnd;if(!i)return;let a=ik(this.shadowRoot,"#preview-rail"),r=ik(this.shadowRoot,'[part~="preview-box"]'),s=np(this,tw,tS).call(this,nh(this,tE)),n=(e.clientX-s.range.left)/s.range.width;n=Math.max(0,Math.min(1,n));let o=np(this,tL,tk).call(this,s,n),l=np(this,tM,tR).call(this,s,n);a.style.transform=`translateX(${o})`,a.style.setProperty("--_range-width",`${s.range.width}`),r.style.setProperty("--_box-shift",`${l}`),r.style.setProperty("--_box-width",`${s.box.width}px`);let d=Math.round(nh(this,tp))-Math.round(n*i);1>Math.abs(d)&&n>.01&&n<.99||(nm(this,tp,n*i),np(this,tO,tN).call(this,nh(this,tp)))},tO=new WeakSet,tN=function(e){this.dispatchEvent(new im.CustomEvent(tK.MEDIA_PREVIEW_REQUEST,{composed:!0,bubbles:!0,detail:e}))},tU=new WeakSet,tP=function(){nh(this,tc).stop();let e=nb(this);this.dispatchEvent(new im.CustomEvent(tK.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e}))},ng.shadowRootOptions={mode:"open"},ng.getContainerTemplateHTML=function(e){return`
    <style>
      :host {
        --media-box-border-radius: 4px;
        --media-box-padding-left: 10px;
        --media-box-padding-right: 10px;
        --media-preview-border-radius: var(--media-box-border-radius);
        --media-box-arrow-offset: var(--media-box-border-radius);
        --_control-background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        --_preview-background: var(--media-preview-background, var(--_control-background));

        
        contain: layout;
      }

      #buffered {
        background: var(--media-time-range-buffered-color, rgb(255 255 255 / .4));
        position: absolute;
        height: 100%;
        will-change: width;
      }

      #preview-rail,
      #current-rail {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 100%;
        pointer-events: none;
        will-change: transform;
      }

      [part~="box"] {
        width: min-content;
        
        position: absolute;
        bottom: 100%;
        flex-direction: column;
        align-items: center;
        transform: translateX(-50%);
      }

      [part~="current-box"] {
        display: var(--media-current-box-display, var(--media-box-display, flex));
        margin: var(--media-current-box-margin, var(--media-box-margin, 0 0 5px));
        visibility: hidden;
      }

      [part~="preview-box"] {
        display: var(--media-preview-box-display, var(--media-box-display, flex));
        margin: var(--media-preview-box-margin, var(--media-box-margin, 0 0 5px));
        transition-property: var(--media-preview-transition-property, visibility, opacity);
        transition-duration: var(--media-preview-transition-duration-out, .25s);
        transition-delay: var(--media-preview-transition-delay-out, 0s);
        visibility: hidden;
        opacity: 0;
      }

      :host(:is([${tj.MEDIA_PREVIEW_IMAGE}], [${tj.MEDIA_PREVIEW_TIME}])[dragging]) [part~="preview-box"] {
        transition-duration: var(--media-preview-transition-duration-in, .5s);
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        visibility: visible;
        opacity: 1;
      }

      @media (hover: hover) {
        :host(:is([${tj.MEDIA_PREVIEW_IMAGE}], [${tj.MEDIA_PREVIEW_TIME}]):hover) [part~="preview-box"] {
          transition-duration: var(--media-preview-transition-duration-in, .5s);
          transition-delay: var(--media-preview-transition-delay-in, .25s);
          visibility: visible;
          opacity: 1;
        }
      }

      media-preview-thumbnail,
      ::slotted(media-preview-thumbnail) {
        visibility: hidden;
        
        transition: visibility 0s .25s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-thumbnail-background, var(--_preview-background));
        box-shadow: var(--media-preview-thumbnail-box-shadow, 0 0 4px rgb(0 0 0 / .2));
        max-width: var(--media-preview-thumbnail-max-width, 180px);
        max-height: var(--media-preview-thumbnail-max-height, 160px);
        min-width: var(--media-preview-thumbnail-min-width, 120px);
        min-height: var(--media-preview-thumbnail-min-height, 80px);
        border: var(--media-preview-thumbnail-border);
        border-radius: var(--media-preview-thumbnail-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius) 0 0);
      }

      :host([${tj.MEDIA_PREVIEW_IMAGE}][dragging]) media-preview-thumbnail,
      :host([${tj.MEDIA_PREVIEW_IMAGE}][dragging]) ::slotted(media-preview-thumbnail) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        visibility: visible;
      }

      @media (hover: hover) {
        :host([${tj.MEDIA_PREVIEW_IMAGE}]:hover) media-preview-thumbnail,
        :host([${tj.MEDIA_PREVIEW_IMAGE}]:hover) ::slotted(media-preview-thumbnail) {
          transition-delay: var(--media-preview-transition-delay-in, .25s);
          visibility: visible;
        }

        :host([${tj.MEDIA_PREVIEW_TIME}]:hover) {
          --media-time-range-hover-display: block;
        }
      }

      media-preview-chapter-display,
      ::slotted(media-preview-chapter-display) {
        font-size: var(--media-font-size, 13px);
        line-height: 17px;
        min-width: 0;
        visibility: hidden;
        
        transition: min-width 0s, border-radius 0s, margin 0s, padding 0s, visibility 0s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-chapter-background, var(--_preview-background));
        border-radius: var(--media-preview-chapter-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius)
          var(--media-preview-border-radius) var(--media-preview-border-radius));
        padding: var(--media-preview-chapter-padding, 3.5px 9px);
        margin: var(--media-preview-chapter-margin, 0 0 5px);
        text-shadow: var(--media-preview-chapter-text-shadow, 0 0 4px rgb(0 0 0 / .75));
      }

      :host([${tj.MEDIA_PREVIEW_IMAGE}]) media-preview-chapter-display,
      :host([${tj.MEDIA_PREVIEW_IMAGE}]) ::slotted(media-preview-chapter-display) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        border-radius: var(--media-preview-chapter-border-radius, 0);
        padding: var(--media-preview-chapter-padding, 3.5px 9px 0);
        margin: var(--media-preview-chapter-margin, 0);
        min-width: 100%;
      }

      media-preview-chapter-display[${tj.MEDIA_PREVIEW_CHAPTER}],
      ::slotted(media-preview-chapter-display[${tj.MEDIA_PREVIEW_CHAPTER}]) {
        visibility: visible;
      }

      media-preview-chapter-display:not([aria-valuetext]),
      ::slotted(media-preview-chapter-display:not([aria-valuetext])) {
        display: none;
      }

      media-preview-time-display,
      ::slotted(media-preview-time-display),
      media-time-display,
      ::slotted(media-time-display) {
        font-size: var(--media-font-size, 13px);
        line-height: 17px;
        min-width: 0;
        
        transition: min-width 0s, border-radius 0s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-time-background, var(--_preview-background));
        border-radius: var(--media-preview-time-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius)
          var(--media-preview-border-radius) var(--media-preview-border-radius));
        padding: var(--media-preview-time-padding, 3.5px 9px);
        margin: var(--media-preview-time-margin, 0);
        text-shadow: var(--media-preview-time-text-shadow, 0 0 4px rgb(0 0 0 / .75));
        transform: translateX(min(
          max(calc(50% - var(--_box-width) / 2),
          calc(var(--_box-shift, 0))),
          calc(var(--_box-width) / 2 - 50%)
        ));
      }

      :host([${tj.MEDIA_PREVIEW_IMAGE}]) media-preview-time-display,
      :host([${tj.MEDIA_PREVIEW_IMAGE}]) ::slotted(media-preview-time-display) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        border-radius: var(--media-preview-time-border-radius,
          0 0 var(--media-preview-border-radius) var(--media-preview-border-radius));
        min-width: 100%;
      }

      :host([${tj.MEDIA_PREVIEW_TIME}]:hover) {
        --media-time-range-hover-display: block;
      }

      [part~="arrow"],
      ::slotted([part~="arrow"]) {
        display: var(--media-box-arrow-display, inline-block);
        transform: translateX(min(
          max(calc(50% - var(--_box-width) / 2 + var(--media-box-arrow-offset)),
          calc(var(--_box-shift, 0))),
          calc(var(--_box-width) / 2 - 50% - var(--media-box-arrow-offset))
        ));
        
        border-color: transparent;
        border-top-color: var(--media-box-arrow-background, var(--_control-background));
        border-width: var(--media-box-arrow-border-width,
          var(--media-box-arrow-height, 5px) var(--media-box-arrow-width, 6px) 0);
        border-style: solid;
        justify-content: center;
        height: 0;
      }
    </style>
    <div id="preview-rail">
      <slot name="preview" part="box preview-box">
        <media-preview-thumbnail>
          <template shadowrootmode="${sF.shadowRootOptions.mode}">
            ${sF.getTemplateHTML({})}
          </template>
        </media-preview-thumbnail>
        <media-preview-chapter-display></media-preview-chapter-display>
        <media-preview-time-display></media-preview-time-display>
        <slot name="preview-arrow"><div part="arrow"></div></slot>
      </slot>
    </div>
    <div id="current-rail">
      <slot name="current" part="box current-box">
        
      </slot>
    </div>
  `},im.customElements.get("media-time-range")||im.customElements.define("media-time-range",ng);var nA=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},nf=(e,t,i)=>(nA(e,t,"read from private field"),i?i.call(e):t.get(e)),n_=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)};let nT=e=>e.mediaMuted?0:e.mediaVolume,nI=e=>`${Math.round(100*e)}%`;class ny extends rT{constructor(){super(...arguments),n_(this,tx,()=>{let e=this.range.value,t=new im.CustomEvent(tK.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(t)})}static get observedAttributes(){return[...super.observedAttributes,tj.MEDIA_VOLUME,tj.MEDIA_MUTED,tj.MEDIA_VOLUME_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),this.range.setAttribute("aria-label",ia("volume")),this.range.addEventListener("input",nf(this,tx))}disconnectedCallback(){this.range.removeEventListener("input",nf(this,tx)),super.disconnectedCallback()}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),(e===tj.MEDIA_VOLUME||e===tj.MEDIA_MUTED)&&(this.range.valueAsNumber=nT(this),this.range.setAttribute("aria-valuetext",nI(this.range.valueAsNumber)),this.updateBar())}get mediaVolume(){return iR(this,tj.MEDIA_VOLUME,1)}set mediaVolume(e){iD(this,tj.MEDIA_VOLUME,e)}get mediaMuted(){return iC(this,tj.MEDIA_MUTED)}set mediaMuted(e){iO(this,tj.MEDIA_MUTED,e)}get mediaVolumeUnavailable(){return iN(this,tj.MEDIA_VOLUME_UNAVAILABLE)}set mediaVolumeUnavailable(e){iU(this,tj.MEDIA_VOLUME_UNAVAILABLE,e)}}tx=new WeakMap,im.customElements.get("media-volume-range")||im.customElements.define("media-volume-range",ny);class nw extends a9{constructor(){super(...arguments),this.container=null}static get observedAttributes(){return[...super.observedAttributes,tj.MEDIA_LOOP]}connectedCallback(){var e;super.connectedCallback(),this.container=(null==(e=this.shadowRoot)?void 0:e.querySelector("#icon"))||null,this.container&&(this.container.textContent=ia("Loop"))}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),e===tj.MEDIA_LOOP&&this.container&&this.setAttribute("aria-checked",this.mediaLoop?"true":"false")}get mediaLoop(){return iC(this,tj.MEDIA_LOOP)}set mediaLoop(e){iO(this,tj.MEDIA_LOOP,e)}handleClick(){let e=!this.mediaLoop,t=new im.CustomEvent(tK.MEDIA_LOOP_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(t)}}function nS(e){return"boolean"==typeof e?e?"":void 0:"function"==typeof e?void 0:Array.isArray(e)&&e.every(e=>"string"==typeof e||"number"==typeof e||"boolean"==typeof e)?e.join(" "):"object"!=typeof e||null===e?e:void 0}nw.getSlotTemplateHTML=function(e){return`
      <style>
        :host {
          min-width: 4ch;
          padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
          width: 100%;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1rem;
          font-weight: var(--media-button-font-weight, normal);
        }

        #checked-indicator {
          display: none;
        }

        :host([${tj.MEDIA_LOOP}]) #checked-indicator {
          display: block;
        }
      </style>
      
      <span id="icon">
     </span>

      <div id="checked-indicator">
        <svg aria-hidden="true" viewBox="0 1 24 24" part="checked-indicator indicator">
          <path d="m10 15.17 9.193-9.191 1.414 1.414-10.606 10.606-6.364-6.364 1.414-1.414 4.95 4.95Z"/>
        </svg>
      </div>
    `},nw.getTooltipContentHTML=function(){return ia("Loop")},im.customElements.get("media-loop-button")||im.customElements.define("media-loop-button",nw),tB({tagName:"media-gesture-receiver",elementClass:iW,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}}),tB({tagName:"media-container",elementClass:ij,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}});let nL=tB({tagName:"media-controller",elementClass:aF,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}});tB({tagName:"media-tooltip",elementClass:a1,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}}),tB({tagName:"media-chrome-button",elementClass:a9,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}}),tB({tagName:"media-airplay-button",elementClass:rt,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}}),tB({tagName:"media-captions-button",elementClass:rs,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}}),tB({tagName:"media-cast-button",elementClass:rd,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}}),tB({tagName:"media-chrome-dialog",elementClass:rv,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}}),tB({tagName:"media-chrome-range",elementClass:rT,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}});let nk=tB({tagName:"media-control-bar",elementClass:rL,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}});tB({tagName:"media-text-display",elementClass:rC,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}}),tB({tagName:"media-duration-display",elementClass:rx,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}}),tB({tagName:"media-error-dialog",elementClass:rQ,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}}),tB({tagName:"media-keyboard-shortcuts-dialog",elementClass:rz,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}});let nM=tB({tagName:"media-fullscreen-button",elementClass:r4,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}});tB({tagName:"media-live-button",elementClass:st,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}}),tB({tagName:"media-loading-indicator",elementClass:sl,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}}),tB({tagName:"media-mute-button",elementClass:sm,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}}),tB({tagName:"media-pip-button",elementClass:sv,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}});let nR=tB({tagName:"media-playback-rate-button",elementClass:sI,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}}),nD=tB({tagName:"media-play-button",elementClass:sL,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}});tB({tagName:"media-poster-image",elementClass:sD,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}}),tB({tagName:"media-preview-chapter-display",elementClass:sP,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}}),tB({tagName:"media-preview-thumbnail",elementClass:sF,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}}),tB({tagName:"media-preview-time-display",elementClass:sq,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}}),tB({tagName:"media-seek-backward-button",elementClass:sZ,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}}),tB({tagName:"media-seek-forward-button",elementClass:s0,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}});let nC=tB({tagName:"media-time-display",elementClass:na,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}}),nO=tB({tagName:"media-time-range",elementClass:ng,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}});tB({tagName:"media-volume-range",elementClass:ny,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}}),tB({tagName:"media-loop-button",elementClass:nw,react:tV,toAttributeValue:nS,defaultProps:{suppressHydrationWarning:!0}})}}]);

