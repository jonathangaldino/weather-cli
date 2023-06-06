const isTestEnvironment = process.env.NODE_ENV === 'test'

export default function error(message: string, exit: boolean) {
  console.error(message)

  exit && !isTestEnvironment && process.exit(1)
}
