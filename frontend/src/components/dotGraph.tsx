// yarn add @nivo/scatterplot
import { ResponsiveScatterPlot } from '@nivo/scatterplot'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export const MyResponsiveScatterPlot = ({ data, average}: any) => (
    <ResponsiveScatterPlot
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
        blendMode="multiply"
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
                stroke: '#b248fe',
                strokeWidth: 1
              },
              value: average
            }
          ]}
        axisBottom={{
            format: '%b %d',
            tickValues: 'every 3 days',
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
            legendOffset: -60
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
)