// to store data while offline //
const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;


let db; 

// creates a new request for a "budget" db // 

const request = indexedDB.open("budget", 2);

request.onsuccess = ({ target }) => {
    db = target.result;
    // check if app is online before reading from db
    if (navigator.onLine) {
      checkDatabase();
    }
  };

  request.onsuccess = ({ target }) => {
    db = target.result;
    // check if app is online before reading from db
    if (navigator.onLine) {
      checkDatabase();
    }
  };
  request.onerror = function(event) {
    console.log("Woops! " + event.target.errorCode);
  };

  function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    store.add(record);
  }
  function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();
    getAll.onsuccess = function() {
      if (getAll.result.length > 0) {
        fetch("/api/transaction/bulk", {
          method: "POST",
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
          }
        })
        .then(response => {        
          return response.json();
        })
        .then(() => {
          // delete records if successful
          const transaction = db.transaction(["pending"], "readwrite");
          const store = transaction.objectStore("pending");
          store.clear();
        });
      }
    };
  }
  // listen for app coming back online
  window.addEventListener("online", checkDatabase);