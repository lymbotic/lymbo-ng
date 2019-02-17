import {ChangeDetectionStrategy, Component, EventEmitter, Input, isDevMode, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {MatDialog} from '@angular/material';
import {SnackbarService} from '../../../../../core/ui/services/snackbar.service';
import {CardsService} from '../../../../../core/entity/services/card/cards.service';
import {Tag} from '../../../../../core/entity/model/tag/tag.model';
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
import {Answer} from '../../../../../core/entity/model/card/quiz/answer.model';
import {CloneService} from '../../../../../core/entity/services/clone.service';
import {VibrantPalette} from '../../../../../core/entity/model/vibrant-palette';
import {MaterialColorService} from '../../../../../core/ui/services/material-color.service';
import {Media} from '../../../../../core/ui/model/media.enum';
import {InformationAspect} from '../../../../../core/entity/model/card/information/information-aspect.model';
import {CardType} from '../../../../../core/entity/model/card/card-type.enum';
import {Stack} from '../../../../../core/entity/model/stack/stack.model';

/**
 * Displays a card
 */
@Component({
  selector: 'app-card-fragment',
  templateUrl: './card-fragment.component.html',
  styleUrls: ['./card-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardFragmentComponent implements OnInit, OnChanges {

  /** Stack the card is contained in */
  @Input() stack = new Stack();
  /** Card to be displayed */
  @Input() card = new Card();
  /** Array of tags */
  @Input() tags: Tag[] = [];
  /** Whether all cards are flipped */
  @Input() viceVersa = false;
  /** Image palette to be used */
  @Input() imagePalette: VibrantPalette;
  /** Current media */
  @Input() media: Media;
  /** Default theme to be used */
  @Input() themeClass = 'light-theme';

  /** Event emitter indicating click on card */
  @Output() cardEventEmitter = new EventEmitter<{ action: Action, card: Card }>();

  /** Map of tags */
  tagsMap = new Map<string, Tag>();

  /** Enum for media types */
  mediaType = Media;
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
  /** Active information */
  activeInformation: string;
  /** Active single choice*/
  activeSingleChoice: boolean;
  /** Active answers */
  activeAnswers: Answer[];

  /** Favorite color */
  favoriteColor = 'black';

  /** Dev mode */
  devMode = false;

  /**
   * Constructor
   * @param cardsService card service
   * @param materialColorService material color service
   * @param snackbarService snack bar service
   * @param dialog dialog
   */
  constructor(private cardsService: CardsService,
              private materialColorService: MaterialColorService,
              private snackbarService: SnackbarService,
              public dialog: MatDialog) {
    this.devMode = isDevMode();
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeColors();
    this.initializeTagsMap();

    if (this.card.aspects != null && this.card.aspects.length > 0) {
      this.activeAspect = this.card.aspects[0];
      this.update();
    }
  }

  /**
   * Handles on-changes lifecycle phase
   */
  ngOnChanges(changes: SimpleChanges) {
    if (this.card.aspects != null && this.card.aspects.length > 0) {
      this.activeAspect = this.card.aspects[0];
      this.update();
    }
  }

  //
  // Initialization
  //

  /**
   * Initializes tags map
   */
  private initializeTagsMap() {
    this.tags.forEach(tag => {
      this.tagsMap.set(tag.id, tag);
    });
  }

  /**
   * Initializes colors
   */
  private initializeColors() {
    if (this.imagePalette != null) {
      const vibrant = this.imagePalette.vibrant;
      this.favoriteColor = `rgb(${vibrant.rgb[0]},${vibrant.rgb[1]},${vibrant.rgb[2]})`;
    } else {
      this.favoriteColor = this.materialColorService.accent;
    }
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
        this.cardEventEmitter.emit({action: action, stack: this.stack, card: this.card});
      }
    }
  }

  /**
   * Handles selection of answers
   * @param answers answers
   */
  onAnswersSelected(answers: Answer[]) {
    this.activeAnswers = answers;
  }

  /**
   * Handles selection of an answer
   * @param answer answer
   */
  onAnswerSelected(answer: Answer) {
    this.activeAnswers.forEach(a => {
      a.selected = (a.text === answer.text);
    });

    this.onCardClicked(Action.NONE);
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
          let activeSideIndex;

          if (!this.viceVersa) {
            activeSideIndex = this.activePartIndex;
          } else {
            if (this.activePartIndex === 0) {
              activeSideIndex = 1;
            } else if (this.activePartIndex === 1) {
              activeSideIndex = 0;
            }
          }

          this.activeSide = (this.activeAspect as SideAspect).sides[activeSideIndex];
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
      case AspectType.INFORMATION: {
        this.activeInformation = (this.activeAspect as InformationAspect).text;
        break;
      }
      case AspectType.QUIZ: {
        const quizAspect = this.activeAspect as QuizAspect;

        this.activeSingleChoice = this.card.type === CardType.SINGLE_CHOICE_QUIZ;

        switch (this.activePartIndex) {
          case 0: {
            this.activeSide = new Side(quizAspect.question);
            this.activeAnswers = CloneService.cloneAnswers(quizAspect.answers);
            this.activeAnswers.forEach(answer => {
              answer.selected = false;
            });
            break;
          }
          case 1: {
            if (this.checkAnswers(quizAspect.answers, this.activeAnswers)) {
              this.activeSide = new Side('CORRECT');
              this.activeAnswers = quizAspect.answers;
            } else {
              this.activeSide = new Side('INCORRECT');
              this.activeAnswers = quizAspect.answers;
            }
            break;
          }
        }
        break;
      }
      case AspectType.UNDEFINED: {
        break;
      }
    }
  }

  /**
   * Deteermines whether a set of given answers matches the correct answers
   * @param correctAnswers correct answers
   * @param givenAnswers given answers
   */
  private checkAnswers(correctAnswers: Answer[], givenAnswers: Answer[]) {
    return !correctAnswers.some((correctAnswer, index) => {
      return correctAnswer.selected !== givenAnswers[index].selected;
    });
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
