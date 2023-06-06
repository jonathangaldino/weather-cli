export type Unit = 'metric' | 'standard' | 'imperial'

export type UnitsSymbol = {
  [key in Unit]: string
}

export const UNITS = ['metric', 'standard', 'imperial']

export const UNITS_SYMBOLS: UnitsSymbol = {
  metric: '°C',
  imperial: '°F',
  standard: '°K',
}
