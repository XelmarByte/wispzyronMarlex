import { isClerkAPIResponseError } from '@clerk/react/errors'

const unknownError = 'Ocurrió un problema inesperado. Inténtalo nuevamente.'

export function getErrorMessage(error: unknown): string {
  if (isClerkAPIResponseError(error)) {
    return error.errors[0]?.longMessage ?? unknownError
  }

  if (error instanceof Error) {
    return error.message
  }

  return unknownError
}
