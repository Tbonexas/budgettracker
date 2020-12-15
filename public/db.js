// to store data while offline // 

const { get } = require("../routes/api");

let db; 

// creates a new request for a "BT" db // 

const request = indexedDB.open("BT", 1);

request.onupgradeneeded = function (event) {
    // object store pending //
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true});
};

request.onsuccess = function (event) {
    db = event.target.result;

    // check to see if app is already online before the db //
    if (navigator.online) {
        checkDatabase();
    }
};

request.onerror = function(event) {
    console.log("Error, " + event.target.errorCode);
};

function saveRecord(record) {
    // this creates a transaction for the pending db // 
    const transaction = db.transaction(["pending"], "readwrite");
    // access object store //
    const store =transaction.createObjectStore("pending");
    // adds the record 
    store.add(record);
}

function checkDatabase () {
    // opens pending db //
    const transaction = db.transaction(["pending"], "readwrite");
    // access //
    const store = transaction.objectStore("pending");
    // gets all records
    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method : "POST",
                body: JSON.stringify(getAll.results),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Context-Type": "application/json"
                }
            })
            .then (response => response.json())
            .then(() => {
                // iff correct will open from pending db //
                const transaction = db.transaction(["pending"], "readwrite");
                const store = transaction.objectStore('pending');
                store.clear();
            })

        }
    }
}
// incase app comes back online //
window.addEventListener("online", checkDatabase)