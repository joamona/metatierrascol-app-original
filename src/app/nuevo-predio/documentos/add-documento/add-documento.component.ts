import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatRadioModule} from "@angular/material/radio";
import {Router, RouterLink} from "@angular/router";
import {MatSelectModule} from "@angular/material/select";
import {DocTypeEnum, Documento} from "../../../models/documento.model";
import {DocumentoService} from "../../../services/DocumentoService";
import {PredioService} from "../../../services/PredioService";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {ImagenService} from "../../../services/ImagenService";
import {MatButtonModule} from "@angular/material/button";
import {MatSnackBar} from "@angular/material/snack-bar";
@Component({
  selector: 'app-add-documento',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    ReactiveFormsModule,
    RouterLink,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './add-documento.component.html',
  styleUrl: './add-documento.component.css'
})
export class AddDocumentoComponent {
  imagenCapturada: string | undefined;
  documentoForm: FormGroup;
  listaImagenes: { id: number; ruta: string }[] = [];
  array_tipo_doc = Object.values(DocTypeEnum);
  predioActual = this.predioService.obtenerPredioActual();
  constructor(private documentoService: DocumentoService, private predioService: PredioService, private router: Router, private imagenService: ImagenService, private snackBar: MatSnackBar) {
    this.documentoForm = new FormGroup({
      tipo_doc: new FormControl(DocTypeEnum.Declaracion, Validators.required),
      notas: new FormControl(''),
      imagenes: new FormControl([]),
      pdfs: new FormControl([])
    });
  }

  takePhoto() {
    this.imagenService.addNewToGallery().then((capturedPhoto) => {
      if (capturedPhoto.webPath) {
        this.listaImagenes.push({
          id: Date.now(), // Un identificador único para cada imagen
          ruta: capturedPhoto.webPath
        });

      } else {
        console.error('No se pudo capturar la foto.');
      }
    });
  }





  eliminarImagen(imagenId: number): void {
    this.listaImagenes = this.listaImagenes.filter(imagen => imagen.id !== imagenId);
  }






  guardarDocumento() {
    if (this.documentoForm.valid) {
      const rutasImagenes = this.listaImagenes.map(imagen => imagen.ruta);
      const idDocumento = this.documentoService.obtenerSiguienteId();
      const nuevoDocumento = new Documento(
        idDocumento,
        this.documentoForm.value.tipo_doc,
        this.documentoForm.value.notas,
        rutasImagenes,
        this.documentoForm.value.pdfs
      );

      this.documentoService.addDocumento(nuevoDocumento);
      this.predioActual.documentos.push(nuevoDocumento);

      this.snackBar.open('Documento guardado con éxito', 'Cerrar', { duration: 3000 });

      // Navegar a otra ruta
      this.router.navigate(['/nuevo-predio/', this.predioActual.id, 'documentos']);
    } else {
      this.snackBar.open('Por favor, completa todos los campos requeridos', 'Cerrar', { duration: 3000 });
    }
  }

  onPDFsSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        this.documentoForm.get('pdfs')?.value.push(file);
      }
    }
  }

}
