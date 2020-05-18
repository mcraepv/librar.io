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
  // db.collection("entries")
  //   .doc("bookDiary")
  //   .set({
  //     bookTitle: "Dune",
  //     date: "5-16-2020",
  //     entry: "lorem ipsum",
  //   })
  //   .then(function () {
  //     console.log("It Worked");
  //   })
  //   .catch(function (error) {
  //     console.log("It didn`t work: ", error);
  //   });
  // //gets data
  // db.collection("entries")
  //   .get()
  //   .then((snapshot) => {
  //     snapshot.docs.forEach((doc) => {
  //       console.log(doc.data());
  //     });
  //   });
  var user;
  var name;
  $("#sign-in").on("click", function (event) {
    console.log("Click");
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        user = result.user;
        console.log(user);
        name = user.displayName;
        console.log(name);
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            // User is signed in.
            console.log(user);
            db.collection("users").doc("user").set({
              name: name,
            });
          } else {
            // No user is signed in.
          }
        });
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  });
  $("#journalBtn").on("click", newBook);
  //need to add function that loads saved books and entries
  function newBook(event) {
    $("#journalContent").empty();
    var newBookCell = $("<div>").addClass("medium-6 cell");
    var newBookCard = $("<div>").addClass("card");
    newBookCard.css({ "box-shadow": "10px 10px 5px grey" });
    var cardDivider = $("<div>").addClass("card-divider");
    var bookTitleInput = $("<input>").attr("type", "text");
    bookTitleInput.attr("placeholder", "Book Title");
    cardDivider.append(bookTitleInput);
    var cardSection = $("<div>").addClass("card-section");
    var newBookBtn = $("<button>").addClass("button large text-center");
    newBookBtn.text("Create New Book!");
    newBookBtn.on("click", function (event) {
      var bookTitle = bookTitleInput.val();
      if (bookTitle === null) {
        return;
      }
      db.collection("users")
        .doc("user")
        .collection("journals")
        .doc("journal")
        .set({
          title: bookTitle,
        });

      db.collection("users/user/journals")
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((doc) => {
            console.log(doc.data());
          });
        });
      bookCreateReset();
    });
    cardSection.append(newBookBtn);
    newBookCard.append(cardDivider, cardSection);
    newBookCell.append(newBookCard);
    $("#journalContent").append(newBookCell);
  }
  function newEntry(event) {
    $("#journalContent").empty();
    var entryCell = $("<div>").addClass("medium-6 cell");
    var entryCard = $("<div>").addClass("card");
    var cardDivider = $("<div>").addClass("card-divider");
    var titleInput = $("<input>").attr("type", "text");
    titleInput.attr("placeholder", "Title");
    cardDivider.append(titleInput);
    var cardSection = $("<div>").addClass("card-section");
    var textArea = $("<textarea>").attr("placeholder", "New Entry!");
    textArea.css({ resize: "none", height: "250px" });
    var saveBtn = $("<button>").addClass("button large text-center");
    saveBtn.text("Save");
    cardSection.append(textArea, saveBtn);
    entryCard.append(cardDivider, cardSection);
    entryCard.css({ "box-shadow": "10px 10px 5px grey" });
    entryCell.append(entryCard);
    $("#journalContent").append(entryCell);
  }
  // db.collection("entries")
  //   .doc("bookDiary")
  //   .set({
  //     bookTitle: "Dune",
  //     date: "5-16-2020",
  //     entry: "lorem ipsum",
  //   })
  //   .then(function () {
  //     console.log("It Worked");
  //   })
  //   .catch(function (error) {
  //     console.log("It didn`t work: ", error);
  //   });
  // //gets data
  // db.collection("entries")
  //   .get()
  //   .then((snapshot) => {
  //     snapshot.docs.forEach((doc) => {
  //       console.log(doc.data());
  //     });
  //   });
  function bookCreateReset() {
    console.log("reset");
  }
});
