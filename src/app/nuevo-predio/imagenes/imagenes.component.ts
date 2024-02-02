import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {Imagen} from "../../models/imagen.model";
import {Predio} from "../../models/predio.model";
import {PredioService} from "../../services/PredioService";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-imagenes',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule
  ],
  templateUrl: './imagenes.component.html',
  styleUrl: './imagenes.component.css'
})
export class ImagenesComponent {

  imagenes: Imagen[];
  predioActual: Predio;
  constructor(private predioService: PredioService, private router: Router) {
    this.predioActual = this.predioService.obtenerPredioActual();
    this.imagenes = this.predioActual.imagenes;
  }

  editarImagen(i:number) {
    this.router.navigate(['/nuevo-predio/', this.predioActual.id, 'imagenes', 'editar-imagen', i])
  }
}
