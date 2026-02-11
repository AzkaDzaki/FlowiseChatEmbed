import { Chart, ChartConfiguration } from 'chart.js';
/**
 * Supported chart types (matches Chart.js types)
 */
export declare const VALID_CHART_TYPES: readonly ["bar", "line", "pie", "doughnut", "radar", "polarArea", "scatter", "bubble"];
export type ChartType = typeof VALID_CHART_TYPES[number];
/**
 * Chart configuration interface (Chart.js format)
 */
export interface ChartConfig extends ChartConfiguration {
    type: ChartType;
    data: {
        labels?: string[];
        datasets: any[];
    };
    options?: any;
}
/**
 * Validate chart configuration
 */
export declare function validateChartConfig(config: any): config is ChartConfig;
/**
 * Create and render a chart on a canvas element
 */
export declare function createChart(canvas: HTMLCanvasElement, config: ChartConfig): Chart | null;
/**
 * Render a chart from configuration
 */
export declare function renderChart(chartId: string, config: ChartConfig, containerElement: HTMLElement): void;
/**
 * Cleanup chart instances
 */
export declare function cleanupCharts(containerElement: HTMLElement): void;
/**
 * Destroy all chart instances
 */
export declare function destroyAllCharts(): void;
/**
 * Generate unique chart ID
 */
export declare function generateChartId(): string;
//# sourceMappingURL=ChartRenderer.d.ts.map