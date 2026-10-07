import React, { useState, useEffect } from "react";
import { apiUrl } from '../api';
import './profile.css';

const localDate = () => {
  const now = new Date();
  return [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map((value, index) => String(value).padStart(index === 0 ? 4 : 2, '0'))
    .join('-');
};

const ProfileForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch(apiUrl(`/user-data?date=${localDate()}`), { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setDisplayName(data.displayName || data.username || "");
        setEmail(data.email || "");
        setDob(data.dob ? String(data.dob).slice(0, 10) : "");
        setHeight(data.height || "");
        setWeight(data.weight || "");
      } catch (err) {
        console.error("Profile request failed.");
        setError("Could not load your profile. Try refreshing.");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(apiUrl('/update_profile'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ displayName, email, dob, height, weight }),
      });
      if (response.ok) {
        setIsEditing(false);
        setError(null);
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Save failed. Please try again.");
      }
    } catch (requestError) {
      console.error("Profile update request failed.");
      setError("Save failed. Please try again.");
    }
  };

  const renderField = (id, label, value, setValue, type = "text", suffix = "") => (
    <label className="profile-field" htmlFor={id}>
      <span>{label}</span>
      {isEditing ? (
        <input className="form-control" type={type} id={id} value={value} onChange={(event) => setValue(event.target.value)} />
      ) : (
        <strong>{value ? `${value}${suffix}` : '—'}</strong>
      )}
    </label>
  );

  if (loading) {
    return <div className="profile-page"><div className="profile-loading">Loading profile...</div></div>;
  }

  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'N';

  return (
    <main className="profile-page">
      <section className="profile-card">
        <aside className="profile-identity">
          <div className="profile-avatar" aria-hidden="true">{initials}</div>
          <h2>{displayName || 'Nutrix member'}</h2>
          <p>{email || 'No email available'}</p>
          <span className="profile-status"><i aria-hidden="true" /> Profile active</span>
        </aside>

        <div className="profile-form">
          <div className="profile-grid">
            {renderField("displayName", "Name", displayName, setDisplayName)}
            {renderField("email", "Email address", email, setEmail, "email")}
            {renderField("dob", "Date of birth", dob, setDob, "date")}
            {renderField("height", "Height", height, setHeight, "number", " cm")}
            {renderField("weight", "Weight", weight, setWeight, "number", " kg")}
          </div>

          {error && <p className="form-error profile-error" role="alert">{error}</p>}

          <div className="profile-actions">
            {isEditing && <button className="secondary-button" onClick={() => setIsEditing(false)}>Cancel</button>}
            <button className="button-primary" onClick={isEditing ? handleSaveChanges : () => setIsEditing(true)}>
              {isEditing ? "Save changes" : "Edit profile"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProfileForm;
