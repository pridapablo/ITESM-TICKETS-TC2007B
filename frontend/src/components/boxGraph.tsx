import { ResponsiveTreeMap } from '@nivo/treemap'
import { useTheme } from '@mui/material/styles';

type ThemeType = 'light' | 'dark';

export const MyResponsiveTreeMap = ({ data  }: any) => {
    const theme = useTheme();

    const colorTheme = theme.palette.mode === 'dark' ? '#333' : '#fff';
    return(
    <ResponsiveTreeMap
        theme={{
            tooltip: {
            container: {
                background: colorTheme,
            }
            }
        }}
        data={data}
        identity="name"
        value="loc"
        valueFormat=".02s"
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        label={e=>e.id}
        labelTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.2
                ]
            ]
        }}
        labelSkipSize={60}
        orientLabel={false}
        tile="binary"
        parentLabelSize={15}
        parentLabelPadding={20}
        // parentLabelPosition="left"
        parentLabelTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    2
                ]
            ]
        }}
        nodeOpacity={0.4}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    0.1
                ]
            ]
        }}
    />
)
    }