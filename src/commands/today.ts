import { ParsedArgs } from 'minimist'
import { z } from 'zod'
import getGeocoding from '../utils/geocoding'
import getLocationByIp from '../utils/location'
import { UserSettings, readUserSettings } from '../utils/user-settings'
import getWeather from '../utils/weather'

const TodayArgsSchema = z.object({
  location: z.string().optional(),
})

type T = z.infer<typeof TodayArgsSchema> & ParsedArgs

function parseLocationArgs(args: T) {
  const [city, state, country] = args.location.split(',')

  return {
    city: city.trim(),
    state: state.trim(),
    country: country.trim(),
  }
}

export default async (args: T) => {
  let userSettings: UserSettings = {
    location: {},
    language: undefined,
  }

  try {
    if (args.location) {
      const locationArgs = parseLocationArgs(args)
      const geocoding = await getGeocoding(
        locationArgs.city,
        locationArgs.state,
        locationArgs.country
      )

      userSettings.location.lat = geocoding.lat
      userSettings.location.lon = geocoding.lon
    } else {
      userSettings = await readUserSettings()
      console.log('Using your configuration.')
    }

    const hasGeoPosition =
      userSettings.location.lat && userSettings.location.lon

    if (!hasGeoPosition) {
      const location = await getLocationByIp()
      userSettings.location.lat = location.latitude
      userSettings.location.lon = location.longitude

      printLocation(location)
    }

    const weather = await getWeather(
      userSettings.location.lat,
      userSettings.location.lon
    )
    printWeather(weather)
  } catch (err) {
    console.error(err)
  }
}

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
