<img src="https://raw.githubusercontent.com/JithinAntony4/Spot-My-Vaccine/main/public/images/banner-logo.png" alt="SpotMyVaccine Banner" align="center" />

<br />
<div align="center">
  <img src="https://img.shields.io/david/JithinAntony4/Spot-My-Vaccine" alt="Dependency Status">  
  <img src="https://github.com/JithinAntony4/Spot-My-Vaccine/actions/workflows/scheduled.yaml/badge.svg" alt="SlotCheck Cron Job">  
  <img src="https://img.shields.io/github/repo-size/JithinAntony4/Spot-My-Vaccine" alt="Repo Size">
  <img src="https://ci.appveyor.com/api/projects/status/fe9b160cp9lb53oj?svg=true" alt="Build Status">
  <img src="https://img.shields.io/twitter/follow/jithinantony333?style=social" alt="Twitter Follow">
</div>
<br />

<div align="center">
  <sub>Created by <a href="https://twitter.com/jithinantony333">Jithin Antony</a></sub>
</div>

## Screenshots
<img width="200" height="400" src="https://raw.githubusercontent.com/JithinAntony4/Spot-My-Vaccine/main/public/demo/splash_screen.jpeg" alt="Splash Screen">
<img width="200" height="400" src="https://raw.githubusercontent.com/JithinAntony4/Spot-My-Vaccine/main/public/demo/home-district-wise.jpeg" alt="Home District Wise">
<img width="200" height="400" src="https://raw.githubusercontent.com/JithinAntony4/Spot-My-Vaccine/main/public/demo/home-pincode-wise.jpeg" alt="Home Pincode Wise">
<img width="200" height="400" src="https://raw.githubusercontent.com/JithinAntony4/Spot-My-Vaccine/main/public/demo/day-wise-list.jpeg" alt="Day Wise List">
<img width="200" height="400" src="https://raw.githubusercontent.com/JithinAntony4/Spot-My-Vaccine/main/public/demo/notification-dashboard.jpeg" alt="Notification Dashboard">
<img width="200" height="400" src="https://raw.githubusercontent.com/JithinAntony4/Spot-My-Vaccine/main/public/demo/notification-dashboard-add-district.jpeg" alt="Add District">

## Features
* Vaccine Slot Checker
* Real-time data
* Typescript Support
* PWA Support


## Installation
To install **Spot-My-Vaccine**, follow these steps:

Download Repo:
``` shell script
git clone https://github.com/JithinAntony4/Spot-My-Vaccine your-project-name
```
Install Dependencies:
``` shell script
npm install
# or
yarn install
```
Add Firebase to your web app:

`Goto Firebase Console -> Project Settings -> General -> your apps`, Click **Add App** 
and download the config which will used in this project.

Download Firebase Admin SDK Config:

`Goto Firebase Console -> Project Settings -> Service accounts -> Firebase Admin SDK`

Click **Generate new private key**, then copy that values and paste into `.env`

Create & Configure `.env`:
``` dotenv
NODE_ENV=[production||development]
TOKEN_SECRET=your_secret_key (which will used for encryt sessions)


AUTH_COOKIE_TOKEN_NAME=cookie_name
AUTH_COOKIE_TOKEN_AGE=28800(in mileseconds)

# use the values from firebase-config.json
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=0123456789
NEXT_PUBLIC_FIREBASE_APP_ID=0123456789
NEXT_PUBLIC_FIREBASE_MESUREMENT_ID=0123456789

PRIVATE_FIREBASE_TYPE=place_your_value
FIREBASE_PRIVATE_KEY_ID=place_your_value
FIREBASE_PRIVATE_KEY=place_your_value
PRIVATE_FIREBASE_CLIENT_EMAIL=place_your_value
PRIVATE_FIREBASE_CLIENT_ID=place_your_value
PRIVATE_FIREBASE_AUTH_URI=place_your_value
PRIVATE_FIREBASE_TOKEN_URI=place_your_value
PRIVATE_FIREBASE_AUTH_PROVIDER_x509_CERT_URL=place_your_value
PRIVATE_FIREBASE_CLIENT_x509_CERT_URL=place_your_value

GOOGLE_AUTH_CLIENT_ID=your_google_auth_client_id (from GCP Console)

API_SECRET_KEY=your_secret_key

```
## Usage

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## Contributing to Spot-My-Vaccine
To contribute to Spot-My-Vaccine, follow these steps:

1. Fork this repository.
2. Create a branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin <project_name>/<location>`
5. Create the pull request.

Alternatively see the GitHub documentation on [creating a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

## License
This project is licensed under the MIT license, Copyright (c) 2021 Jithin Antony. For more information see LICENSE.md.
