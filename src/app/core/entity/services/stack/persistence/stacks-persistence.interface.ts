import {User} from 'firebase';
import {Stack} from '../../../model/stack/stack.model';
import {Subject} from 'rxjs/Subject';

/**
 * Interface containing stacks persistence methods
 */
export interface StacksPersistenceService {

  /** Map of all stacks */
  stacks: Map<String, Stack>;
  /** Subject that publishes stacks */
  stacksSubject: Subject<Stack[]>;

  /** Stack in focus */
  stack: Stack;
  /** Subject that publishes stack */
  stackSubject: Subject<Stack>;

  //
  // Read
  //

  /**
   * Finds all stacks
   * @param user user (optional)
   */
  findStacks(user?: User);

  /**
   * Finds stack by a given ID
   * @param user user (optional)
   * @param {number} id ID of filter by
   */
  findStackByID(id: string, user?: User);

  //
  // Create
  //

  /**
   * Creates a new stack
   * @param stack stack to be created
   */
  createStack(stack: Stack): Promise<any>;

  /**
   * Creates new stacks
   * @param stacks stacks to be created
   */
  createStacks(stacks: Stack[]): Promise<any>;

  //
  // Update
  //

  /**
   * Updates an existing stack
   * @param stack stack to be updated
   */
  updateStack(stack: Stack): Promise<any>;

  //
  // Delete
  //

  /**
   * Deletes a stack
   * @param {Stack} stack stack to be deleted
   */
  deleteStack(stack: Stack): Promise<any>;

  /**
   * Deletes an array of stacks
   * @param stacks stacks
   */
  deleteStacks(stacks: Stack[]): Promise<any>;

  //
  // Others
  //

  /**
   * Uploads a stack
   * @param stack stack
   * @param owner user that will be the new owner of this stack
   */
  uploadStack(stack: Stack, owner?: User);

  /**
   * Clears all stacks
   */
  clearStacks();

  /**
   * Informs subscribers that something has changed
   */
  notifyMultipleStacks();

  /**
   * Informs subscribers that something has changed
   */
  notifySingleStack();
}
