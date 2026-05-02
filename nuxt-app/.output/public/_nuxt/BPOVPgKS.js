const c={poster:{width:600,height:900,title:"No Image",bg:"#11161c",panel:"#1c2834",accent:"#2b9fb3"},avatar:{width:300,height:300,title:"User",bg:"#141a20",panel:"#22303c",accent:"#c99b33"},banner:{width:1600,height:450,title:"OmniList",bg:"#10161d",panel:"#1b2a36",accent:"#2b9fb3"}};function i(e,t){return`${(Array.isArray(e)?e.join(" "):e)??""}`.replace(/<[^>]*>/g,"").replace(/\s+/g," ").trim()||t}function g(e){return i(e,"U").split(" ").filter(Boolean).slice(0,2).map(t=>t[0]).join("").toUpperCase()}function $(e){return`${e}`.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function f(e,t){if(typeof e=="object"&&e!==null){const l=e.type??"poster";return{...c.poster,...c[l],type:l,label:e.label}}const a=e??"poster";return{...c.poster,...c[a],type:a,label:t}}function n(e){const t=i(e.label,e.title),a=e.type==="avatar"?g(t):i(t,e.title).slice(0,34),l=$(a),h=e.type==="banner"?64:e.type==="avatar"?86:54;return e.type==="avatar"?`
      <svg xmlns="http://www.w3.org/2000/svg" width="${e.width}" height="${e.height}" viewBox="0 0 ${e.width} ${e.height}" role="img" aria-label="${l}">
        <rect width="100%" height="100%" fill="${e.bg}"/>
        <circle cx="150" cy="126" r="76" fill="${e.panel}"/>
        <circle cx="150" cy="115" r="48" fill="${e.accent}" opacity=".9"/>
        <path d="M58 270c16-58 56-88 92-88s76 30 92 88" fill="${e.accent}" opacity=".75"/>
        <text x="50%" y="52%" fill="#eef6f8" font-family="Arial, Helvetica, sans-serif" font-size="${h}" font-weight="700" text-anchor="middle" dominant-baseline="middle">${l}</text>
      </svg>
    `:`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e.width}" height="${e.height}" viewBox="0 0 ${e.width} ${e.height}" role="img" aria-label="${l}">
      <rect width="100%" height="100%" fill="${e.bg}"/>
      <rect x="${e.width*.08}" y="${e.height*.08}" width="${e.width*.84}" height="${e.height*.84}" rx="18" fill="${e.panel}" stroke="${e.accent}" stroke-width="8" opacity=".95"/>
      <path d="M0 ${e.height*.78} C ${e.width*.18} ${e.height*.62}, ${e.width*.35} ${e.height*.9}, ${e.width*.55} ${e.height*.72} S ${e.width*.86} ${e.height*.64}, ${e.width} ${e.height*.76} V ${e.height} H 0 Z" fill="${e.accent}" opacity=".32"/>
      <circle cx="${e.width*.78}" cy="${e.height*.22}" r="${Math.min(e.width,e.height)*.08}" fill="${e.accent}" opacity=".72"/>
      <text x="50%" y="52%" fill="#eef6f8" font-family="Arial, Helvetica, sans-serif" font-size="${h}" font-weight="700" text-anchor="middle" dominant-baseline="middle">${l}</text>
    </svg>
  `}function r(e="poster",t){const a=f(e,t);return`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(n(a))}`}function d(e,t="poster",a){return typeof e=="string"&&e.trim().length>0?e:r(t,a)}function w(e,t="poster",a){e?.target&&(e.target.onerror=null,e.target.src=r(t,a))}export{d as i,w as u};
