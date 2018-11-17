import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {CardDialogComponent} from '../../dialogs/card-dialog/card-dialog.component';
import {Card} from '../../../../../core/entity/model/card.model';
import {Side} from '../../../../../core/entity/model/side.model';
import {CardsService} from '../../../../../core/entity/services/cards.service';
import {SnackbarService} from '../../../../../core/ui/services/snackbar.service';
import {ConfirmationDialogComponent} from '../../../../../ui/confirmation-dialog/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styles: [require('./card.component.scss')],
})
export class CardComponent implements OnInit {

  @Input() card = new Card();

  activeSideIndex = 0;
  activeSide: Side;

  constructor(private cardsService: CardsService,
              private snackbarService: SnackbarService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.activeSide = this.card.sides[this.activeSideIndex];
  }

  /**
   * Handles click on the card
   * @param value
   */
  onCardClicked(value: string) {
    switch (value) {
      case 'update': {
        this.updateCard();
        break;
      }
      case 'delete': {
        this.deleteCard();
        break;
      }
      case 'flip': {
        this.flipCard();
        break;
      }
      case 'putAside': {
        this.putCardAside();
        break;
      }
      case 'putToEnd': {
        this.putCardToEnd();
        break;
      }
    }
  }

  public updateCard() {
    let dialogRef = this.dialog.open(CardDialogComponent, {
      disableClose: true, data: {
        card: this.card
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.cardsService.updateCard(result as Card);
        this.snackbarService.showSnackbar('Updated card');
      }
    });
  }

  public deleteCard() {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
      data: {
        title: 'Delete card',
        text: 'Do you want to delete this card?',
        action: 'Delete',
        value: this.card
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.cardsService.deleteCard(result as Card);
        this.snackbarService.showSnackbar('Deleted card');
      }
    });
  }

  private flipCard() {
    this.activeSideIndex++;
    if (this.activeSideIndex >= this.card.sides.length) {
      this.activeSideIndex = 0;
    }

    this.activeSide = this.card.sides[this.activeSideIndex];
  }

  private putCardAside() {
    this.cardsService.putCardAside(this.card);
  }

  private putCardToEnd() {
    this.cardsService.putCardToEnd(this.card);
  }
}
