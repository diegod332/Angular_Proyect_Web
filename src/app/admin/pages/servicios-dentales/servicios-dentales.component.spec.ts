import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosDentalesComponent } from './servicios-dentales.component';

describe('ServiciosDentalesComponent', () => {
  let component: ServiciosDentalesComponent;
  let fixture: ComponentFixture<ServiciosDentalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiciosDentalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiciosDentalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
