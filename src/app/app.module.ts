//Módulos
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Services
import {NetStatusService} from "./services/net-status.service";
import {JWTTokenService} from "./services/jwtTokenService";
import { AppGlobalVarsService} from './services/app-global-vars.service';
import {PropietarioService} from "./services/PropietarioService";
import { MessageService } from './services/message.service';
import { ServerService } from './services/server.service';
import { AuthService } from './services/auth.service';

//Componentes
import { AppComponent } from './app.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { NuevoPredioComponent } from "./nuevo-predio/nuevo-predio.component";
import { DigitalizarComponent } from "./nuevo-predio/digitalizar/digitalizar.component";
import { MapaComponent } from "./mapa/mapa.component";
import { EditarPredioComponent } from "./editar-predio/editar-predio.component";
import { MedirGpsComponent } from "./nuevo-predio/medir-gps/medir-gps.component";
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MessagesComponent } from './messages/messages.component';
import { SqliteComponent } from './components/sqlite/sqlite.component';

@NgModule({
    declarations: [
        AppComponent,
        MainScreenComponent,
        NuevoPredioComponent,
        DigitalizarComponent,
        MapaComponent,
        EditarPredioComponent,
        MedirGpsComponent,
        HeaderComponent,
        FooterComponent,
        MessagesComponent,
        SqliteComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MatMenuModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatButtonModule,
        MatIconModule,
        FormsModule, ReactiveFormsModule
    ],
    providers: [PropietarioService, NetStatusService, 
        JWTTokenService, AppGlobalVarsService, ServerService,
        MessageService, AuthService],
    exports: [
        MapaComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
