// Your web app's Firebase configuration
$(document).ready(function () {
  var firebaseConfig = {
    apiKey: "AIzaSyCCSPzvoB10U9Wq36T3ZkatJY3CvohgaLY",
    authDomain: "librario-57ec3.firebaseapp.com",
    databaseURL: "https://librario-57ec3.firebaseio.com",
    projectId: "librario-57ec3",
    storageBucket: "librario-57ec3.appspot.com",
    messagingSenderId: "529783172996",
    appId: "1:529783172996:web:a03461d78eaa4f1d97f7d1",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  //creates doc and sets data
  db.collection("entries")
    .doc("bookDiary")
    .set({
      bookTitle: "Dune",
      date: "5-16-2020",
      entry: "lorem ipsum",
    })
    .then(function () {
      console.log("It Worked");
    })
    .catch(function (error) {
      console.log("It didn`t work: ", error);
    });
  //gets data
  db.collection("entries")
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        console.log(doc.data());
      });
    });
});
