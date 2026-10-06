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
    <div className="food-page">
      {selectedDish && (
        <Card
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
          onAdded={handleNutritionAdded}
        />
      )}

      <main className='food-sub'>
          <section className="food-intro" aria-labelledby="food-page-title">
            <div>
              <p className="food-intro-kicker">Nutrition</p>
              <h1 id="food-page-title">Food library</h1>
            </div>
            {!loading && <span className="food-total">{filteredDishes.length} available</span>}
          </section>
          <label className="food-search">
            <span className="sr-only">Search foods</span>
            <CiSearch size={22} aria-hidden="true" />
            <input
              className='in'
              placeholder='Search foods'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <div className='food-sub-2'>
            {error && <p className="food-feedback error" role="alert">{error}</p>}

            {loading && <p className="food-feedback">Loading foods...</p>}

            {!loading && filteredDishes.length === 0 && (
              <p className="food-feedback">
                No foods match your search.
              </p>
            )}

            {filteredDishes.map((dish) => (
              <div className='food-card' key={dish._id}>
                <img
                  className="food-image"
                  src={idli}
                  alt={dish.dish_name}
                />
                <div className="food-card-content">
                  <span className="food-calorie-tag">{dish.calorie} kcal</span>
                  <div className="food-card-row">
                    <div>
                      <h2>{dish.dish_name}</h2>
                      <p>
                        {dish.calorie} calories per {dish.servingDescription || 'serving'}
                      </p>
                    </div>
                    <button className="food-add-button" aria-label={`Add ${dish.dish_name}`} onClick={() => setSelectedDish(dish)}>
                      <IoIosAddCircleOutline size={28} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
      </main>
    </div>
  )
}

export const Card = ({ dish, onClose, onAdded }) => {
  const [count, setCount] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

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
    <div className="food-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className='food-card2' role="dialog" aria-modal="true" aria-labelledby="food-dialog-title">
      <div className="food-modal-header">
        <div><p className="page-eyebrow">Add to today</p><h2 id="food-dialog-title">{dish.dish_name}</h2></div>
        <button className="icon-button" aria-label="Close" onClick={onClose}><RxCross1 size={19} /></button>
      </div>
      <dl className="nutrition-list">
        <div><dt>Serving</dt><dd>{dish.servingDescription || '1 serving'}</dd></div>
        <div><dt>Protein</dt><dd>{dish.protein} g</dd></div>
        <div><dt>Carbs</dt><dd>{dish.carbs} g</dd></div>
        <div><dt>Fats</dt><dd>{dish.fat} g</dd></div>
        <div><dt>Calories</dt><dd>{dish.calorie} kcal</dd></div>
      </dl>
      <div className="quantity-row">
        <span>Quantity</span>
        <div className='add-b'>
          <button aria-label="Decrease quantity" onClick={() => setCount(Math.max(1, count - 1))}><FiMinus /></button>
          <span>{count}</span>
          <button aria-label="Increase quantity" onClick={() => setCount(count + 1)}><FaPlus /></button>
        </div>
      </div>
      {error && <p className="food-feedback error" role="alert">{error}</p>}
      <div className="food-modal-actions">
        <button className="secondary-button" onClick={onClose}>Cancel</button>
        <button className="button-primary" onClick={handle} disabled={saving}>{saving ? 'Adding...' : 'Add food'}</button>
      </div>
    </section>
    </div>
  )
}
