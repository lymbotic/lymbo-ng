import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

/**
 * Displays stack title
 */
@Component({
  selector: 'app-stack-title-fragment',
  templateUrl: './stack-title-fragment.component.html',
  styleUrls: ['./stack-title-fragment.component.scss']
})
export class StackTitleFragmentComponent implements OnInit {

  /** Stack name to be displayed */
  @Input() stackTitle: string;
  /** Placeholder */
  @Input() placeholder: string;
  /** Readonly dialog if true */
  @Input() readonly: false;
  /** Event emitter indicating changes in stack title */
  @Output() stackTitleChangedEmitter = new EventEmitter<string>();

  /** Debouncer for input field */
  debouncer = new Subject();

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeDebouncer();
  }

  //
  // Initialization
  //

  /**
   * Initializes debouncer
   */
  private initializeDebouncer() {
    this.debouncer.pipe(
      debounceTime(500)
    ).subscribe((value: string) => this.stackTitleChangedEmitter.emit(value));
  }

  //
  // Actions
  //

  /**
   * Handles stack title changes
   * @param stackTitle stack title
   */
  onStackTitleChanged(stackTitle: string) {
    this.stackTitle = stackTitle;
    this.debouncer.next(stackTitle);
  }

  /**
   * Handles key up event
   */
  onKeyUp() {
    this.notify();
  }

  /**
   * Handles option selection
   */
  onOptionSelected() {
    this.notify();
  }

  //
  // Notification
  //

  /**
   * Informs subscribers that something has changed
   */
  private notify() {
    this.debouncer.next(this.stackTitle);
  }
}
