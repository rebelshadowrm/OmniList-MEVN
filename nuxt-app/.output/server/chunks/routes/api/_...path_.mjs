import { c as defineEventHandler, u as useRuntimeConfig, g as getRequestURL, p as proxyRequest } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const ____path_ = defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const requestUrl = getRequestURL(event);
  const target = new URL(`${requestUrl.pathname}${requestUrl.search}`, config.apiProxyTarget).toString();
  return proxyRequest(event, target);
});

export { ____path_ as default };
//# sourceMappingURL=_...path_.mjs.map
