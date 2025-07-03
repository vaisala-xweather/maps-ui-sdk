import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'node:path';

export default defineConfig({
    plugins: [
        visualizer({
            open: true,
            gzipSize: true,
            brotliSize: true
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        },
        extensions: ['.mjs', '.js', '.ts', '.tsx', '.json', '.cjs']
    },
    build: {
        // reportCompressedSize: true,
        outDir: 'temp-analysis',
        minify: false,
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            fileName: 'index',
            formats: ['es']
        },
        rollupOptions: {
            external: ['react', 'react-dom', '@aerisweather/mapsgl'],
            output: {
                globals: {
                    'react': 'React',
                    'react-dom': 'ReactDOM',
                    '@aerisweather/mapsgl': 'MapsGL'
                }
            }
        }
    }
});
