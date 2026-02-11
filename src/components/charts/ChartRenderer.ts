import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

// Store chart instances for cleanup
const chartInstances = new Map<string, Chart>();

/**
 * Supported chart types (matches Chart.js types)
 */
export const VALID_CHART_TYPES = ['bar', 'line', 'pie', 'doughnut', 'radar', 'polarArea', 'scatter', 'bubble'] as const;

export type ChartType = (typeof VALID_CHART_TYPES)[number];

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
export function validateChartConfig(config: any): config is ChartConfig {
  if (!config || typeof config !== 'object') {
    return false;
  }

  if (!config.type || !VALID_CHART_TYPES.includes(config.type)) {
    console.warn(`Invalid chart type: ${config.type}. Supported types:`, VALID_CHART_TYPES);
    return false;
  }

  if (!config.data || !config.data.datasets || !Array.isArray(config.data.datasets)) {
    console.warn('Invalid chart configuration: missing or invalid data.datasets');
    return false;
  }

  return true;
}

/**
 * Get default chart options based on type
 */
function getDefaultOptions(type: ChartType): any {
  const baseOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 15,
          font: {
            size: 12,
            family: "'Inter', 'Segoe UI', sans-serif",
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 6,
        titleFont: {
          size: 13,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
        displayColors: true,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
  };

  // Configure scales for chart types that use axes
  if (['bar', 'line', 'scatter', 'bubble', 'radar'].includes(type)) {
    if (type === 'radar') {
      baseOptions.scales = {
        r: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          },
          ticks: {
            font: {
              size: 11,
            },
          },
        },
      };
    } else {
      baseOptions.scales = {
        x: {
          grid: {
            display: ['scatter', 'bubble'].includes(type),
            color: 'rgba(0, 0, 0, 0.05)',
          },
          ticks: {
            font: {
              size: 11,
            },
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          },
          ticks: {
            font: {
              size: 11,
            },
          },
        },
      };
    }
  }

  // Move legend to the right for circular charts
  if (['pie', 'doughnut', 'polarArea'].includes(type)) {
    baseOptions.plugins.legend.position = 'right';
  }

  return baseOptions;
}

/**
 * Deep merge objects
 */
function deepMerge(target: any, source: any): any {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  return output;
}

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Create and render a chart on a canvas element
 */
export function createChart(canvas: HTMLCanvasElement, config: ChartConfig): Chart | null {
  try {
    // Get default options for the chart type
    const defaultOptions = getDefaultOptions(config.type);

    // Merge user options with defaults
    const mergedOptions = config.options ? deepMerge(defaultOptions, config.options) : defaultOptions;

    // Create chart configuration with merged options
    const chartConfig: ChartConfiguration = {
      type: config.type,
      data: config.data,
      options: mergedOptions,
    };

    // Create and return chart instance
    return new Chart(canvas, chartConfig);
  } catch (error) {
    console.error('Error creating chart:', error);
    return null;
  }
}

/**
 * Render a chart from configuration
 */
export function renderChart(chartId: string, config: ChartConfig, containerElement: HTMLElement): void {
  const canvas = containerElement.querySelector(`#${chartId}`) as HTMLCanvasElement;

  if (!canvas) {
    console.warn(`Canvas element with ID ${chartId} not found`);
    return;
  }

  try {
    // Destroy existing chart if it exists
    if (chartInstances.has(chartId)) {
      chartInstances.get(chartId)?.destroy();
    }

    // Create new chart
    const chart = createChart(canvas, config);
    if (chart) {
      chartInstances.set(chartId, chart);
    }
  } catch (error) {
    console.error(`Error rendering chart ${chartId}:`, error);
  }
}

/**
 * Cleanup chart instances
 */
export function cleanupCharts(containerElement: HTMLElement): void {
  const canvases = containerElement.querySelectorAll('canvas[id^="chart-"]');
  canvases.forEach((canvas) => {
    const chartId = canvas.id;
    if (chartInstances.has(chartId)) {
      chartInstances.get(chartId)?.destroy();
      chartInstances.delete(chartId);
    }
  });
}

/**
 * Destroy all chart instances
 */
export function destroyAllCharts(): void {
  chartInstances.forEach((chart) => {
    chart.destroy();
  });
  chartInstances.clear();
}

/**
 * Generate unique chart ID
 */
export function generateChartId(): string {
  return `chart-${Math.random().toString(36).substring(2, 11)}`;
}
