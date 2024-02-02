import {Component, OnInit} from '@angular/core';
import {RouterLink, Router, ActivatedRoute} from "@angular/router";
import {PropietarioService} from "../../services/PropietarioService";
import {Propietario} from "../../models/propietario.model";
import {PredioService} from "../../services/PredioService";
import {Predio} from "../../models/predio.model";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-datos-propietario',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule
  ],
  templateUrl: './datos-propietario.component.html',
  styleUrl: './datos-propietario.component.css'
})
export class DatosPropietarioComponent{

  propietarios?: Propietario[];
  predioActual?: Predio;
  constructor(private propietarioService: PropietarioService, private router: Router, private predioService: PredioService, private route: ActivatedRoute,) {

  }

  ngOnInit() {
    const predioId = +this.route.snapshot.params['id'];
    const predioEnLista = this.predioService.getListaPredios().find(predio => predio.id === predioId);

    if (predioEnLista) {
      this.predioActual = predioEnLista;
    } else {
      this.predioActual = this.predioService.obtenerPredioActual();
    }

    this.propietarios = this.predioActual?.propietarios;
  }

  editarPropietario(documentoIdentidad: string) {
    if (this.predioActual) {
      this.router.navigate(['/nuevo-predio/', this.predioActual.id, 'datos-propietario', 'editar-propietario', documentoIdentidad]);
    } else {
      console.error('No hay predio actual seleccionado');
    }
  }
}

