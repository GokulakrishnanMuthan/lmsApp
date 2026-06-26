import { createReducer, on } from '@ngrx/store';
import * as BookActions from './book.actions';
import { BookState } from './book.model';

export interface AppState {
  book: BookState;
}

export const initialState: BookState = {
  rackSearchFilterVal: '',
  rowSearchFilterVal: '',
  accessNoSearchFilterVal: '',
  titleSearchFilterVal: '',
  authorSearchFilterVal: '',
  publisherSearchFilterVal: '',
  languageSearchFilterVal: '',
  bookStatusSearchFilterVal: '',
};

export const reducer = createReducer(
  initialState,
  on(BookActions.rackSearchFilter, (state, { rackValue }) => ({ ...state, rackSearchFilterVal: rackValue })),
  on(BookActions.rowSearchFilter, (state, { rsValue }) => ({ ...state, rowSearchFilterVal: rsValue })),
  on(BookActions.accessNoSearchFilter, (state, { anS }) => ({ ...state, accessNoSearchFilterVal: anS })),
  on(BookActions.titleSearchFilter, (state, { bS }) => ({ ...state, titleSearchFilterVal: bS })),
  on(BookActions.authorSearchFilter, (state, { aS }) => ({ ...state, authorSearchFilterVal: aS })),
  on(BookActions.publisherSearchFilter, (state, { pS }) => ({ ...state, publisherSearchFilterVal: pS })),
  on(BookActions.languageSearchFilter, (state, { lS }) => ({ ...state, languageSearchFilterVal: lS })),
  on(BookActions.bookStatusSearchFilter, (state, { bookStaS }) => ({ ...state, bookStatusSearchFilterVal: bookStaS })),
);
