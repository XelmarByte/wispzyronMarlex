export type OrganizationPlan = 'BASIC' | 'PRO' | 'ENTERPRISE'

export type OrganizationStatus = 'draft' | 'provisioning' | 'active'

export type OrganizationRole = 'owner' | 'manager'

export type PrimaryAdministratorMode = 'self' | 'invite'

export type AdministratorInvitationStatus = 'not-required' | 'pending'

export type BillingCycle = 'monthly' | 'annual'

export type DemoPaymentMethod = 'card' | 'yape' | 'agent-transfer'

export type DemoPaymentStatus = 'pending' | 'confirmed'

export type OrganizationOnboardingStatus =
  'not-started' | 'in-progress' | 'completed'

export interface OrganizationPlanDefinition {
  id: OrganizationPlan
  name: string
  shortName: string
  description: string
  monthlyPrice: number
  currency: 'PEN'
  aiEnabled: boolean
}

export const organizationPlans: OrganizationPlanDefinition[] = [
  {
    id: 'BASIC',
    name: 'Básico',
    shortName: 'Básico',
    description: 'Las herramientas esenciales para comenzar a operar tu ISP.',
    monthlyPrice: 79,
    currency: 'PEN',
    aiEnabled: false,
  },
  {
    id: 'PRO',
    name: 'Premium',
    shortName: 'Premium',
    description:
      'Gestión avanzada para empresas con una operación en crecimiento.',
    monthlyPrice: 169,
    currency: 'PEN',
    aiEnabled: false,
  },
  {
    id: 'ENTERPRISE',
    name: 'Premium + AI',
    shortName: 'Premium + AI',
    description:
      'Gestión avanzada con herramientas de análisis e inteligencia artificial.',
    monthlyPrice: 299,
    currency: 'PEN',
    aiEnabled: true,
  },
]

export interface OrganizationDraft {
  plan: OrganizationPlan | null
  billingCycle: BillingCycle
  paymentMethod: DemoPaymentMethod | null

  companyName: string
  slug: string
  country: string
  phone: string
  taxId: string

  ownerName: string
  ownerEmail: string

  primaryAdministratorMode: PrimaryAdministratorMode
  administratorName: string
  administratorEmail: string
}

export interface OrganizationAdministrator {
  mode: PrimaryAdministratorMode
  fullName: string
  email: string
  invitationStatus: AdministratorInvitationStatus
}

export interface DemoPayment {
  method: DemoPaymentMethod
  status: DemoPaymentStatus
  reference: string
  confirmedAt: string
}

export interface DemoOrganization {
  tenantId: string
  organizationName: string
  subdomain: string
  country: string
  phone: string
  taxId: string
  plan: OrganizationPlan
  billingCycle: BillingCycle
  ownerName: string
  ownerEmail: string
  role: OrganizationRole
  primaryAdministrator: OrganizationAdministrator
  payment: DemoPayment
  status: OrganizationStatus
  onboardingStatus: OrganizationOnboardingStatus
  createdAt: string
}

export const defaultOrganizationDraft: OrganizationDraft = {
  plan: null,
  billingCycle: 'monthly',
  paymentMethod: null,

  companyName: '',
  slug: '',
  country: 'Perú',
  phone: '',
  taxId: '',

  ownerName: '',
  ownerEmail: '',

  primaryAdministratorMode: 'self',
  administratorName: '',
  administratorEmail: '',
}

export function getOrganizationPlan(
  planId: OrganizationPlan,
): OrganizationPlanDefinition {
  const plan = organizationPlans.find((item) => item.id === planId)

  if (!plan) {
    throw new Error(`Plan de organización no encontrado: ${planId}`)
  }

  return plan
}

export function createOrganizationSlug(companyName: string): string {
  return companyName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

function createPrimaryAdministrator(
  draft: OrganizationDraft,
): OrganizationAdministrator {
  if (draft.primaryAdministratorMode === 'self') {
    return {
      mode: 'self',
      fullName: draft.ownerName.trim(),
      email: draft.ownerEmail.trim(),
      invitationStatus: 'not-required',
    }
  }

  if (!draft.administratorName.trim()) {
    throw new Error('El nombre del administrador es obligatorio.')
  }

  if (!draft.administratorEmail.trim()) {
    throw new Error('El email del administrador es obligatorio.')
  }

  return {
    mode: 'invite',
    fullName: draft.administratorName.trim(),
    email: draft.administratorEmail.trim(),
    invitationStatus: 'pending',
  }
}

export function createDemoOrganization(
  draft: OrganizationDraft,
): DemoOrganization {
  if (!draft.plan) {
    throw new Error('La organización debe tener un plan seleccionado.')
  }

  if (!draft.paymentMethod) {
    throw new Error('Debes seleccionar un método de pago.')
  }

  if (!draft.companyName.trim()) {
    throw new Error('El nombre de la empresa es obligatorio.')
  }

  if (!draft.ownerName.trim()) {
    throw new Error('El nombre del propietario es obligatorio.')
  }

  if (!draft.ownerEmail.trim()) {
    throw new Error('El email del propietario es obligatorio.')
  }

  const slug = draft.slug.trim() || createOrganizationSlug(draft.companyName)

  if (!slug) {
    throw new Error('No se pudo generar un identificador de organización.')
  }

  const createdAt = new Date().toISOString()

  return {
    tenantId: `demo-tenant-${slug}`,
    organizationName: draft.companyName.trim(),
    subdomain: slug,
    country: draft.country.trim(),
    phone: draft.phone.trim(),
    taxId: draft.taxId.trim(),
    plan: draft.plan,
    billingCycle: draft.billingCycle,
    ownerName: draft.ownerName.trim(),
    ownerEmail: draft.ownerEmail.trim(),
    role: 'owner',
    primaryAdministrator: createPrimaryAdministrator(draft),
    payment: {
      method: draft.paymentMethod,
      status: 'confirmed',
      reference: `DEMO-${slug.toUpperCase()}-${Date.now()}`,
      confirmedAt: createdAt,
    },
    status: 'active',
    onboardingStatus: 'not-started',
    createdAt,
  }
}
