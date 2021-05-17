import {NextApiRequest, NextApiResponse} from "next";

const admin = require("firebase-admin");

export default async function initCron(req: NextApiRequest, res: NextApiResponse) {
    let apisecretkey = req.headers.API_SECRET_KEY;
    if (apisecretkey === process.env.API_SECRET_KEY) {
        try {
            const topic = 'AllUser';

            const message = {
                data: {
                    score: '850',
                    type: 'checkSlot',
                    time: '2:45'
                },
                topic: topic
            };

            // Send a message to devices subscribed to the provided topic.
            let response = await admin.messaging().send(message);
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
            return res.send("Success")
        } catch (e) {
            console.log(e.message)
            return res.status(400).json(e.message)
        }

    } else
        res.status(401).send("Unauthenticated access")
}
