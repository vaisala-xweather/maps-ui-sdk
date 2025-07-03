import React from 'react';
import { createRoot } from 'react-dom/client';
import { UNITS, InitialSettings } from '@xweather/maps-ui-sdk';
import { AppProviders } from './providers/AppProviders';
import App from './App';
import './index.css';

const { temperature, distance, speed, pressure, rate } = UNITS;

const settings: InitialSettings = {
    baseMap: 'dark',
    units: {
        temperature: temperature.degF,
        distance: distance.mi,
        speed: speed.mph,
        pressure: pressure.inhg,
        rate: rate.mmh
    },
    activeGroupId: 'maritime'
};

const rootElement = document.querySelector('#root');

if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <AppProviders initialSettings={settings}>
                <App />
            </AppProviders>
        </React.StrictMode>
    );
} else {
    console.error('Unable to find the root element with id "root"');
}
