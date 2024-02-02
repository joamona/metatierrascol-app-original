import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoPredioComponent } from './nuevo-predio.component';

describe('NuevoPredioComponent', () => {
  let component: NuevoPredioComponent;
  let fixture: ComponentFixture<NuevoPredioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoPredioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevoPredioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
