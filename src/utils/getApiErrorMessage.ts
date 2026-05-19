type ApiErrorBody = {
  error?: string;
  message?: string;
  detail?: string;
};

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    const body = error as ApiErrorBody;
    if (typeof body.error === 'string' && body.error.trim()) {
      return body.error;
    }
    if (typeof body.message === 'string' && body.message.trim()) {
      return body.message;
    }
    if (typeof body.detail === 'string' && body.detail.trim()) {
      return body.detail;
    }
  }

  if (typeof error === 'string' && error.trim()) {
    return error;
  }

  return fallback;
}
