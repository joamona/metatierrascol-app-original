import { Component, OnInit } from '@angular/core';
import { ServerService } from './services/server.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'metatierrascol-app';
  constructor(public serverService: ServerService, authService: AuthService){
    authService.cargarUrlyTokenDelAlmacen().then((value) => {
      authService.checkAuthorizationToken();//comprueba que el token es válido
          //y establece el usuario, el token y los grupos en authService.
          //el componente header hace uso de auth service para obtener estos datos
    });
  }
  ngOnInit(): void {

  }

}

