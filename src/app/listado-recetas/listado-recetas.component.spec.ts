import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoRecetasComponent } from './listado-recetas.component';

describe('ListadoRecetasComponent', () => {
  let component: ListadoRecetasComponent;
  let fixture: ComponentFixture<ListadoRecetasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoRecetasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoRecetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
