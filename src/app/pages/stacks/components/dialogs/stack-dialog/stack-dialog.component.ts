import {Component, EventEmitter, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DialogMode} from '../../../../../core/entity/model/dialog-mode.enum';
import {Stack} from '../../../../../core/entity/model/stack/stack.model';
import {Tag} from '../../../../../core/entity/model/tag.model';
import {CloneService} from '../../../../../core/entity/services/clone.service';
import {SuggestionService} from '../../../../../core/entity/services/suggestion.service';
import {DisplayAspect} from '../../../../../core/entity/services/stack/stack-display.service';
import {Action} from '../../../../../core/entity/model/action.enum';
import {StacksService} from '../../../../../core/entity/services/stack/stacks.service';
import {StackType} from '../../../../../core/entity/model/stack/stack-type.enum';
import {Language} from '../../../../../core/entity/model/card/language.enum';
import {PexelsService} from '../../../../../core/image/services/pexels.service';
import {Photo} from '../../../../../core/image/model/photo.model';
import {SearchResult} from '../../../../../core/image/model/search-result';

/**
 * Displays stack dialog
 */
@Component({
  selector: 'app-stack-dialog',
  templateUrl: './stack-dialog.component.html',
  styleUrls: ['./stack-dialog.component.scss'],
})
export class StackDialogComponent implements OnInit, OnDestroy {

  /** Enum of dialog modes */
  public modeType = DialogMode;
  /** Current media */
  public mode: DialogMode = DialogMode.NONE;

  /** Dialog title */
  dialogTitle = '';

  /** Stack to be displayed */
  stack: Stack;

  /** Temporarily displayed tags */
  tags: Tag[] = [];

  /** Tag options */
  tagOptions: string[];

  /** Enum of display aspects */
  displayAspectType = DisplayAspect;

  /**
   * Constructor
   * @param stacksService cards service
   * @param suggestionService suggestion service
   * @param dialogRef dialog reference
   * @param data dialog data
   */
  constructor(private stacksService: StacksService,
              private suggestionService: SuggestionService,
              public dialogRef: MatDialogRef<StackDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeData();
    this.initializeOptions();
  }

  /**
   * Handles on-destroy lifecycle phase
   */
  ngOnDestroy() {
    this.handleStackChanges();
  }

  //
  // Initialization
  //

  /**
   * Initializes data
   */
  private initializeData() {
    this.mode = this.data.mode;
    this.dialogTitle = this.data.dialogTitle;
    this.stack = this.data.stack != null ? CloneService.cloneStack(this.data.stack) : new Stack();
    this.tags = this.data.tags != null ? CloneService.cloneTags(this.data.tags) : [];
  }

  /**
   * Initializes options
   */
  private initializeOptions() {
    this.tagOptions = Array.from(this.suggestionService.tagOptions.values()).sort((t1, t2) => {
      return new Date(t2.modificationDate).getTime() > new Date(t1.modificationDate).getTime() ? 1 : -1;
    }).map(t => {
      return t.name;
    });
  }

  //
  // Actions
  //

  /**
   * Handles stack type changes
   * @param type stack type
   */
  onStackTypeChanged(type: StackType) {
    this.stack.type = type;
  }

  /**
   * Handles stack title change
   * @param stackTitle
   */
  onStackTitleChanged(stackTitle: string) {
    this.stack.title = stackTitle;
  }

  /**
   * Handles source tense change
   * @param language source tense
   */
  onSourceLanguageChanged(language: Language) {
    this.stack.sourceLanguage = language;
  }

  /**
   * Handles target tense change
   * @param language target tense
   */
  onTargetLanguageChanged(language: Language) {
    this.stack.targetLanguage = language;
  }

  /**
   * Handles tag changes
   * @param tags new tags
   */
  onTagsChanged(tags: string[]) {
    this.tags = tags.map(t => {
      return new Tag(t, true);
    });
  }

  //
  // Button actions
  //

  /**
   * Handles click on add button
   */
  addStack() {
    this.tags = this.aggregateTags(this.stack);

    this.dialogRef.close({
      action: Action.ADD,
      stack: this.stack,
      tags: this.tags
    });
  }

  /**
   * Handles click on update button
   */
  updateStack() {
    this.tags = this.aggregateTags(this.stack);

    this.dialogRef.close({
      action: Action.UPDATE,
      stack: this.stack,
      tags: this.tags
    });
  }

  /**
   * Handles click on delete button
   */
  deleteStack() {
    this.mode = DialogMode.DELETE;
    this.dialogRef.close({action: Action.DELETE, stack: this.stack});
  }

  /**
   * Handles key down event
   * @param event
   */
  onKeyDown(event: any) {
    const KEY_CODE_ENTER = 13;
    if (event.keyCode === KEY_CODE_ENTER && event.ctrlKey) {
      this.handleStackChanges();
    }
  }

  /**
   * Handles the creation, updating or continuation of a task
   */
  private handleStackChanges() {
    switch (this.mode) {
      case DialogMode.ADD: {
        if (this.stacksService.containsDisplayAspect(DisplayAspect.CAN_BE_CREATED, this.stack)) {
          this.addStack();
        }
        break;
      }
      case DialogMode.UPDATE: {
        if (this.stacksService.containsDisplayAspect(DisplayAspect.CAN_BE_UPDATED, this.stack)) {
          this.updateStack();
        }
        break;
      }
      case DialogMode.DELETE: {
        break;
      }
      case DialogMode.NONE: {
        break;
      }
    }
  }

  //
  // Helpers
  //

  // Tags

  /**
   * Aggregates tags
   * @param {Stack} stack
   * @returns {Tag[]}
   */
  private aggregateTags(stack: Stack): Tag[] {
    const aggregatedTags = new Map<string, Tag>();

    // Concatenate
    this.tags.forEach(t => {
      aggregatedTags.set(t.id, t);
    });

    return Array.from(aggregatedTags.values());
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
    return this.stacksService.containsDisplayAspect(displayAspect, stack);
  }
}
