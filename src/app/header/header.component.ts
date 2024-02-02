import { Component } from '@angular/core';
import { NetStatusService } from '../services/net-status.service';
import { AuthService } from '../services/auth.service';
import { AppGlobalVarsService } from '../services/app-global-vars.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  showMessages = false;
  constructor(public netStatusService: NetStatusService, 
    public authService: AuthService, public appGlobalVarsService: AppGlobalVarsService){
  }
}
