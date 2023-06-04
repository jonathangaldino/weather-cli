import { ParsedArgs } from 'minimist'
import { z } from 'zod'
import getGeocoding from '../utils/geocoding'
import getWeather from '../utils/weather'

const TodayArgsSchema = z.object({
  location: z.string().optional(),
})

type T = z.infer<typeof TodayArgsSchema> & ParsedArgs

export default async (args: T) => {
  try {
    let lat, lon: number

    // const location = await getLocationByIp()
    if (args.location) {
      const [city, state, country] = args.location.split(',')
      const geocoding = await getGeocoding(
        city.trim(),
        state.trim(),
        country.trim()
      )

      lat = geocoding.lat
      lon = geocoding.lon
    }

    const weather = await getWeather(lat, lon)

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
