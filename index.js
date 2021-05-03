// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require("firebase-functions"); // The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const request = require('request-promise');
const admin = require('firebase-admin'); // The Firebase Admin SDK to access Firestore.
admin.initializeApp();
const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
};
const unirest = require('unirest');
const { firestore } = require("./node_modules/firebase-admin/lib/index");

exports.webhookTrello = functions.https.onRequest(async (req, res) => {
    const action = req.body.action;
    if (action && action.display.translationKey !== 'unknown') {
        const data = {
            'action': action,
            'changeTime': Date.now() + 25200000,
        }
        const board = action.data.board;
        const card = action.data.card;
        board.changeTime = Date.now() + 25200000;
        await admin.firestore().collection('board').doc(action.data.board.id).set(board);
        await admin.firestore().collection('card').doc(action.data.card.id).set(card);
        await admin.firestore().collection('change').doc(action.id).set(data);

        const taskName = 'ชื่องาน:' + card.name + ' ได้ถูกย้ายเข้ามาใน list ของแผนกคุณแล้ว';
        return push(res, taskName);
    }
    res.status(200).send('ok_naka');
});

const push = (res, msg) => {
    return request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API}/push`,
        headers: LINE_HEADER,
        body: JSON.stringify({
            to: `zzzzz`,
            messages: [
                {
                    type: `text`,
                    text: msg
                }
            ]
        })
    }).then(() => {
        return res.status(200).send(`Done`);
    }).catch((error) => {
        return Promise.reject(error);
    });
}
