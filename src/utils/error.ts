export default function error(message: string, exit: boolean) {
  console.error(message)

  exit && process.exit(1)
}
