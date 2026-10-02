import React, { useState, useEffect } from "react";
import { apiUrl } from '../api';

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
  const [mobileno, setMobileno] = useState("");
  const [dob, setDob] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch(apiUrl(`/user-data?date=${localDate()}`), {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setDisplayName(data.displayName || data.username || "");
        setEmail(data.email || "");
        setMobileno(data.mobileno || "");
        setDob(data.dob ? String(data.dob).slice(0, 10) : "");
        setBloodGroup(data.bloodGroup || "");
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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    try {
      const updatedData = {
        displayName,
        email,
        mobileno,
        dob,
        bloodGroup,
        height,
        weight,
      };

      const response = await fetch(apiUrl('/update_profile'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setIsEditing(false);
        setError(null);
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Save failed. Please try again.");
      }
    } catch (error) {
      console.error("Profile update request failed.");
      setError("Save failed. Please try again.");
    }
  };

  const styles = {
    profileFormContainer: {
      maxWidth: '60rem',
      margin: '6.8rem auto',
      padding: '1.5rem',
      backgroundColor: '#fff',
      borderRadius: '1rem',
      boxShadow: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.1)',
      position: 'relative',
      minHeight: '70vh',
      display: 'flex',
      gap: '2rem'
    },
    avatarSection: {
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '1.5rem'
    },
    avatar: {
      width: '8rem',
      height: '8rem',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '0.25rem solid #e5e7eb'
    },
    profileFormWrapper: {
      flex: 1,
      paddingTop: '1.5rem'
    },
    profileForm: {
      width: '100%',
      maxWidth: '45rem'
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem',
      marginBottom: '2rem'
    },
    fieldGroup: {
      position: 'relative',
      minHeight: '4.5rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '600',
      fontSize: '0.9375rem',
      color: '#374151'
    },
    fieldContent: {
      position: 'relative',
      minHeight: '2.5rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '0.0625rem solid #d1d5db',
      borderRadius: '0.5rem',
      outline: 'none',
      boxSizing: 'border-box',
      fontSize: '1rem',
      transition: 'border-color 0.2s ease',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      zIndex: 2
    },
    textDisplay: {
      padding: '0.75rem',
      fontSize: '1rem',
      minHeight: '2.5rem',
      display: 'flex',
      alignItems: 'center',
      color: isEditing ? '#111827' : '#6b7280',
      backgroundColor: 'transparent',
      margin: 0,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1
    },
    saveBtn: {
      display: 'block',
      width: '10rem',
      padding: '0.75rem 0',
      backgroundColor: isEditing ? '#10b981' : '#3b82f6',
      color: '#fff',
      border: 'none',
      borderRadius: '0.625rem',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      marginLeft: 'auto',
      marginTop: '2rem',
      transition: 'background-color 0.2s ease'
    },
    errorText: {
      color: '#dc2626',
      fontSize: '0.9rem',
      marginTop: '1rem'
    }
  };

  const renderField = (id, label, value, setValue, type = "text") => (
    <div style={styles.fieldGroup}>
      <label htmlFor={id} style={styles.label}>{label}</label>
      <div style={styles.fieldContent}>
        <p style={styles.textDisplay}>{value}</p>
        {isEditing && (
          <input
            type={type}
            id={id}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={styles.input}
          />
        )}
      </div>
    </div>
  );

  if (loading) {
    return <div style={styles.profileFormContainer}>Loading profile...</div>;
  }

  return (
    <div style={styles.profileFormContainer}>
      <div style={styles.avatarSection}>
        <img
          src="https://imgs.search.brave.com/6T4oYY2aQcqpAskwH5wVw6YtnzCYIoD9eNmrgCKPSOw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9nZXR3/YWxscGFwZXJzLmNv/bS93YWxscGFwZXIv/ZnVsbC80LzkvOS8x/MTgwMTc4LXdpZGVz/Y3JlZW4tY2F0LWhk/LXdhbGxwYXBlcnMt/MTA4MHAtMjA0OHgy/MDQ4LWZvci1pcGFk/LTIuanBn"
          alt="Profile Avatar"
          style={styles.avatar}
        />
      </div>

      <div style={styles.profileFormWrapper}>
        <div style={styles.profileForm}>
          <div style={styles.row}>
            {renderField("displayName", "Name", displayName, setDisplayName)}
            {renderField("email", "Email Address", email, setEmail, "email")}
          </div>

          <div style={styles.row}>
            {renderField("mobileno", "Phone Number", mobileno, setMobileno, "tel")}
            {renderField("dob", "Date of Birth", dob, setDob, "date")}
          </div>

          <div style={styles.row}>
            {renderField("bloodGroup", "Blood Group", bloodGroup, setBloodGroup)}
            {renderField("height", "Height", height, setHeight)}
          </div>

          <div style={styles.row}>
            {renderField("weight", "Weight", weight, setWeight)}
          </div>

          {error && <p style={styles.errorText}>{error}</p>}

          <button
            style={styles.saveBtn}
            onClick={isEditing ? handleSaveChanges : handleEditToggle}
          >
            {isEditing ? "Save Changes" : "Edit Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
