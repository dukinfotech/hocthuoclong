const useDataBase = () => {
  const listDB = async () => {
    const listDB = await window.indexedDB.databases();
    return listDB;
  };

  const deleteDB = (dbName: string) => {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(dbName);

      request.onsuccess = () => {
        console.log(`Database ${dbName} deleted successfully`);
        resolve();
      };

      request.onerror = (event) => {
        console.error(`Error deleting database ${dbName}`, event);
        reject(event);
      };

      request.onblocked = () => {
        console.warn(`Database ${dbName} delete blocked`);
        reject(new Error("Delete blocked"));
      };
    });
  };

  return { listDB, deleteDB };
};

export default useDataBase;
