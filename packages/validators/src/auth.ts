import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(128),
})

export const registerSchema = loginSchema.extend({
  name: z.string().trim().min(1).max(120).optional(),
})

export const requestPasswordResetSchema = z.object({
  email: z.email(),
})

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1),
  password: z.string().min(8).max(128),
})

export const resetPasswordFormSchema = resetPasswordSchema
  .extend({
    confirmPassword: z.string().min(8).max(128),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  })

export const resendEmailVerificationSchema = z.object({
  email: z.email(),
})

export const confirmEmailVerificationSchema = z.object({
  token: z.string().trim().min(1),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type ResetPasswordFormInput = z.input<typeof resetPasswordFormSchema>
export type ResendEmailVerificationInput = z.infer<typeof resendEmailVerificationSchema>
export type ConfirmEmailVerificationInput = z.infer<typeof confirmEmailVerificationSchema>
