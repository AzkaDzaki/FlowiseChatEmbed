/**
 * Chart component exports
 * 
 * Core Chart.js rendering functionality separated from HTML processing.
 */

export {
  // Main rendering functions
  createChart,
  renderChart,
  
  // Validation
  validateChartConfig,
  
  // Cleanup
  cleanupCharts,
  destroyAllCharts,
  
  // Utilities
  generateChartId,
  
  // Types
  type ChartConfig,
  type ChartType,
  VALID_CHART_TYPES,
} from './ChartRenderer';