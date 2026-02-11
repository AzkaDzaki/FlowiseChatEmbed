import { validateChartConfig, renderChart, generateChartId, cleanupCharts, destroyAllCharts, type ChartConfig } from '../components/charts';

/**
 * Process HTML content and render Chart.js charts from code blocks
 * @param html - The HTML string with potential chart code blocks
 * @param containerElement - The DOM element where charts will be rendered
 * @returns Processed HTML with chart placeholders
 */
export function processChartCodeBlocks(html: string, containerElement: HTMLElement): string {
  // Regular expression to match code blocks with chart/chartjs language
  // Matches variations like: lang-chart, language-chart, lang-chartjs, language-chartjs
  // Handles attributes on both <pre> and <code> tags
  const chartCodeBlockRegex = /<pre[^>]*>\s*<code[^>]*class="[^"]*\b(?:lang(?:uage)?-(?:chart|chartjs))\b[^"]*"[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi;
  let processedHtml = html;
  const chartConfigs: Array<{ id: string; config: ChartConfig }> = [];

  // Replace chart code blocks with canvas elements
  processedHtml = processedHtml.replace(chartCodeBlockRegex, (match, content) => {
    try {
      // Decode HTML entities
      const decodedContent = decodeHtmlEntities(content);

      // Parse the JSON configuration
      const chartConfig = JSON.parse(decodedContent);

      // Validate chart configuration
      if (!validateChartConfig(chartConfig)) {
        console.warn('Invalid chart configuration');
        return match; // Return original code block
      }

      // Generate unique ID for the chart
      const chartId = generateChartId();

      // Store configuration for later rendering
      chartConfigs.push({ id: chartId, config: chartConfig });

      // Return canvas element with responsive container
      return `<div class="chart-container" style="position: relative; height: 300px; width: 100%; margin: 1rem 0; padding: 16px; background: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
        <canvas id="${chartId}" style="max-height: 100%; max-width: 100%;"></canvas>
      </div>`;
    } catch (error) {
      console.error('Error parsing chart configuration:', error);
      // Return original code block if parsing fails
      return match;
    }
  });

  // Schedule chart rendering after DOM update
  if (chartConfigs.length > 0) {
    setTimeout(() => {
      chartConfigs.forEach(({ id, config }) => {
        renderChart(id, config, containerElement);
      });
    }, 0);
  }

  return processedHtml;
}

/**
 * Decode HTML entities
 * @param html - HTML string with entities
 * @returns Decoded string
 */
function decodeHtmlEntities(html: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
}

// Re-export chart cleanup functions for convenience
export { cleanupCharts, destroyAllCharts };
