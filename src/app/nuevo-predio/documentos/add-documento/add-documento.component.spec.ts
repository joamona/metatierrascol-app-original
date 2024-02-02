import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDocumentoComponent } from './add-documento.component';

describe('AddDocumentoComponent', () => {
  let component: AddDocumentoComponent;
  let fixture: ComponentFixture<AddDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDocumentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
