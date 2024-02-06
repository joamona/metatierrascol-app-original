import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AuthService } from './app/services/auth.service';
import { MessageService } from './app/services/message.service';
import { ServerService } from './app/services/server.service';
import { AppGlobalVarsService } from './app/services/app-global-vars.service';
import { JWTTokenService } from './app/services/jwtTokenService';
import { NetStatusService } from './app/services/net-status.service';
import { PropietarioService } from './app/services/PropietarioService';


bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, MatMenuModule, MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule),
        PropietarioService, NetStatusService,
        JWTTokenService, AppGlobalVarsService, ServerService,
        MessageService, AuthService,
        provideAnimations(),
        provideHttpClient(withInterceptorsFromDi())
    ]
})
  .catch(err => console.error(err));
