import { ParsedArgs } from 'minimist'
import { z } from 'zod'
import error from '../utils/error'
import getGeocoding from '../utils/geocoding'
import getLocationByIp from '../utils/location'
import { UserSettings, readUserSettings } from '../utils/user-settings'
import getWeather from '../utils/weather'

const todayArgSchema = z.object({
  location: z.string().optional(),
  units: z
    .enum(['metric', 'standard', 'imperial'])
    .optional()
    .default('metric'),
})

export type TodayArguments = ParsedArgs & z.infer<typeof todayArgSchema>

function printWeather(weather: Awaited<ReturnType<typeof getWeather>>) {
  console.log(
    `Temperature (celsius):: min is ${weather.temp_min} - max is ${weather.temp_max} - current: ${weather.temp} - feels like ${weather.feels_like}`
  )
  console.log(`The humidity is ${weather.humidity}%`)
}

function printLocation(location: Awaited<ReturnType<typeof getLocationByIp>>) {
  console.log(
    `Location: ${location.city}, ${location.state}, ${location.country}`
  )
}

function parseTodayArguments(args: TodayArguments) {
  try {
    const parsedArgs = todayArgSchema.parse(args)
    const [city, state, country] = args.location.split(',')

    return {
      location: {
        city: city.trim(),
        state: state.trim(),
        country: country.trim(),
      },
      units: parsedArgs.units,
    }
  } catch (err) {
    error(err.message, true)
  }
}

export default async (args: TodayArguments) => {
  const features = parseTodayArguments(args)

  let userSettings: UserSettings = {
    location: {},
    language: undefined,
  }

  try {
    if (features.location) {
      const geocoding = await getGeocoding(
        features.location.city,
        features.location.state,
        features.location.country
      )

      userSettings.location.lat = geocoding.lat
      userSettings.location.lon = geocoding.lon
    } else {
      const cachedSettings = await readUserSettings()

      if (cachedSettings) {
        userSettings = cachedSettings
        console.log('Using your configuration.')
      }
    }

    const hasGeoPosition =
      userSettings.location.lat && userSettings.location.lon

    if (!hasGeoPosition) {
      const location = await getLocationByIp()
      userSettings.location.lat = location.latitude
      userSettings.location.lon = location.longitude

      printLocation(location)
    }

    const weather = await getWeather({
      lat: userSettings.location.lat,
      lon: userSettings.location.lon,
    })

    printWeather(weather)
  } catch (err) {
    console.error(err)
  }
}
