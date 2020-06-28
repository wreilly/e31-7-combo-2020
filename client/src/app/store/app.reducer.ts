import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromUi from '../shared/store/ui.reducer';

export interface MyOverallState {
    uiPartOfStore: fromUi.MyState;
}

export const myRootReducersMap: ActionReducerMap<MyOverallState> = {
  uiPartOfStore: fromUi.UIReducer,
};

export const getUiState = createFeatureSelector<fromUi.MyState>('uiPartOfStore');
export const getIsSidenavOpen = createSelector(getUiState, fromUi.getIsSidenavOpen)
