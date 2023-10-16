import { ResponsivePie } from '@nivo/pie'
import { useTheme } from '@mui/material/styles';

type ThemeType = 'light' | 'dark';

export const MyResponsivePie = ({ data }: any) => {
    const theme = useTheme();

    const colorTheme = theme.palette.mode === 'dark' ? '#333' : '#fff';
    const colorTextTheme = theme.palette.mode === 'dark' ? '#fff' : '#333';
return(
    <ResponsivePie
    theme={{
        tooltip: {
        container: {
            background: colorTheme,
        }
        }
    }}
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        startAngle={-22}
        endAngle={90}
        sortByValue={true}
        innerRadius={0.5}
        padAngle={1}
        cornerRadius={13}
        activeInnerRadiusOffset={15}
        activeOuterRadiusOffset={10}
        colors={{ scheme: 'nivo' }}
        borderWidth={2}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    // @ts-ignore
                    '0.5'
                ]
            ]
        }}
        arcLinkLabelsTextOffset={5}
        arcLinkLabelsTextColor={colorTextTheme}
        arcLinkLabelsDiagonalLength={20}
        arcLinkLabelsStraightLength={9}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabel="value"
        arcLabelsTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    2
                ]
            ]
        }}
        legends={[
            {
                anchor: 'bottom-left',
                direction: 'column',
                justify: false,
                translateX: -25,
                translateY: -15,
                itemsSpacing: 0,
                itemWidth: 10,
                itemHeight: 21,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000'
                        }
                    }
                ]
            }
        ]}
    />
)}