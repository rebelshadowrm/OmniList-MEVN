import type {
  CatalogDetail,
  CatalogGenre,
  CatalogSearchParams,
  CatalogSummary,
} from '../types/contracts'

type CatalogRequestParams = Record<string, unknown>

function buildCatalogUrl(path: string, params: CatalogRequestParams = {}): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }

    if (Array.isArray(value)) {
      if (value.length) {
        searchParams.set(key, value.join(','))
      }
      return
    }

    searchParams.set(key, `${value}`)
  })

  const query = searchParams.toString()
  return query ? `${path}?${query}` : path
}

async function requestCatalog<T>(path: string, params?: CatalogRequestParams): Promise<T> {
  const response = await fetch(buildCatalogUrl(path, params))
  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload?.message ?? response.statusText ?? 'Catalog request failed')
  }

  return payload as T
}

class CatalogService {
  static async search(domain: string, params: CatalogSearchParams = {}): Promise<CatalogSummary[]> {
    return requestCatalog<CatalogSummary[]>(`/api/catalog/${domain}/search`, params)
  }

  static async genres(domain: string): Promise<CatalogGenre[]> {
    return requestCatalog<CatalogGenre[]>(`/api/catalog/${domain}/genres`)
  }

  static async detail(domain: string, externalId: string): Promise<CatalogDetail> {
    return requestCatalog<CatalogDetail>(`/api/catalog/${domain}/${externalId}`)
  }

  static async updates(
    domain: string,
    externalId: string,
    params: CatalogRequestParams = {}
  ): Promise<Record<string, unknown>> {
    return requestCatalog<Record<string, unknown>>(`/api/catalog/${domain}/${externalId}/updates`, params)
  }
}

export {buildCatalogUrl, requestCatalog}
export default CatalogService
