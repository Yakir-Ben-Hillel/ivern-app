import { RequestCustom } from './project_methods';
import { database } from '../index';
import functions = require('firebase-functions');
export const userUpdate = async (request, res) => {
  const req = request as RequestCustom;
  const userDetails = {
    fullName: req.body.fullName,
    location: req.body.location,
  };
  const reducedDetails: { fullName: any; location: any } = {
    fullName: null,
    location: null,
  };
  if (!isEmpty(userDetails.fullName.trim()))
    reducedDetails.fullName = userDetails.fullName;
  if (!isEmpty(userDetails.location.trim()))
    reducedDetails.location = userDetails.location;
  try {
    await database.doc(`users/${req.user.handle}`).update(reducedDetails);
    return res.status(201).json({ message: 'Details added sucessesfuly.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.code });
  }
};
export const getUser = async (req, res) => {
  try {
    const user = await database.doc(`/users/${req.params.uid}`).get();
    if (!user.exists)
      return res.status(404).json({ error: 'User does not exist.' });
    return res.status(200).json(user.data());
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.code });
  }
};
export const userUpdateListener = functions
  .region('europe-west3')
  .firestore.document('/users/{uid}')
  .onUpdate(async (change) => {
    const batch = database.batch();
    let docs = await database
      .collection('/projects')
      .where('users', 'array-contains', change.before.data())
      .get();
    docs.forEach(async (doc) => {
      const data = await database.doc(`/projects/${doc.id}`).get();
      const users: any[] = data.data()?.users;

      const index = users.findIndex(
        (item) => item.uid === change.before.data().uid
      );
      users.splice(index, 1);
      users.splice(index, 0, change.after.data());
      const project = database.doc(`projects/${doc.id}`);
      batch.update(project, {
        users,
      });
    });
    docs = await database
      .collection('/missions')
      .where('user.uid', '==', change.before.data().uid)
      .get();
    docs.forEach((doc) => {
      const mission = database.doc(`/missions/${doc.id}`);
      batch.update(mission, { user: change.after.data() });
    });
    docs = await database
      .collection('/comments')
      .where('user.uid', '==', change.before.data().uid)
      .get();
    docs.forEach((doc) => {
      const comment = database.doc(`/comments/${doc.id}`);
      batch.update(comment, { user: change.after.data() });
    });
    return batch.commit();
  });
