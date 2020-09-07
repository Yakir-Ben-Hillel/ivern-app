import { FBAuth, login, signup, signupWithGoogle } from './utils/sign_methods';
import { getUser, userUpdate } from './utils/user_methods';
import {
  postAllPS4games,
  searchUnfoundGame,
  searchGameInDatabase,
  addGameToDatabase,
  updateGames,
  getAllGames,
  updateArtworks,
  updateGamesFunc,
} from './utils/games_methods';
import {
  addPost,
  getPost,
  editPost,
  deletePost,
  getAllGamePosts,
  getAllUserPosts,
  getAllPosts,
  getCustomPostsRequest,
  getAllPlatformPosts,
} from './utils/posts_methods';
import { changeProfileImage, uploadImage } from './utils/file_upload';
import functions = require('firebase-functions');
import admin = require('firebase-admin');
import express = require('express');
import cors = require('cors');
const app = express();
export const database = admin.firestore();
//projects handlers.
app.use(cors());
//user endpoints.
app.get('/user/:uid', getUser);
app.post('/login', login);
app.post('/signup', signup);
app.post('/signup/google', signupWithGoogle);
app.post('/user', FBAuth, userUpdate);
app.post('/image', uploadImage);
app.post('/users/image', FBAuth, changeProfileImage);
//Games endpoints.
app.get('/games', getAllGames);
app.get('/games/:gameName', searchGameInDatabase);
app.get('/games/api/:gameName', searchUnfoundGame);
app.post('/games', postAllPS4games);
app.post('/games/artworks', updateArtworks);
app.post('/games/add', addGameToDatabase);
app.post('/games/update', updateGamesFunc);
//Posts endpoints.
app.get('/posts/get', getAllPosts);
app.get('/posts/get/platform/:platform', getAllPlatformPosts);
app.get('/posts/get/custom', getCustomPostsRequest);
app.get('/posts/get/one/:pid', getPost);
app.get('/posts/get/game/:gid', getAllGamePosts);
app.get('/posts/get/user/:uid', getAllUserPosts);
app.post('/posts/add', FBAuth, addPost);
app.post('/posts/edit/:pid', FBAuth, editPost);
app.delete('/posts/delete/:pid', FBAuth, deletePost);

exports.api = functions.region('europe-west3').https.onRequest(app);
exports.updateGamesEachDay = functions
  .region('europe-west3')
  .pubsub.schedule('0 0 * * *')
  .timeZone('Israel/Tel_Aviv')
  .onRun(updateGames);
