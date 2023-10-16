import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { useTheme } from '@mui/material/styles';

type ThemeType = 'light' | 'dark';

export const MyResponsiveScatterPlot = ({ data, average}: any) => {
    const theme = useTheme();

    const colorTheme = theme.palette.mode === 'dark' ? '#333' : '#fff';
    const blendTheme = theme.palette.mode === 'dark' ? "screen" : "multiply";
    const averageThemeText = theme.palette.mode === 'dark' ? "#fff" : "#333";


    return(
    <ResponsiveScatterPlot
        theme={{
            tooltip: {
            container: {
                background: colorTheme,
            }
            }
        }}
        data={data}
        margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
        xScale={{
            type: 'time',
            format: '%Y-%m-%d',
            precision: 'day'
          }}
        xFormat="time:%Y-%m-%d"
        yScale={{ type: 'linear', min: 0, max: 'auto' }}
        yFormat=">-.2f"
        blendMode={blendTheme}
        colors={{
            scheme: 'set2'
          }}
        nodeSize={15}
        enableGridX={false}
        axisTop={null}
        axisRight={null}
        markers={[
            {
              axis: 'y',
              legend: 'avg.',
              legendPosition: 'bottom-left',
              lineStyle: {
                stroke: '#b0413e',
                strokeWidth: 1
              },
              textStyle: {
                fill: averageThemeText,
              },
              value: average
            }
          ]}
        axisBottom={{
            format: '%b %d',
            tickValues: 'every 2 days',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Fecha',
            legendPosition: 'middle',
            legendOffset: 46
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Tiempo de solución (horas)',
            legendPosition: 'middle',
            legendOffset: -60,
            
        }}
        legends={[
            {
                anchor: 'right',
                direction: 'column',
                justify: false,
                translateX: 110,
                translateY: 0,
                itemWidth: 100,
                itemHeight: 12,
                itemsSpacing: 5,
                itemDirection: 'left-to-right',
                symbolSize: 12,
                symbolShape: 'circle',
                itemTextColor: averageThemeText,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
)}