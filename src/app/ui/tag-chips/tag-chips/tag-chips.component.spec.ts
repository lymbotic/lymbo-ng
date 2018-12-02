import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TagChipsComponent} from './tag-chips.component';

describe('TagChipsFragmentComponent', () => {
  let component: TagChipsComponent;
  let fixture: ComponentFixture<TagChipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TagChipsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
