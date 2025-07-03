import { defineConfig } from 'vite';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import circleDependency from 'vite-plugin-circular-dependency';

export default defineConfig({
    plugins: [
        react(),
        circleDependency({
            outputFilePath: './circleDependency.html'
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        },
        extensions: ['.mjs', '.js', '.ts', '.tsx', '.json', '.cjs']
    },
});
