import React, { useState } from 'react';
import './HealthView.css';

const UserInfoPage = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container">
    <div className="content-container">
    <h1 className="title">Tell Us About Yourself</h1>
    <form onSubmit={handleSubmit} className="form-container">
    <div className="form-group">
    <label htmlFor="weight" className="form-label>">Weight (kg)</label>
    <input
    type="number"
    id="weight"
    name="weight"
    className="form-input"
    value={weight}
    onChange={(e)=> setWeight(e.target.value)}
    />
    </div>
        <div className="form-group">
    <label htmlFor="height" className="form-label>">Height (cm)</label>
    <input
    type="number"
    id="height"
    name="height"
    className="form-input"
    value={height}
    onChange={(e)=> setWeight(e.target.value)}
    />
    </div>
   <div className="buttonCon">
  <button type="button" className="btn1 btn-primary">
    Previous
  </button>
  <button type="submit" className="btn btn-primary">
    Next
  </button>
</div>

    </form>
    </div>
    </div>
  );
};

export default UserInfoPage;