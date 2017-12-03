import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatIconRegistry, MatDialogRef} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {Stack} from '../../../model/stack.model';
import {UUID} from '../../../model/util/uuid';
import {DIALOG_MODE} from '../../../model/DialogMode';

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

  constructor(public dialogRef: MatDialogRef<StackDialogComponent>,
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
  }

  addStack() {
    this.stack.id = new UUID().toString();
    this.dialogRef.close(this.stack);
  }

  updateStack() {
    this.dialogRef.close(this.stack);
  }
}
