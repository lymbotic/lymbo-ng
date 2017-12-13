import {Component, Inject, OnInit} from '@angular/core';
import {Card} from '../../../model/card.model';
import {MAT_DIALOG_DATA, MatDialogRef, MatIconRegistry} from '@angular/material';
import {Side} from 'app/model/side.model';
import {DomSanitizer} from '@angular/platform-browser';
import {UUID} from '../../../model/util/uuid';
import {DIALOG_MODE} from '../../../model/DialogMode';
import {CardsService} from '../../../services/cards.service';
import {Tag} from '../../../model/tag.model';

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

  existingTags: Tag[] = [];
  newTags: Tag[] = [];

  constructor(private cardsService: CardsService,
              public dialogRef: MatDialogRef<CardDialogComponent>,
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

    this.existingTags = this.cardsService.getAllTags();
    // Get existing existingTags and add empty tag
    console.log(`DEBUG existing ${this.existingTags.length}`);
    this.existingTags.forEach(et => {
      console.log(`DEBUG et ${et}`);
      this.card.tags.forEach(t => {
        console.log(`DEBUG et ${t}`);
        if (et.value === t.value) {
          console.log(`DEBUG hey ${et.value}`);
          et.checked = true;
        }
      });
    });
    this.newTags.push(new Tag('', false));
  }

  addCard() {
    this.card.id = new UUID().toString();
    this.card.tags = [];
    this.existingTags.concat(this.newTags).filter(t => t.checked).forEach(t => {
        this.card.tags.push(t);
      }
    );

    this.dialogRef.close(this.card);
  }

  updateCard() {
    this.card.tags = [];
    this.existingTags.concat(this.newTags).filter(t => t.checked).forEach(t => {
        this.card.tags.push(t);
      }
    );
    this.dialogRef.close(this.card);
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

      if (this.card.sides[0].title.length > 0 && this.card.sides[1].title.length > 0) {
        if (this.mode === DIALOG_MODE.ADD) {
          this.addCard();
        } else if (this.mode === DIALOG_MODE.UPDATE) {
          this.updateCard();
        }
      }
    }
  }
}
