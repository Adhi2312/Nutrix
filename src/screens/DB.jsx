import React, { useState, useEffect } from 'react';
import './db.css';
import cal from '../imges/fire.gif';
import foot from '../imges/runer-silhouette-running-fast.png';
import GaugeChart from 'react-gauge-chart';
import hrt from '../imges/heartbeat.gif';
import { authenticateFitbit, fetchFitbitActivities } from './Connect';
import { LineChart, Gauge } from '@mui/x-charts';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PersonalDetails from './PersonalDetails';

const DB = ({ data }) => {
  const [activities, setActivities] = useState(null);
  const nav = useNavigate();

  // Effect to handle initial authorization check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:4000/authorize', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (res.status === 404) {
          nav('/login');
        }
      } catch (error) {
        console.error("Authorization check failed:", error);
        nav('/login');
      }
    };
    checkAuth();
  }, [nav]);

  // Effect to fetch Fitbit activities
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fitbitData = await fetchFitbitActivities();
        console.log("Fetched Fitbit data:", fitbitData);
        setActivities(fitbitData);
        console.log("activities fetched :",activities);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 30 * 60 * 1000); // Corrected interval to 30 minutes

    return () => clearInterval(interval);
  }, []);
  console.log("Activities state has been updated:", activities);

  useEffect(() => {
    if (activities) {
        
        // You can also verify specific values here
        console.log("Steps from updated state:", activities.result.dailySummary.steps);
    }
}, [activities]);

  const handleConnectFitbit = () => {
    authenticateFitbit();
  };

  // Safely access Fitbit data from the state
  const caloriesBurned = activities?.result?.dailySummary?.caloriesBurned || 0;
  const steps = activities?.result?.dailySummary?.steps || 0;
  const heartRate = activities?.result?.heartRateData?.length > 0 ? activities.result.heartRateData[0].bpm : 'N/A';
  const calorieGoal = activities?.result?.dailySummary?.activityGoals?.caloriesOut || 2500;
  const caloriePercent = (caloriesBurned / calorieGoal).toFixed(2);
  const bmiPercent = (data?.weight && data?.height) ? (data.weight / ((data.height / 100) * (data.height / 100))) / 30 * 100 : 0;
    
  return (
    <div className='DB-main'>
      <div style={{ display: "flex", width: "100%", alignItems: "flex-start", justifyContent: "space-between" }}>
        <h1> Hello , Prithiv Raj</h1>
        <button onClick={handleConnectFitbit} className='connect-fitbit-btn'>
          Connect Fitbit
        </button>
      </div>
      <div className='one'>
        <div className='one-1'>
          <div className='one-1-sub'>
            <h3>Calorie</h3>
            <div className='one-1-chart'>
              <div className='gauge'>
                <GaugeComponent value={data?.Calorie || 0} />
              </div>
              <div className='gauge-info'>
                <SubComponent text={'Calorie Gained'} color={'#f1fdf5'} tc={'#2b9e56'} value={data?.Calorie || 0} />
                <SubComponent text={"Calorie burnt"} color={'#eef7ff'} tc={'#2b64d9'} value={caloriesBurned} />
              </div>
            </div>
          </div>
        </div>

        <div className='one-2'>
          <div style={{ height: "8%", marginTop: '-10px', width: "100%", marginLeft: "10px", marginBottom: "10px" }}>
            <h3>Macros</h3>
          </div>
          <div className='one-gauge'>
            <div style={{ height: "100%" }}>
              <Gauge width={150} height={150} value={data?.Protein || 0} sx={{
                '& .MuiGauge-valueArc': { fill: '#00274D' },
                '& .MuiGauge-referenceArc': { fill: '#d3d3d3' },
                '& .MuiGauge-valueLabel': { fill: '#74b8', fontSize: '24px' },
              }} />
              <p>Protein</p>
            </div>
            <div style={{ height: "100%" }}>
              <Gauge width={150} height={150} value={data?.Carbs || 0}
                maxValue={3000}
                sx={{
                  '& .MuiGauge-valueArc': { fill: '#72C2E8' },
                  '& .MuiGauge-referenceArc': { fill: '#d3d3d3' },
                  '& .MuiGauge-valueLabel': { fill: '#74b8', fontSize: '24px' },
                }}
              />
              <p>Carbs</p>
            </div>
            <div style={{ height: "100%" }}>
              <Gauge width={150} height={150} value={data?.Fat || 0}
                sx={{
                  '& .MuiGauge-valueArc': { fill: '#556B2F' },
                  '& .MuiGauge-referenceArc': { fill: '#d3d3d3' },
                  '& .MuiGauge-valueLabel': { fill: '#74b8', fontSize: '24px' },
                }}
              />
              <p>Fats</p>
            </div>
          </div>
        </div>

        <div className='one-3'>
          <h3>BMI</h3>
          <GaugeChart id="gauge-chart5"
            nrOfLevels={3}
            colors={['#5BE12C', '#F5CD19', '#EA4228']}
            percent={bmiPercent} // Updated to use a calculated BMI percentage
            arcPadding={0.02}
          />
        </div>
      </div>

      <div className='two'>
        <div className='two-1'>
          <div className='two-1-1'>
            <img style={{ height: "60px", width: "60px" }} src={hrt} alt="Heart Rate" />
            <p>Heart Rate</p>
            <h3>{heartRate} bpm</h3>
          </div>
          <div className='two-1-2'>
            <img style={{ height: "60px", width: "60px" }} src={foot} alt="Steps" />
            <p>Steps</p>
            <h3>{steps} m</h3>
          </div>
        </div>
        <div className='two-2'>
          <div style={{ height: "10%", width: "100%", marginLeft: "10px" }}>
            <h3>Caloric Balance: Intake vs Burn Rate</h3>
          </div>
          <div style={{ height: "80%", width: "100%", marginTop: "-15px" }}>
            <Linechart />
          </div>
        </div>
        <PersonalDetails userData={data} />
      </div>
    </div>
  );
};

const Linechart = () => {
  const [chartData, setChartData] = useState([]);
  const [calorieBurnedData, setCalorieBurnedData] = useState([]);

  useEffect(() => {
    const fetchCalorieHistory = async () => {
      try {
        const response = await axios.get('http://localhost:4000/getCalH', {
          withCredentials: true,
        });
        const calorieIn = response.data.map(item => item.calorie_in);
        const calorieBurned = response.data.map(item => item.calorie_burnt);
        setChartData(calorieIn);
        setCalorieBurnedData(calorieBurned);
      } catch (error) {
        console.error("Error fetching calorie history:", error);
      }
    };
    fetchCalorieHistory();
  }, []);

  return (
    <LineChart
      xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
      series={[
        {
          data: chartData,
          color: "#ff5a5a",
          label: "Calories Gained"
        },
        {
          data: calorieBurnedData.length > 0 ? calorieBurnedData : [3, 7, 8, 5, 5, 1],
          color: '#8f8f',
          label: "Calories Burned"
        }
      ]}
      width={600}
      height={350}
    />
  );
};

const SubComponent = ({ text, color, tc, value }) => {
  return (
    <div className='info-sub' style={{ backgroundColor: color }}>
      <p>{text}</p>
      <p style={{ fontWeight: 'bold', color: tc }}>{value}</p>
    </div>
  );
};

const GaugeComponent = ({ value }) => {
  return (
    <Gauge
      width={150}
      height={150}
      value={value}
      max={300}
      sx={{
        '& .MuiGauge-valueArc': { fill: '#72C2E8' },
        '& .MuiGauge-referenceArc': { fill: '#d3d3d3' },
        '& .MuiGauge-valueLabel': { fill: '#74b8', fontSize: '24px' },
      }}
    />
  );
};

export default DB;