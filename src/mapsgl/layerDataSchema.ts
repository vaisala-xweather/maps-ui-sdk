export const PaintStyleKeys = {
    opacity: 'opacity',
    sample: 'sample',
    particle: 'particle',
    grid: 'grid',
    symbol: 'symbol',
    raster: 'raster',
    fill: 'fill',
    stroke: 'stroke',
    circle: 'circle',
    contour: 'contour',
    heatmap: 'heatmap'
} as const;

export const SampleStyleKeys = {
    expression: `paint.${PaintStyleKeys.sample}.expression`,
    channel: `paint.${PaintStyleKeys.sample}.channel`,
    quality: `paint.${PaintStyleKeys.sample}.quality`,
    interpolation: `paint.${PaintStyleKeys.sample}.interpolation`,
    smoothing: `paint.${PaintStyleKeys.sample}.smoothing`,
    colorscalePath: `paint.${PaintStyleKeys.sample}.colorscale`,
    colorscale: {
        stops: `paint.${PaintStyleKeys.sample}.colorscale.stops`,
        interval: `paint.${PaintStyleKeys.sample}.colorscale.interval`,
        range: `paint.${PaintStyleKeys.sample}.colorscale.range`,
        interpolate: `paint.${PaintStyleKeys.sample}.colorscale.interpolate`,
        normalized: `paint.${PaintStyleKeys.sample}.colorscale.normalized`
    },
    opacity: `paint.${PaintStyleKeys.sample}.opacity`,
    multiband: `paint.${PaintStyleKeys.sample}.multiband`,
    offset: `paint.${PaintStyleKeys.sample}.offset`,
    meld: `paint.${PaintStyleKeys.sample}.meld`,
    drawRangePath: `paint.${PaintStyleKeys.sample}.drawRange`,
    drawRange: {
        min: `paint.${PaintStyleKeys.sample}.drawRange.min`,
        max: `paint.${PaintStyleKeys.sample}.drawRange.max`
    }
} as const;

export const ParticleStyleKeys = {
    count: `paint.${PaintStyleKeys.particle}.count`,
    density: `paint.${PaintStyleKeys.particle}.density`,
    size: `paint.${PaintStyleKeys.particle}.size`,
    speed: `paint.${PaintStyleKeys.particle}.speed`,
    trails: `paint.${PaintStyleKeys.particle}.trails`,
    trailsFade: `paint.${PaintStyleKeys.particle}.trailsFade`,
    dropRate: `paint.${PaintStyleKeys.particle}.dropRate`,
    dropRateBump: `paint.${PaintStyleKeys.particle}.dropRateBump`
} as const;

export const GridStyleKeys = {
    symbol: `paint.${PaintStyleKeys.grid}.symbol`,
    spacing: `paint.${PaintStyleKeys.grid}.spacing`
} as const;

export const SymbolStyleKeys = {
    size: `paint.${PaintStyleKeys.symbol}.size`
} as const;

export const DataStyleKeys = {
    quality: 'data.quality'
} as const;

export const LayerSchema = {
    paint: {
        [PaintStyleKeys.opacity]: 'paint.opacity',
        [PaintStyleKeys.sample]: SampleStyleKeys,
        [PaintStyleKeys.particle]: ParticleStyleKeys,
        [PaintStyleKeys.grid]: GridStyleKeys,
        [PaintStyleKeys.symbol]: SymbolStyleKeys
    },
    filter: 'filter',
    data: DataStyleKeys
} as const;
