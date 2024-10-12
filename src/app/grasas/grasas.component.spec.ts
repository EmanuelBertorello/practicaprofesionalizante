import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrasasComponent } from './grasas.component';

describe('GrasasComponent', () => {
  let component: GrasasComponent;
  let fixture: ComponentFixture<GrasasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrasasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrasasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
