export const delay = async (t: number, isError?: boolean) => {
  await new Promise((r) => setTimeout(r, t * 1000))
  if (isError === true) throw new Error('Hubo un error')
}

export { cn } from 'cnfast'
