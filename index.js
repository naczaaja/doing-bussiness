//import
const functions = require("firebase-functions");
const request = require('request-promise');
const admin = require('firebase-admin');
const { user } = require("firebase-functions/lib/providers/auth");
admin.initializeApp(functions.config().firebase);

//-----------------------------------------------------------------------------------

// index variables

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = 
{
  'Content-Type': 'application/json',
  'Authorization': `Bearer zzz+q0gGok7jqT5yCo2EgHQceOeTyLyVeo/oje3Zx1wRVtGl+2hRsYSs+JI/Gw30HFcy5T1DEO53QayXJ1QwQPMjjAkP7eGclHHBgecoII+h0BLfqH1Uy/CUS4r71wMnja9zOAq0kpX2Ctexbz7ANwdB04t89/1O/w1cDnyilFU=`
};
var db = admin.firestore();
const admimUser = 'U7e121ccdb2e6bde87f0ce6b734cbd7b3';
const csList = '6028938e60eeaa20085e4f45'; //ผบค. list
const actList = '6028939797c65d8331a95235'; //ผบป. list
const eqtList = '603c9a325ea84524d0d2e832'; //ผคพ. list
const cstList = '6028def313f7e56f043a2849'; //ผกส. list
const metList = '602893c9a89e1d712af38f54'; //ผมต. list

//------------------------------------------------------------------------------------

exports.infoLineWebhook = functions.https.onRequest(async (req, res) => {
  const userId = req.body.events[0].source.userId;  
  const msgType = req.body.events[0].message.type;
  const inputText = req.body.events[0].message.text;
  const msgRegis = '"ส่งคำขอการยืนยันตัวตนเรียบร้อย โปรดติดต่อ ผบค.กฟอ.กล เพื่อแจ้งเจ้าหน้าที่ต่อไป"';
  const msgRegisRej = 'คุณเคยยืนยันตัวตนกับทางเจ้าหน้าที่แล้ว!';
  const lineIdRef = db.collection('Member');
  const snapshot =  await lineIdRef.get();

  //วน loop ดึงข้อมูล Member collection มาจาก firestore
  snapshot.forEach(doc => {
    LineFunction(doc);
  });

  function LineFunction(doc) {
    const fbLineID = doc.data().lineId;
    
    if (msgType !== 'text') 
    {
      return;
    };
    

    if (inputText === 'Register')
    {
      if (userId !== fbLineID)
      {
        replyRegister(req.body, msgRegis);
        dataSet = {
          'userId': userId
        };
        db.collection('Request_member').doc(req.body.events[0].replyToken).set(dataSet);
      } else {
        replyRegister(req.body, msgRegisRej);
      };
    };

    if (req.body.events[0].message.text === 'Our tasks'){
      if (userId !== fbLineID){
        replyRegister(req.body, 'คุณยังไม่ได้ยืนยันตัวตน โปรดติดต่อ ผบค.กฟอ.กล');
      };
      replyRegister(req.body, 'reply flex message to show all tasks');
    };
  };
});



exports.infoTrelloWebhook = functions.https.onRequest(async (req, res) => {
  const action = req.body.action;
  const translationKey = action.display.translationKey;
  const dataRef = db.collection('Member');
  const CSsnapshot =  await dataRef.where('dep','==','ผบค.').get();
  const ACTsnapshot =  await dataRef.where('dep','==','ผบป.').get();
  const EQTsnapshot =  await dataRef.where('dep','==','ผคพ.').get();
  const CSTsnapshot =  await dataRef.where('dep','==','ผกส.').get();
  const METsnapshot =  await dataRef.where('dep','==','ผมต.').get();
  
  //วน loop ดึงข้อมูล Member collection มาจาก firestore
  CSsnapshot.forEach(doc => {
    CSTrelloFunction(doc);
  });
  ACTsnapshot.forEach(doc => {
    ACTTrelloFunction(doc);
  });
  EQTsnapshot.forEach(doc => {
    EQTTrelloFunction(doc);
  });
  CSTsnapshot.forEach(doc => {
    CSTTrelloFunction(doc);
  });
  METsnapshot.forEach(doc => {
    METTrelloFunction(doc);
  });
  
  function CSTrelloFunction(doc) {
    if(action && translationKey !== 'unknown' && translationKey === 'action_move_card_from_list_to_list')
    {
      const msgReply = `มีงานชื่อ \n\n**${action.data.card.name}** \n\nถูกย้ายเข้ามายังแผนกของคุณ โปรดตรวจสอบ https://trello.com/b/NGMUS7im`;
      const csUser = doc.data().lineId;
      if (action.data.listAfter.id === csList)
      {
        push(csUser,msgReply);
        //push(csUser2,msg);
        return res.status(200).end();
      }  
    }
  };
  
  function ACTTrelloFunction(doc) {
    if(action && translationKey !== 'unknown' && translationKey === 'action_move_card_from_list_to_list')
    {
      const msgReply = `มีงานชื่อ \n\n**${action.data.card.name}** \n\nถูกย้ายเข้ามายังแผนกของคุณ โปรดตรวจสอบ https://trello.com/b/NGMUS7im`;
      const actUser = doc.data().lineId;
      if (action.data.listAfter.id === actList)
      {
        push(actUser,msgReply);
        //push(actUser2,msg);
        return res.status(200).end();
      }
    }
  };
  
  function EQTTrelloFunction(doc) {
    if(action && translationKey !== 'unknown' && translationKey === 'action_move_card_from_list_to_list'){
      const msgReply = `มีงานชื่อ \n\n**${action.data.card.name}** \n\nถูกย้ายเข้ามายังแผนกของคุณ โปรดตรวจสอบ https://trello.com/b/NGMUS7im`;
      const eqtUser = doc.data().lineId;
      if (action.data.listAfter.id === eqtList)
      {
        push(eqtUser,msgReply);
        //push(eqtUser2,msg);
        return res.status(200).end();
      }
    }
  };
  
  function CSTTrelloFunction(doc) {
    if(action && translationKey !== 'unknown' && translationKey === 'action_move_card_from_list_to_list'){
      const msgReply = `มีงานชื่อ \n\n**${action.data.card.name}** \n\nถูกย้ายเข้ามายังแผนกของคุณ โปรดตรวจสอบ https://trello.com/b/NGMUS7im`;
      const cstUser = doc.data().lineId;
      if (action.data.listAfter.id === cstList)
      {
        push(cstUser,msgReply);
        //push(cstUser2,msg);
        return res.status(200).end();
      }
    }  
  };
  
  function METTrelloFunction(doc) {
    if(action && translationKey !== 'unknown' && translationKey === 'action_move_card_from_list_to_list'){
      const msgReply = `มีงานชื่อ \n\n**${action.data.card.name}** \n\nถูกย้ายเข้ามายังแผนกของคุณ โปรดตรวจสอบ https://trello.com/b/NGMUS7im`;
      const metUser = doc.data().lineId;
      if (action.data.listAfter.id === metList)
      {
        push(metUser,msgReply);
        //push(metUser2,msg);
        return res.status(200).end();
      }
    }
  }
});

const push = (res, msg) => {
    return request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API}/push`,
        headers: LINE_HEADER,
        body: JSON.stringify({
        to: res,
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

const replyRegister = (bodyResponse, msg) => {
    return request({
      method: `POST`,
      uri: `${LINE_MESSAGING_API}/reply`,
      headers: LINE_HEADER,
      body: JSON.stringify({
        replyToken: bodyResponse.events[0].replyToken,
        messages: [
          {
            type: `text`,
            text: msg
          }
        ]
      })
    });
  };
