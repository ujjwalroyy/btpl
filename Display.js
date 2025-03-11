import React, { useState, useEffect, useRef } from "react";

const Display = () => {
  const [userData, setUserData] = useState([]);
  const [editInd, setEditInd] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const storedData = localStorage.getItem("data");
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

  const handleDelete = (ind) => {
    const updatedData = userData.filter((_, i) => i !== ind);
    setUserData(updatedData);
    localStorage.setItem("data", JSON.stringify(updatedData));
  };

  const handleStatusChange = (ind, val) => {
    const updatedData = [...userData];
    updatedData[ind].status = val;
    setUserData(updatedData);
    localStorage.setItem("data", JSON.stringify(updatedData));
  };

  const handleEdit = (ind) => {
    console.log("Ind ", ind);
    setEditInd(ind);
    setEditData({...userData[ind]});
  };

  const printMap = () => {
    userData.map((user, ind) => {
        console.log("-----------", user.subject);
    })
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setEditData((prevData) => ({
        ...prevData,
        subject: checked
          ? [...(prevData.subject || []), value]
          : (prevData.subject || []).filter((sub) => sub !== value),
      }));
    } else {
      setEditData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updatedData = [...userData];
    updatedData[editInd] = editData;
    setUserData(updatedData);
    localStorage.setItem("data", JSON.stringify(updatedData));
    setEditInd(null);
    setEditData({});
  };

  const mySearch = () => {
    let input = document.getElementById("myInput")
    let filter = input.value.toLowerCase();
    let tr = document.getElementsByTagName("tr")
    let th = document.getElementsByTagName("thead")
    for(let i = 0; i < tr.length; i++){
      let textVal = tr[i].textContent || tr[i].innerText
      if(textVal.toLowerCase().indexOf(filter) > -1){
        tr[i].style.display = "";
      }
      else{
        tr[i].style.display = "none"
      }
    }
  }

  const genderOptions = ["Male", "Female", "Other"];



  const validateUserName = (username) => {
    const validUserName = /^[a-z0-9]+$/i;
    const usernameError = document.getElementById('username-error');
    if (!validUserName.test(username)) {
      usernameError.style.display = 'block';
      return false;
    }
    return true;
  };

  const checkOption = [
    { name: 'physics ', key: 'physics', label: 'Physics' },
    { name: 'chemistry ', key: 'chemistry', label: 'Chemistry' },
    { name: 'math ', key: 'math', label: 'Math' },
    { name: 'biology ', key: 'bio', label: 'Biology' },
  ];

  const validateAge = (age) => {
    const ageCheck = document.getElementById('age-error');
    if (parseInt(age, 10) < 16) {
      ageCheck.style.display = 'block';
      return false;
    }
    ageCheck.style.display = 'none';
    return true;
  };

  const validateLocalEmail = (email) => {
    const duplicateEmailCheck = document.getElementById('duplicate-error');
    const user = JSON.parse(localStorage.getItem('data')) || [];
    const emailExist = user.some((obj) => obj.email === email);
    duplicateEmailCheck.style.display = emailExist ? 'block' : 'none';
    return emailExist;
  };

  const validateEmail = (email) => {
    const validEmail = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
    const emailCheck = document.getElementById('email-error');
    if (!validEmail.test(email)) {
      emailCheck.style.display = 'block';
      return false;
    }
    return true;
  };


  return (
    <>
    <div>
      <input type="text" id="myInput" onKeyUp={mySearch} placeholder="search"/>
    </div>
      <table className="table-container">
        <thead>
        <tr>
          <th>Profile Pic</th>
          <th>User Name</th>
          <th>Email</th>
          <th>Gender</th>
          <th>Age</th>
          <th>Stream</th>
          <th>Subjects</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody>
        {userData.length > 0 ? (
          userData.map((user, ind) => (
            <tr key={ind}>
                <td>
                  {user.file ? (
                    <img src={user.file} alt="Profile Pic" />
                  ) : (
                    <p>No Profile Pic</p>
                  )}
                </td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.gender}</td>
                <td>{user.age}</td>
                <td>{user.stream}</td>
                <td>{user.subject ? user.subject : "None"}</td>
                <td>
                  <select
                    value={user.status || "Active"}
                    onChange={(e) => handleStatusChange(ind, e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleEdit(ind)}>Update</button>
                  <button onClick={() => handleDelete(ind)}>Delete</button>
                </td>
              </tr>
          ))
        ) : (
          <tr>
              <td colSpan="9">
                <h1>No data available</h1>
              </td>
            </tr>
        )}
        </tbody>

      </table>
      {editInd !== null && (
        <form className='form-controller' onSubmit={handleSave}>
        <div>Username:
          <input type='text' name="username" value={editData.username} onChange={handleChange} onInput={validateUserName} placeholder='Enter Username' minLength={6} maxLength={20} />
          <span id='username-error' style={{ display: "none" }}>Enter valid username</span>
        </div><br />
        <div>
            Select Gender:
            <select name="gender" value={editData.gender || ""} onChange={handleChange}>
              <option value="">Select</option>
              {genderOptions.map((val, ind) => (
                <option key={ind} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div><br />
        <div>Age:
          <input type='text' name="age" value={editData.age} onChange={handleChange} onInput={validateAge} />
          <span id='age-error' style={{ display: "none" }}>Age must be greater than 16</span>
        </div><br />
        <div>Email:
          <input type='text' name="email" value={editData.email} onChange={handleChange} onInput={validateEmail && validateLocalEmail} />
          <span id='email-error' style={{ display: "none" }}>Enter valid Email</span>
          <span id='duplicate-error' style={{ display: "none" }}>Email already exist</span>
        </div><br />
        <div>
            Stream:
            <label>
              <input
                type="radio"
                name="stream"
                value="PCM"
                checked={editData.stream === "PCM"}
                onChange={handleChange}
              />
              PCM
            </label>
            <label>
              <input
                type="radio"
                name="stream"
                value="Commerce"
                checked={editData.stream === "Commerce"}
                onChange={handleChange}
              />
              Commerce
            </label>
            <label>
              <input
                type="radio"
                name="stream"
                value="Arts"
                checked={editData.stream === "Arts"}
                onChange={handleChange}
              />
              Arts
            </label>
          </div><br />
          <div>
            Subjects:
            {checkOption.map((it) => (
              <label key={it.key}>
                {it.label}
                <input
                  type="checkbox"
                  name="subject"
                  value={it.label}
                  checked={(editData.subject || []).includes(it.label)}
                  onChange={handleChange}
                />
              </label>
            ))}
          </div>
        <button type="submit">Update</button>
      </form>

        // <div>
          
        //   <input type="text" name="username" value={editData.username} onChange={handleChange} />
        //   <input type="email" name="email" value={editData.email} onChange={handleChange} />
        //   <input type="text" name="gender" value={editData.gender} onChange={handleChange} />
        //   <input type="number" name="age" value={editData.age} onChange={handleChange} />
        //   <input type="text" name="stream" value={editData.stream} onChange={handleChange}  />
        //   <input type="text" name="subject" value={editData.subject} onChange={handleChange} />
        //   <button onClick={handleSave}>Save</button>
        // </div>
      )}
    </>
  );
};

export default Display;


