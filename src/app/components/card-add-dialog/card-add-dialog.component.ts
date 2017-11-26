import {Component, OnInit} from '@angular/core';
import {Card} from '../../model/card.model';
import {MatIconRegistry, MdDialogRef} from '@angular/material';
import {Side} from 'app/model/side.model';
import {DomSanitizer} from '@angular/platform-browser';
import {UUID} from '../../model/util/uuid';

@Component({
  selector: 'app-card-add-dialog',
  templateUrl: './card-add-dialog.component.html',
  styles: [require('./card-add-dialog.component.scss')],
})
export class CardAddDialogComponent implements OnInit {
  frontTitle = '';
  backTitle = '';

  constructor(public dialogRef: MdDialogRef<CardAddDialogComponent>,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'close',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_close_black_24px.svg'));
  }

  ngOnInit() {
  }

  addCard() {
    let card = new Card();
    let front = new Side();
    let back = new Side();

    front.title = this.frontTitle;
    back.title = this.backTitle;

    card.id = new UUID().toString();
    card.sides.push(front);
    card.sides.push(back);

    this.dialogRef.close(card);
  }
}
