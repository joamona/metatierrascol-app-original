import { Component, OnInit } from '@angular/core';
import { ServerService } from './services/server.service';
import { AuthService } from './services/auth.service';
import { FooterComponent } from './footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { RxdbService } from './services/rxdb.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [HeaderComponent, RouterOutlet, FooterComponent]
})
export class AppComponent implements OnInit{
  title = 'metatierrascol-app';
  constructor(public serverService: ServerService, authService: AuthService,
    public rxdbService: RxdbService){
    authService.cargarUrlyTokenDelAlmacen().then((value) => {
      authService.checkAuthorizationToken();//comprueba que el token es válido
          //y establece el usuario, el token y los grupos en authService.
          //el componente header hace uso de auth service para obtener estos datos
    });
  }
  ngOnInit(): void {

  }
  insertPredio(){
    this.rxdbService.insertPredio()
  }
  borraColeccionPredios(){
    this.rxdbService.removePrediosCollection()
  }

}

