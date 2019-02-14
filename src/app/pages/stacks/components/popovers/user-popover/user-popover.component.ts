import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from 'firebase';

/**
 * Displays a user popover
 */
@Component({
  selector: 'app-user-popover',
  templateUrl: './user-popover.component.html',
  styleUrls: ['./user-popover.component.scss']
})
export class UserPopoverComponent implements OnInit {

  /** User to display */
  @Input() user: User;
  /** Event emitter indicating a logout event */
  @Output() logoutEventEmitter = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  //
  // Actions
  //

  /**
   * Handles click on logout button
   */
  onLogoutClicked() {
    this.logoutEventEmitter.emit();
  }
}
