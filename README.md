# Weather CLI

A CLI to help you get the forecast for today's weather based on your location.

## How to use

### Get all commands:

```bash
$ outside

Welcome to outside!

    outside [command] <options>

    today .............. show weather for today
    version ............ show package version
    help ............... show help menu for a command
```

### Fetch today's weather using your IP as location:

```bash
$ outside today

Welcome to outside!
Location: Araruama, Rio de Janeiro, Brazil
Temperature (celsius):: min is 15.97 - max is 18.97 - current: 17.25 - feels like 17.49
The humidity is 94%
```

### Fetch today's weather using a location you will provide

```bash
$ outside today --location="Rio de Janeiro, RJ, BR"

Welcome to outside!
Fetching geocoding [Rio de Janeiro, RJ, BR]
Temperature (celsius):: min is 15.99 - max is 18.97 - current: 18.97 - feels like 19.38
The humidity is 94%
```

## Contributing

Follow the guidelines described in CONTRIBUTING.md

## Development

Follow the guidelines described in DEVELOPMENT.md
