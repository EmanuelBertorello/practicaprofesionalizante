import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProteComponent } from './prote.component';

describe('ProteComponent', () => {
  let component: ProteComponent;
  let fixture: ComponentFixture<ProteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
