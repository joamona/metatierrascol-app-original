import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPredioListaComponent } from './editar-predio-lista.component';

describe('EditarPredioListaComponent', () => {
  let component: EditarPredioListaComponent;
  let fixture: ComponentFixture<EditarPredioListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPredioListaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarPredioListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
