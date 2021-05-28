import {NextApiRequest, NextApiResponse} from "next";

export default async function getPlaces(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== "GET")
            throw new Error('Invalid Request')

        let {inputType} = req.query;

        let placeRes = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${inputType}&key=${process.env.GOOGLE_PLACES_API_KEY}&components=country:in`);
        let resJson = await placeRes.json();
        return res.send(resJson)
    } catch (error) {
        console.error(error)
        res.status(404).send(error.message ? error.message : error.detail)
    }
}
