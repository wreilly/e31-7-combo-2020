/*
REDUCERS:
1. Is Sidenav Open? Y/N
2. IsLoading (spinner)? Y/N

/app/shared/store/ui.reducer.ts

BE SURE TO SEE MORE NOTES IN
/Users/william.reilly/dev/Angular/Udemy-AngularMaterial-MaxS/2019/WR__2/fitness-tracker-wr3/src/app/app.reducer.ts
 */

import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromUi from '../shared/store/ui.reducer';

export interface MyOverallState {
    uiPartOfStore: fromUi.MyState;
}

export const myRootReducersMap: ActionReducerMap<MyOverallState> = {
  uiPartOfStore: fromUi.UIReducer,
};

// ********  Utility functions  ********

export const getUiState = createFeatureSelector<fromUi.MyState>('uiPartOfStore');

export const getIsSidenavOpen = createSelector(getUiState, fromUi.getIsSidenavOpen)

export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading)
