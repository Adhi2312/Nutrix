import React, { useState, useEffect } from 'react';
import './db.css';
import foot from '../imges/runer-silhouette-running-fast.png';
import GaugeChart from 'react-gauge-chart';
import hrt from '../imges/heartbeat.gif';
import { authenticateFitbit, fetchFitbitActivities } from './Connect';
import { LineChart, Gauge } from '@mui/x-charts';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PersonalDetails from './PersonalDetails';
import { calculateBMI, bmiToGaugePercent } from '../utils/bmi';
import { calculateMaintenanceCalories, calculateMacroGoals } from '../utils/nutrition';

const DB = ({ data }) => {

  const [activities, setActivities] = useState(null);
  const [loadingFitbit, setLoadingFitbit] = useState(true);
const [fitbitConnected, setFitbitConnected] = useState(true);
// const [activities, setActivities] = useState(null);
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
        if (!res.ok) {
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

            const data = await fetchFitbitActivities();

            setActivities(data);
            setFitbitConnected(true);

        } catch (err) {

            setFitbitConnected(false);

        } finally {

            setLoadingFitbit(false);

        }

    };

    fetchData();

}, []);

  const handleConnectFitbit = () => {
    authenticateFitbit();
  };

  // Safely access Fitbit data from the state
  const caloriesBurned = activities?.result?.dailySummary?.caloriesBurned || 0;
  const steps = activities?.result?.dailySummary?.steps || 0;
  const heartRate = activities?.result?.heartRateData?.length > 0 ? activities.result.heartRateData[0].bpm : 'N/A';
  const bmi = calculateBMI(data?.height, data?.weight);
  const bmiPercent = bmiToGaugePercent(bmi);

  const maintenanceCalories = calculateMaintenanceCalories(data?.weight, data?.height, data?.age, data?.gender);
  const macroGoals = calculateMacroGoals(data?.weight, maintenanceCalories);
  const consumedCalories = Number(data?.Calorie) || 0;
  const consumedProtein = Number(data?.Protein) || 0;
  const consumedCarbs = Number(data?.Carbs) || 0;
  const consumedFat = Number(data?.Fat) || 0;

  const calorieGaugeValue = Math.min(consumedCalories, maintenanceCalories || consumedCalories);
  const proteinGaugeValue = Math.min(consumedProtein, macroGoals.proteinGoal || consumedProtein);
  const carbsGaugeValue = Math.min(consumedCarbs, macroGoals.carbGoal || consumedCarbs);
  const fatGaugeValue = Math.min(consumedFat, macroGoals.fatGoal || consumedFat);

  return (
    <div className="dashboard-wrapper">

    <div className={!fitbitConnected ? "dashboard blur" : "dashboard"}>
        {/* Entire existing dashboard goes here */}
        <div className='DB-main'>
      {/* <div style={{ display: "flex", width: "100%", alignItems: "flex-start", justifyContent: "space-between" }}>
        <h1> Hello , {data?.username || 'there'}</h1>
        
      </div> */}
      <div className='one'>
        <div className='one-1'>
          <div className='one-1-sub'>
            <h3>Calorie</h3>
            <div className='one-1-chart'>
              <div className='gauge'>
                <GaugeComponent value={calorieGaugeValue} max={maintenanceCalories || consumedCalories} unit="kcal" />
              </div>
              <div className='gauge-info'>
                <SubComponent text={'Calorie Gained'} color={'#f1fdf5'} tc={'#2b9e56'} value={`${consumedCalories} / ${maintenanceCalories || 0} kcal`} />
                <SubComponent text={"Calorie burnt"} color={'#eef7ff'} tc={'#2b64d9'} value={caloriesBurned} />
              </div>
            </div>
          </div>
        </div>

        <div className='one-2'>
          <div className="graph-header">
    <h3>Macros</h3>
</div>
          <div className='one-gauge'>
            <div style={{ height: "100%" }}>
              <GaugeComponent value={proteinGaugeValue} max={macroGoals.proteinGoal || consumedProtein} unit="g" />
              <p>Protein</p>
              <p style={{ marginTop: '6px', fontSize: '14px', color: '#4b5563' }}>{`${consumedProtein} / ${macroGoals.proteinGoal || 0} g`}</p>
            </div>
            <div style={{ height: "100%" }}>
              <GaugeComponent value={carbsGaugeValue} max={macroGoals.carbGoal || consumedCarbs} unit="g" />
              <p>Carbs</p>
              <p style={{ marginTop: '6px', fontSize: '14px', color: '#4b5563' }}>{`${consumedCarbs} / ${macroGoals.carbGoal || 0} g`}</p>
            </div>
            <div style={{ height: "100%" }}>
              <GaugeComponent value={fatGaugeValue} max={macroGoals.fatGoal || consumedFat} unit="g" />
              <p>Fats</p>
              <p style={{ marginTop: '6px', fontSize: '14px', color: '#4b5563' }}>{`${consumedFat} / ${macroGoals.fatGoal || 0} g`}</p>
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
          <div className="graph-header">
    <h3>Caloric Balance: Intake vs Burn Rate</h3>
</div>

<div className="graph-body">
    <Linechart />
</div>
          
        </div>
        <PersonalDetails userData={data} />
      </div>
    </div>
    </div>

    {!fitbitConnected && (
        <div className="fitbit-overlay">
            <div className="fitbit-card">
                <h2>Connect your Fitbit</h2>

                <p>
                    Connect your Fitbit account to view
                    heart rate, steps, calories burned and
                    other health insights.
                </p>

                <button
                    className="connect-fitbit-btn"
                    onClick={handleConnectFitbit}
                >
                    Connect Fitbit
                </button>
            </div>
        </div>
    )}

</div>
    
  );
};

const Linechart = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalorieHistory = async () => {
      try {
        const response = await axios.get('http://localhost:4000/getCalH', {
          withCredentials: true,
        });
        setHistory(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching calorie history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCalorieHistory();
  }, []);

  if (loading) {
    return <p style={{ padding: '20px' }}>Loading history...</p>;
  }

  if (history.length === 0) {
    return (
      <p style={{ padding: '20px', color: '#6b7280' }}>
        No calorie history yet — this fills in once a full day has passed.
      </p>
    );
  }

  const labels = history.map(item =>
    item.date ? new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''
  );
  const calorieIn = history.map(item => item.calorie_in ?? 0);
  const calorieBurned = history.map(item => item.calorie_burnt ?? 0);

  return (
    <LineChart
      xAxis={[{ data: labels, scaleType: 'point' }]}
      series={[
        {
          data: calorieIn,
          color: "#ff5a5a",
          label: "Calories Gained"
        },
        {
          data: calorieBurned,
          color: '#22c55e',
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

const GaugeComponent = ({ value, max, unit }) => {
  const safeValue = Number(value) || 0;
  const safeMax = Number(max) || 0;
  const normalizedValue = safeMax > 0 ? Math.min(safeValue, safeMax) : safeValue;
  const displayValue = safeMax > 0 ? `${Math.round(normalizedValue)}${unit ? ` ${unit}` : ''}` : `${Math.round(safeValue)}${unit ? ` ${unit}` : ''}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Gauge
        width={150}
        height={150}
        value={safeMax > 0 ? (normalizedValue / safeMax) * 100 : 0}
        max={100}
        sx={{
          '& .MuiGauge-valueArc': { fill: '#72C2E8' },
          '& .MuiGauge-referenceArc': { fill: '#d3d3d3' },
          '& .MuiGauge-valueLabel': { fill: '#74b8', fontSize: '24px' },
        }}
      />
      
    </div>
  );
};

export default DB;