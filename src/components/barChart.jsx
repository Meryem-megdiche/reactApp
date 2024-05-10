import React, { useState, useEffect } from "react";
import { ResponsiveBar } from "@nivo/bar";
import axios from "axios";
import { parseISO, format } from "date-fns";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const BarChart = ({ isDashboard = true, equipmentIds, startDate, endDate }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (equipmentIds.length > 0 && startDate && endDate) {
          const response = await axios.post("https://nodeapp-2h1p.onrender.com/api/barChartData", {
            startDate,
            endDate,
            equipmentIds,
          });

          if (response.status === 200) {
            const data = response.data;
            const formattedData = formatBarChartData(data);
            setChartData(formattedData);
          } else {
            console.error("Error fetching data. HTTP Status:", response.status);
            setError("Erreur lors de la récupération des données.");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Une erreur s'est produite lors de la récupération des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [equipmentIds, startDate, endDate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ResponsiveBar
      data={chartData}
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      indexBy="timestamp"
      keys={["TTL"]}
      colors={(d) => d.data.color} // Utilisez la couleur définie dans les données
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Temps",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "TTL",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: "#999",
              strokeWidth: 1,
            },
          },
          ticks: {
            line: {
              stroke: "#999",
              strokeWidth: 1,
            },
            text: {
              fill: "#999",
            },
          },
        },
        grid: {
          line: {
            stroke: "#eee",
            strokeWidth: 1,
          },
        },
        
      }}
    
      
    />
  );
};

const formatBarChartData = (data) => {
  return data.map((item, index) => {
    if (!item || !item.timestamp || !item.TTL) {
      console.error("Invalid data at index", index, ":", item);
      return null;
    }

    const color = getColorByTTL(item.TTL);
    
    // Assurez-vous que item.timestamp est une instance de Date
    const timestamp = new Date(item.timestamp);

    if (!(timestamp instanceof Date) || isNaN(timestamp.getTime())) {
      console.error("Invalid timestamp at index", index, ":", item.timestamp);
      return null;
    }

    return {
      timestamp: timestamp.toISOString(),
      TTL: item.TTL,
      color: color,
    };
  }).filter((item) => item !== null);
};

const getColorByTTL = (TTL) => {
  if (TTL < 56) {
    return "green";
  } else if (TTL >= 56 && TTL <= 113) {
    return "orange";
  } else if (TTL > 113) {
    return "red";
  } else {
    console.error("Unexpected TTL value:", TTL);
    // ou une autre couleur par défaut
  }
};

export default BarChart;