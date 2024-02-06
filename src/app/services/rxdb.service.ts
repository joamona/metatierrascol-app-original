import { Injectable } from '@angular/core';
import { isDevMode } from '@angular/core';

import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import {addRxPlugin, createRxDatabase, RxDatabase, RxCollection,
        RxJsonSchema, RxDocument} from 'rxdb';


import { MessageService } from './message.service';
import { sendMessages } from '../utilities/manageMessages';

@Injectable({
  providedIn: 'root'
})
export class RxdbService {
  database: RxDatabase;

  constructor(public messageService: MessageService) { 
    addRxPlugin(RxDBJsonDumpPlugin);//para exportar a json

    this.createOrGetDatabase('metatierrascol').then((db)=>{
      if (db==undefined){
        sendMessages('La base de datos no pudo ser creada', this.messageService);
        return
      }else{
        sendMessages('Valor base de datos creada, o existía', this.messageService);
        this.database=db;        
        this.createOrGetPrediosCollection().then((created:any)=>{
          if (created){
            sendMessages('Tabla creada', this.messageService);
          }else{
            sendMessages('Tabla existía', this.messageService);
          }
        })
      }
    })
  }

  async createOrGetDatabase(dataBaseName: string){
    /**
     * Si existe la devuelve
     */
    if (isDevMode()){
      await import('rxdb/plugins/dev-mode').then(
          module => addRxPlugin(module.RxDBDevModePlugin)
      );
    }
    try{
      const db = await createRxDatabase({
        name: 'metatierrascol',
        storage: getRxStorageDexie(),
        multiInstance: false
      });
      return db;
    }catch(e: any){
        var result = e.message; // error under useUnknownInCatchVariables 
        if (typeof e === "string") {
            sendMessages(e, this.messageService);
            return undefined;
        } else if (e instanceof Error) {
          sendMessages(e.message, this.messageService);
          return undefined;
        } else {
          sendMessages('No se pudo crear la base de datos metatierrascol. Probablemente ya existía', this.messageService);
          return undefined;
        }
      }
    }

  async createOrGetPrediosCollection(){
    /**
     * Crea una colección o tabla. Si existe la devuekve
     */

    let s = {
      version: 0,
      primaryKey: 'id',
      type: 'object',
      properties: {
          id: {
              type: 'integer',
              maxLength: 100 // <- the primary key must have set maxLength
          },
          name: {
              type: 'string'
          },
          done: {
              type: 'boolean'
          },
          timestamp: {
              type: 'string',
              format: 'date-time'
          }
      },
      required: ['id', 'name', 'done', 'timestamp']
    }
    try{
      var col = await this.database.addCollections({
        predios: {
          schema: s
        }
      });
      return col;
    }catch(e: any){
        var result = e.message; // error under useUnknownInCatchVariables 
        if (typeof e === "string") {
            sendMessages(e, this.messageService);
            return false;
        } else if (e instanceof Error) {
          sendMessages(e.message, this.messageService);
          return false;
        } else {
          sendMessages('La tabla predios. Probablemente ya existía', this.messageService);
          return false;
        }
      }
    }
  
  async insertPredio(){
    const p1 = await this.database['predios'].insert({
      id: 'integer',
      name: 'Learn RxDB',
      done: false,
      timestamp: new Date().toISOString()
    });
    return p1;
  }
  
  async selectPredio(id:number){
    const p2 = await this.database['predios'].find({
      selector: {
          id: {
              $eq: id
          }
      }
    }).exec();
    console.log(p2.values);
    return p2;
  }

  async removePrediosCollection(){
    this.createOrGetPrediosCollection().then((col:any)=>{
      if(col){
        col.destroy();
        sendMessages('Colección predios borrada',this.messageService);
      }else{
        sendMessages('No se pudo borrar la colección',this.messageService);
      }
    })
  }
}
