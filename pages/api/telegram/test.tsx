import {NextApiRequest, NextApiResponse} from "next";
import {getCurrentFormattedDate} from "../../../lib/dateUtils";

export default async function telegramTest(req: NextApiRequest, res: NextApiResponse) {
    try {
        let date = getCurrentFormattedDate();
        let district_id = 303;
        let response = await fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${district_id}&date=${date}`);
        return res.send(`${response.status} ${await response.text()}`);
    } catch (e) {
        console.log(e.message);
        return res.send(e.message);
    }
}
