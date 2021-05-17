'use strict'
//Firebase Messaging
// import firebase from "firebase/app";

importScripts('https://www.gstatic.com/firebasejs/8.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.5.0/firebase-messaging.js');
importScripts('/localforage.min.js');

function getCurrentFormattedDate() {
    try {
        let date = new Date();
        let dateEle = date.toISOString().split('T')[0];
        let reverse = dateEle.split('-').reverse();
        return reverse.join('-');
    } catch (e) {
        console.log(e.message);
        return ""
    }
}

// let localforage = require('localforage');

async function sendNotification({title, body}) {
    try {
        if (Notification.permission === 'granted')
            await self.registration.showNotification(title, {body: body});
    } catch (e) {
        console.log(e.message)
    }
}

async function checkSlots() {
    try {
        const districts = await localforage.getItem('districts');
        if (!districts) return;
        if (districts.length <= 0) return;
        let district = districts[0];
        let date = getCurrentFormattedDate();
        let response = await fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${district.id}&date=${date}`);
        if (response.status !== 200) return;
        let body = await response.json();
        body.centers.forEach(center => {
            if (district.isPaid && center.fee_type !== "Paid") return;
            if (district.isFree && center.fee_type !== "Free") return;
            center.sessions.forEach(session => {
                if (district.underFortyFive && session.min_age_limit !== 18) return;
                if (district.aboveFortyFive && session.min_age_limit !== 45) return;
                if (district.isCovaxin && session.vaccine !== "COVAXIN") return;
                if (district.isCovisheild && session.vaccine !== "COVISHIELD") return;
                if (district.isSputnikV && session.vaccine !== "SPUTNIKV") return;
                let availableCapacity = !isNaN(session.available_capacity) ? session.available_capacity : 0;
                if (availableCapacity > 0) {
                    sendNotification({
                        body: `New ${availableCapacity} sessions is available at ${center.name} (${session.date}).Age: ${session.min_age_limit}`,
                        title: `New Slots at ${district.name} (${session.date})`
                    })
                }
            })
        })
    } catch (e) {
        console.log(e.message)
    }
}

if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyDe2oLkWcbWuqqWGKSqqcaduc0O9W-3m-k",
        authDomain: "vaccine-booking.firebaseapp.com",
        projectId: "vaccine-booking",
        storageBucket: "vaccine-booking.appspot.com",
        messagingSenderId: "654614858619",
        appId: "1:654614858619:web:dc43cf94cf64454ba7cbde",
        measurementId: "G-WVSWNT194M"
    });
}
firebase.messaging();

//background notifications will be received here
firebase.messaging().onBackgroundMessage(async message => {
    if (message.data.type === "checkSlot") {
        await checkSlots()
    } else {
        if (Notification.permission === 'granted') {
            if (navigator.serviceWorker)
                navigator.serviceWorker.getRegistration().then(async function (reg) {
                    if (reg)
                        await reg.showNotification(message.notification.title, {
                            body: message.notification.body,
                            icon: "/images/icon-512x512.png",
                            badge: "/images/icon-512x512.png",
                            actions: [
                                {
                                    action: 'booking',
                                    title: 'Book your slot'
                                }
                            ],
                            renotify: true,
                        });
                });
        }
    }
})
self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    if (event.action === 'booking') {
        clients.openWindow('https://selfregistration.cowin.gov.in/');
    } else {
        // Main body of notification was clicked
    }
}, false);
