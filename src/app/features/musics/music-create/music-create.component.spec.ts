import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MusicCreateComponent} from './music-create.component';

describe('CreateComponent', () => {
  let component: MusicCreateComponent;
  let fixture: ComponentFixture<MusicCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MusicCreateComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should music-create', () => {
    expect(component).toBeTruthy();
  });
});
