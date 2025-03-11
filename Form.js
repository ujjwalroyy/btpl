import React, { useEffect, useRef, useState } from 'react'
import Display from './Display';
import { useNavigate } from 'react-router-dom';

const Form = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const [userName, setUserName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [subject, setSubject] = useState(new Map());
  const [file, setFile] = useState(null);
  const [sub, setSub] = useState('');
  const fileInputRef = useRef(null);
  const genderInputRef = useRef()
  const navigate = useNavigate()

  const data = {
    username: userName,
    email,
    gender,
    age,
    stream: selectedValue,
    file,
    subject: [...subject],
  };

  const handleRadioChange = (val) => setSelectedValue(val);

  const handleNameChange = (val) => {
    setUserName(val.target.value);
    document.getElementById('username-error').style.display = 'none';
  };

  const handleAgeChange = (val) => {
    const ageVal = val.target.value;
    if (/^\d*$/.test(ageVal)) {
      setAge(ageVal);
    }
    const ageCheck = document.getElementById('age-error');
    if (parseInt(ageVal, 10) > 16) {
      ageCheck.style.display = 'none';
    }
  };

  const handleEmailChange = (val) => {
    setEmail(val.target.value);
    document.getElementById('email-error').style.display = 'none';
    document.getElementById('duplicate-error').style.display = 'none';
  };

  const handlePasswordChange = (val) => {
    setPassword(val.target.value);
    document.getElementById('password-error').style.display = 'none';
  };

  const handleConfirmPasswordChange = (val) => {
    setConfirmPassword(val.target.value);
    document.getElementById('cPassword-error').style.display = 'none';
  };

  const checkOption = [
    { name: 'physics ', key: 'physics', label: 'Physics' },
    { name: 'chemistry ', key: 'chemistry', label: 'Chemistry' },
    { name: 'math ', key: 'math', label: 'Math' },
    { name: 'biology ', key: 'bio', label: 'Biology' },
  ];

  const updateMap = (key, value) => {
    setSubject((map => {
      const newMap = new Map(map)
      if (newMap.has(key)) {
        newMap.delete(key)
      }
      else {
        newMap.set(key, value)
      }
      return newMap;
    }
      // new Map(map.set(key, value))
    ))
  }

  const handleProfilePic = (val) => {
    console.log("Val---------------", val.target.value);

    const file = val.target.value
    setFile(file)

  }

  const handleSubjectChange = (val) => updateMap(val.target.name, val.target.checked);

  const validateUserName = (username) => {
    const validUserName = /^[a-z0-9]+$/i;
    const usernameError = document.getElementById('username-error');
    if (!validUserName.test(username)) {
      usernameError.style.display = 'block';
      return false;
    }
    return true;
  };

  const comparePassword = (password, confirmPassword) => {
    const comPass = document.getElementById('cPassword-error');
    if (password !== confirmPassword) {
      comPass.style.display = 'block';
      return false;
    }
    return true;
  };

  const handleGenderChange = (val) => {
    console.log(val, "-");

    const genderError = document.getElementById('gender-error');
    if (val === 'select') {
      setGender(val);
      genderError.style.display = 'block';
      return false;
    }
    genderError.style.display = 'none';
    setGender(val);
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

  const validateAge = (age) => {
    const ageCheck = document.getElementById('age-error');
    if (parseInt(age, 10) < 16) {
      ageCheck.style.display = 'block';
      return false;
    }
    ageCheck.style.display = 'none';
    return true;
  };

  const validatePassword = (password) => {
    const validPass = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    const passCheck = document.getElementById('password-error');
    if (!validPass.test(password)) {
      passCheck.style.display = 'block';
      return false;
    }
    return true;
  };

  function submitFormHandler() {
    if (validateUserName(userName) && validateEmail(email) && validateAge(age)) {
      setSub('true')
    }
    else {
      // console.log("Empty fields", validateUserName(userName));
      // console.log("Empty fields", validateEmail(email));
      // console.log("Empty fields", validateAge(age));
      // console.log("Empty fields", validatePassword(password));
      // console.log("Empty fields", comparePassword(password, confirmPassword));
      setSub('false')
    }
  }

  const genderOptions = ['Male', 'Female', 'Other']


  const handleClear = () => {
    setUserName('');
    // setGender('');
    if(genderInputRef.current){
      genderInputRef.current.value = ""
    }
    setAge('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setSubject(new Map());
    setFile(null)
    setSelectedValue('');
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  const storeData = (e) => {
    e.preventDefault();
    if (
      validateUserName(userName) &&
      validateEmail(email) &&
      validateAge(age) &&
      validatePassword(password) &&
      comparePassword(password, confirmPassword) &&
      handleGenderChange(gender) &&
      !validateLocalEmail(email)
    ) {
      setSub('true');
      const user = JSON.parse(localStorage.getItem('data')) || [];
      user.push(data);
      localStorage.setItem('data', JSON.stringify(user));
      handleClear();
      navigate("/display")
      console.log("Submited", validateUserName(userName));
      console.log("Submited", validateEmail(email));
      console.log("Submited", validateAge(age));
      console.log("Submited", validatePassword(password));
      console.log("Submited", comparePassword(password, confirmPassword));
      console.log("Submited", handleGenderChange(gender));
      console.log("Submited", validatePassword(password));
      console.log("Submited", handleGenderChange(gender));

    }
    else {
      console.log("Empty fields", validateUserName(userName));
      console.log("Empty fields", validateEmail(email));
      console.log("Empty fields", validateAge(age));
      console.log("Empty fields", validatePassword(password));
      console.log("Empty fields", comparePassword(password, confirmPassword));
      console.log("Empty fields", handleGenderChange(gender));
      console.log("Empty fields", validatePassword(password));
      console.log("Empty fields", handleGenderChange(gender));
      setSub('false')
    }
  }
  // function showData() {
  //   temp.map(function (val, ind) {
  //     console.log("------", val.email);

  //   })
  // }
  // function showData(){
  //   for(let it of Object.entries(temp)){
  //     let cnt = 0;
  //     console.log("it ---", it[1]);
  //     for(let val in it[1]){
  //       props[cnt+=1]
  //       cnt++;
  //       console.log("val------", it[1][val], "ind", cnt);

  //     }
  //   }
  // }

  return (
    <>
      <form className='form-controller' onSubmit={storeData}>
        <div>Username:
          <input type='text' value={userName} onChange={handleNameChange} onInput={validateUserName} placeholder='Enter Username' minLength={6} maxLength={20} />
          <span id='username-error' style={{ display: "none" }}>Enter valid username</span>
        </div><br />
        <div>Select Gender:
          <select ref={genderInputRef} onChange={(e) => handleGenderChange(e.target.value)}>
            <option value={""} >select</option>
            {genderOptions.map((val, ind) => (
              <option key={ind}>{val}</option>
            ))}
          </select>
          <span id='gender-error' style={{ display: "none" }}>Select your gender</span>
        </div><br />
        <div>Age:
          <input type='text' value={age} onChange={handleAgeChange} onInput={validateAge} />
          <span id='age-error' style={{ display: "none" }}>Age must be greater than 16</span>
        </div><br />
        <div>Email:
          <input type='text' value={email} onChange={handleEmailChange} onInput={validateEmail && validateLocalEmail} />
          <span id='email-error' style={{ display: "none" }}>Enter valid Email</span>
          <span id='duplicate-error' style={{ display: "none" }}>Email already exist</span>
        </div><br />
        <div>Stream:
          <input type='radio' value={selectedValue} checked={selectedValue === "PCM"} onChange={() => {
            handleRadioChange("PCM")
          }} />PCM
          <input type='radio' value={selectedValue} checked={selectedValue === "Commerce"} onChange={() => {
            handleRadioChange("Commerce")
          }} />Commerce
          <input type='radio' value={selectedValue} checked={selectedValue === "Arts"} onChange={() => {
            handleRadioChange("Arts")
          }} />Arts
        </div><br />
        <div>Subject: {subject.get('physics')}
          {checkOption.map(it => (
            <label key={it.key}>
              {it.label}
              <input type='checkbox' name={it.name} checked={subject.get(it.name) ? true : false} onChange={handleSubjectChange} />
              <span id='subject-error' style={{ display: "none" }}>Enter valid password</span>
            </label>
          ))}
        </div>
        <div>Password:
          <input type='text' value={password} onChange={handlePasswordChange} onInput={validatePassword} />
          <span id='password-error' style={{ display: "none" }}>Enter valid password</span>
        </div>
        <div>Confirm Password:
          <input type='text' value={confirmPassword} onChange={handleConfirmPasswordChange} onInput={comparePassword} />
          <span id='cPassword-error' style={{ display: "none" }}>password and confirm password not matched</span>
        </div>
        <div>Profile Photo:
          <input type='file' ref={fileInputRef} onChange={handleProfilePic} />
        </div>
        <button>Submit</button>
      </form>
      <div>
        {/* <button>Submit</button> */}
        {/* <button onClick={handleClear}>Clear</button> */}
      </div>
    </>
  )
}

export default Form
