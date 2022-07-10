export async function Api(request: Request): Promise<Response> {
  const response = await fetch(request)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response
}