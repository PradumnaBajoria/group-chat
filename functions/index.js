const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const Filter = require("bad-words");

const admin = require("firebase-admin");
admin.initializeApps();

const db = admin.firestore();

exports.detectEvilUsers = functions.firestore
    .document("messages/{msgId}")
    .onCreate(async (doc, ctx) => {

        const filter = new Filter();
        const {text, uid} = doc.data();

        if(filter.isProfane(text)){
            const cleaned = filter.clean(text);
            await doc.ref.update({text: `Oops! I got banned(don't make same mistake as me....) ${cleaned}`});
            await db.collection("banned").db(uid).set({});
        }

    });