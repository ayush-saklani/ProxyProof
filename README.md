<!-- # **RollCall (v1.0)** <img src="./assets/img/logo_c.png" height="110" align="left"/>
 **A secure, automated attendance system that verifies real student presence through multiple layers of validation.** -->

<p align="center">
    <div align="center">
        <img src="./assets/img/logo_c.png" height="150"/><br>
        <h1>RollCall (v1.0)</h1>
    </div>
</p>

#### **A secure, automated attendance system that verifies real student presence through multiple layers of validation.**

# **Languages, Frameworks and Tools**

<div align="left" style="margin: 10px;">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" height="75"/>
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" height="75"/>
<img src="https://devicon-website.vercel.app/api/nodejs/original.svg" height="75"/>
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg" height="75"/>
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg" height="75"/>
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg" height="75"/>
</div>

# How to run this project

- **Backend ( Server ) -** in terminal `cd backend && npm start` **_( starts the server )_**
- **Frontend -** Open `/frontend` `npm start`**_( starts the development server )_**

#

## ⭐ Features

- [ ] **QR Code Generation & Scanning:** Teachers generate time-limited QR codes for each session, and students scan them to initiate the attendance process.
- [ ] **Geofence Validation:** The system verifies that the student is within the classroom boundaries using their device's location.
- [ ] **Liveness Detection:** A blink-to-capture mechanism using `face-api.js` ensures that the person in front of the camera is a live human, preventing spoofing attacks with static images.
- [ ] **Face Recognition:** The system matches the student's face with their registered profile for an additional layer of identity verification.
- [ ] **Device ID Verification:** The system uses the device's unique ID to prevent students from marking attendance on behalf of others.
- [ ] **Secure & Reliable:** The multi-layered approach makes the system robust against common attendance fraud methods.
