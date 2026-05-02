export default defineNuxtRouteMiddleware(async () => {
  const session = useSessionStore()
  await session.initialize()

  if (!session.isLoggedIn) {
    return navigateTo('/login')
  }
})
