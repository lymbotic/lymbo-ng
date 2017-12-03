import {Component, Inject, OnInit} from '@angular/core';
import {Card} from '../../../model/card.model';
import {MAT_DIALOG_DATA, MatIconRegistry, MatDialogRef} from '@angular/material';
import {Side} from 'app/model/side.model';
import {DomSanitizer} from '@angular/platform-browser';
import {UUID} from '../../../model/util/uuid';
import {DIALOG_MODE} from '../../../model/DialogMode';

@Component({
  selector: 'app-card-dialog',
  templateUrl: './card-dialog.component.html',
  styles: [require('./card-dialog.component.scss')],
})
export class CardDialogComponent implements OnInit {
  DIALOG_MODE: typeof DIALOG_MODE = DIALOG_MODE;
  mode = DIALOG_MODE.NONE;
  dialogTitle = '';
  card: Card;

  constructor(public dialogRef: MatDialogRef<CardDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'close',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_close_black_24px.svg'));

    // Create basic card
    this.card = new Card();
    this.card.sides.push(new Side());
    this.card.sides.push(new Side());
  }

  ngOnInit() {
    if (this.data == null) {
      this.mode = DIALOG_MODE.ADD;
      this.dialogTitle = 'Add card';
    } else {
      this.mode = DIALOG_MODE.UPDATE;
      this.dialogTitle = 'Update card';
      this.card = this.data.card as Card;
    }
  }

  addCard() {
    this.card.id = new UUID().toString();
    this.dialogRef.close(this.card);
  }

  updateCard() {
    this.dialogRef.close(this.card);
  }
}
