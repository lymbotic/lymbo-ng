import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Language} from '../../../../../core/entity/model/language.enum';

@Component({
  selector: 'app-language-selection-fragment',
  templateUrl: './language-selection-fragment.component.html',
  styleUrls: ['./language-selection-fragment.component.scss']
})
export class LanguageSelectionFragmentComponent {

  /** Language to be displayed */
  @Input() language: Language;
  /** Placeholder */
  @Input() placeholder: string;
  /** Event emitter indicating changes in language */
  @Output() languageChangedEmitter = new EventEmitter<Language>();

  /** Available languages */
  languages = Object.keys(Language).map(key => Language[key]);

  /** Reference to static method */
  selectIcon = LanguageSelectionFragmentComponent.selectIcon;

  /**
   * Retrieves an icon by language
   * @param language language
   */
  static selectIcon(language: Language) {
    switch (language) {
      default: {
        return 'blank';
      }
    }
  }

  //
  // Actions
  //

  /**
   * Handles selection change
   */
  onSelectionChanged() {
    this.languageChangedEmitter.emit(this.language);
  }
}
