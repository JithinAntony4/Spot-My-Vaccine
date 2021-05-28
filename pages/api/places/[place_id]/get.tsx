import {NextApiRequest, NextApiResponse} from "next";

export default async function getPlace(req: NextApiRequest, res: NextApiResponse) {
    try {

        if (req.method !== "GET")
            throw new Error('Invalid Request')

        let {place_id} = req.query;
        let placeRes = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${process.env.GOOGLE_PLACES_API_KEY}`);
        let resJson = await placeRes.json();
        return res.send(resJson);
    } catch (error) {
        console.error(error)
        res.status(404).send(error.message ? error.message : error.detail)
    }
}
