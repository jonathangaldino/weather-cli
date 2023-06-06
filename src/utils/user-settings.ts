import { writeFile } from 'fs'
import { readFile } from 'fs/promises'
import path from 'path'
import { z } from 'zod'

export const UserSettigsSchema = z
  .object({
    location: z
      .object({
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        lat: z.number().optional(),
        lon: z.number().optional(),
      })
      .required(),
    language: z.string().optional(),
    unit: z.string().optional(),
  })
  .required()

export type UserSettings = z.infer<typeof UserSettigsSchema>

const userSettingsFilePath = path.join(__dirname, 'user-settings.json')

export function createUserSettings(settings: Partial<UserSettings>): void {
  const settingsJson = JSON.stringify(settings)

  writeFile(userSettingsFilePath, settingsJson, (err) => {
    if (err) {
      console.error('Error writing user settings', err)
      return
    }

    console.log('User settings saved successfully')
  })
}

export async function readUserSettings(): Promise<UserSettings | null> {
  let data

  try {
    data = await readFile(userSettingsFilePath, 'utf-8')
  } catch (err) {
    if (err.code === 'ENOENT') {
      return null
    } else {
      console.error('Error reading from user settings file', err)
      throw err
    }
  }

  try {
    const userData = JSON.parse(data)

    const userSettings = UserSettigsSchema.parse(userData)
    return userSettings
  } catch (err) {
    return null
  }
}
