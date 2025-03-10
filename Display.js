import React, { useState, useEffect } from "react";

const Display = () => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const storedData = localStorage.getItem("data"); 
    if (storedData) {
      setUserData(JSON.parse(storedData)); 
    }
  }, []);

  return (
    <div>
      {userData.length > 0 ? (
        userData.map((user, index) => (
          <div key={index} className="card-component">
            {user.file ? <img src={user.file} alt="Profile Pic" /> : <p>No Profile Pic</p>}
            <p>Username: {user.userName}</p>
            <p>Email: {user.email}</p>
            <p>Gender: {user.gender}</p>
            <p>Age: {user.age}</p>
            <p>Stream: {user.selectedValue}</p>
            <p>Subjects: {user.subject ? Object.keys(user.subject).join(", ") : "None"}</p>
          </div>
        ))
      ) : (
        <h1>No data available</h1>
      )}
    </div>
  );
};

export default Display;
