import { error } from 'console'
import { ParsedArgs } from 'minimist'
import prompts from 'prompts'
import getGeocoding from '../utils/geocoding'
import { LANGUAGES } from '../utils/languages'
import {
  UserSettigsSchema,
  UserSettings,
  createUserSettings,
} from '../utils/user-settings'

async function promptConfigurationQuestions() {
  const questions = [
    {
      type: 'text',
      name: 'city',
      message: 'What is the name of your city?',
    },
    {
      type: 'text',
      name: 'state',
      message: 'What is the state code of your city?',
      validate: (value) =>
        value.length >= 4
          ? `State codes are usually represented by 2 capital letters, up to 4 in some places in the world.`
          : true,
    },
    {
      type: 'text',
      name: 'country',
      message: 'What is the code of your country?',
      validate: (value) =>
        value.length >= 4
          ? `Country codes are usually represented by 2 capital letters, up to 4 in some places in the world.`
          : true,
    },
    {
      type: 'text',
      name: 'language',
      message: 'Which language do you speak? (use the code: pt_br, en, pt, es)',
      validate: (value) =>
        LANGUAGES.includes(value) ? true : 'Language code not found',
    },
  ]

  const { city, state, country, language } = await prompts(questions)

  const location = await getGeocoding(city, state, country)

  const { isLocationCorrect } = await prompts({
    type: 'confirm',
    name: 'isLocationCorrect',
    message: `We will be using ${location.lat} and ${location.lon} as latitude and longitude. Is that ok?`,
  })

  let lat, lon: number

  if (!isLocationCorrect) {
    const { latitude, longitude } = await prompts([
      {
        type: 'text',
        name: 'latitude',
        message: 'What is the latitude of your location? (Use dot not comma)',
        format: (value) => parseFloat(value),
        validate: (value) =>
          isFinite(value) && Math.abs(value) <= 90
            ? true
            : 'Latitude must be a number between -90 and 90.',
      },
      {
        type: 'text',
        name: 'longitude',
        message: 'What is the longitude of your location? (Use dot not comma)',
        format: (value) => parseFloat(value),
        validate: (value) =>
          isFinite(value) && Math.abs(value) <= 90
            ? true
            : 'Longitude must be a number between -90 and 90.',
      },
    ])

    lat = latitude
    lon = longitude
  }

  return {
    city,
    state,
    country,
    lat: isLocationCorrect ? location.lat : lat,
    lon: isLocationCorrect ? location.lon : lon,
    language,
  }
}

async function validateSettings({
  city,
  state,
  country,
  lat,
  lon,
  language,
}: Awaited<ReturnType<typeof promptConfigurationQuestions>>) {
  let userSettings: UserSettings

  try {
    userSettings = UserSettigsSchema.parse({
      location: {
        city,
        state,
        country,
        lat,
        lon,
      },
      language,
    })
  } catch (err) {
    console.error(err)
    error('Failed to parse user settings from prompt configuration', true)
  }

  return userSettings
}

export default async (args: ParsedArgs) => {
  const promptResponses = await promptConfigurationQuestions()

  const userSettings = await validateSettings(promptResponses)

  createUserSettings(userSettings)
}
