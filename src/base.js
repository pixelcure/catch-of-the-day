import Rebase from 're-base';

// Connects to Firebase for Fish Inventory
const base = Rebase.createClass({
    apiKey: "AIzaSyA2BGCORjhMkMxnzkETvofFKmkU4F-pBdQ",
    authDomain: "catch-of-the-day-paul-t.firebaseapp.com",
    databaseURL: "https://catch-of-the-day-paul-t.firebaseio.com",
});

export default base;