import {NextApiRequest, NextApiResponse} from "next";
import {initFirebaseAdmin} from "../../../lib/firebase-admin";

const admin = require("firebase-admin");

export default async function initCron(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== "POST") return res.status(401).send("Unauthenticated access")
        const ACTION_KEY = req.headers.authorization.split(" ")[1];
        if (ACTION_KEY === process.env.API_SECRET_KEY) {
            const topic = 'AllUser';
            const message = {
                data: {
                    type: 'checkSlot',
                },
                topic: topic
            };
            await initFirebaseAdmin();
            // Send a message to devices subscribed to the provided topic.
            let response = await admin.messaging().send(message);
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
            return res.send("Success")

        } else
            res.status(401).send("Unauthenticated access")
    } catch (e) {
        console.log(e.message)
        return res.status(400).json(e.message)
    }
}
