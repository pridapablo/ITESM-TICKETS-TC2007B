import { Card, CardContent, CardHeader, Grid, Typography, Checkbox } from '@mui/material';
import { useEffect, useState } from 'react';
import AppsIcon from '@mui/icons-material/Apps';
import { motion } from 'framer-motion';
// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/sunburst
import { MyResponsiveSunburst } from '../components/circleGraph';
import { MyResponsivePie } from '../components/DigGraph';
import { MyResponsiveBar } from '../components/barGraph';
import  IndeterminateCheckbox  from '../components/checkBox';
import { MyResponsiveTreeMap } from '../components/boxGraph';
import { MyResponsiveScatterPlot } from '../components/dotGraph';
import { Button } from 'react-admin';
import { useTheme } from '@mui/material/styles';

type ThemeType = 'light' | 'dark';

export const Dashboard = () => {
  const theme = useTheme();
  const colorThemeBG = theme.palette.mode === 'dark' ? 'bg-neutral-600' : 'bg-white';
  const [isCheckboxVisible, setCheckboxVisible] = useState(false); 

  const [isMySuburstExpanded, setMySuburstExpanded] = useState(false);
  const [isMySuburstVisible, setMySuburstVisible] = useState(true);

  const [isMyPieExpanded, setMyPieExpanded] = useState(false);
  const [isMyPieVisible, setMyPieVisible] = useState(true);

  const [isMyBarExpanded, setMyBarExpanded] = useState(false);
  const [isMyBarVisible, setMyBarVisible] = useState(true);

  const [isMyBoxExpanded, setMyBoxExpanded] = useState(false);
  const [isMyBoxVisible, setMyBoxVisible] = useState(true);

  const [isMyDotExpanded, setMyDotExpanded] = useState(false);
  const [isMyDotVisible, setMyDotVisible] = useState(true);

  interface DataTypes {
    allTicketQueryData: [];
    avgResolutionTime: [];
    allResoultionTime: [];
    inventoryByClassification: [];
    mostReportedCategories: [];
    ticketCounts: [];
    ticketStats: [];
  }

  const [data, setData] = useState<DataTypes>({
    allTicketQueryData: [],
    avgResolutionTime: [],
    allResoultionTime: [],  
    inventoryByClassification: [],
    mostReportedCategories: [],
    ticketCounts: [],
    ticketStats: [],
  });
    const [transformedData, setTransformedData] = useState<TransformedDataWrapper>();
    useEffect(() => {
        async function fetchData(){
            const res = await fetch(`${import.meta.env.VITE_JSON_SERVER_URL}/report`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
                })
            
            const data = await res.json();
            setData(data);
            console.log(data);
        }

       fetchData();
    }   
    , []);
      
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Reporte de tickets" />
          <button
                  className="absolute right-2 top-24 bg-neutral-100 hover:bg-neutral-300 shadow-md shadow-slate-500 text-white font-bold py-2 px-4 mr-2 rounded-lg"
                  onClick={() => setCheckboxVisible(!isCheckboxVisible)}
                >
                  <AppsIcon style={{ color: 'black' }} />
          </button>
        
          { isCheckboxVisible ?
          ( 
            <motion.div 
            className='absolute right-2 top-35 bg-white'
            initial={{ x: '100%' }}
            animate={isCheckboxVisible ? { x: 0 } : { x: '100%'}}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <IndeterminateCheckbox 
              setVisible3={setMyBarVisible} 
              isVisible3={isMyBarVisible} 
              setVisible2={setMyPieVisible} 
              isVisible2={isMyPieVisible}
              setVisible1={setMySuburstVisible}
              isVisible1={isMySuburstVisible}
              setVisible4={setMyBoxVisible}
              isVisible4={isMyBoxVisible}
              setVisible5={setMyDotVisible}
              isVisible5={isMyDotVisible}
              /> 
            </motion.div>
          ): <></>}
          <CardContent>
            <div className='flex flex-wrap h-screen overflow-y-auto custom-scrollbar justify-center'>
              {isMySuburstVisible && (
                <div className={`${isMySuburstExpanded? "h-[85%] w-[85%]" : "h-[50%] w-[45%]"} ${colorThemeBG} shadow-lg my-5 shadow-neutral-600 p-10 mx-5 rounded-xl`}>
                  <h2 className='text-xl text-center'> Categorias más utilizadas</h2>
                  <MyResponsiveSunburst data={data.mostReportedCategories} />
                  <Button
                    variant="contained"
                    onClick={() => setMySuburstExpanded(!isMySuburstExpanded)}
                  >
                    <span>{isMySuburstExpanded ? 'Shrink' : 'Expand'}</span>
                  </Button>
              </div>
              )}

              {isMyPieVisible && (
              <div className={`${isMyPieExpanded? "h-[85%] w-[85%]" : "h-[50%] w-[45%]"} ${colorThemeBG} shadow-lg my-5 shadow-neutral-600 p-10 mx-5 rounded-xl`}>
                <h2 className='text-xl text-center'> Tickets creados</h2>
                <MyResponsivePie data={data.ticketStats} />
                <Button
                  variant="contained"
                  onClick={() => setMyPieExpanded(!isMyPieExpanded)}
                >
                  <span>{isMyPieExpanded ? 'Shrink' : 'Expand'}</span>
                </Button>
              </div>
              )}

              {isMyBarVisible && (
              <div className={`${isMyBarExpanded? "h-[85%] w-[85%]" : "h-[50%] w-[45%]"} ${colorThemeBG} shadow-lg my-5 shadow-neutral-600 p-10 mx-5 rounded-xl `}>
                <h2 className='text-xl text-center'> Tickets por aula</h2>
                <MyResponsiveBar data={data.ticketCounts} />
                <Button
                  variant="contained"
                  onClick={() => setMyBarExpanded(!isMyBarExpanded)}
                >
                  <span>{isMyBarExpanded ? 'Shrink' : 'Expand'}</span>
                </Button>
              </div>
              )}

                {isMyBoxVisible && (
                <div className={`${isMyBoxExpanded? "h-[85%] w-[85%]" : "h-[50%] w-[45%]"} ${colorThemeBG} shadow-lg my-5 shadow-neutral-600 p-10 mx-5 rounded-xl `}>
                <h2 className='text-xl text-center'> Inventario por aula</h2>
                <MyResponsiveTreeMap data={data.inventoryByClassification} />
                <Button
                  variant="contained"
                  onClick={() => setMyBoxExpanded(!isMyBoxExpanded)}
                >
                  <span>{isMyBoxExpanded ? 'Shrink' : 'Expand'}</span>
                </Button>
              </div>
              )}

              {isMyDotVisible && (
                <div className={`${isMyDotExpanded? "h-[85%] w-[85%]" : "h-[50%] w-[45%]"} ${colorThemeBG} shadow-lg my-5 shadow-neutral-600 p-10 mx-5 rounded-xl `}>
                <h2 className='text-xl text-center'>Tiempo en solucionar problemas</h2>
                <MyResponsiveScatterPlot data={data.allResoultionTime} average={data.avgResolutionTime} />
                <Button
                  variant="contained"
                  onClick={() => setMyDotExpanded(!isMyDotExpanded)}
                >
                  <span>{isMyDotExpanded ? 'Shrink' : 'Expand'}</span>
                </Button>
              </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
