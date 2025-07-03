import { WEATHER_API_ENDPOINT } from './endpoint';
import { WEATHER_API_ACTION } from './action';

const {
    affects,
    all,
    id,
    closest,
    contains,
    route,
    search,
    within
} = WEATHER_API_ACTION;

export const IMPACT_ACTIVITIES = [
    'general',
    'roadway_trucking',
    'maritime_small_craft',
    'maritime_large_vessel'
] as const;

export type ImpactActivity = typeof IMPACT_ACTIVITIES[number];
export type ImpactEndpoint = `${typeof WEATHER_API_ENDPOINT.impacts}/${ImpactActivity}`;

export const INDICE_TYPES = [
    'arthritis',
    'coldflu',
    'migraine',
    'sinus',
    'outdoors',
    'golf',
    'biking',
    'swimming',
    'campfires',
    'bees'
] as const;

export type IndiceType = typeof INDICE_TYPES[number];
export type IndiceEndpoint = `${typeof WEATHER_API_ENDPOINT.indices}/${IndiceType}`;

export const WEATHER_API_CONFIG = {
    airQuality: {
        endpoint: WEATHER_API_ENDPOINT.airQuality,
        actions: [id, route] as const
    },
    airQualityForecasts: {
        endpoint: WEATHER_API_ENDPOINT.airQualityForecasts,
        actions: [id, route] as const
    },
    airQualityIndex: {
        endpoint: WEATHER_API_ENDPOINT.airQualityIndex,
        actions: [id, route] as const
    },
    alerts: {
        endpoint: WEATHER_API_ENDPOINT.alerts,
        actions: [id, route] as const
    },
    alertsSummary: {
        endpoint: WEATHER_API_ENDPOINT.alertsSummary,
        actions: [id, search, within] as const
    },
    conditions: {
        endpoint: WEATHER_API_ENDPOINT.conditions,
        actions: [id, route] as const
    },
    conditionsSummary: {
        endpoint: WEATHER_API_ENDPOINT.conditionsSummary,
        actions: [id, route] as const
    },
    convectiveOutlook: {
        endpoint: WEATHER_API_ENDPOINT.convectiveOutlook,
        actions: [id, affects, contains, search] as const
    },
    countries: {
        endpoint: WEATHER_API_ENDPOINT.countries,
        actions: [id, search] as const
    },
    droughtsMonitor: {
        endpoint: WEATHER_API_ENDPOINT.droughtsMonitor,
        actions: [id, affects, contains, search] as const
    },
    earthquakes: {
        endpoint: WEATHER_API_ENDPOINT.earthquakes,
        actions: [id, closest, within, search, affects] as const
    },
    energyFarm: {
        endpoint: WEATHER_API_ENDPOINT.energyFarm,
        actions: [id] as const
    },
    fires: {
        endpoint: WEATHER_API_ENDPOINT.fires,
        actions: [id, closest, within, search] as const
    },
    firesOutlook: {
        endpoint: WEATHER_API_ENDPOINT.firesOutlook,
        actions: [id, affects, contains, search, within] as const
    },
    forecasts: {
        endpoint: WEATHER_API_ENDPOINT.forecasts,
        actions: [id, route] as const
    },
    impacts: {
        endpoint: WEATHER_API_ENDPOINT.impacts as ImpactEndpoint,
        actions: [id, route] as const
    },
    indices: {
        endpoint: WEATHER_API_ENDPOINT.indices as IndiceEndpoint,
        actions: [id, route] as const
    },
    lightning: {
        endpoint: WEATHER_API_ENDPOINT.lightning,
        actions: [id, closest, route] as const
    },
    lightningArchive: {
        endpoint: WEATHER_API_ENDPOINT.lightningArchive,
        actions: [id, closest, route] as const
    },
    lightningFlash: {
        endpoint: WEATHER_API_ENDPOINT.lightningFlash,
        actions: [id, closest, route] as const
    },
    lightningSummary: {
        endpoint: WEATHER_API_ENDPOINT.lightningSummary,
        actions: [id, closest] as const
    },
    lightningThreats: {
        endpoint: WEATHER_API_ENDPOINT.lightningThreats,
        actions: [id, closest, contains, affects, route] as const
    },
    maritime: {
        endpoint: WEATHER_API_ENDPOINT.maritime,
        actions: [id, route] as const
    },
    normals: {
        endpoint: WEATHER_API_ENDPOINT.normals,
        actions: [id, closest, within, search, route] as const
    },
    normalsStations: {
        endpoint: WEATHER_API_ENDPOINT.normalsStations,
        actions: [id, closest, within, search, route] as const
    },
    observations: {
        endpoint: WEATHER_API_ENDPOINT.observations,
        actions: [id, closest, within, search, route] as const
    },
    observationsArchive: {
        endpoint: WEATHER_API_ENDPOINT.observationsArchive,
        actions: [id, closest, within] as const
    },
    observationsSummary: {
        endpoint: WEATHER_API_ENDPOINT.observationsSummary,
        actions: [id, closest, within] as const
    },
    phrasesSummary: {
        endpoint: WEATHER_API_ENDPOINT.phrasesSummary,
        actions: [id] as const
    },
    places: {
        endpoint: WEATHER_API_ENDPOINT.places,
        actions: [id, closest, within, search] as const
    },
    placesAirports: {
        endpoint: WEATHER_API_ENDPOINT.placesAirports,
        actions: [id, closest, within, search] as const
    },
    placesPostalCodes: {
        endpoint: WEATHER_API_ENDPOINT.placesPostalCodes,
        actions: [id, closest, within, search] as const
    },
    rivers: {
        endpoint: WEATHER_API_ENDPOINT.rivers,
        actions: [id, closest, within, search] as const
    },
    riverGauges: {
        endpoint: WEATHER_API_ENDPOINT.riverGauges,
        actions: [id, closest, within, search] as const
    },
    roadWeather: {
        endpoint: WEATHER_API_ENDPOINT.roadWeather,
        actions: [id, route] as const
    },
    roadWeatherAnalytics: {
        endpoint: WEATHER_API_ENDPOINT.roadWeatherAnalytics,
        actions: [id, route] as const
    },
    roadWeatherConditions: {
        endpoint: WEATHER_API_ENDPOINT.roadWeatherConditions,
        actions: [id, route] as const
    },
    stormCells: {
        endpoint: WEATHER_API_ENDPOINT.stormCells,
        actions: [id, closest, within, search, affects] as const
    },
    stormCellsSummary: {
        endpoint: WEATHER_API_ENDPOINT.stormCellsSummary,
        actions: [id, affects, search, within] as const
    },
    stormReports: {
        endpoint: WEATHER_API_ENDPOINT.stormReports,
        actions: [id, closest, within, search] as const
    },
    stormReportsSummary: {
        endpoint: WEATHER_API_ENDPOINT.stormReportsSummary,
        actions: [id, within, search] as const
    },
    sunMoon: {
        endpoint: WEATHER_API_ENDPOINT.sunMoon,
        actions: [id] as const
    },
    sunMoonMoonPhases: {
        endpoint: WEATHER_API_ENDPOINT.sunMoonMoonPhases,
        actions: [id, search, contains] as const
    },
    threats: {
        endpoint: WEATHER_API_ENDPOINT.threats,
        actions: [id] as const
    },
    tides: {
        endpoint: WEATHER_API_ENDPOINT.tides,
        actions: [id, closest, within, search] as const
    },
    tidesStations: {
        endpoint: WEATHER_API_ENDPOINT.tidesStations,
        actions: [id, closest, within, search] as const
    },
    tropicalCyclones: {
        endpoint: WEATHER_API_ENDPOINT.tropicalCyclones,
        actions: [all, closest, search, within, affects] as const
    },
    tropicalArchive: {
        endpoint: WEATHER_API_ENDPOINT.tropicalArchive,
        actions: [all, closest, search, within, affects] as const
    }
} as const;
