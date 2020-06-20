/* eslint-disable no-async-promise-executor */
/* eslint-disable import/no-mutable-exports */
import { get, isEmpty } from 'lodash';
import * as firebase from 'firebase/app';
import firebaseErrors from './firebase/errors';
import { setCookie, getCookie } from './session';
// Firebase services
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

const isServer = typeof window === 'undefined';
const isProd = process.env.NODE_ENV === 'production';

const config = {
  apiKey: process.env.FIREBASE_APP_API_KEY,
  authDomain: process.env.FIREBASE_APP_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_APP_DATABASE_URL,
  projectId: process.env.FIREBASE_APP_PROJECT_ID,
  storageBucket: process.env.FIREBASE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_APP_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

let auth = null;
let firestore = null;
let analytics = null;

class Firebase {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    if (!isServer && isProd) {
      this.analytics = firebase.analytics();
      this.analytics.logEvent('alive');
    }
    this.auth = firebase.auth();
    this.db = firebase.firestore();
    auth = this.auth;
    firestore = this.db;
    analytics = this.analytics;
  }

  /**
   * Return if user is auth
   */
  isAuthUser = () => {
    return this.auth.currentUser !== null;
  };

  /**
   * Return auth user
   */
  authUser = () => this.auth.currentUser;

  /**
   * Return ref for any collection
   */
  getRef = ({ collection, doc }) => this.db.collection(collection).doc(doc);

  /**
   * Return auth user ref
   */
  authRef = () => {
    const authUser = this.authUser();
    if (!authUser) {
      return null;
    }
    return this.getRef({ collection: 'users', doc: authUser.uid });
  };

  /**
   * Universal Query to firebase collections
   * @param collection [collection name]
   * @param orderBy? [orderBy clausure, object { field, op }]
   * @param startAt? [startAt] pagination startAt
   * @param limit [limit of collection data]
   * @param where [where clausure, object { field, op, value }]
   */
  query = ({ collection, orderBy = null, startAt = null, limit = 20, where } = {}) => {
    let ref = this.db.collection(collection);
    if (startAt !== null) ref = ref.startAt(startAt);
    if (limit !== null) ref = ref.limit(limit);
    if (orderBy !== null) {
      const { field, op } = orderBy;
      ref = ref.orderBy(field, op);
    }
    if (where !== null) {
      const { field, op, value } = where;
      ref = ref.where(field, op, value);
    }
    return ref;
  };

  /**
   * Return snapshot data
   * @param querySnapshot [Query Firebase snapshot data]
   */
  getQuerySnapshotData = async (querySnapshot, addUid = false) => {
    const res = [];
    querySnapshot.forEach((doc) => {
      if (doc.exists) {
        if (addUid) {
          res.push({ ...doc.data(), id: doc.id });
        } else {
          res.push({ ...doc.data() });
        }
      }
    });
    return res;
  };

  /**
   * Universal collection data
   * @param collection [collection name]
   * @param orderBy? [orderBy colection]
   * @param orderByOp? [orderBy Op ex. 'desc', 'asc']
   * @param startAt? [startAt] pagination startAt
   * @param limit [limit of collection data]
   * @param where [where clausure, object { field, op, value }]
   */
  getCollectionData = ({
    collection,
    orderBy = null,
    startAt = null,
    addUid = true,
    limit = null,
    where = null,
    cache = false,
  } = {}) => {
    if (isEmpty(collection)) return [];
    if (cache && !isEmpty(getCookie(collection))) {
      return getCookie(collection);
    }
    return new Promise(async (resolve, reject) => {
      const docRef = this.query({ collection, orderBy, startAt, limit, where });
      try {
        const querySnapshot = await docRef.get();
        const res = await this.getQuerySnapshotData(querySnapshot, addUid);
        if (cache) setCookie(collection, res);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
  };

  /**
   * Generic: Save data into collection especified
   * @param string collection
   * @param object data
   * @param string id
   * @param bool merge
   * @return Promise
   */
  saveData = ({ collection = null, data = {}, id = null }) => {
    return new Promise(async (resolve, reject) => {
      if (!collection) reject(new Error('Set collection name'));
      try {
        const dbRef = this.db.collection(collection);
        let docRef;
        if (id) {
          dbRef.doc(id);
          await dbRef.doc(id).set(data);
          docRef = this.getRef({ collection, doc: id });
        } else {
          docRef = await dbRef.add(data);
        }
        const doc = await docRef.get();
        const { id: docId } = doc;
        const docData = doc.data();
        resolve({ id: docId, ref: docRef, ...docData });
      } catch (error) {
        reject(error);
      }
    });
  };

  /**
   * Generic: Delete document into collection especified
   * @param string collection
   * @param string id
   * @return Promise
   */
  deleteDocument = ({ collection = null, id = null }) => {
    return new Promise(async (resolve, reject) => {
      if (!collection) reject(new Error('Set collection name'));
      if (!id) reject(new Error('Set document id'));

      try {
        const dbRef = this.db.collection(collection).doc(id);
        await dbRef.delete();
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };

  sanitizeUser = (user) => {
    return {
      uid: get(user, 'uid'),
      email: get(user, 'email') || null,
      displayName: get(user, 'displayName') || null,
      photoURL: get(user, 'photoURL') || null,
      emailVerified: get(user, 'emailVerified') || null,
      phoneNumber: get(user, 'phoneNumber') || null,
      team: get(user, 'team') || null,
    };
  };

  getDocumentData = async ({ collection, documentId } = {}) => {
    if (!documentId) throw new Error('documentId is mandatory');
    const docRef = this.db.collection(collection).doc(documentId);
    const doc = await docRef.get();
    const { id } = doc;
    const data = doc.data();
    return { id, ref: docRef, ...data };
  };

  getUser = async (user) => {
    const doc = await this.db
      .collection('users')
      .doc(user.uid)
      .get();
    return doc.data();
  };

  fillUserData = async (user) => {
    const doc = await this.db
      .collection('users')
      .doc(user.uid)
      .get();
    const data = doc.data();
    if (doc.exists) {
      return { ...user, ...data };
    }
    return user;
  };

  // ** Auth with google **
  doAuthWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(async (resp) => {
          if (resp) {
            let { user } = resp;
            const { additionalUserInfo } = resp;
            if (additionalUserInfo.isNewUser) {
              const sanitizeUser = this.sanitizeUser(user);
              const userToSave = {
                ...sanitizeUser,
                createdAt: new Date(),
              };
              await this.saveData({ collection: 'users', data: userToSave, id: user.uid });
              console.log('user saved in users collection');
            }
            const { idToken } = resp.credential;
            console.log({ idToken });
            user = await this.fillUserData(this.sanitizeUser(user));
            console.log({ user });
            resolve({ user, idToken });
          }
          reject(new Error('Sorry, something went wrong. Please try later'));
        })
        .catch((error) => {
          const { code } = error;
          let message = 'Sorry, something went wrong. Please try later';
          if (code) {
            message = get(firebaseErrors, code);
          }
          reject(new Error(message));
        });
    });
  };

  // ** Auth with github **
  doAuthWithGithub = () => {
    const provider = new firebase.auth.GithubAuthProvider();
    provider.addScope('read:user');
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(async (resp) => {
          if (resp) {
            let { user } = resp;
            if (!user.emailVerified) {
              await user.sendEmailVerification();
            }
            const { idToken } = resp.credential;
            const { additionalUserInfo } = resp;
            if (additionalUserInfo.isNewUser) {
              const sanitizeUser = this.sanitizeUser(user);
              const userToSave = {
                ...sanitizeUser,
                createdAt: new Date(),
              };
              await this.saveData({ collection: 'users', data: userToSave, id: user.uid });
            }
            user = await this.fillUserData(this.sanitizeUser(user));
            resolve({ user, idToken });
          } else {
            reject(new Error('Sorry, something went wrong. Please try later'));
          }
        })
        .catch((error) => {
          const { code } = error;
          let message = 'Sorry, something went wrong. Please try later';
          if (code) {
            message = get(firebaseErrors, code);
          }
          reject(new Error(message));
        });
    });
  };

  doSignOut = () => {
    this.auth.signOut();
  };
}

export { Firebase, auth, firestore, analytics };
