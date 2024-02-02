import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarGeometriaComponent } from './seleccionar-geometria.component';

describe('SeleccionarGeometriaComponent', () => {
  let component: SeleccionarGeometriaComponent;
  let fixture: ComponentFixture<SeleccionarGeometriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionarGeometriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeleccionarGeometriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
