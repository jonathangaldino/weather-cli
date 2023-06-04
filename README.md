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

### Configuring your location

```bash
$ outside config

Welcome to outside!
✔ What is the name of your city? … Rio de Janeiro
✔ What is the state code of your city? … RJ
✔ What is the code of your country? … BR
✔ Which language do you speak? (use the code: pt_br, en, pt, es) … pt_br
Fetching geocoding [Rio de Janeiro, RJ, BR]
✔ We will be using -22.9110137 and -43.2093727 as latitude and longitude. Is that ok? … yes
User settings saved successfully
```

**You can provide your own latitude and longitude if ours is not accurate.**

## Contributing

Follow the guidelines described in CONTRIBUTING.md

## Development

Follow the guidelines described in DEVELOPMENT.md
