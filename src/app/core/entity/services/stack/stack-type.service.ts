import {Injectable} from '@angular/core';
import {SettingsService} from '../../../settings/services/settings.service';
import {StackType} from '../../model/stack-type.enum';
import {StackTypeGroup} from '../../model/stack-type-group.enum';

/**
 * Handles stack type hierarchy
 */
@Injectable({
  providedIn: 'root'
})
export class StackTypeService {

  /** Map of stack types and type groups */
  stackTypeGroups = new Map<StackType, StackTypeGroup>();

  /**
   * Constructor
   * @param settingsService settings service
   */
  constructor(private settingsService: SettingsService) {
    this.initializeStackTypeHierarchy();
  }

  //
  // Initialization
  //

  /**
   * Initializes stack type hierarchy
   */
  private initializeStackTypeHierarchy() {
    const groups = Object.keys(StackTypeGroup).map(key => StackTypeGroup[key]);

    groups.forEach(group => {
      switch (group) {
        case StackTypeGroup.UNSPECIFIED: {
          this.stackTypeGroups.set(StackType.UNSPECIFIED, group);
          break;
        }
        case StackTypeGroup.FREESTYLE: {
          this.stackTypeGroups.set(StackType.FREESTYLE, group);
          break;
        }
        case StackTypeGroup.LANGUAGE: {
          this.stackTypeGroups.set(StackType.LANGUAGE, group);
          break;
        }
      }
    });
  }

  //
  // Lookup
  //

  /**
   * Returns a list of stack types contained in a given stack type group
   * @param group stack type group
   */
  public getStackTypesByGroup(group: StackTypeGroup): StackType[] {
    const types: StackType[] = [];

    this.stackTypeGroups.forEach((g: StackTypeGroup, t: StackType) => {
      if (g === group) {
        types.push(t);
      }
    });

    return types;
  }

  /**
   * Returns the stack type group of a given stack type
   * @param type stack type
   */
  public getStackGroupByType(type: StackType): StackTypeGroup {
    return this.stackTypeGroups.get(type);
  }

  /**
   * Determines if a stack type group contains a given stack type
   * @param group stack type group
   * @param type stack type
   */
  public groupContainsType(group: StackTypeGroup, type: StackType) {
    return this.stackTypeGroups.get(type) === group;
  }

  /**
   * Retrieves an icon by stack type
   * @param group stack type group
   */
  public getIconByStackTypeGroup(group: StackTypeGroup): string {
    switch (group) {
      case StackTypeGroup.UNSPECIFIED: {
        return 'help';
      }
      case StackTypeGroup.FREESTYLE: {
        return 'crop_free';
      }
      case StackTypeGroup.LANGUAGE: {
        return 'translate';
      }
    }
  }

  /**
   * Retrieves an icon by stack type
   * @param type stack type
   */
  public getIconByStackType(type: StackType): string {
    switch (type) {
      case StackType.UNSPECIFIED: {
        return 'help';
      }
      case StackType.FREESTYLE: {
        return 'crop_free';
      }
      case StackType.LANGUAGE: {
        return 'translate';
      }
    }
  }
}
