import { AxiosError } from 'axios'

type StandardErrorResponseBody = {
  message: string
}

const defaultMessage = 'Something went wrong'

export function handleAxiosError(error: AxiosError) {
  let message = defaultMessage
  if (error instanceof AxiosError) {
    const responseBody = error.response?.data as StandardErrorResponseBody

    if (responseBody.message) {
      message = responseBody.message
    }
  }

  return { message }
}
