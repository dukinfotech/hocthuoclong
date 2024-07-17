import { useEffect, useState } from "react";
import { DATA_OBJECT_STORE_NAME } from "../const";

const useData = (dbName: string) => {
  const [data, setData] = useState<Array<object>>([]);

  useEffect(() => {
    if (!dbName) return;

    (async () => {
      try {
        const db = (await openDatabase()) as IDBDatabase;
        // Open transaction to access object store
        const transaction = db.transaction(DATA_OBJECT_STORE_NAME, "readonly");
        const objectStore = transaction.objectStore(DATA_OBJECT_STORE_NAME);

        // Get all data from object store
        const getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = function (event) {
          const result: any = (event.target as IDBOpenDBRequest).result;
          setData(result);
        };

        getAllRequest.onerror = function (event: any) {
          console.error(
            "Error getting data from IndexedDB:",
            event.target.error
          );
        };
      } catch (error) {
        console.error(error);
      }
    })();
  }, [dbName]);

  const openDatabase = async () => {
    return new Promise((resolve, reject) => {
      // Open connection to IndexedDB
      const request = window.indexedDB.open(dbName);

      request.onerror = function (event: any) {
        console.error("Database error: " + event.target.errorCode);
        reject(event);
      };

      request.onsuccess = function (event) {
        const db = (event.target as IDBOpenDBRequest).result;
        resolve(db);
      };
    });
  };

  const update = (key: string, field: string, newValue: string) => {
    return new Promise<void>(async (resolve, reject) => {
      const db = (await openDatabase()) as IDBDatabase;
      const transaction = db.transaction(DATA_OBJECT_STORE_NAME, "readwrite");
      const store = transaction.objectStore(DATA_OBJECT_STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        const data = request.result;
        if (data) {
          data[field] = newValue;
          const updateRequest = store.put(data);

          updateRequest.onsuccess = () => {
            resolve();
          };

          updateRequest.onerror = (event) => {
            reject(event);
          };
        } else {
          reject(new Error("Object not found"));
        }
      };

      request.onerror = (event) => {
        reject(event);
      };
    });
  };

  return { data, update };
};

export default useData;
