import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { CreateOrganizationPage } from '@/components/organizations/create-organization-page'
import { OrganizationAdministratorPage } from '@/components/organizations/organization-administrator-page'
import { OrganizationCreated } from '@/components/organizations/organization-created'
import { OrganizationDetailsPage } from '@/components/organizations/organization-details-page'
import { OrganizationPaymentPage } from '@/components/organizations/organization-payment-page'
import { OrganizationProvisioning } from '@/components/organizations/organization-provisioning'
import { OrganizationReviewPage } from '@/components/organizations/organization-review-page'
import type { DemoAccount } from '@/data/demo-account'
import {
  createDemoOrganization,
  defaultOrganizationDraft,
  type DemoOrganization,
  type OrganizationDraft,
  type OrganizationPlan,
} from '@/data/demo-organization'
import { useDemoAccount } from '@/providers/demo-account-context'

type OrganizationCreationStep =
  | 'plan'
  | 'details'
  | 'administrator'
  | 'review'
  | 'payment'
  | 'provisioning'
  | 'created'

interface StoredOrganizationCreationState {
  step: OrganizationCreationStep
  draft: OrganizationDraft
  createdOrganization: DemoOrganization | null
}

function getStorageKey(accountId: string) {
  return `wispzyron-organization-draft-${accountId}`
}

function getInitialDraft(account: DemoAccount): OrganizationDraft {
  return {
    ...defaultOrganizationDraft,
    ownerName: account.name,
    ownerEmail: account.email,
  }
}

function getInitialCreationState(
  account: DemoAccount,
): StoredOrganizationCreationState {
  return {
    step: 'plan',
    draft: getInitialDraft(account),
    createdOrganization: null,
  }
}

function isCreationStep(value: unknown): value is OrganizationCreationStep {
  return (
    value === 'plan' ||
    value === 'details' ||
    value === 'administrator' ||
    value === 'review' ||
    value === 'payment' ||
    value === 'provisioning' ||
    value === 'created'
  )
}

function isOrganizationPlan(value: unknown): value is OrganizationPlan {
  return value === 'BASIC' || value === 'PRO' || value === 'ENTERPRISE'
}

function isDemoOrganization(value: unknown): value is DemoOrganization {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  return (
    'tenantId' in value &&
    'organizationName' in value &&
    'subdomain' in value &&
    'plan' in value &&
    typeof value.tenantId === 'string' &&
    typeof value.organizationName === 'string' &&
    typeof value.subdomain === 'string' &&
    isOrganizationPlan(value.plan)
  )
}

function getStoredCreationState(
  account: DemoAccount,
): StoredOrganizationCreationState {
  const fallback = getInitialCreationState(account)

  try {
    const storedValue = sessionStorage.getItem(getStorageKey(account.id))

    if (!storedValue) {
      return fallback
    }

    const parsed: unknown = JSON.parse(storedValue)

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('step' in parsed) ||
      !('draft' in parsed) ||
      !isCreationStep(parsed.step) ||
      typeof parsed.draft !== 'object' ||
      parsed.draft === null
    ) {
      return fallback
    }

    const storedDraft = parsed.draft as Partial<OrganizationDraft>
    const draft: OrganizationDraft = {
      ...fallback.draft,
      ...storedDraft,
      plan: isOrganizationPlan(storedDraft.plan) ? storedDraft.plan : null,
    }

    const createdOrganization =
      'createdOrganization' in parsed &&
      isDemoOrganization(parsed.createdOrganization)
        ? parsed.createdOrganization
        : null

    const canRestoreCreatedStep =
      parsed.step !== 'created' || createdOrganization !== null

    return {
      step: draft.plan && canRestoreCreatedStep ? parsed.step : fallback.step,
      draft,
      createdOrganization,
    }
  } catch {
    return fallback
  }
}

function storeCreationState(
  accountId: string,
  nextState: StoredOrganizationCreationState,
) {
  try {
    sessionStorage.setItem(getStorageKey(accountId), JSON.stringify(nextState))
  } catch {
    // El flujo puede continuar aunque sessionStorage no esté disponible.
  }
}

function clearStoredCreationState(accountId: string) {
  try {
    sessionStorage.removeItem(getStorageKey(accountId))
  } catch {
    // La navegación puede continuar aunque sessionStorage no esté disponible.
  }
}

export function OrganizationCreationFlow() {
  const navigate = useNavigate()

  const { state, createOrganization } = useDemoAccount()

  const [creationState, setCreationState] =
    useState<StoredOrganizationCreationState>(() =>
      getStoredCreationState(state.account),
    )

  const updateCreationState = (nextState: StoredOrganizationCreationState) => {
    setCreationState(nextState)
    storeCreationState(state.account.id, nextState)
  }

  const handlePlanContinue = (plan: OrganizationPlan) => {
    updateCreationState({
      ...creationState,
      step: 'details',
      draft: {
        ...creationState.draft,
        plan,
      },
    })
  }

  const handleDraftChange = (draft: OrganizationDraft) => {
    updateCreationState({
      ...creationState,
      draft,
    })
  }

  const handleProvisioningComplete = () => {
    const organization = createDemoOrganization(creationState.draft)

    createOrganization(organization)

    updateCreationState({
      ...creationState,
      step: 'created',
      createdOrganization: organization,
    })
  }

  const handleOpenDashboard = () => {
    if (!creationState.createdOrganization) {
      return
    }

    clearStoredCreationState(state.account.id)

    void navigate({
      to: '/$orgSlug/manager',
      params: {
        orgSlug: creationState.createdOrganization.subdomain,
      },
    })
  }

  if (
    creationState.step === 'created' &&
    creationState.createdOrganization !== null
  ) {
    return (
      <OrganizationCreated
        organization={creationState.createdOrganization}
        onOpenDashboard={handleOpenDashboard}
      />
    )
  }

  if (creationState.step === 'provisioning') {
    return (
      <OrganizationProvisioning
        draft={creationState.draft}
        onComplete={handleProvisioningComplete}
      />
    )
  }

  if (creationState.step === 'payment') {
    return (
      <OrganizationPaymentPage
        draft={creationState.draft}
        onChange={handleDraftChange}
        onBack={() =>
          updateCreationState({
            ...creationState,
            step: 'review',
          })
        }
        onContinue={() =>
          updateCreationState({
            ...creationState,
            step: 'provisioning',
          })
        }
      />
    )
  }

  if (creationState.step === 'review') {
    return (
      <OrganizationReviewPage
        draft={creationState.draft}
        onBack={() =>
          updateCreationState({
            ...creationState,
            step: 'administrator',
          })
        }
        onContinue={() =>
          updateCreationState({
            ...creationState,
            step: 'payment',
          })
        }
      />
    )
  }

  if (creationState.step === 'administrator') {
    return (
      <OrganizationAdministratorPage
        draft={creationState.draft}
        onChange={handleDraftChange}
        onBack={() =>
          updateCreationState({
            ...creationState,
            step: 'details',
          })
        }
        onContinue={() =>
          updateCreationState({
            ...creationState,
            step: 'review',
          })
        }
      />
    )
  }

  if (creationState.step === 'details') {
    return (
      <OrganizationDetailsPage
        draft={creationState.draft}
        onChange={handleDraftChange}
        onBack={() =>
          updateCreationState({
            ...creationState,
            step: 'plan',
          })
        }
        onContinue={() =>
          updateCreationState({
            ...creationState,
            step: 'administrator',
          })
        }
      />
    )
  }

  return <CreateOrganizationPage onContinue={handlePlanContinue} />
}
