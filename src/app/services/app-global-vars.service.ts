import { Injectable } from '@angular/core';

export var appMode: number = 2;

@Injectable({
  providedIn: 'root'
})
export class AppGlobalVarsService {
  public urlDjangoApi:string; // url para django
  public urlAppAngular: string; // url para navegar dentro de la aplicación de angular
  public showMessagesInConsole: boolean;
  public appMode = appMode;
  constructor() { 
    switch (appMode) {
      case 1: {
       this.urlDjangoApi="http://localhost:8000/";
        this.urlAppAngular="http://localhost:4200";
        this.showMessagesInConsole=true;
        break;
      }
      case 2: {
        this.urlDjangoApi="https://metatierrascol.upvusig.car.upv.es/api/";
        this.urlAppAngular="https://metatierrascol.upvusig.car.upv.es/app/"
        this.showMessagesInConsole=false;
        break;
      }
    }
  }
}