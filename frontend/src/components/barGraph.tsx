import { ResponsiveBar } from '@nivo/bar'
import { useTheme } from '@mui/material/styles';

type ThemeType = 'light' | 'dark';

export const MyResponsiveBar = ({ data}: any) => {
    const theme = useTheme();
    const colorTheme = theme.palette.mode === 'dark' ? '#333' : '#fff';
    const lineGraphSettings = {
        tooltip: {
            container: {
                background: colorTheme,
            }
            },
        theme: {
        fontSize: '14px',
        textColor: 'blue',
        },
        };

    
    const averageThemeText = theme.palette.mode === 'dark' ? "#fff" : "#333";
    return(
    <ResponsiveBar
        data={data}
        theme={{
            tooltip: {
            container: {
                background: colorTheme,
            }
            }
        }}
        keys={[
            'Muy baja',
            'Baja',
            'Media',
            'Alta',
            'Muy alta'
        ]}
        indexBy="username"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.2}
        innerPadding={1}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'nivo' }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#38bcb2',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: '#eed312',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    // @ts-ignore
                    '3'
                ]
            ]
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Aulas',
            legendPosition: 'middle',
            legendOffset: 32
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Tickets',
            legendPosition: 'middle',
            legendOffset: -40
        }}
        labelSkipWidth={10}
        labelSkipHeight={12}
        labelTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.6
                ]
            ]
        }}
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                symbolBorderColor: colorTheme,
                itemTextColor: averageThemeText,
                itemsSpacing: 4,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
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
        motionConfig={{
            mass: 1,
            tension: 170,
            friction: 26,
            clamp: false,
            precision: 0.01,
            velocity: 0
        }}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={e=>e.id+": "+e.formattedValue+" in country: "+e.indexValue}
    />
)
    }