import { z } from 'zod'

export type SuccessStatus = { success: true; error?: never }
export type FailureStatus = { success: false; error: Error }
export type Status = SuccessStatus | FailureStatus

function success(): SuccessStatus {
  return { success: true }
}

function failure(error: Error): FailureStatus {
  return { success: false, error }
}

export const status = {
  success,
  failure,
}
