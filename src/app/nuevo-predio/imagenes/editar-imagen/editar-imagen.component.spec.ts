import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarImagenComponent } from './editar-imagen.component';

describe('EditarImagenComponent', () => {
  let component: EditarImagenComponent;
  let fixture: ComponentFixture<EditarImagenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarImagenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarImagenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
