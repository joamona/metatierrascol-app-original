import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalizarComponent } from './digitalizar.component';

describe('DigitalizarComponent', () => {
  let component: DigitalizarComponent;
  let fixture: ComponentFixture<DigitalizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigitalizarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DigitalizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
