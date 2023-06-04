import axios from 'axios'
import { z } from 'zod'
import env from './env'

const Location = z.object({
  region_name: z.string(),
  country_name: z.string(),
  city: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  location: z.object({
    languages: z.array(z.object({})),
  }),
})

type LocationResponse = z.infer<typeof Location>

export default async function getLocationByIp() {
  const { data } = await axios.get<LocationResponse>(
    `http://api.ipapi.com/api/check?access_key=${env.IP_API_ACCESS_TOKEN}`
  )

  return {
    city: data.city,
    state: data.region_name,
    country: data.country_name,
    latitude: data.latitude,
    longitude: data.longitude,
  }
}
