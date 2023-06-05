import * as GetGeocoding from '../utils/geocoding'
import * as GetLocation from '../utils/location'
import * as UserConfig from '../utils/user-settings'
import * as GetWeather from '../utils/weather'
import today from './today'

describe('Today Command', () => {
  it('fetch geocoding if location arg is provided', async () => {
    const getGeocodingSpy = jest
      .spyOn(GetGeocoding, 'default')
      .mockResolvedValueOnce({
        lat: 30,
        lon: 30,
      })
    jest.spyOn(GetWeather, 'default').mockResolvedValueOnce({
      humidity: 90,
      feels_like: 30,
      temp: 20,
      temp_max: 30,
      temp_min: 10,
    })

    await today({ _: [], location: 'Rio de Janeiro, RJ, BR' })

    expect(getGeocodingSpy).toHaveBeenCalledWith('Rio de Janeiro', 'RJ', 'BR')
  })

  it('should read from userSettings if location args is not provided', async () => {
    const userSettings = {
      location: {
        city: 'Rio de Janeiro',
        state: 'RJ',
        country: 'BR',
        lat: 30,
        lon: 30,
      },
      language: 'pt_br',
    } satisfies UserConfig.UserSettings

    const readuserSettingsSpy = jest
      .spyOn(UserConfig, 'readUserSettings')
      .mockResolvedValueOnce(userSettings)

    jest.spyOn(GetWeather, 'default').mockResolvedValueOnce({
      humidity: 90,
      feels_like: 30,
      temp: 20,
      temp_max: 30,
      temp_min: 10,
    })

    await today({
      _: [],
    })

    expect(readuserSettingsSpy).toHaveBeenCalled()
  })

  it('should fetch location if user doesnt have settings saved', async () => {
    jest.spyOn(UserConfig, 'readUserSettings').mockResolvedValueOnce(null)

    const getLocationByIpSpy = jest
      .spyOn(GetLocation, 'default')
      .mockResolvedValueOnce({
        city: 'whatever',
        state: 'wh',
        country: 'whatever',
        latitude: 30,
        longitude: 30,
      })

    jest.spyOn(GetWeather, 'default').mockResolvedValueOnce({
      humidity: 90,
      feels_like: 30,
      temp: 20,
      temp_max: 30,
      temp_min: 30,
    })

    await today({
      _: [],
    })

    expect(getLocationByIpSpy).toHaveBeenCalled()
  })
})
