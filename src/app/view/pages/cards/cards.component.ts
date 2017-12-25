import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackbarService} from '../../../services/snackbar.service';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {CardDialogComponent} from '../../dialogs/card-dialog/card-dialog.component';
import {Card} from '../../../model/card.model';
import {CardsService} from '../../../services/cards.service';
import {Subject} from 'rxjs/Subject';
import {TagDialogComponent} from '../../dialogs/tag-dialog/tag-dialog.component';
import {Tag} from '../../../model/tag.model';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styles: [require('./cards.component.scss')]
})
export class CardsComponent implements OnInit, OnDestroy {
  title = 'Lymbo';
  filteredCards: Card[] = [];
  tags: Tag[] = [];
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
    this.cardsService.stack = stack;
    this.cardsService.cards = stack.cards.reduce((map, c) => {
      return map.set(c.id, c);
    }, new Map<String, Card>());

    this.tags = this.cardsService.getAllTags();
    this.filteredCards = this.cardsService.getFilteredCards();

    this.cardsService.cardsSubject
      .takeUntil(this.cardsUnsubscribeSubject)
      .subscribe((value) => {
        this.filteredCards = value;
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
      case 'back': {
        this.router.navigate(['/stacks']).then();
        break;
      }
      case 'settings': {
        this.snackbarService.showSnackbar('Clicked on menu item Settings', '');
        break;
      }
      case 'tags': {
        let dialogRef = this.dialog.open(TagDialogComponent, {
          disableClose: true,
          data: {
            dialogTitle: 'Select tags',
            tags: this.cardsService.getAllTags()
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            this.cardsService.update();
            this.snackbarService.showSnackbar('Tags selected', '');
          }
        });
        break;
      }
      case 'refresh': {
        this.cardsService.uncheckAll();
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

  /**
   * Handles click on side menu items
   * @param menuItem
   */
  onSideMenuItemClicked(menuItem: string) {
    this.snackbarService.showSnackbar(`Clicked on side menu item ${menuItem}`, '');
  }
}
