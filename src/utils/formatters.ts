export const PRODUCT_IDENTIFICATION_ERROR = 'unidentified product'

export const extractSearchQueries = (output: string): string[] => {
  if (!output) return [PRODUCT_IDENTIFICATION_ERROR]

  const regex =
    /"queries":\s*{\s*"query1":\s*"[^"]*",\s*"query2":\s*"[^"]*",\s*"query3":\s*"[^"]*",\s*"query4":\s*"[^"]*",\s*"query5":\s*"[^"]*",\s*"query6":\s*"[^"]*"\s*}/

  const match = output.match(regex)
  if (!match) {
    console.error('No match found')
    throw new Error('No match found')
  }

  try {
    const jsonData = JSON.parse(`{${match[0]}}`)

    // If we have a JSON object with queries
    if (jsonData && jsonData.queries) {
      const queries = jsonData.queries
      return [
        queries.query1 || PRODUCT_IDENTIFICATION_ERROR,
        queries.query2 || PRODUCT_IDENTIFICATION_ERROR,
        queries.query3 || PRODUCT_IDENTIFICATION_ERROR,
        queries.query4 || PRODUCT_IDENTIFICATION_ERROR,
        queries.query5 || PRODUCT_IDENTIFICATION_ERROR,
        queries.query6 || PRODUCT_IDENTIFICATION_ERROR,
      ]
    }
  } catch (error) {
    console.error('Not JSON format, using regex parsing', error)
    throw error
  }
  return [PRODUCT_IDENTIFICATION_ERROR]
}

export const extractMaskUrl = (data: any): string => {
  const firstMask = data?.masks?.[0]
  return firstMask && firstMask.url ? firstMask.url : ''
}

export const formatTimestamp = (timestamp: number): string => {
  const now = Date.now()
  const diff = now - timestamp

  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`
  return `${Math.floor(diff / 86400000)} days ago`
}