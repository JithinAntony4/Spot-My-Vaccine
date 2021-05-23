import {NextApiRequest, NextApiResponse} from "next";
import {getCurrentFormattedDate} from "../../../lib/dateUtils";

export default async function telegramTest(req: NextApiRequest, res: NextApiResponse) {
    try {
        let date = getCurrentFormattedDate();
        let district_id = 303;
        let response = await fetch("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=307&date=23-05-2021", {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9,ml;q=0.8",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
                "sec-ch-ua-mobile": "?0",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site"
            },
            "referrer": "https://www.spotmyvaccine.in/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors"
        });
        return res.send(`${response.status} ${await response.text()}`);
    } catch (e) {
        console.log(e.message);
        return res.send(e.message);
    }
}
