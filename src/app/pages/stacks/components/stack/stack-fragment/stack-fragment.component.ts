import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {SnackbarService} from '../../../../../core/ui/services/snackbar.service';
import {Stack} from '../../../../../core/entity/model/stack.model';
import {StacksService} from '../../../../../core/entity/services/stack/stacks.service';
import {Action} from '../../../../../core/entity/model/action.enum';
import {Tag} from '../../../../../core/entity/model/tag.model';

/**
 * Displays a stack
 */
@Component({
  selector: 'app-stack-fragment',
  templateUrl: './stack-fragment.component.html',
  styles: [require('./stack-fragment.component.scss')]
})
export class StackFragmentComponent {

  /** Stack to be displayed */
  @Input() stack;
  /** Map of tags */
  @Input() tags = new Map<string, Tag>();
  /** Default theme to be used */
  @Input() themeClass = 'light-theme';

  /** Event emitter indicating click on stack */
  @Output() stackEventEmitter = new EventEmitter<{ action: Action, stack: Stack, tags?: Tag[] }>();

  /**
   * Constructor
   * @param stacksService
   * @param snackbarService
   * @param dialog
   */
  constructor(private stacksService: StacksService,
              private snackbarService: SnackbarService,
              public dialog: MatDialog) {
  }

  //
  // Actions
  //

  /**
   * Handles click on stack
   */
  onStackClicked() {
    this.stackEventEmitter.emit({action: Action.GO_INTO, stack: this.stack});
  }

  /**
   * Handles click on update button
   */
  onUpdateClicked() {
    this.stackEventEmitter.emit({action: Action.OPEN_DIALOG_UPDATE, stack: this.stack, tags: Array.from(this.tags.values())});
  }

  /**
   * Handles click on delete button
   */
  onDeleteClicked() {
    this.stackEventEmitter.emit({action: Action.DELETE, stack: this.stack});
  }
}
