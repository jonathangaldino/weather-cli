import axios from 'axios'
import { z } from 'zod'
import env from './env'

const WeatherSchema = z
  .object({
    main: z
      .object({
        temp: z.number(),
        feels_like: z.number(),
        temp_min: z.number(),
        temp_max: z.number(),
        humidity: z.number(),
      })
      .required(),
  })
  .required()

type WeatherResponse = z.infer<typeof WeatherSchema>

const WeatherOptions = z
  .object({
    lat: z.number(),
    lon: z.number(),
    unit: z
      .enum(['metric', 'imperial', 'standard'])
      .optional()
      .default('metric'),
  })
  .required()

export default async function getWeather({
  lat,
  lon,
  unit,
}: z.infer<typeof WeatherOptions>) {
  const { data } = await axios.get<WeatherResponse>(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${env.OPEN_WEATHER_API_KEY}`
  )

  return {
    ...data.main,
  }
}
