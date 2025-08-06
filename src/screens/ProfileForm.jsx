import React, { useState, useEffect } from "react";

const ProfileForm = ({ userData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("Prithiv");
  const [lastName, setLastName] = useState("raj");
  const [email, setEmail] = useState("prithiv936@gmail.com");
  const [phone, setPhone] = useState("9361648407");
  const [age, setAge] = useState("20");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [height, setHeight] = useState("181");
  const [weight, setWeight] = useState("70");

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setEmail(userData.email || "");
      setPhone(userData.phone || "");
      setAge(userData.age || "");
      setBloodGroup(userData.bloodGroup || "");
      setHeight(userData.height || "");
      setWeight(userData.weight || "");
    }
  }, [userData]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    try {
      const updatedData = {
        firstName,
        lastName,
        email,
        phone,
        age,
        bloodGroup,
        height,
        weight,
      };
      
      // Replace with your actual API call
      console.log("Saving data:", updatedData);
      // const response = await fetch('http://localhost:4000/update_profile', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   credentials: 'include',
      //   body: JSON.stringify(updatedData)
      // });

      // if (response.ok) {
        console.log("Profile updated successfully!");
        if (onSave) {
          onSave(updatedData);
        }
        setIsEditing(false);
      // }
    } catch (error) {
      console.error("Error saving changes:", error);
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
    inputFocus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 0.1875rem rgba(59, 130, 246, 0.1)'
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
    saveBtnHover: {
      backgroundColor: isEditing ? '#059669' : '#2563eb'
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
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 0.1875rem rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          />
        )}
      </div>
    </div>
  );

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
            {renderField("firstName", "First Name", firstName, setFirstName)}
            {renderField("lastName", "Last Name", lastName, setLastName)}
          </div>
          
          <div style={styles.row}>
            {renderField("email", "Email Address", email, setEmail, "email")}
            {renderField("phone", "Phone Number", phone, setPhone, "tel")}
          </div>
          
          <div style={styles.row}>
            {renderField("age", "Age", age, setAge, "number")}
            {renderField("bloodGroup", "Blood Group", bloodGroup, setBloodGroup)}
          </div>
          
          <div style={styles.row}>
            {renderField("height", "Height", height, setHeight)}
            {renderField("weight", "Weight", weight, setWeight)}
          </div>
          
          <button
            style={styles.saveBtn}
            onClick={isEditing ? handleSaveChanges : handleEditToggle}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = isEditing ? '#059669' : '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = isEditing ? '#10b981' : '#3b82f6';
            }}
          >
            {isEditing ? "Save Changes" : "Edit Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;