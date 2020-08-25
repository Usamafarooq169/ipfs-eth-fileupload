import * as firebase from 'firebase';
import {firebaseConfig} from "./index";

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
export var database = firebase.database();

export default firebase;