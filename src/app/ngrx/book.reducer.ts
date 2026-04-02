import { BookActionTypes, BookActions } from './book.actions';
import {BookState} from './book.model'

export interface AppState {
  book: BookState;
}

export const initialState: BookState = {
    rackSearchFilterVal:"",
    rowSearchFilterVal:'',
    accessNoSearchFilterVal:'',
    titleSearchFilterVal:'',
    authorSearchFilterVal:'',
    publisherSearchFilterVal:'',
    languageSearchFilterVal:''
};



export function reducer(state:BookState = initialState, action: BookActions) {
    //console.log("access No"+JSON.stringify(action))
   // console.log("state-->"+JSON.stringify(state));
  switch (action.type) {
    case BookActionTypes.rackSearchFilter: 
     return {...state, rackSearchFilterVal:action['rackValue']    };
    case BookActionTypes.rowSearchFilter: 
        return {...state, rowSearchFilterVal:action['rsValue']  };
    case BookActionTypes.accessNoSearchFilter: 
      return {...state, accessNoSearchFilterVal:action['anS']  };
    case BookActionTypes.titleSearchFilter: 
      return {...state, titleSearchFilterVal:action['bS']  };
    case BookActionTypes.authorSearchFilter: 
      return {...state, authorSearchFilterVal:action['aS']  };
    case BookActionTypes.publisherSearchFilter: 
      return {...state, publisherSearchFilterVal:action['pS']  };
    case BookActionTypes.languageSearchFilter: 
      return {...state, languageSearchFilterVal:action['lS']  };
    default:
        return state;
  }
}
