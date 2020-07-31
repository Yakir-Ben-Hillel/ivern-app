"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = exports.login = exports.FBAuth = void 0;
const firebase_1 = require("../firebase");
const admin = require("firebase-admin");
admin.initializeApp();
const database = admin.firestore();
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
exports.FBAuth = async (req, res, next) => {
    let idToken;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    }
    else {
        console.error('No token found.');
        return res.status(403).json({ error: 'Unauthorized.' });
    }
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        const data = await database
            .collection('users')
            .where('uid', '==', req.user.uid)
            .limit(1)
            .get();
        req.user.handle = data.docs[0].data().handle;
        return next();
    }
    catch (error) {
        console.error('Error while verifying token', error);
        res.status(403).json(error);
    }
};
exports.login = async (req, res) => {
    var _a;
    const user = {
        email: req.body.email,
        password: req.body.password,
    };
    try {
        const data = await firebase_1.firebase
            .auth()
            .signInWithEmailAndPassword(user.email, user.password);
        const token = await ((_a = data.user) === null || _a === void 0 ? void 0 : _a.getIdToken());
        return res.json({ token });
    }
    catch (error) {
        console.log(error);
        if (error.code === 'auth/wrong-password') {
            return res.status(403).json({ password: 'The password is incorrect.' });
        }
        else if (error.code === 'auth/user-not-found') {
            return res
                .status(403)
                .json({ email: 'The user has not been found, please signup.' });
        }
        else if (error.code === 'auth/invalid-email') {
            return res.status(400).json({ email: 'The email address is invalid.' });
        }
        else
            return res.status(500).json({ general: 'Something went wrong!' });
    }
};
exports.signup = async (req, res) => {
    var _a, _b;
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    };
    const doc = await database.doc(`/users/${newUser.email}`).get();
    if (doc.exists)
        return res.status(400).json({ handle: 'This user already exists' });
    try {
        const data = await firebase_1.firebase
            .auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password);
        const uid = (_a = data.user) === null || _a === void 0 ? void 0 : _a.uid;
        const token = await ((_b = data.user) === null || _b === void 0 ? void 0 : _b.getIdToken());
        const userCredentials = {
            email: newUser.email,
            createdAt: newUser.createdAt,
            imageURL: 'https://firebasestorage.googleapis.com/v0/b/ivern-app.appspot.com/o/no-img.png?alt=media',
            handle: uid,
            uid,
        };
        await database.doc(`/users/${uid}`).set(userCredentials);
        return res.status(201).json({ token });
    }
    catch (error) {
        console.error(error);
        if (error.code === 'auth/email-already-in-use') {
            return res.status(400).json({ email: 'Email is already is use.' });
        }
        else if (error.code === 'auth/invalid-email') {
            return res.status(400).json({ email: 'The email address is invalid.' });
        }
        else if (error.code === 'auth/weak-password') {
            return res
                .status(400)
                .json({ password: 'Password should be at least 6 characters' });
        }
        else {
            return res
                .status(500)
                .json({ general: 'Something went wrong, please try again.' });
        }
    }
};
//# sourceMappingURL=sign_methods.js.map