import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainModalComponent } from './train-modal.component';

describe('TrainModalComponent', () => {
  let component: TrainModalComponent;
  let fixture: ComponentFixture<TrainModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
