# maps-ui-sdk

**maps-ui-sdk** is a React UI toolkit for enhancing mapping interfaces with interactive UI controls. It features both standalone UI components and specialized controls designed to integrate seamlessly with our [MapsGL service](https://www.xweather.com/docs/mapsgl).

## Maps UI SDK Demo Application

![Maps UI SDK Demo Application](https://raw.githubusercontent.com/vaisala-xweather/maps-ui-sdk/main/screenshot.png)

## MapsGL components

**[MapsGLMapControllerProvider](https://www.xweather.com/docs/maps-ui-sdk/reference/mapsgl/map-controller-provider)**  
Core provider that integrates with the MapsGL Map Controller, providing access to map controller instances throughout your application.

**[MapsGLLayersProvider](https://www.xweather.com/docs/maps-ui-sdk/reference/mapsgl/layers-provider)**  
State management solution for MapsGL weather layers, handling layer lifecycle, styling, and state synchronization.

**[MapsGLLayersControl](https://www.xweather.com/docs/maps-ui-sdk/reference/mapsgl/layers-control)**  
Interface for managing map layer visibility and styling, supporting both individual and grouped layer controls.

**[MapsGLTimelineControl](https://www.xweather.com/docs/maps-ui-sdk/reference/mapsgl/timeline-control)**     
Specialized timeline interface for time-based map animations, offering navigation, dynamic tick marks, and settings panel for customizing animation speed and time ranges.

**[MapsGLSearchControl](https://www.xweather.com/docs/maps-ui-sdk/reference/mapsgl/search-control)**  
Pre-configured search interface designed for MapsGL integration, with built-in result grouping and location history.

Visit our [documentation](https://www.xweather.com/docs/maps-ui-sdk) for more information and a complete list of components with usage examples.

## Getting Started

```bash
yarn add @xweather/maps-ui-sdk
```

Import the required styles:
```javascript
import '@xweather/maps-ui-sdk/dist/style.css'
```

## Example Project

The SDK includes an example project that demonstrates how to build a complete mapping interface using the various components and providers. It serves as both a reference implementation and a playground for experimenting with different configurations.

### Prerequisites

- An Xweather account— We offer a [free developer account](https://signup.xweather.com/developer/) for you to give our weather API a test drive.
- A Mapbox account

### Steps to Run

1. **Get Xweather MapsGL ID and Secret**
Log into your Xweather account, and from [your account's Apps page](https://login.xweather.com/u/login/), create a new application for the MapsGL Demo app. Make note of the application's *Xweather MapsGL ID* and *Secret*.

2. **Get Xweather Mapbox public access token**
 The example project relies on Mapbox, so you'll need to log into or create a [Mapbox](https://www.mapbox.com/) account and follow the instructions to create a [Mapbox public access token](https://docs.mapbox.com/help/getting-started/access-tokens/).

3. **Navigate to the Example Directory**
```bash
cd ./example
```

4. **Install Dependencies**
```bash
yarn install
```

5.  **Update environment variables** 
Rename .env.template to .env and add your access keys:
```bash
VITE_MAPBOX_KEY=''
VITE_MAPSGL_ID=''
VITE_MAPSGL_SECRET=''
```

6. **Run the project**
```bash
yarn dev
```

## Documentation

For detailed documentation, examples, and API references, visit:
- [Maps UI SDK Documentation](https://www.xweather.com/docs/maps-ui-sdk)
- [MapsGL Documentation](https://www.xweather.com/docs/mapsgl/)
- [Weather API Documentation](https://www.xweather.com/docs/weather-api)

## TypeScript Support

The SDK includes comprehensive TypeScript definitions, providing full type safety and excellent IDE support.

## Support

[Submit a new ticket](https://www.xweather.com/support) with any questions, bug reports or feature suggestions you have.