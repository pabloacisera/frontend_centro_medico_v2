import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaFichaComponent } from './nueva-ficha.component';

describe('NuevaFichaComponent', () => {
  let component: NuevaFichaComponent;
  let fixture: ComponentFixture<NuevaFichaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaFichaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevaFichaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
