import type {
  AppUser,
  BootstrapSessionDependencies,
  SessionResponse,
} from '../types/contracts'

export async function bootstrapSession({
  getSession,
  getUserById,
  decodeTokenPayload,
  getAccessToken,
  setAccessToken,
  setUser,
  setLoggedOut,
  setupUserTheme,
  setupLocalTheme,
}: BootstrapSessionDependencies): Promise<AppUser | null> {
  const session = await getSession()

  if (session?.status === 200) {
    const sessionData = (session.data ?? {}) as SessionResponse
    const accessToken = sessionData.accessToken ?? null
    const user = sessionData.user ?? null

    if (accessToken) {
      setAccessToken(accessToken)
    }

    if (user) {
      setUser(user)
      setupUserTheme(user)
      return user
    }
  }

  const fallbackToken = getAccessToken()
  const { _id } = decodeTokenPayload(fallbackToken)?.user ?? {}

  if (_id) {
    const checkUser = await getUserById(_id)

    if (checkUser?.status === 200) {
      setUser(checkUser.data)
      setupUserTheme(checkUser.data)
      return checkUser.data
    }
  }

  setLoggedOut()
  setupLocalTheme()
  return null
}

export default bootstrapSession
