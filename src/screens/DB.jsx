import React, { useState, useEffect } from 'react';
import './db.css';
import foot from '../imges/runer-silhouette-running-fast.png';
import GaugeChart from 'react-gauge-chart';
import hrt from '../imges/heartbeat.gif';
import { authenticateGoogleHealth, fetchHealthActivities, fetchHealthConnection } from './Connect';
import { LineChart, Gauge } from '@mui/x-charts';
import axios from 'axios';
import PersonalDetails from './PersonalDetails';
import { calculateBMI, bmiToGaugePercent } from '../utils/bmi';
import { calculateAge, calculateMaintenanceCalories, calculateMacroGoals } from '../utils/nutrition';
import { apiUrl } from '../api';

const localDate = () => {
  const now = new Date();
  return [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map((value, index) => String(value).padStart(index === 0 ? 4 : 2, '0'))
    .join('-');
};

const googleHealthErrorMessage = (status) => {
  const messages = {
    'api-access-denied': 'Google has not granted this Cloud project access to the Google Health API yet.',
    'account-not-linked': 'This Google Account is not linked to a Google Health profile yet.',
    'configuration-error': 'The Google Health connection is not configured correctly.',
    'authorization-expired': 'The Google authorization expired before it could be completed.',
    'connection-failed': 'Google Health could not complete the connection.',
  };
  return messages[status] || '';
};

const DB = ({ data }) => {

  const [activities, setActivities] = useState(null);
  const [healthConnected, setHealthConnected] = useState(null);
  const [healthUnavailable, setHealthUnavailable] = useState(false);
  const [healthLoading, setHealthLoading] = useState(true);
  const [migrationRequired, setMigrationRequired] = useState(false);
  const [healthError, setHealthError] = useState(() => {
    const status = new URLSearchParams(window.location.search).get('health');
    return googleHealthErrorMessage(status);
  });
  // Load the connected health provider, then fetch its activity data.
  useEffect(() => {

    const fetchData = async () => {

        try {

            const connection = await fetchHealthConnection();
            setHealthConnected(connection.connected);
            setMigrationRequired(connection.migrationRequired);
            if (!connection.connected) return;

            try {
              const data = await fetchHealthActivities();
              setActivities(data);
              window.dispatchEvent(new Event('calorie-history-updated'));
              setHealthUnavailable(false);
            } catch (err) {
              if (err.status === 401) {
                setHealthConnected(false);
                setHealthUnavailable(false);
              } else {
                setHealthUnavailable(true);
              }
            }

        } catch (err) {
            if (err.status === 401) {
              setHealthConnected(false);
              setHealthUnavailable(false);
            } else {
              setHealthConnected(false);
              setHealthUnavailable(true);
            }
        } finally {
          setHealthLoading(false);

        }
    };

    fetchData();

}, []);

  const handleConnectGoogleHealth = () => {
    setHealthError('');
    authenticateGoogleHealth();
  };

  // Safely access connected health data from the state
  const caloriesBurned = activities?.result?.dailySummary?.caloriesBurned || 0;
  const steps = activities?.result?.dailySummary?.steps || 0;
  const heartRate = activities?.result?.heartRateData?.length > 0 ? activities.result.heartRateData[0].bpm : 'N/A';
  const bmi = calculateBMI(data?.height, data?.weight);
  const bmiPercent = bmiToGaugePercent(bmi);

  const profileAge = Number(data?.age) > 0 ? Number(data.age) : calculateAge(data?.dob);
  const maintenanceCalories = calculateMaintenanceCalories(data?.weight, data?.height, profileAge, data?.gender);
  const hasCalorieTarget = maintenanceCalories > 0;
  const macroGoals = calculateMacroGoals(data?.weight, maintenanceCalories);
  const consumedCalories = Number(data?.Calorie) || 0;
  const consumedProtein = Number(data?.Protein) || 0;
  const consumedCarbs = Number(data?.Carbs) || 0;
  const consumedFat = Number(data?.Fat) || 0;

  const calorieGaugeValue = Math.min(consumedCalories, maintenanceCalories);
  const proteinGaugeValue = Math.min(consumedProtein, macroGoals.proteinGoal || consumedProtein);
  const carbsGaugeValue = Math.min(consumedCarbs, macroGoals.carbGoal || consumedCarbs);
  const fatGaugeValue = Math.min(consumedFat, macroGoals.fatGoal || consumedFat);

  return (
    <div className="dashboard-wrapper">

    <div className={healthConnected === false ? "dashboard blur" : "dashboard"}>
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
                <GaugeComponent value={calorieGaugeValue} max={maintenanceCalories} unit="kcal" />
              </div>
              <div className='gauge-info'>
                <SubComponent
                  text={'Calorie Gained'}
                  color={'#f1fdf5'}
                  tc={'#2b9e56'}
                  value={hasCalorieTarget ? `${consumedCalories} / ${maintenanceCalories} kcal` : `${consumedCalories} / -- kcal`}
                />
                {!hasCalorieTarget && (
                  <p style={{ margin: '8px 0 0', color: '#6b7280', fontSize: '12px' }}>
                    Add valid age, height, and weight to set your target.
                  </p>
                )}
                <SubComponent text={"Calorie burnt"} color={'#eef7ff'} tc={'#2b64d9'} value={caloriesBurned} />
                {healthUnavailable && (
                  <div>
                    <p style={{ margin: '8px 0 0', color: '#6b7280', fontSize: '12px' }}>
                      Health data is temporarily unavailable.
                    </p>
                    <button type="button" className="connect-fitbit-btn" onClick={() => window.location.reload()}>
                      Retry health connection
                    </button>
                  </div>
                )}
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
            <h3>{steps}</h3>
          </div>
        </div>
        <div className='two-2'>
          <div className="graph-header">
    <h3>Daily Calorie History</h3>
</div>

<div className="graph-body">
    <Linechart />
</div>
          
        </div>
        <PersonalDetails userData={data} />
      </div>
    </div>
    </div>

    {migrationRequired && healthConnected && (
      <div className="fitbit-card" style={{ margin: '16px auto', maxWidth: '680px' }}>
        <h2>Reconnect Fitbit through Google Health</h2>
        <p>
          Google is retiring the old Fitbit developer connection. Reconnect once to keep
          steps, heart rate, and calories syncing from your Fitbit device.
        </p>
        <button className="connect-fitbit-btn" onClick={handleConnectGoogleHealth}>
          Move connection to Google Health
        </button>
      </div>
    )}

    {!healthLoading && healthConnected === false && (
        <div className="fitbit-overlay">
            <div className="fitbit-card">
                <h2>{healthUnavailable ? 'Google Health is unavailable' : 'Connect Google Health'}</h2>

                <p>
                    {healthError || (healthUnavailable
                      ? 'Nutrix could not check the Google Health connection. Please retry.'
                      : 'Connect Google Health to view Fitbit or Pixel Watch heart rate, steps, calories burned and other health insights.')}
                </p>

                <button
                    className="connect-fitbit-btn"
                    onClick={healthUnavailable && !healthError ? () => window.location.reload() : handleConnectGoogleHealth}
                >
                    {healthUnavailable && !healthError ? 'Retry health connection' : 'Connect Google Health'}
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
        const response = await axios.get(apiUrl(`/nutrition/history?date=${localDate()}`), {
          withCredentials: true,
        });
        setHistory(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Calorie history request failed.");
      } finally {
        setLoading(false);
      }
    };
    fetchCalorieHistory();
    window.addEventListener('calorie-history-updated', fetchCalorieHistory);
    return () => window.removeEventListener('calorie-history-updated', fetchCalorieHistory);
  }, []);

  if (loading) {
    return <p style={{ padding: '20px' }}>Loading history...</p>;
  }

  if (history.length === 0) {
    return (
      <p style={{ padding: '20px', color: '#6b7280' }}>
        No calorie history yet. Add food to start tracking today.
      </p>
    );
  }

  const labels = history.map(item =>
    item.date ? new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''
  );
  const calorieIn = history.map(item => item.calorie_in ?? 0);
  const calorieBurnt = history.map(item => item.calorie_burnt ?? 0);

  return (
    <LineChart
      xAxis={[{ data: labels, scaleType: 'point' }]}
      series={[
        {
          data: calorieIn,
          color: "#ff5a5a",
          label: "Calories Consumed"
        },
        {
          data: calorieBurnt,
          color: "#2b64d9",
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
