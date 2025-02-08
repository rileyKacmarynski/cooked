export type SuccessResult<T> = { success: true; value: T; error?: never }
export type FailureResult = { success: false; error: Error; value?: never }
export type Result<T> = SuccessResult<T> | FailureResult

function success<T>(value: T): SuccessResult<T> {
  return { success: true, value }
}

function failure(error: Error): FailureResult {
  return { success: false, error }
}

function isSuccess<T>(result: Result<T>): result is SuccessResult<T> {
  return result.success
}

export const result = {
  success,
  failure,
  isSuccess,
}
