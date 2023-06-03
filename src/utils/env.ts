import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z
  .object({
    OPEN_WEATHER_API_KEY: z
      .string()
      .nonempty()
      .describe('Required API Key to access Open Weather API services'),
    IP_API_ACCESS_TOKEN: z
      .string()
      .nonempty()
      .describe('Required Access Token to access IP API services'),
  })
  .required()

const env = envSchema.parse(process.env)

export default env
