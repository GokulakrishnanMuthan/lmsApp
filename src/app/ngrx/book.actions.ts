import { Action } from '@ngrx/store';
import { createAction, props } from "@ngrx/store";

export enum BookActionTypes {
    rowSearchFilter = '[Book] rowSearchFilter',
    rackSearchFilter = '[Book] rackSearchFilter',
    accessNoSearchFilter = '[Book] accessNoSearchFilter',
    titleSearchFilter = '[Book] titleSearchFilter', 
    authorSearchFilter = '[Book] authorSearchFilter',
    publisherSearchFilter = '[Book] publisherSearchFilter',
    languageSearchFilter = '[Book] languageSearchFilter',
    bookStatusSearchFilter = '[Book] bookStatusSearchFilter',

}

 export class rackSearchFilter11 implements Action {  readonly type = BookActionTypes.rackSearchFilter; }

 export class rowSearchFilter11 implements Action {  readonly type = BookActionTypes.rowSearchFilter; }

 export class accessNoSearchFilter11 implements Action {  readonly type = BookActionTypes.accessNoSearchFilter; }

 export class titleSearchFilter11 implements Action {  readonly type = BookActionTypes.titleSearchFilter; }

 export class authorSearchFilter11 implements Action {  readonly type = BookActionTypes.authorSearchFilter; }

 export class publisherSearchFilter11 implements Action {  readonly type = BookActionTypes.publisherSearchFilter; }

 export class languageSearchFilter11 implements Action {  readonly type = BookActionTypes.languageSearchFilter; }
 export class bookStatusSearchFilter11 implements Action {  readonly type = BookActionTypes.bookStatusSearchFilter; }

export const rackSearchFilter = createAction( "[Book] rackSearchFilter",  props<{ rackValue: string }>());
export const rowSearchFilter = createAction(  "[Book] rowSearchFilter",  props<{ rsValue: string }>());
export const accessNoSearchFilter = createAction(  "[Book] accessNoSearchFilter",  props<{ anS: string }>());
export const titleSearchFilter = createAction(  "[Book] titleSearchFilter",  props<{ bS: string }>());
export const authorSearchFilter = createAction(  "[Book] authorSearchFilter",  props<{ aS: string }>());
export const publisherSearchFilter = createAction(  "[Book] publisherSearchFilter",  props<{ pS: string }>());
export const languageSearchFilter = createAction(  "[Book] languageSearchFilter",  props<{ lS: string }>());
export const bookStatusSearchFilter = createAction(  "[Book] bookStatusSearchFilter",  props<{ bookStaS: string }>());


export type BookActions = rackSearchFilter11 | rowSearchFilter11 | accessNoSearchFilter11 | titleSearchFilter11 | authorSearchFilter11 | publisherSearchFilter11 | languageSearchFilter11 | bookStatusSearchFilter11;

