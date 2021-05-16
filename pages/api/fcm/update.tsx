import {NextApiRequest, NextApiResponse} from "next";
import {TokenPayload} from "google-auth-library/build/src/auth/loginticket";
import {getSession} from "../../../lib/iron";
import {initFirebaseAdmin} from "../../../lib/firebase-admin";

const admin = require("firebase-admin");

export default async function updateUserFCM(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session: TokenPayload = await getSession(req)
        // if (!session) return res.status(401).send("Unauthorized Access")
        // let email = session.email;
        let fcmToken = req.body.fcmToken;
        await initFirebaseAdmin();

        let response = await admin.messaging().subscribeToTopic(fcmToken, 'AllUser');
        console.log('Successfully subscribed to topic:', response);
        return res.send("Success")
    } catch (error) {
        console.error(error)
        res.status(400).send(error.message ? error.message : error.detail)
    }
}
