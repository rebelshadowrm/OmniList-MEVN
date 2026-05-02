import {afterEach, describe, expect, it, vi} from 'vitest'
import CatalogService, {buildCatalogUrl} from '../CatalogService'

describe('CatalogService', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
        vi.restoreAllMocks()
    })

    it('builds detail requests against the normalized catalog endpoint', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({id: '123'}),
        })
        vi.stubGlobal('fetch', fetchMock)

        const payload = await CatalogService.detail('anime', '123')

        expect(fetchMock).toHaveBeenCalledWith('/api/catalog/anime/123')
        expect(payload).toEqual({id: '123'})
    })

    it('serializes browse search params for server-side catalog requests', () => {
        expect(buildCatalogUrl('/api/catalog/books/search', {
            search: 'dune',
            genre: ['Sci-Fi', 'Adventure'],
            year: 1965,
        })).toBe('/api/catalog/books/search?search=dune&genre=Sci-Fi%2CAdventure&year=1965')
    })

    it('throws the API error message for failed catalog requests', async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: false,
            statusText: 'Bad Request',
            json: async () => ({message: 'Unsupported catalog domain'}),
        })
        vi.stubGlobal('fetch', fetchMock)

        await expect(CatalogService.detail('unknown', '1')).rejects.toThrow('Unsupported catalog domain')
    })
})
