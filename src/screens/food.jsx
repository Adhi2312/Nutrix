import React, { useState, useEffect } from 'react'
import './food.css'
import idli from '../imges/idli_premix_featured.jpg'
import { IoIosAddCircleOutline } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { FiMinus } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import { apiUrl } from '../api';

const localDate = () => {
  const now = new Date();
  return [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map((value, index) => String(value).padStart(index === 0 ? 4 : 2, '0'))
    .join('-');
};

export const Food = () => {
  const [selectedDish, setSelectedDish] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFoods = async () => {
      try {
        const foodsResponse = await fetch(apiUrl('/foods'), { credentials: 'include' });
        if (!foodsResponse.ok) throw new Error('Unable to load nutrition data');
        const foodsData = await foodsResponse.json();
        setDishes(Array.isArray(foodsData) ? foodsData : []);
      } catch (err) {
        console.error('Food request failed.');
        setError('Could not load foods. Try refreshing.');
      } finally {
        setLoading(false);
      }
    };
    loadFoods();
  }, []);

  const filteredDishes = dishes.filter(d =>
    d.dish_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleNutritionAdded = () => {
    setSelectedDish(null);
    window.dispatchEvent(new Event('nutrition-updated'));
  };

  return (
    <div>
      {selectedDish && (
        <Card
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
          onAdded={handleNutritionAdded}
        />
      )}

      <div style={{ display: "flex", height: "100vh", width: "100vw", justifyContent: "center" }}>
        <div className='food-sub'>
          <div style={{ display: "flex" }}>
            <input
              className='in'
              placeholder='Type Something,...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <CiSearch size={30} className='search' />
          </div>

          <div className='food-sub-2'>
            {error && <p style={{ padding: '12px 20px', color: '#b91c1c' }}>{error}</p>}

            {loading && <p style={{ padding: '20px' }}>Loading dishes...</p>}

            {!loading && filteredDishes.length === 0 && (
              <p style={{ padding: '20px' }}>
                No dishes are available yet.
              </p>
            )}

            {filteredDishes.map((dish) => (
              <div className='food-card' key={dish._id}>
                <img
                  style={{ width: "300px", height: "200px", borderRadius: "20px 20px 0px 0px" }}
                  src={idli}
                  alt={dish.dish_name}
                />
                <div style={{ padding: "10px" }}>
                  <div style={{ display: 'flex' }}>
                    <div>
                      <p style={{ margin: "0px", fontSize: "20px" }}>{dish.dish_name}</p>
                      <p style={{ margin: "5px 0px 5px 0px", fontSize: "15px", color: "grey" }}>
                        {dish.calorie} calories per {dish.servingDescription || 'serving'}
                      </p>
                    </div>
                    <IoIosAddCircleOutline
                      style={{ marginLeft: "auto" }}
                      color='grey'
                      size={40}
                      onClick={() => setSelectedDish(dish)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export const Card = ({ dish, onClose, onAdded }) => {
  const [count, setCount] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handle = async () => {
    const body = { foodId: dish._id, quantity: count, date: localDate() };
    try {
      setSaving(true);
      setError('');
      const res = await fetch(apiUrl('/nutrition/intake'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to update today\'s nutrition');
      onAdded();
    } catch (error) {
      console.error('Macro update request failed.');
      setError(error.message || 'Unable to update today\'s nutrition.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className='food-card2'>
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: "100%", backgroundColor: "white", padding: "7px 0px" }}>
        <RxCross1 style={{ marginRight: '10px' }} size={20} onClick={onClose} />
      </div>
      <div style={{ width: "100%", display: "flex", height: "100%", backgroundColor: "white" }}>
        <div className="ccc" style={{ display: 'flex', flexDirection: 'column', width: "50%" }}>
          <h3>Dish Name</h3>
          <p>Serving</p>
          <p>Protein</p>
          <p>Carbs</p>
          <p>Fats</p>
          <p>Calorie</p>
          <p>Qty</p>
          <button
            style={{ maxWidth: "100px", padding: '10px 30px', margin: "10px", borderRadius: "10px", border: '0px' }}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
        <div className='ccc' style={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <h3>{dish.dish_name}</h3>
          <p>{dish.servingDescription || '1 serving'}</p>
          <p>{dish.protein} g</p>
          <p>{dish.carbs} g</p>
          <p>{dish.fat} g</p>
          <p>{dish.calorie} kcal</p>
          <div className='add-b'>
            <button onClick={() => { (count <= 1) ? setCount(1) : setCount(count - 1) }}><FiMinus size={7} /></button>
            <p>{count}</p>
            <button onClick={() => { setCount(count + 1) }}><FaPlus size={7} /></button>
          </div>
          <button
            onClick={handle}
            disabled={saving}
            style={{ minWidth: "100px", padding: '10px 30px', margin: "10px", borderRadius: "10px", border: '0px' }}
          >
            {saving ? 'Adding...' : 'Add'}
          </button>
          {error && <p style={{ color: '#b91c1c', margin: '0 10px' }}>{error}</p>}
        </div>
      </div>
    </div>
  )
}
