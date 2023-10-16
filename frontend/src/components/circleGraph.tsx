import { ResponsiveSunburst } from '@nivo/sunburst'
import { useTheme } from '@mui/material/styles';

type ThemeType = 'light' | 'dark';

export const MyResponsiveSunburst = ({ data /* see data tab */ }: any) => {
    const theme = useTheme();

    const colorTheme = theme.palette.mode === 'dark' ? '#333' : '#fff';
return (
    <ResponsiveSunburst
        theme={{
            tooltip: {
              container: {
                background: colorTheme,
              }
            }
          }}
        data={data}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        id="name"
        value="loc"
        cornerRadius={2}
        borderColor={{ theme: 'background' }}
        colors={{ scheme: 'nivo' }}
        childColor={{
            from: 'color',
            modifiers: [
                [
                    'brighter',
                    0.1
                ]
            ]
        }}
        enableArcLabels={true}
        
        arcLabelsSkipAngle={10}
        arcLabelsTextColor="#ffffff"
        transitionMode="startAngle"
        
    />
)
    }