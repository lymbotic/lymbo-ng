import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Card} from '../../../../../core/entity/model/card.model';
import {Tag} from '../../../../../core/entity/model/tag.model';
import {CardsService} from '../../../../../core/entity/services/cards.service';
import {DialogMode} from '../../../../../core/entity/model/dialog-mode.enum';
import {UUID} from '../../../../../core/entity/model/uuid';

@Component({
  selector: 'app-card-dialog',
  templateUrl: './card-dialog.component.html',
  styles: [require('./card-dialog.component.scss')],
})
export class CardDialogComponent implements OnInit {

  /** Enum of dialog modes */
  public modeType = DialogMode;
  /** Current media */
  public mode: DialogMode = DialogMode.NONE;

  dialogTitle = '';
  card: Card;

  existingTags: Tag[] = [];
  newTags: Tag[] = [];

  constructor(private cardsService: CardsService,
              public dialogRef: MatDialogRef<CardDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

    // Create basic card
    this.card = new Card();
  }

  ngOnInit() {
    if (this.data == null) {
      this.dialogTitle = 'Add card';
    } else {
      this.dialogTitle = 'Update card';
      this.card = this.data.card as Card;
    }

    this.cardsService.getAllTags().forEach(t => {
      this.existingTags.push(new Tag(t.value, false));
    });

    // Get existing tags and add empty tag to new tags
    this.existingTags.forEach(et => {
      this.card.tags.forEach(t => {
        if (et.value === t.value) {
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
      }
    }
  }
}
