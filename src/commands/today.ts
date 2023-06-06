import { ParsedArgs } from 'minimist'
import { z } from 'zod'
import { UNITS_SYMBOLS, Unit } from '../locale/units'
import error from '../utils/error'
import getGeocoding from '../utils/geocoding'
import getLocationByIp from '../utils/location'
import { UserSettings, readUserSettings } from '../utils/user-settings'
import getWeather from '../utils/weather'

const todayArgSchema = z.object({
  location: z.string().optional(),
  unit: z.enum(['metric', 'standard', 'imperial']).optional().default('metric'),
})

export type TodayArguments = ParsedArgs & z.infer<typeof todayArgSchema>

function printWeather(
  weather: Awaited<ReturnType<typeof getWeather>>,
  unit: Unit
) {
  const degree = UNITS_SYMBOLS[unit]

  console.log(
    `Now is: ${weather.temp + degree} but feels like ${
      weather.feels_like + degree
    }\nYou should expect a min of ${weather.temp_min + degree} and a max of ${
      weather.temp_max + degree
    } for today.\nThe humidity is ${weather.humidity}%`
  )
}

function printLocation(location: Awaited<ReturnType<typeof getLocationByIp>>) {
  console.log(
    `Location: ${location.city}, ${location.state}, ${location.country}`
  )
}

function parseTodayArguments(_args: TodayArguments) {
  let parsedArgs: z.infer<typeof todayArgSchema>

  try {
    parsedArgs = todayArgSchema.parse(_args)
  } catch (err) {
    // todo: format error (improve message)
    error(err.message, true)
  }

  let location: { city: string; state: string; country: string }

  if (parsedArgs.location) {
    const [city, state, country] = parsedArgs.location.split(',')
    location = {
      city: city.trim(),
      state: state.trim(),
      country: country.trim(),
    }
  }

  return {
    location,
    unit: parsedArgs.unit,
  }
}

export default async (args: TodayArguments) => {
  const features = parseTodayArguments(args)

  let userSettings: UserSettings = (await readUserSettings()) || {
    location: {},
    unit: features.unit,
  }

  if (features.location) {
    const geocoding = await getGeocoding(
      features.location.city,
      features.location.state,
      features.location.country
    )

    userSettings.location.lat = geocoding.lat
    userSettings.location.lon = geocoding.lon
  }

  const hasCoordinates =
    userSettings.location?.lat !== undefined &&
    userSettings.location?.lon !== undefined

  try {
    if (!hasCoordinates) {
      const location = await getLocationByIp()
      userSettings.location.lat = location.latitude
      userSettings.location.lon = location.longitude
      printLocation(location)
    }
  } catch (err) {
    error('We were not able to get your location based on your IP.', true)
  }

  const unitToUse = args.unit
    ? features.unit
    : (userSettings.unit as Unit) || features.unit

  try {
    const weather = await getWeather({
      lat: userSettings.location.lat,
      lon: userSettings.location.lon,
      unit: unitToUse,
    })

    printWeather(weather, unitToUse)
  } catch (err) {
    error(
      "Our weather server did not respond well. We're sorry! Try again later.",
      true
    )
  }
}
