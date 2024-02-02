import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedirGpsComponent } from './medir-gps.component';

describe('MedirGpsComponent', () => {
  let component: MedirGpsComponent;
  let fixture: ComponentFixture<MedirGpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedirGpsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedirGpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
