import axios from 'axios'
import { z } from 'zod'
import env from './env'

const GeocodingSchema = z.array(
  z.object({
    name: z.string(),
    lat: z.number(),
    lon: z.number(),
    coutry: z.string(),
    state: z.string(),
  })
)

type GeocingResponse = z.infer<typeof GeocodingSchema>

export default async function getGeocoding(
  city: string,
  state: string,
  country: string
) {
  console.log(`Fetching geocoding [${city}, ${state}, ${country}]`)

  const q = `${city},${state},${country}`

  const { data } = await axios.get<GeocingResponse>(
    `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=1&units=metric&appid=${env.OPEN_WEATHER_API_KEY}`
  )

  if (data.length < 1) {
    throw new Error('Geocoding information not found.')
  }

  return {
    lat: data[0].lat,
    lon: data[0].lon,
  }
}
