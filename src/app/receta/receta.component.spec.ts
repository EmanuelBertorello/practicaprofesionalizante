import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecetaComponent } from './receta.component';

describe('RecetaComponent', () => {
  let component: RecetaComponent;
  let fixture: ComponentFixture<RecetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecetaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
