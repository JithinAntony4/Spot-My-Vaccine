'use strict'

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

let localforage = require('localforage');

async function sendNotification({title, body}) {
    try {
        console.log('navigator', navigator);
        if (Notification.permission === 'granted')
            if (navigator.serviceWorker)
                navigator.serviceWorker.getRegistration().then(async function (reg) {
                    if (reg)
                        await reg.showNotification(title, {
                            body: body,
                        });
                });
            else
                navigator.serviceWorker.ready.then(async reg => {
                    console.log('got it ', reg)
                    await reg.showNotification(title, {
                        body: body,
                    });
                })
        else
            console.log('Notification.permission', Notification.permission)
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
        console.log(body);
        body.centers.forEach(center => {
            center.sessions.forEach(session => {
                let availableCapacity = !isNaN(session.available_capacity) ? session.available_capacity : 0;
                console.log('availableCapacity', availableCapacity)
                if (availableCapacity > 0) {
                    sendNotification({
                        body: `New ${availableCapacity} sessions is available at ${center.name} (${session.date}).Age: ${session.min_age_limit}`,
                        title: `New Slots at ${district.name} (${session.date})`
                    })
                    console.log(`New ${availableCapacity} sessions is available at ${center.name} (${session.date}).Age: ${session.min_age_limit}`)
                }
            })
        })
        console.log('Completed')
    } catch (e) {
        console.log(e.message)
    }
}

setInterval(checkSlots, 60000 * 1);


self.addEventListener('message', event => {
    console.log(event.data)
})
