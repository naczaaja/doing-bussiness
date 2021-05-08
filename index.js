const functions = require("firebase-functions"); // The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const request = require('request-promise');
const admin = require('firebase-admin'); // The Firebase Admin SDK to access Firestore.
admin.initializeApp();
const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer zzz+q0gGok7jqT5yCo2EgHQceOeTyLyVeo/oje3Zx1wRVtGl+2hRsYSs+JI/Gw30HFcy5T1DEO53QayXJ1QwQPMjjAkP7eGclHHBgecoII+h0BLfqH1Uy/CUS4r71wMnja9zOAq0kpX2Ctexbz7ANwdB04t89/1O/w1cDnyilFU=`
};
const unirest = require('unirest');
const { firestore } = require("./node_modules/firebase-admin/lib/index");

const csUser = 'U7e121ccdb2e6bde87f0ce6b734cbd7b3';

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
        return push(action);
    } else {
        res.status(200).send('ok_naka');
    }
});

const push = bodyResponse => {
    return request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API}/push`,
        headers: LINE_HEADER,
        body: JSON.stringify({
            to: csUser,
            messages: [
                {
                    type: `text`,
                    text: JSON.stringify(bodyResponse)
                }
            ]
        })
    }).then(() => {
        return res.status(200).send(`Done`);
    }).catch((error) => {
        return Promise.reject(error);
    });
}
