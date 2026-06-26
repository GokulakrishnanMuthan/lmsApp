import { createAction, props } from '@ngrx/store';

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

export const rackSearchFilter = createAction(BookActionTypes.rackSearchFilter, props<{ rackValue: string }>());
export const rowSearchFilter = createAction(BookActionTypes.rowSearchFilter, props<{ rsValue: string }>());
export const accessNoSearchFilter = createAction(BookActionTypes.accessNoSearchFilter, props<{ anS: string }>());
export const titleSearchFilter = createAction(BookActionTypes.titleSearchFilter, props<{ bS: string }>());
export const authorSearchFilter = createAction(BookActionTypes.authorSearchFilter, props<{ aS: string }>());
export const publisherSearchFilter = createAction(BookActionTypes.publisherSearchFilter, props<{ pS: string }>());
export const languageSearchFilter = createAction(BookActionTypes.languageSearchFilter, props<{ lS: string }>());
export const bookStatusSearchFilter = createAction(BookActionTypes.bookStatusSearchFilter, props<{ bookStaS: string }>());
