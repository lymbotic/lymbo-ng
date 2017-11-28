import {Component, OnInit} from '@angular/core';
import {MatIconRegistry, MdDialogRef} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {Stack} from '../../model/stack.model';
import {UUID} from '../../model/util/uuid';

@Component({
  selector: 'app-stack-add-dialog',
  templateUrl: './stack-add-dialog.component.html',
  styles: [require('./stack-add-dialog.component.scss')],
})
export class StackAddDialogComponent implements OnInit {
  title = '';

  constructor(public dialogRef: MdDialogRef<StackAddDialogComponent>,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'close',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_close_black_24px.svg'));
  }

  ngOnInit() {
  }

  addStack() {
    let stack = new Stack();

    stack.title = this.title;
    stack.id = new UUID().toString();

    this.dialogRef.close(stack);
  }
}
