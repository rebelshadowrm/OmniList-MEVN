import {describe, expect, it, vi} from 'vitest'
import {bootstrapSession} from '../sessionBootstrap'

function createDependencies(overrides = {}) {
    return {
        getSession: vi.fn().mockResolvedValue({status: 200, data: {user: null, accessToken: null}}),
        getUserById: vi.fn().mockResolvedValue({status: 404}),
        decodeTokenPayload: vi.fn().mockReturnValue(null),
        getAccessToken: vi.fn().mockReturnValue(null),
        setAccessToken: vi.fn(),
        setUser: vi.fn(),
        setLoggedOut: vi.fn(),
        setupUserTheme: vi.fn(),
        setupLocalTheme: vi.fn(),
        ...overrides,
    }
}

describe('bootstrapSession', () => {
    it('prefers the explicit session endpoint when it returns a user', async () => {
        const user = {_id: 'user-1', userName: 'demo'}
        const deps = createDependencies({
            getSession: vi.fn().mockResolvedValue({
                status: 200,
                data: {
                    user,
                    accessToken: 'access-123',
                },
            }),
        })

        const result = await bootstrapSession(deps)

        expect(result).toEqual(user)
        expect(deps.setAccessToken).toHaveBeenCalledWith('access-123')
        expect(deps.setUser).toHaveBeenCalledWith(user)
        expect(deps.setupUserTheme).toHaveBeenCalledWith(user)
        expect(deps.getUserById).not.toHaveBeenCalled()
        expect(deps.setLoggedOut).not.toHaveBeenCalled()
    })

    it('falls back to token-based user lookup when the session endpoint has no user', async () => {
        const user = {_id: 'user-2', userName: 'fallback'}
        const deps = createDependencies({
            getAccessToken: vi.fn().mockReturnValue('token-123'),
            decodeTokenPayload: vi.fn().mockReturnValue({user: {_id: 'user-2'}}),
            getUserById: vi.fn().mockResolvedValue({status: 200, data: user}),
        })

        const result = await bootstrapSession(deps)

        expect(result).toEqual(user)
        expect(deps.getUserById).toHaveBeenCalledWith('user-2')
        expect(deps.setUser).toHaveBeenCalledWith(user)
        expect(deps.setupUserTheme).toHaveBeenCalledWith(user)
        expect(deps.setLoggedOut).not.toHaveBeenCalled()
    })

    it('marks the session logged out and restores local theme when no authenticated user can be resolved', async () => {
        const deps = createDependencies()

        const result = await bootstrapSession(deps)

        expect(result).toBeNull()
        expect(deps.setLoggedOut).toHaveBeenCalledTimes(1)
        expect(deps.setupLocalTheme).toHaveBeenCalledTimes(1)
        expect(deps.setUser).not.toHaveBeenCalled()
    })
})
