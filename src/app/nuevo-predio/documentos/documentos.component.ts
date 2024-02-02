import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {Documento} from "../../models/documento.model";
import {Predio} from "../../models/predio.model";
import {PredioService} from "../../services/PredioService";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule
  ],
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.css'
})
export class DocumentosComponent {

  documentos: Documento[];
  predioActual: Predio;
  constructor(private predioService: PredioService, private router: Router) {
    this.predioActual = this.predioService.obtenerPredioActual();
    this.documentos = this.predioActual.documentos;
  }

  editarDocumento(i:number) {
    this.router.navigate(['/nuevo-predio/', this.predioActual.id, 'documentos', 'editar-documento', i])
  }
}
