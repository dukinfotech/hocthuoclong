import { useEffect, useState } from "react";
import { DATA_OBJECT_STORE_NAME } from "../const";

const useData = (dbName) => {
  const [data, setData] = useState<Array<object>>([]);

  useEffect(() => {
    if (!dbName) return;
    // Open connection to IndexedDB
    const request = window.indexedDB.open(dbName);

    request.onerror = function (event: any) {
      console.error("Database error: " + event.target.errorCode);
    };

    request.onsuccess = function (event) {
      const db = (event.target as IDBOpenDBRequest).result;

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
        console.error("Error getting data from IndexedDB:", event.target.error);
      };
    };

    // Close connection on component unmount
    // return () => {
    //   request.result.close();
    // };
  }, [dbName]);

  return data;
};

export default useData;
