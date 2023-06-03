import { ParsedArgs } from 'minimist'
import getLocationByIp from '../utils/location'
import getWeather from '../utils/weather'

export default async (args: ParsedArgs) => {
  try {
    const location = await getLocationByIp()
    const weather = await getWeather(location.latitude, location.longitude)

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
