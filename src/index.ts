import minimist from 'minimist'
import error from './utils/error'

async function main() {
  console.log('Welcome to outside!')

  const args = minimist(process.argv.slice(2))

  let cmd = args._[0] || 'help'

  if (args.version || args.v) {
    cmd = 'version'
  }

  if (args.help || args.h) {
    cmd = 'help'
  }

  switch (cmd) {
    case 'today':
      const todayFn = await (await import('./commands/today')).default
      todayFn(args)
      break

    case 'version':
      const versionFn = await (await import('./commands/version')).default
      versionFn(args)
      break

    case 'help':
      const helpFn = await (await import('./commands/help')).default
      helpFn(args)
      break

    case 'forecast':
      const forecastFn = await (await import('./commands/forecast')).default
      forecastFn(args)
      break

    default:
      error(`"${cmd}" is not a valid command!`, true)
      break
  }
}

main()
