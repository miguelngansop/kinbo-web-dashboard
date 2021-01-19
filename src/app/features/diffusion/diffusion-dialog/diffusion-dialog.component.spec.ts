import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DiffusionDialogComponent} from './diffusion-dialog.component';

describe('DiffusionDialogComponent', () => {
  let component: DiffusionDialogComponent;
  let fixture: ComponentFixture<DiffusionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiffusionDialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffusionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
