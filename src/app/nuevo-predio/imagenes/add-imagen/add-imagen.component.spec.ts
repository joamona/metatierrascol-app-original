import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddImagenComponent } from './add-imagen.component';

describe('AddImagenComponent', () => {
  let component: AddImagenComponent;
  let fixture: ComponentFixture<AddImagenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddImagenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddImagenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
