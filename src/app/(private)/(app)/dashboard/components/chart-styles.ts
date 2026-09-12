// Estilos compartilhados pelos gráficos do dashboard, com os tokens do tema
export const CHART_HEIGHT = 240

export const chartMargin = { top: 8, right: 8, bottom: 8, left: 0 }

export const axisProps = {
  stroke: 'var(--muted-foreground)',
  tickLine: false,
  axisLine: false,
}

export const gridProps = {
  vertical: false,
  stroke: 'var(--border)',
}

export const tooltipStyles = {
  contentStyle: {
    background: 'var(--popover)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--popover-foreground)',
  },
  labelStyle: { color: 'var(--muted-foreground)' },
}

// Destaque da coluna sob o cursor nos gráficos de barras
export const barCursor = { fill: 'var(--muted)', opacity: 0.6 }
