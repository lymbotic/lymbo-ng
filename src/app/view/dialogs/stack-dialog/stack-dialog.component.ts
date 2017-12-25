import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {Stack} from '../../../model/stack.model';
import {UUID} from '../../../model/util/uuid';
import {DIALOG_MODE} from '../../../model/DialogMode';
import {Tag} from '../../../model/tag.model';
import {StacksService} from '../../../services/stacks.service';

@Component({
  selector: 'app-stack-dialog',
  templateUrl: './stack-dialog.component.html',
  styles: [require('./stack-dialog.component.scss')],
})
export class StackDialogComponent implements OnInit {
  DIALOG_MODE: typeof DIALOG_MODE = DIALOG_MODE;
  mode = DIALOG_MODE.NONE;
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
      this.mode = DIALOG_MODE.ADD;
      this.dialogTitle = 'Add stack';
    } else {
      this.mode = DIALOG_MODE.UPDATE;
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
        if (this.mode === DIALOG_MODE.ADD) {
          this.addStack();
        } else if (this.mode === DIALOG_MODE.UPDATE) {
          this.updateStack();
        }
      }
    }
  }
}
