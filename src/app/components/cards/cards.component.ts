import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackbarService} from '../../services/snackbar.service';
import {MatIconRegistry, MdDialog} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {CardDialogComponent} from '../card-dialog/card-dialog.component';
import {Card} from '../../model/card.model';
import {CardsService} from '../../services/cards.service';
import {StacksService} from '../../services/stacks.service';
import {Stack} from '../../model/stack.model';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styles: [require('./cards.component.scss')]
})
export class CardsComponent implements OnInit, OnDestroy {
  title = 'Lymbo';
  stack: Stack = new Stack();
  private cardsUnsubscribeSubject = new Subject();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private cardsService: CardsService,
              private stacksService: StacksService,
              private snackbarService: SnackbarService,
              public dialog: MdDialog,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'add',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_add_white_24px.svg'));
  }

  ngOnInit() {
    this.stack = this.route.snapshot.data['stack'];

    this.title = this.stack != null ? `Lymbo | ${this.stack.title}` : `Lymbo`;

    this.cardsService.cardsAddSubject
      .takeUntil(this.cardsUnsubscribeSubject)
      .subscribe((value) => {
        if (value != null) {
          this.stack.cards.push(value as Card);
        } else {
          this.stack.cards = [];
        }
      });
    this.cardsService.cardsDeleteSubject
      .takeUntil(this.cardsUnsubscribeSubject)
      .subscribe((value) => {
      if (value != null) {
        this.stack.cards = this.stack.cards.filter(c => c.id !== (value as Card).id);
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
        this.stacksService.updateStack(this.stack);
        this.router.navigate(['/stacks']);
        break;
      }
      case 'add': {
        let dialogRef = this.dialog.open(CardDialogComponent, {disableClose: true});
        dialogRef.afterClosed().subscribe(result => {
          if (result != null) {
            this.cardsService.addCard(result as Card);
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
