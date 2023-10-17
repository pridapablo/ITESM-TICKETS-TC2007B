import { Card, CardContent, CardHeader, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import AppsIcon from "@mui/icons-material/Apps";
import { motion } from "framer-motion";
// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/sunburst
import { MyResponsiveSunburst } from "../components/circleGraph";
import { MyResponsivePie } from "../components/DigGraph";
import { MyResponsiveBar } from "../components/barGraph";
import IndeterminateCheckbox from "../components/checkBox";
import { MyResponsiveTreeMap } from "../components/boxGraph";
import { MyResponsiveScatterPlot } from "../components/dotGraph";
import { Button, useTranslate } from "react-admin";
import { useTheme } from "@mui/material/styles";
import ToggleButtonDashboard from "../components/toggleDashboard";

export const Dashboard = () => {
  const [weekView, setWeekView] = useState(true); // Initialize isList state as true

  const toggleWeekView = () => {
    setWeekView(true); // Toggle the isList state when the button is clicked
  };

  const toggleAllTimeView = () => {
    setWeekView(false); // Toggle the isList state when the button is clicked
  };

  const theme = useTheme();
  const colorThemeBG =
    theme.palette.mode === "dark" ? "bg-neutral-600" : "bg-white";
  const colorThemeHover =
    theme.palette.mode === "dark"
      ? "hover:bg-neutral-500"
      : "hover:bg-neutral-300";
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
    dataWeek: {
      allTicketQueryData: [];
      avgResolutionTime: [];
      allResoultionTime: [];
      inventoryByClassification: [];
      mostReportedCategories: [];
      ticketCounts: [];
      ticketStats: [];
    };
    allData: {
      allTicketQueryDataAllTime: [];
      avgResolutionTimeAllTime: [];
      allResoultionTimeAllTime: [];
      inventoryByClassificationAllTime: [];
      mostReportedCategoriesAllTime: [];
      ticketCountsAllTime: [];
      ticketStatsAllTime: [];
    };
  }

  const [data, setData] = useState<DataTypes>({
    dataWeek: {
      allTicketQueryData: [],
      avgResolutionTime: [],
      allResoultionTime: [],
      inventoryByClassification: [],
      mostReportedCategories: [],
      ticketCounts: [],
      ticketStats: [],
    },
    allData: {
      allTicketQueryDataAllTime: [],
      avgResolutionTimeAllTime: [],
      allResoultionTimeAllTime: [],
      inventoryByClassificationAllTime: [],
      mostReportedCategoriesAllTime: [],
      ticketCountsAllTime: [],
      ticketStatsAllTime: [],
    },
  });
  useEffect(() => {
    async function fetchData() {
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authentication: localStorage.getItem("auth") || "",
        },
      };

      const res = await fetch(
        `${import.meta.env.VITE_JSON_SERVER_URL}/report`,
        options
      );

      const data = await res.json();
      setData(data);
    }

    fetchData();
  }, []);

  const translate = useTranslate();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={translate("resources.dashboard.name")} />
          <ToggleButtonDashboard
            handleClick1={toggleWeekView}
            handleClick2={toggleAllTimeView}
          />
          <button
            className={`absolute right-2 top-24 ${colorThemeBG} ${colorThemeHover} shadow-md shadow-neutral-600 font-bold py-2 px-4 mr-2 rounded-lg`}
            onClick={() => setCheckboxVisible(!isCheckboxVisible)}
          >
            <AppsIcon style={{ color: "black" }} />
          </button>

          {isCheckboxVisible ? (
            <motion.div
              className="absolute right-2 top-36"
              initial={{ x: "100%" }}
              animate={isCheckboxVisible ? { x: 0 } : { x: "100%" }}
              exit={{ x: "-100%" }}
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
          ) : (
            <></>
          )}
          <CardContent>
            <div className="flex flex-wrap h-screen overflow-y-auto custom-scrollbar justify-center">
              {isMySuburstVisible && (
                <div
                  className={`${
                    isMySuburstExpanded ? "h-[85%] w-[85%]" : "h-[50%] w-[45%]"
                  } ${colorThemeBG} shadow-lg my-5 shadow-neutral-600 p-10 mx-5 rounded-xl`}
                >
                  <h2 className="text-xl text-center">
                    {" "}
                    {translate("resources.dashboard.mostReportedCategories")}
                  </h2>
                  <MyResponsiveSunburst
                    data={
                      weekView
                        ? data.dataWeek.mostReportedCategories
                        : data.allData.mostReportedCategoriesAllTime
                    }
                  />
                  <Button
                    variant="contained"
                    onClick={() => setMySuburstExpanded(!isMySuburstExpanded)}
                  >
                    <span>
                      {isMySuburstExpanded
                        ? translate("ra.action.shrink")
                        : translate("ra.action.expand")}
                    </span>
                  </Button>
                </div>
              )}

              {isMyPieVisible && (
                <div
                  className={`${
                    isMyPieExpanded ? "h-[85%] w-[85%]" : "h-[50%] w-[45%]"
                  } ${colorThemeBG} shadow-lg my-5 shadow-neutral-600 p-10 mx-5 rounded-xl`}
                >
                  <h2 className="text-xl text-center">
                    {translate("resources.dashboard.ticketCreated")}
                  </h2>
                  <MyResponsivePie
                    data={
                      weekView
                        ? data.dataWeek.ticketStats
                        : data.allData.ticketStatsAllTime
                    }
                  />
                  <Button
                    variant="contained"
                    onClick={() => setMyPieExpanded(!isMyPieExpanded)}
                  >
                    <span>
                      {isMyPieExpanded
                        ? translate("ra.action.shrink")
                        : translate("ra.action.expand")}
                    </span>
                  </Button>
                </div>
              )}

              {isMyBarVisible && (
                <div
                  className={`${
                    isMyBarExpanded ? "h-[85%] w-[85%]" : "h-[50%] w-[45%]"
                  } ${colorThemeBG} shadow-lg my-5 shadow-neutral-600 p-10 mx-5 rounded-xl `}
                >
                  <h2 className="text-xl text-center">
                    {translate("resources.dashboard.ticketByRoom")}
                  </h2>
                  <MyResponsiveBar
                    data={
                      weekView
                        ? data.dataWeek.ticketCounts
                        : data.allData.ticketCountsAllTime
                    }
                  />
                  <Button
                    variant="contained"
                    onClick={() => setMyBarExpanded(!isMyBarExpanded)}
                  >
                    <span>
                      {isMyBarExpanded
                        ? translate("ra.action.shrink")
                        : translate("ra.action.expand")}
                    </span>
                  </Button>
                </div>
              )}

              {isMyBoxVisible && (
                <div
                  className={`${
                    isMyBoxExpanded ? "h-[85%] w-[85%]" : "h-[50%] w-[45%]"
                  } ${colorThemeBG} shadow-lg my-5 shadow-neutral-600 p-10 mx-5 rounded-xl `}
                >
                  <h2 className="text-xl text-center">
                    {" "}
                    {translate("resources.dashboard.inventoryByRoom")}
                  </h2>
                  <MyResponsiveTreeMap
                    data={
                      weekView
                        ? data.dataWeek.inventoryByClassification
                        : data.allData.inventoryByClassificationAllTime
                    }
                  />
                  <Button
                    variant="contained"
                    onClick={() => setMyBoxExpanded(!isMyBoxExpanded)}
                  >
                    <span>
                      {isMyBoxExpanded
                        ? translate("ra.action.shrink")
                        : translate("ra.action.expand")}
                    </span>
                  </Button>
                </div>
              )}

              {isMyDotVisible && (
                <div
                  className={`${
                    isMyDotExpanded ? "h-[85%] w-[85%]" : "h-[50%] w-[45%]"
                  } ${colorThemeBG} shadow-lg my-5 shadow-neutral-600 p-10 mx-5 rounded-xl `}
                >
                  <h2 className="text-xl text-center">
                    {translate("resources.dashboard.avgResolutionTime")}
                  </h2>
                  <MyResponsiveScatterPlot
                    data={
                      weekView
                        ? data.dataWeek.allResoultionTime
                        : data.allData.allResoultionTimeAllTime
                    }
                    average={
                      weekView
                        ? data.dataWeek.avgResolutionTime
                        : data.allData.avgResolutionTimeAllTime
                    }
                  />
                  <Button
                    variant="contained"
                    onClick={() => setMyDotExpanded(!isMyDotExpanded)}
                  >
                    <span>
                      {isMyDotExpanded
                        ? translate("ra.action.shrink")
                        : translate("ra.action.expand")}
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
