import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {DialogMode} from '../../../../../core/entity/model/dialog-mode.enum';
import {Stack} from '../../../../../core/entity/model/stack.model';
import {Tag} from '../../../../../core/entity/model/tag.model';
import {StacksService} from '../../../../../core/entity/services/stacks.service';
import {UUID} from '../../../../../core/entity/model/uuid';

@Component({
  selector: 'app-stack-dialog',
  templateUrl: './stack-dialog.component.html',
  styles: [require('./stack-dialog.component.scss')],
})
export class StackDialogComponent implements OnInit {

  /** Enum of dialog modes */
  public modeType = DialogMode;
  /** Current media */
  public mode: DialogMode = DialogMode.NONE;

  /** Dialog title */
  dialogTitle = '';

  stack: Stack;

  existingTags: Tag[] = [];
  newTags: Tag[] = [];

  constructor(private stacksService: StacksService,
              public dialogRef: MatDialogRef<StackDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'close',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_close_black_24px.svg'));

    // Create basic stack
    this.stack = new Stack();
  }

  ngOnInit() {
    if (this.data == null) {
      this.dialogTitle = 'Add stack';
    } else {
      this.dialogTitle = 'Update stack';
      this.stack = this.data.stack as Stack;
    }

    this.stacksService.getAllTags().forEach(t => {
      this.existingTags.push(new Tag(t.value, false));
    });

    // Get existing tags and add empty tag to new tags
    this.existingTags.forEach(et => {
      this.stack.tags.forEach(t => {
        if (et.value === t.value) {
          et.checked = true;
        }
      });
    });
    this.newTags.push(new Tag('', false));
  }

  addStack() {
    this.stack.id = new UUID().toString();
    this.dialogRef.close(this.stack);
  }

  updateStack() {
    this.stack.tags = [];
    this.existingTags.concat(this.newTags).filter(t => t.checked).forEach(t => {
        this.stack.tags.push(t);
      }
    );
    this.dialogRef.close(this.stack);
  }

  tagChanged(value: string) {
    let noEmptyTag = true;

    this.newTags.forEach((t: Tag) => {
        if (t.value.trim().length === 0) {
          noEmptyTag = false;
        }
      }
    );

    if (noEmptyTag) {
      this.newTags.push(new Tag('', false));
    }
  }

  onKey(event: any) {
    if (event.keyCode === 13) {
      event.preventDefault();

      if (this.stack.title) {
      }
    }
  }
}
