import { Component } from '@angular/core';
import {Predio} from "../models/predio.model";
import {PredioService} from "../services/PredioService";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-editar-predio-lista',
  standalone: true,
    imports: [
        RouterLink
    ],
  templateUrl: './editar-predio-lista.component.html',
  styleUrl: './editar-predio-lista.component.css'
})
export class EditarPredioListaComponent {
  predios: Predio[] = [];

  constructor(private predioService: PredioService, private router: Router) {}

  ngOnInit() {
    // Obtiene la lista de predios disponibles
    this.predios = this.predioService.getListaPredios();
    console.log(this.predios)
  }

  editarPredio(id: number) {
    this.router.navigate(['/editar-predio', id]);
  }
}
