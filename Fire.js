import uuid from "uuid";

import getUserInfo from "./utils/getUserInfo";
import shrinkImageAsync from "./utils/shrinkImageAsync";
import uploadPhoto from "./utils/uploadPhoto";

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

const collectionName = "instagram-app";

class Fire {
  constructor() {
    firebase.initializeApp({
      apiKey: "AIzaSyCwSv-ojvAmpwqpH58WHzgilmbMGu7feTw",
      authDomain: "instagram-firebase01.firebaseapp.com",
      databaseURL: "https://instagram-firebase01.firebaseio.com",
      projectId: "instagram-firebase01",
      storageBucket: "instagram-firebase01.appspot.com",
      messagingSenderId: "121571270101",
    });
    // Some nonsense...
    firebase.firestore().settings({ timestampsInSnapshots: true });

    // Listen for auth
    firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
    });
  }

  // Download Data
  getPaged = async ({ size, start }) => {
    let ref = this.collection.orderBy("timestamp", "desc").limit(size);
    try {
      if (start) {
        ref = ref.startAfter(start);
      }

      const querySnapshot = await ref.get();

      const data = [];
      querySnapshot.forEach(function (doc) {
        if (doc.exists) {
          const post = doc.data() || {};

          // Reduce the name
          const user = post.user || {};

          const name = user.deviceName;
          const reduced = {
            key: doc.id,
            id: doc.id,
            name: (name || "User").trim(),
            ...post,
          };
          data.push(reduced);
        }
      });

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      return { data, cursor: lastVisible };
    } catch ({ message }) {
      alert(message);
    }
  };

  // Upload photo
  uploadPhotoAsync = async (uri) => {
    const path = `${collectionName}/${this.uid}/${uuid.v4()}.jpg`;
    return uploadPhoto(uri, path);
  };

  // Post
  post = async ({ text, image: localUri }) => {
    try {
      const { uri: reducedImage, width, height } = await shrinkImageAsync(
        localUri
      );

      const remoteUri = await this.uploadPhotoAsync(reducedImage);

      return await this.collection.add({
        text,
        uid: this.uid,
        timestamp: this.timestamp,
        imageWidth: width,
        imageHeight: height,
        image: remoteUri,
        user: getUserInfo(),
        likedUserIds: [],
      });
    } catch ({ message }) {
      alert(message);
    }
  };

  // Update like
  like = (postId, likedUserIds) => {
    this.collection.doc(postId).update({
      likedUserIds: Array.from(new Set(likedUserIds)),
    });
  };

  // Helpers
  get collection() {
    return firebase.firestore().collection(collectionName);
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }
  get timestamp() {
    return Date.now();
  }
}

Fire.shared = new Fire();
export default Fire;
