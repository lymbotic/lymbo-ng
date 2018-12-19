import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Card} from '../../../../../core/entity/model/card.model';
import {Side} from '../../../../../core/entity/model/side.model';
import {Action} from '../../../../../core/entity/model/action.enum';

/**
 * Displays a card's side
 */
@Component({
  selector: 'app-side-fragment',
  templateUrl: './side-fragment.component.html',
  styleUrls: ['./side-fragment.component.scss'],
})
export class SideFragmentComponent {

  /** Card containing this side */
  @Input() card: Card;
  /** Index of side to be displayed */
  @Input() sideIndex: number;
  /** Side to be displayed */
  @Input() side: Side;

  /** Event emitter indicating click on side */
  @Output() sideClickedEmitter = new EventEmitter<Action>();

  //
  // Actions
  //

  /**
   * Handles click on the card
   */
  onSideClicked() {
    this.sideClickedEmitter.emit(Action.NONE);
  }

  /**
   * Handles click on update button
   */
  onUpdateClicked() {
    this.sideClickedEmitter.emit(Action.OPEN_DIALOG_UPDATE);
  }

  /**
   * Handles click on delete button
   */
  onDeleteClicked() {
    this.sideClickedEmitter.emit(Action.DELETE);
  }

  /**
   * Handles click on check button
   */
  onCheckClicked() {
    this.sideClickedEmitter.emit(Action.PUT_ASIDE);
  }

  /**
   * Handles click on undo button
   */
  onUndoClicked() {
    this.sideClickedEmitter.emit(Action.PUT_TO_END);
  }
}
