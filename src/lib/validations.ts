import { z } from 'zod'

export const emailFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Ingresa tu correo electrónico.')
    .email('Ingresa un correo electrónico válido.'),
})

export const otpCodeSchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'Ingresa el código completo de 6 dígitos.'),
})

export type EmailFormValues = z.infer<typeof emailFormSchema>

export type OtpCodeValues = z.infer<typeof otpCodeSchema>
