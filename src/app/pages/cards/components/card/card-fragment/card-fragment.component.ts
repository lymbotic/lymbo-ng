import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {SnackbarService} from '../../../../../core/ui/services/snackbar.service';
import {CardsService} from '../../../../../core/entity/services/card/cards.service';
import {Tag} from '../../../../../core/entity/model/tag.model';
import {Action} from '../../../../../core/entity/model/action.enum';
import {Card} from '../../../../../core/entity/model/card/card.model';
import {Aspect} from '../../../../../core/entity/model/card/aspect.interface';
import {AspectType} from '../../../../../core/entity/model/card/aspect.type';
import {SideAspect} from '../../../../../core/entity/model/card/side/side-aspect';
import {TenseAspect} from '../../../../../core/entity/model/card/tense/tense-aspect';
import {ExampleAspect} from '../../../../../core/entity/model/card/example/example-aspect';
import {Side} from '../../../../../core/entity/model/card/side/side.model';
import {TenseGroup} from '../../../../../core/entity/model/card/tense/tense-group';
import {Vocabel} from '../../../../../core/entity/model/card/example/vocabel.model';
import {QuizAspect} from '../../../../../core/entity/model/card/quiz/quiz-aspect.model';

/**
 * Displays a card
 */
@Component({
  selector: 'app-card-fragment',
  templateUrl: './card-fragment.component.html',
  styleUrls: ['./card-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardFragmentComponent implements OnInit {

  /** Card to be displayed */
  @Input() card = new Card();
  /** Map of tags */
  @Input() tags = new Map<string, Tag>();
  /** Default theme to be used */
  @Input() themeClass = 'light-theme';

  /** Event emitter indicating click on card */
  @Output() cardEventEmitter = new EventEmitter<{ action: Action, card: Card }>();

  /** Enum of action types */
  public actionType = Action;
  /** Enum of aspect types */
  public aspectType = AspectType;

  /** Active aspect */
  activeAspect: Aspect;
  /** Index of active aspect */
  activeAspectIndex = 0;
  /** Index of active part of an aspect */
  activePartIndex = 0;

  /** Active side */
  activeSide: Side;
  /** Active tense */
  activeTenseGroup: TenseGroup;
  /** Active example */
  activeExample: Vocabel;

  /**
   * Constructor
   * @param cardsService card service
   * @param snackbarService snack bar service
   * @param dialog dialog
   */
  constructor(private cardsService: CardsService,
              private snackbarService: SnackbarService,
              public dialog: MatDialog) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.activeAspect = this.card.aspects[0];
    this.update();
  }

  //
  // Actions
  //

  /**
   * Handles click on the card
   */
  onCardClicked(action: Action) {
    switch (action) {
      case Action.NONE: {
        this.flipCard();
        break;
      }
      default: {
        this.cardEventEmitter.emit({action: action, card: this.card});
      }
    }
  }

  //
  // Helpers
  //

  /**
   * Flips card to the next side
   */
  private flipCard() {
    // Increase index and loop if needed
    if (this.activeAspect != null) {
      const targetPartCount = this.getPartCount(this.activeAspect.type);

      // Flip part
      this.activePartIndex++;

      if (this.activePartIndex >= targetPartCount) {
        this.activePartIndex = 0;

        this.activeAspectIndex++;
        if (this.activeAspectIndex >= this.card.aspects.length) {
          this.activeAspectIndex = 0;
        }

        this.activeAspect = this.card.aspects[this.activeAspectIndex];
      }

      this.update();
    }
  }

  /**
   * Updates display side
   */
  private update() {
    switch (this.activeAspect.type) {
      case AspectType.SIDE: {
        if ((this.activeAspect as SideAspect).sides.length > 0) {
          this.activeSide = (this.activeAspect as SideAspect).sides[this.activePartIndex];
        } else {
          this.flipCard();
        }
        break;
      }
      case AspectType.TENSE: {
        if ((this.activeAspect as TenseAspect).tenseGroups.length > 0) {
          this.activeTenseGroup = (this.activeAspect as TenseAspect).tenseGroups[this.activePartIndex];
        } else {
          this.flipCard();
        }
        break;
      }
      case AspectType.EXAMPLE: {
        if ((this.activeAspect as ExampleAspect).examples.length > 0) {
          this.activeExample = (this.activeAspect as ExampleAspect).examples[this.activePartIndex];
        } else {
          this.flipCard();
        }

        break;
      }
      case AspectType.QUIZ: {
        const quizAspect = this.activeAspect as QuizAspect;

        break;
      }
      case AspectType.UNDEFINED: {
        break;
      }
    }
  }

  /**
   * Deteermines the total count of part of an aspect
   * @param aspectType aspect type
   */
  private getPartCount(aspectType: AspectType): number {
    switch (aspectType) {
      case AspectType.SIDE: {
        return (this.card.aspects.filter(aspect => {
          return aspect.type === AspectType.SIDE;
        })[0] as SideAspect).sides.length;
      }
      case AspectType.TENSE: {
        return (this.card.aspects.filter(aspect => {
          return aspect.type === AspectType.TENSE;
        })[0] as TenseAspect).tenseGroups.length;
      }
      case AspectType.EXAMPLE: {
        return (this.card.aspects.filter(aspect => {
          return aspect.type === AspectType.EXAMPLE;
        })[0] as ExampleAspect).examples.length;
      }
      case AspectType.QUIZ: {
        return 2;
      }
      case AspectType.UNDEFINED: {
        break;
      }
    }
  }
}
