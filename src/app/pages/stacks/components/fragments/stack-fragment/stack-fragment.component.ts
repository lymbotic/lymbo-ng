import {Component, EventEmitter, Input, isDevMode, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {SnackbarService} from '../../../../../core/ui/services/snackbar.service';
import {Stack} from '../../../../../core/entity/model/stack/stack.model';
import {StacksService} from '../../../../../core/entity/services/stack/stacks.service';
import {Action} from '../../../../../core/entity/model/action.enum';
import {Tag} from '../../../../../core/entity/model/tag/tag.model';
import {DisplayAspect} from '../../../../../core/entity/services/stack/stack-display.service';

/**
 * Displays a stack
 */
@Component({
  selector: 'app-stack-fragment',
  templateUrl: './stack-fragment.component.html',
  styleUrls: ['./stack-fragment.component.scss']
})
export class StackFragmentComponent implements OnInit {

  /** Stack to be displayed */
  @Input() stack: Stack;
  /** Array of tags */
  @Input() tags: Tag[] = [];
  /** Default theme to be used */
  @Input() themeClass = 'light-theme';

  /** Event emitter indicating click on stack */
  @Output() stackEventEmitter = new EventEmitter<{ action: Action, stack: Stack, tags?: Tag[] }>();

  /** Map of tags */
  tagsMap = new Map<string, Tag>();
  /** Title color */
  titleColor = 'black';
  /** Tag color */
  tagColor = 'white';

  /** Enum of display aspects */
  displayAspectType = DisplayAspect;

  /** Dev mode */
  devMode = false;

  /**
   * Constructor
   * @param stacksService stacks service
   * @param snackbarService snackbar service
   * @param dialog dialog
   */
  constructor(private stacksService: StacksService,
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
    this.initializeTagsMap();
    this.initializeColors();
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
    if (this.stack.imagePalette != null) {
      const swatchMuted = this.stack.imagePalette.muted;
      this.titleColor = `rgb(${swatchMuted.rgb[0]},${swatchMuted.rgb[1]},${swatchMuted.rgb[2]})`;

      const swatchLightMuted = this.stack.imagePalette.lightMuted;
      this.tagColor = `rgb(${swatchLightMuted.rgb[0]},${swatchLightMuted.rgb[1]},${swatchLightMuted.rgb[2]})`;
    }
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

  /**
   * Handles click on export button
   */
  onExportClicked() {
    StacksService.downloadStack(this.stack);
  }

  //
  // Helpers
  //

  /**
   * Determines whether the displayed stack contains a specific display aspect
   * @param displayAspect display aspect
   * @param stack stack
   */
  public containsDisplayAspect(displayAspect: DisplayAspect, stack: Stack): boolean {
    return StacksService.containsDisplayAspect(displayAspect, stack);
  }
}
