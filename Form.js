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

  const handleRadioChange = (val) => {
    setSelectedValue(val);
    document.getElementById('stream-error').style.display = 'none';
  };

  const handleSubjectChange = (val) => {
    updateMap(val.target.name, val.target.checked);
    document.getElementById('subject-error').style.display = 'none';
  };

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
    setFile(val.target.files[0]); 
  };

  const validateField = (field, regex, errorId) => {
    const isValid = regex.test(field);
    document.getElementById(errorId).style.display = isValid ? 'none' : 'block';
    return isValid;
  };


  const validateUserName = (username) =>
    validateField(username, /^[a-z0-9]+$/i, 'username-error');

  const comparePassword = (password, confirmPassword) => {
    const isValid = password === confirmPassword;
    document.getElementById('cPassword-error').style.display = isValid ? 'none' : 'block';
    return isValid;
  };

  const validateRequiredFields = () => {
    let isValid = true;

    if (!gender) {
      document.getElementById('gender-error').style.display = 'block';
      isValid = false;
    }

    if (!selectedValue) {
      document.getElementById('stream-error').style.display = 'block';
      isValid = false;
    }

    if (subject.size === 0) {
      document.getElementById('subject-error').style.display = 'block';
      isValid = false;
    }

    return isValid;
  };

  const handleGenderChange = (val) => {
    setGender(val);
    document.getElementById('gender-error').style.display = val === 'select' ? 'block' : 'none';
  };

  const validateLocalEmail = (email) => {
    const duplicateEmailCheck = document.getElementById('duplicate-error');
    const user = JSON.parse(localStorage.getItem('data')) || [];
    const emailExist = user.some((obj) => obj.email === email);
    duplicateEmailCheck.style.display = emailExist ? 'block' : 'none';
    return emailExist;
  };

  const validateEmail = (email) =>
    validateField(email, /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/, 'email-error');

  const validateAge = (age) => {
    const isValid = parseInt(age, 10) >= 16;
    document.getElementById('age-error').style.display = isValid ? 'none' : 'block';
    return isValid;
  };

  const validatePassword = (password) =>
    validateField(password, /^[a-zA-Z0-9!@#$%^&*]{6,16}$/, 'password-error');

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
    setAge('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setSubject(new Map());
    setFile(null);
    setSelectedValue('');
    setGender('');
    if (genderInputRef.current) {
      genderInputRef.current.value = '';
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
      validateRequiredFields()
    ) {
      const userData = {
        username: userName,
        email,
        gender,
        age,
        stream: selectedValue,
        file,
        subject: [...subject],
      };
      const user = JSON.parse(localStorage.getItem('data')) || [];
      user.push(userData);
      localStorage.setItem('data', JSON.stringify(user));
      handleClear();
      navigate('/display');
    }
  };
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
      <div>
          Username:
          <input type='text' value={userName} onChange={(e) => setUserName(e.target.value)} placeholder='Enter Username' minLength={6} maxLength={20} />
          <span id='username-error' style={{ display: 'none' }}>Enter valid username</span>
        </div><br />
        <div>
          Select Gender:
          <select ref={genderInputRef} onChange={(e) => handleGenderChange(e.target.value)}>
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <span id='gender-error' style={{ display: 'none', color: 'red' }}>Select your gender</span>
        </div><br />
        <div>
          Age:
          <input type='text' value={age} onChange={(e) => setAge(e.target.value)} />
          <span id='age-error' style={{ display: 'none', color: 'red' }}>Age must be greater than 16</span>
        </div><br />
        <div>
          Email:
          <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
          <span id='email-error' style={{ display: 'none', color: 'red' }}>Enter valid Email</span>
        </div><br />
        <div>
          Stream:
          <input type='radio' checked={selectedValue === 'PCM'} onChange={() => handleRadioChange('PCM')} />PCM
          <input type='radio' checked={selectedValue === 'Commerce'} onChange={() => handleRadioChange('Commerce')} />Commerce
          <input type='radio' checked={selectedValue === 'Arts'} onChange={() => handleRadioChange('Arts')} />Arts
          <span id='stream-error' style={{ display: 'none', color: 'red' }}>Select a stream</span>
        </div><br />
        <div>
          Subject:
          {checkOption.map((it) => (
            <label key={it.key}>
              {it.label}
              <input type='checkbox' name={it.name} checked={subject.has(it.name)} onChange={handleSubjectChange} />
            </label>
          ))}
          <span id='subject-error' style={{ display: 'none', color: 'red' }}>Select at least one subject</span>
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
