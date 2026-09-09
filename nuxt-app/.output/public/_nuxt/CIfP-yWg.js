var e={poster:{width:600,height:900,title:`No Image`,bg:`#11161c`,panel:`#1c2834`,accent:`#2b9fb3`},avatar:{width:300,height:300,title:`User`,bg:`#141a20`,panel:`#22303c`,accent:`#c99b33`},banner:{width:1600,height:450,title:`OmniList`,bg:`#10161d`,panel:`#1b2a36`,accent:`#2b9fb3`}};function t(e,t){return`${(Array.isArray(e)?e.join(` `):e)??``}`.replace(/<[^>]*>/g,``).replace(/\s+/g,` `).trim()||t}function n(e){return t(e,`U`).split(` `).filter(Boolean).slice(0,2).map(e=>e[0]).join(``).toUpperCase()}function r(e){return`${e}`.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function i(t,n){if(typeof t==`object`&&t){let n=t.type??`poster`;return{...e.poster,...e[n],type:n,label:t.label}}let r=t??`poster`;return{...e.poster,...e[r],type:r,label:n}}function a(e){let i=t(e.label,e.title),a=r(e.type===`avatar`?n(i):t(i,e.title).slice(0,34)),o=e.type===`banner`?64:e.type===`avatar`?86:54;return e.type===`avatar`?`
      <svg xmlns="http://www.w3.org/2000/svg" width="${e.width}" height="${e.height}" viewBox="0 0 ${e.width} ${e.height}" role="img" aria-label="${a}">
        <rect width="100%" height="100%" fill="${e.bg}"/>
        <circle cx="150" cy="126" r="76" fill="${e.panel}"/>
        <circle cx="150" cy="115" r="48" fill="${e.accent}" opacity=".9"/>
        <path d="M58 270c16-58 56-88 92-88s76 30 92 88" fill="${e.accent}" opacity=".75"/>
        <text x="50%" y="52%" fill="#eef6f8" font-family="Arial, Helvetica, sans-serif" font-size="${o}" font-weight="700" text-anchor="middle" dominant-baseline="middle">${a}</text>
      </svg>
    `:`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e.width}" height="${e.height}" viewBox="0 0 ${e.width} ${e.height}" role="img" aria-label="${a}">
      <rect width="100%" height="100%" fill="${e.bg}"/>
      <rect x="${e.width*.08}" y="${e.height*.08}" width="${e.width*.84}" height="${e.height*.84}" rx="18" fill="${e.panel}" stroke="${e.accent}" stroke-width="8" opacity=".95"/>
      <path d="M0 ${e.height*.78} C ${e.width*.18} ${e.height*.62}, ${e.width*.35} ${e.height*.9}, ${e.width*.55} ${e.height*.72} S ${e.width*.86} ${e.height*.64}, ${e.width} ${e.height*.76} V ${e.height} H 0 Z" fill="${e.accent}" opacity=".32"/>
      <circle cx="${e.width*.78}" cy="${e.height*.22}" r="${Math.min(e.width,e.height)*.08}" fill="${e.accent}" opacity=".72"/>
      <text x="50%" y="52%" fill="#eef6f8" font-family="Arial, Helvetica, sans-serif" font-size="${o}" font-weight="700" text-anchor="middle" dominant-baseline="middle">${a}</text>
    </svg>
  `}function o(e=`poster`,t){let n=i(e,t);return`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(a(n))}`}function s(e,t=`poster`,n){return typeof e==`string`&&e.trim().length>0?e:o(t,n)}function c(e,t=`poster`,n){e?.target&&(e.target.onerror=null,e.target.src=o(t,n))}export{c as n,s as t};