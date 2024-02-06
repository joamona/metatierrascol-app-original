export class SetProperties{
    setPropertyValues(databaseRow?: any){
      if (!(typeof databaseRow === 'undefined')) {
        for (let key in databaseRow) {
            this[key] = databaseRow[key];
        }
      }
    }
 }