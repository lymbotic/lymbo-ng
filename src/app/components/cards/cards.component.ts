import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackbarService} from '../../services/snackbar.service';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {CardDialogComponent} from '../card-dialog/card-dialog.component';
import {Card} from '../../model/card.model';
import {CardsService} from '../../services/cards.service';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styles: [require('./cards.component.scss')]
})
export class CardsComponent implements OnInit, OnDestroy {
  title = 'Lymbo';
  cards: Card[] = [];
  private cardsUnsubscribeSubject = new Subject();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private cardsService: CardsService,
              private snackbarService: SnackbarService,
              public dialog: MatDialog,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'add',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_add_white_24px.svg'));
  }

  ngOnInit() {
    let stack = this.route.snapshot.data['stack'];

    this.title = stack != null ? `Lymbo | ${stack.title}` : `Lymbo`;
    this.cards = stack.cards;
    this.cardsService.stack = stack;

    this.cardsService.cardsSubject
      .takeUntil(this.cardsUnsubscribeSubject)
      .subscribe((value) => {
        if (value != null) {
          this.cards = value;
        } else {
          this.cards = [];
        }
      });
  }

  ngOnDestroy(): void {
    this.cardsUnsubscribeSubject.next();
    this.cardsUnsubscribeSubject.complete();
  }

  /**
   * Handles click on menu items
   * @param menuItem
   */
  onMenuItemClicked(menuItem: string) {
    switch (menuItem) {
      case 'settings': {
        this.snackbarService.showSnackbar('Clicked on menu item Settings', '');
        break;
      }
      case 'back': {
        this.router.navigate(['/stacks']);
        break;
      }
      case 'add': {
        let dialogRef = this.dialog.open(CardDialogComponent, {disableClose: true});
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            this.cardsService.createCard(result as Card);
            this.snackbarService.showSnackbar('Added card', '');
          }
        });
        break;
      }
      default: {
        break;
      }
    }
  }

}
