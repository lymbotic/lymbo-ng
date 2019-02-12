import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Media} from '../../../../../core/ui/model/media.enum';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {Stack} from '../../../../../core/entity/model/stack/stack.model';
import {StacksService} from '../../../../../core/entity/services/stack/stacks.service';
import {User} from 'firebase';

/**
 * Displays stacks toolbar
 */
@Component({
  selector: 'app-stacks-toolbar',
  templateUrl: './stacks-toolbar.component.html',
  styleUrls: ['./stacks-toolbar.component.scss']
})
export class StacksToolbarComponent implements OnInit {

  /** Title displayed in the toolbar */
  @Input() title;
  /** Current media */
  @Input() media: Media;
  /** Search items options for auto-complete */
  @Input() searchOptions = [];
  /** Indicates whether a filter is active */
  @Input() filterActive = false;
  /** Current user */
  @Input() user: User;
  /** Event emitter indicating changes in search bar */
  @Output() searchItemEventEmitter = new EventEmitter<string>();
  /** Event emitter indicating menu items being clicked */
  @Output() menuItemEventEmitter = new EventEmitter<string>();

  /** File change input */
  @ViewChild('fileChange') fileChange: ElementRef;

  /** Enum for media types */
  mediaType = Media;

  /** Current search item */
  searchItem = '';
  /** Debouncer for search field */
  searchItemDebouncer = new Subject();
  /** Filtered search items options for auto-complete */
  searchOptionsFiltered: string[];

  /**
   * Constructor
   * @param stacksService stacks service
   */
  constructor(private stacksService: StacksService) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeOptions();
    this.initializeDebouncer();
  }

  //
  // Initialization
  //

  /**
   * Initialize auto-complete options
   */
  private initializeOptions() {
    this.searchOptionsFiltered = this.searchOptions;
  }

  /**
   * Initializes search options filter
   */
  private initializeDebouncer() {
    this.searchItemDebouncer.pipe(
      debounceTime(500)
    ).subscribe((value) => {
      this.searchItemEventEmitter.emit(value.toString());
    });
  }

  //
  // Actions
  //

  /** Handles click on menu item
   * @param {string} menuItem
   */
  onMenuItemClicked(menuItem: string): void {
    this.menuItemEventEmitter.emit(menuItem);
  }

  /**
   * Handles click on import button
   */
  onFileInputClicked() {
    this.fileChange.nativeElement.click();
  }

  /**
   * Handles uploaded files
   * @param event event
   */
  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsText(file);
      reader.onload = () => {
        this.stacksService.uploadStack(JSON.parse(reader.result) as Stack);
      };
    }
  }

  /**
   * Handles changes in search item
   * @param searchItem search item
   */
  onSearchItemChanged(searchItem: string) {
    this.searchItem = searchItem;
    this.searchOptionsFiltered = this.filterOptions(this.searchItem);
    this.searchItemDebouncer.next(this.searchItem);
  }

  /**
   * Handles click on search field
   */
  onSearchFieldClicked() {
    this.filterOptions(this.searchItem);
  }

  /**
   * Handles key up event
   */
  onKeyUp() {
    this.searchItemDebouncer.next(this.searchItem);
  }

  /**
   * Handles option selection
   */
  onOptionSelected() {
    this.searchItemDebouncer.next(this.searchItem);
  }

  /**
   * Handles click on clear button
   */
  onClearButtonClicked() {
    this.searchItem = '';
    this.searchItemDebouncer.next(this.searchItem);
  }

  //
  // Filters
  //

  /**
   * Filters options according to current value of input field
   * @param {string} value input field value
   * @returns {string[]} array of filtered options
   */
  private filterOptions(value: string): string[] {
    return this.searchOptions.filter(option =>
      option.toLowerCase().includes(value.toLowerCase())
    );
  }
}
