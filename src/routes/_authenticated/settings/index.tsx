import { useUser } from '@clerk/react'
import { createFileRoute } from '@tanstack/react-router'
import { AccountSettingsPage } from '@/modules/account/settings/account-settings-page'
import { useDemoAccount } from '@/providers/demo-account-context'

export const Route = createFileRoute('/_authenticated/settings/')({
  component: SettingsRoute,
})

function SettingsRoute() {
  const { isLoaded, user } = useUser()
  const { state, updateAccountProfile } = useDemoAccount()

  const workspaceCount = state.memberships.filter(
    (membership) => membership.accountId === state.account.id,
  ).length

  const handleSave = async (updates: { name: string; phone: string }) => {
    if (!isLoaded || user === null) {
      throw new Error('No pudimos identificar tu sesión. Inténtalo nuevamente.')
    }

    const nameParts = updates.name.split(/\s+/).filter(Boolean)

    const firstName = nameParts[0] ?? null
    const lastName = nameParts.slice(1).join(' ') || null

    await user.update({
      firstName,
      lastName,
    })

    updateAccountProfile(updates)
  }

  return (
    <AccountSettingsPage
      account={state.account}
      workspaceCount={workspaceCount}
      onSave={handleSave}
    />
  )
}
