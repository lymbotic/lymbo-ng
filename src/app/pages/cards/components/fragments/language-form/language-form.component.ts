import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Card} from '../../../../../core/entity/model/card.model';
import {Stack} from '../../../../../core/entity/model/stack.model';
import {TenseGroup} from '../../../../../core/entity/model/language/tense-group';

/**
 * Displays form to set language properties
 */
@Component({
  selector: 'app-language-form',
  templateUrl: './language-form.component.html',
  styleUrls: ['./language-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageFormComponent implements OnInit {

  /** Card to be displayed */
  @Input() card: Card;
  /** Stack the card is contained in */
  @Input() stack: Stack;
  /** Readonly dialog if true */
  @Input() readonly = false;
  /** Event emitter indicating card changes */
  @Output() cardEventEmitter = new EventEmitter<Card>();

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
  }

  //
  // Initialization
  //

  //
  // Actions
  //

  //
  // Notifications
  //

  /**
   * Informs subscribers that something has changed
   */
  private notify() {
    this.cardEventEmitter.emit(this.card);
  }
}
