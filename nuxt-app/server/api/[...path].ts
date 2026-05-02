import { proxyRequest } from 'h3'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const requestUrl = getRequestURL(event)
  const target = new URL(`${requestUrl.pathname}${requestUrl.search}`, config.apiProxyTarget).toString()

  return proxyRequest(event, target)
})
