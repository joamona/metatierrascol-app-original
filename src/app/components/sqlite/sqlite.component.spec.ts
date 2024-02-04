import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqliteComponent } from './sqlite.component';

describe('SqliteComponent', () => {
  let component: SqliteComponent;
  let fixture: ComponentFixture<SqliteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqliteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SqliteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
