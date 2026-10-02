import {
  demoEstablishedAccountState,
  type DemoInvitation,
  type DemoMembership,
  type DemoOrganizationRecord,
} from '@/data/demo-account'
import type { CustomOrganizationRole } from '@/data/custom-organization-roles'

export interface DemoWorkspaceDirectory {
  organizations: DemoOrganizationRecord[]
  memberships: DemoMembership[]
  invitations: DemoInvitation[]
  customRoles?: CustomOrganizationRole[]
}

const demoWorkspaceDirectoryStorageKey = 'wispzyron-demo-workspace-directory'

function createInitialDirectory(): DemoWorkspaceDirectory {
  return structuredClone({
    organizations: demoEstablishedAccountState.organizations,
    memberships: demoEstablishedAccountState.memberships,
    invitations: demoEstablishedAccountState.invitations,
    customRoles: demoEstablishedAccountState.customRoles ?? [],
  })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isDemoWorkspaceDirectory(
  value: unknown,
): value is DemoWorkspaceDirectory {
  return (
    isRecord(value) &&
    Array.isArray(value.organizations) &&
    Array.isArray(value.memberships) &&
    Array.isArray(value.invitations)
  )
}

export function readDemoWorkspaceDirectory(): DemoWorkspaceDirectory {
  try {
    const storedDirectory = localStorage.getItem(
      demoWorkspaceDirectoryStorageKey,
    )

    if (!storedDirectory) {
      return createInitialDirectory()
    }

    const parsedDirectory: unknown = JSON.parse(storedDirectory)

    return isDemoWorkspaceDirectory(parsedDirectory)
      ? parsedDirectory
      : createInitialDirectory()
  } catch {
    return createInitialDirectory()
  }
}

export function writeDemoWorkspaceDirectory(directory: DemoWorkspaceDirectory) {
  try {
    localStorage.setItem(
      demoWorkspaceDirectoryStorageKey,
      JSON.stringify(directory),
    )
  } catch {
    // La demo sigue funcionando aunque localStorage no esté disponible.
  }
}

export function clearDemoWorkspaceDirectory(): void {
  try {
    localStorage.removeItem(demoWorkspaceDirectoryStorageKey)
  } catch {
    // La demo sigue funcionando aunque localStorage no esté disponible.
  }
}
