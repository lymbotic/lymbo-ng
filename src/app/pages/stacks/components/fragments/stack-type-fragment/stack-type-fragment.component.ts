import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {StackTypeGroup} from '../../../../../core/entity/model/stack/stack-type-group.enum';
import {StackType} from '../../../../../core/entity/model/stack/stack-type.enum';
import {ColorService} from '../../../../../core/ui/services/color.service';
import {FeatureService} from '../../../../../core/settings/services/feature.service';
import {StacksService} from '../../../../../core/entity/services/stack/stacks.service';
import {MatSelect} from '@angular/material';
import {Stack} from '../../../../../core/entity/model/stack/stack.model';

/**
 * Represents a stack type group action button
 */
class StackTypeGroupAction {

  /** Stack type group */
  group: StackTypeGroup;
  /** Label to be displayed */
  label: string;
  /** Icon to be used */
  icon: string;
  /** Background color to be used */
  backgroundColor: string;
  /** Background color to be used */
  iconColor: string;
  /** Stack types in context menu */
  stackTypes = [];
}

/**
 * Displays stack type fragment
 */
@Component({
  selector: 'app-stack-type-fragment',
  templateUrl: './stack-type-fragment.component.html',
  styleUrls: ['./stack-type-fragment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StackTypeFragmentComponent implements OnInit, OnChanges {

  /** Stack to be displayed */
  @Input() stack: Stack;
  /** Event emitter indicating stack type selection */
  @Output() stackTypeEventEmitter = new EventEmitter<StackType>();

  /** Tasklet type selection */
  @ViewChild('select') select: MatSelect;

  /** Available stack types */
  stackTypes = Object.keys(StackType).map(key => StackType[key]);
  /** Available stack type groups */
  stackTypeGroups = Object.keys(StackTypeGroup).map(key => StackTypeGroup[key]);
  /** List of stack type actions */
  stackTypeActions = [];
  /** Currently selected group */
  selectedGroup: StackTypeGroup;
  /** Currently hovered group */
  hoveredGroup: StackTypeGroup;

  /**
   * Constructor
   * @param colorService color service
   * @param featureService feature service
   * @param stacksService stacks service
   */
  constructor(private colorService: ColorService,
              private featureService: FeatureService,
              private stacksService: StacksService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeStackTypeGroups();
  }

  /**
   * Handles on-changes lifecycle phase
   */
  ngOnChanges(changes: SimpleChanges) {
    // Update color of all actions
    this.stackTypeActions.forEach(a => {
      this.updateActionColor(a);
    });
  }

  //
  // Initialization
  //

  /**
   * Initializes stack types
   */
  initializeStackTypeGroups() {
    this.stackTypeActions = [];
    this.stackTypeGroups.filter(group => {
      return group !== StackTypeGroup.UNSPECIFIED;
    }).forEach(group => {
      const action = new StackTypeGroupAction();
      action.group = group;
      action.backgroundColor = this.getGroupColor(group);
      action.iconColor = this.getGroupContrast(group);
      action.icon = this.stacksService.getIconByStackTypeGroup(group);
      action.label = group.toString();
      action.stackTypes = this.stacksService.getStackTypesByGroup(group);
      this.stackTypeActions.push(action);
    });
  }


  //
  // Actions
  //

  /**
   * Handles click on selected action button
   * @param action action
   */
  onSuggestedActionButtonClicked(action: StackTypeGroupAction) {
    if (action.stackTypes.length > 1) {
      this.select.open();
    } else {
      this.onStackTypeSelected(action.stackTypes[0], action);
    }
  }

  /**
   * Handles selection of stack type
   * @param stackType stack type action
   * @param action stack type group action
   */
  onStackTypeSelected(stackType: StackType, action: StackTypeGroupAction) {
    this.stackTypeEventEmitter.emit(stackType);

    this.selectedGroup = action.group;

    // Update color of all actions
    this.stackTypeActions.forEach(a => {
      this.updateActionColor(a);
    });
  }

  /**
   * Handles hover over container
   * @param {boolean} hovered whether there is currently a hover event
   * @param {StackTypeGroupAction} action stack type group action
   */
  onHoverContainer(hovered: boolean, action: StackTypeGroupAction) {
    this.hoveredGroup = hovered ? action.group : null;

    // Update color of hovered action
    this.updateActionColor(action);
  }

  //
  // Helpers
  //

  /**
   * Updates color of a given stack type group action
   * @param action stack type group action
   */
  private updateActionColor(action: StackTypeGroupAction) {
    this.stackTypeActions.filter(a => {
      return a === action;
    }).forEach((a: StackTypeGroupAction) => {
      const group = a.group;
      action.backgroundColor = this.getGroupColor(group);
      action.iconColor = this.getGroupContrast(group);
    });
  }

  /**
   * Retrieves a color by stack type group
   * @param group stack type group
   */
  private getGroupColor(group: StackTypeGroup): string {
    if (this.stack != null && (this.stack.type != null && this.stacksService.groupContainsType(group, this.stack.type))
      || (this.hoveredGroup === group)) {
      return this.colorService.getStackTypeGroupColor(group).color;
    } else {
      return this.colorService.getStackTypeGroupColor(null).color;
    }
  }

  /**
   * Retrieves a contrast color by stack type group
   * @param group stack type group
   */
  private getGroupContrast(group: StackTypeGroup): string {
    if (this.stack != null && (this.stack.type != null && this.stacksService.groupContainsType(group, this.stack.type))
      || (this.hoveredGroup === group)) {
      return this.colorService.getStackTypeGroupColor(group).contrast;
    } else {
      return this.colorService.getStackTypeGroupColor(null).contrast;
    }
  }

  /**
   * Retrieves an icon by stack type
   * @param type stack type
   */
  public getIconByStackType(type: StackType): string {
    return this.stacksService.getIconByStackType(type);
  }
}
