import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPredioComponent } from './editar-predio.component';

describe('EditarPredioComponent', () => {
  let component: EditarPredioComponent;
  let fixture: ComponentFixture<EditarPredioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPredioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarPredioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
