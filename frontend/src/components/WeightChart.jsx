import React from 'react';
import Plot from 'react-plotly.js';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

const WeightChart = ({ plotData }) => {
  if (!plotData || !plotData.dates || plotData.dates.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Weight Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No data available for chart</p>
        </CardContent>
      </Card>
    );
  }

  const data = [
    {
      x: plotData.dates,
      y: plotData.weights,
      type: 'scatter',
      mode: 'lines+markers',
      marker: { color: 'rgb(75, 192, 192)' },
      name: 'Weight',
    },
    {
      x: plotData.dates,
      y: Array(plotData.dates.length).fill(plotData.target_weight),
      type: 'scatter',
      mode: 'lines',
      line: { dash: 'dash', color: 'rgba(255, 99, 132, 0.8)' },
      name: 'Target Weight',
    },
  ];

  const layout = {
    autosize: true,
    margin: { l: 60, r: 30, t: 30, b: 60 },
    xaxis: {
      title: 'Date',
      tickangle: -45,
    },
    yaxis: {
      title: 'Weight (kg)',
    },
    legend: {
      orientation: 'h',
      y: -0.2,
    },
    font: {
      size: 12,
    },
  };

  const config = {
    responsive: true,
    displayModeBar: false,
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Weight Trend for {plotData.name}</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <Plot
          data={data}
          layout={layout}
          config={config}
          style={{ width: '100%', height: '100%' }}
        />
      </CardContent>
    </Card>
  );
};

export default WeightChart;