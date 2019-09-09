import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ColorService} from '../../../../../core/ui/services/color.service';
import {FeatureService} from '../../../../../core/settings/services/feature.service';
import {CardsService} from '../../../../../core/entity/services/card/cards.service';
import {MatSelect} from '@angular/material';
import {Card} from '../../../../../core/entity/model/card/card.model';
import {CardType} from '../../../../../core/entity/model/card/card-type.enum';
import {CardTypeGroup} from '../../../../../core/entity/model/card/card-type-group.enum';

/**
 * Represents a card type group action button
 */
class CardTypeGroupAction {

  /** Card type group */
  group: CardTypeGroup;
  /** Label to be displayed */
  label: string;
  /** Icon to be used */
  icon: string;
  /** Background color to be used */
  backgroundColor: string;
  /** Background color to be used */
  iconColor: string;
  /** Card types in context menu */
  cardTypes = [];
}

/**
 * Displays card type fragment
 */
@Component({
  selector: 'app-card-type-fragment',
  templateUrl: './card-type-fragment.component.html',
  styleUrls: ['./card-type-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardTypeFragmentComponent implements OnInit, OnChanges {

  /** Card to be displayed */
  @Input() card: Card;
  /** Event emitter indicating card type selection */
  @Output() cardTypeEventEmitter = new EventEmitter<CardType>();

  /** Available card types */
  cardTypes = Object.keys(CardType).map(key => CardType[key]);
  /** Available card type groups */
  cardTypeGroups = Object.keys(CardTypeGroup).map(key => CardTypeGroup[key]);
  /** List of card type actions */
  cardTypeActions = [];
  /** Currently selected group */
  selectedGroup: CardTypeGroup;
  /** Currently hovered group */
  hoveredGroup: CardTypeGroup;

  /**
   * Constructor
   * @param colorService color service
   * @param featureService feature service
   * @param cardsService cards service
   */
  constructor(private colorService: ColorService,
              private featureService: FeatureService,
              private cardsService: CardsService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeCardTypeGroups();
  }

  /**
   * Handles on-changes lifecycle phase
   */
  ngOnChanges(changes: SimpleChanges) {
    // Update color of all actions
    this.cardTypeActions.forEach(a => {
      this.updateActionColor(a);
    });
  }

  //
  // Initialization
  //

  /**
   * Initializes card types
   */
  initializeCardTypeGroups() {
    this.cardTypeActions = [];
    this.cardTypeGroups.filter(group => {
      return group !== CardTypeGroup.UNSPECIFIED;
    }).forEach(group => {
      const action = new CardTypeGroupAction();
      action.group = group;
      action.backgroundColor = this.getGroupColor(group);
      action.iconColor = this.getGroupContrast(group);
      action.icon = this.cardsService.getIconByCardTypeGroup(group);
      action.label = group.toString();
      action.cardTypes = this.cardsService.getCardTypesByGroup(group);
      this.cardTypeActions.push(action);
    });
  }


  //
  // Actions
  //

  /**
   * Handles click on selected action button
   * @param select material select component
   * @param action action
   */
  onSuggestedActionButtonClicked(select: MatSelect, action: CardTypeGroupAction) {
    if (action.cardTypes.length > 1) {
      select.open();
    } else {
      this.onCardTypeSelected(action.cardTypes[0], action);
    }
  }

  /**
   * Handles selection of card type
   * @param cardType card type action
   * @param action card type group action
   */
  onCardTypeSelected(cardType: CardType, action: CardTypeGroupAction) {
    this.cardTypeEventEmitter.emit(cardType);

    this.selectedGroup = action.group;

    // Update color of all actions
    this.cardTypeActions.forEach(a => {
      this.updateActionColor(a);
    });
  }

  /**
   * Handles hover over container
   * @param hovered whether there is currently a hover event
   * @param action card type group action
   */
  onHoverContainer(hovered: boolean, action: CardTypeGroupAction) {
    this.hoveredGroup = hovered ? action.group : null;

    // Update color of hovered action
    this.updateActionColor(action);
  }

  //
  // Helpers
  //

  /**
   * Updates color of a given card type group action
   * @param action card type group action
   */
  private updateActionColor(action: CardTypeGroupAction) {
    this.cardTypeActions.filter(a => {
      return a === action;
    }).forEach((a: CardTypeGroupAction) => {
      const group = a.group;
      action.backgroundColor = this.getGroupColor(group);
      action.iconColor = this.getGroupContrast(group);
    });
  }

  /**
   * Retrieves a color by card type group
   * @param group card type group
   */
  private getGroupColor(group: CardTypeGroup): string {
    if (this.card != null && (this.card.type != null && this.cardsService.groupContainsType(group, this.card.type))
      || (this.hoveredGroup === group)) {
      return this.colorService.getCardTypeGroupColor(group).color;
    } else {
      return this.colorService.getCardTypeGroupColor(null).color;
    }
  }

  /**
   * Retrieves a contrast color by card type group
   * @param group card type group
   */
  private getGroupContrast(group: CardTypeGroup): string {
    if (this.card != null && (this.card.type != null && this.cardsService.groupContainsType(group, this.card.type))
      || (this.hoveredGroup === group)) {
      return this.colorService.getCardTypeGroupColor(group).contrast;
    } else {
      return this.colorService.getCardTypeGroupColor(null).contrast;
    }
  }

  /**
   * Retrieves an icon by card type
   * @param type card type
   */
  public getIconByCardType(type: CardType): string {
    return this.cardsService.getIconByCardType(type);
  }
}
