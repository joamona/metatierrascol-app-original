import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatRadioModule} from "@angular/material/radio";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {Imagen, LC_FuenteAdministrativaTipo} from "../../../models/imagen.model";
import {PropietarioService} from "../../../services/PropietarioService";
import {PredioService} from "../../../services/PredioService";
import {ImagenService} from "../../../services/ImagenService";
import {DocTypeEnum} from "../../../models/documento.model";
import {MatButtonModule} from "@angular/material/button";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-editar-imagen',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    ReactiveFormsModule,
    RouterLink,
    MatOptionModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './editar-imagen.component.html',
  styleUrl: './editar-imagen.component.css'
})
export class EditarImagenComponent {
  array_tipo_doc = Object.values(LC_FuenteAdministrativaTipo);
  notas = '';
  tipo_doc = LC_FuenteAdministrativaTipo.DNI;
  imagenCapturada: string | undefined = '';
  imagen: Imagen = {
    tipo_doc: LC_FuenteAdministrativaTipo.Imagen_propietario,
    notas: '',
    imageData: ''
  }
  imagenIndex = -1;
  predioActual = this.predioService.obtenerPredioActual();
  constructor(private imagenService: ImagenService, private snackBar: MatSnackBar,private route: ActivatedRoute, private router: Router, private predioService: PredioService) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let indexParam = params.get('i');
      if (indexParam) {

        this.imagenIndex = parseInt(indexParam, 10);


        let imgEncontrada = this.predioActual.imagenes[this.imagenIndex];


        if (imgEncontrada) {
          this.imagen = imgEncontrada;

          this.imagenCapturada = imgEncontrada.imageData;
        }
      }
    });
  }

  takePhoto() {
    this.imagenService.addNewToGallery().then((capturedPhoto) => {

      this.imagenCapturada = capturedPhoto.webPath;


      this.imagen.imageData = capturedPhoto.dataUrl;
    });
  }

  guardarImagen() {
    let index = this.imagenIndex;

    if (index !== -1) {
      const imagenActualizada = this.imagen

      this.predioActual.imagenes[index] = imagenActualizada;
      this.imagenService.actualizarImagen(index, imagenActualizada);

      this.snackBar.open('Imagen guardada con éxito', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/nuevo-predio/', this.predioActual.id, 'imagenes']);
      console.log(this.predioActual)
    } else {
      console.error('No se pudo encontrar el documento actual en la lista de imagenes.');
    }
  }

  eliminarImagen() {
    let index = this.imagenIndex;
    this.imagenService.eliminarImagen(index);

    this.predioActual = this.predioService.obtenerPredioActual();
    this.predioActual.imagenes = this.imagenService.getImagenes();

    this.snackBar.open('Imagen eliminada con éxito', 'Cerrar', { duration: 3000 });

    this.router.navigate(['/nuevo-predio/', this.predioActual.id, 'imagenes']);
    console.log(this.predioActual);
  }
}
