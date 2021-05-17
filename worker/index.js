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

setInterval(checkSlots, 60000)

async function sendNotification({title, body}) {
    try {
        if (Notification.permission === 'granted')
            await self.registration.showNotification(title, {body: body});
    } catch (e) {
        console.log(e.message)
    }
}
