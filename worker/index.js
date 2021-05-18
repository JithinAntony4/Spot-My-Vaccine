'use strict'

import {isFilteredCenter, isFilteredSession} from "../lib/utils";

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
            if (!isFilteredCenter({isFree: district.isFree, isPaid: district.isPaid, center: center})) return;
            center.sessions.forEach(session => {
                if (!isFilteredSession({
                    underFortyFive: district.underFortyFive,
                    aboveFortyFive: district.aboveFortyFive,
                    session: session,
                    isCovaxin: district.isCovaxin,
                    isCovisheild: district.isCovisheild,
                    isSputnikV: district.isSputnikV
                })) return;
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
            await self.registration.showNotification(title, {
                body: body, icon: "/images/icon-512x512.png",
                tag: 'slot',
                badge: "/images/icon-512x512.png",
                actions: [
                    {
                        action: 'booking',
                        title: 'Book your slot'
                    }
                ],
                renotify: true,
            });
    } catch (e) {
        console.log(e.message)
    }
}
