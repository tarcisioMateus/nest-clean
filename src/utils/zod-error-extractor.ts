// Define the shape of the extracted error information
interface FormattedErrorOutput {
  message: string
  path: (string | number)[]
}

export function zodErrorExtractor(
  rawInputString: string,
): FormattedErrorOutput | undefined {
  try {
    const outerParsed = JSON.parse(rawInputString)

    if (Array.isArray(outerParsed)) {
      const firstIssue = outerParsed[0]
      const message =
        typeof firstIssue.message === 'string' ? firstIssue.message : ''
      const path = Array.isArray(firstIssue.path) ? firstIssue.path : []

      return {
        message,
        path,
      }
    }
  } catch (e) {
    console.log(e)
  }
}
