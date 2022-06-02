import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {UserReducer, CategoriesReducer, SelectedCategoryReducer, FiltersReducer, FileUrlsReducer, CopiedVideoIDReducer, ChatCountReducer, NotificationCountReducer, HasSubscribedReducer, SubscriberFreeProgramAccess, GuidesReducer} from "./Reducers";

const allReducers = combineReducers({
    UserReducer, CategoriesReducer, SelectedCategoryReducer, FiltersReducer, FileUrlsReducer, CopiedVideoIDReducer, ChatCountReducer, NotificationCountReducer, HasSubscribedReducer, SubscriberFreeProgramAccess, GuidesReducer
});
const applicationStore = createStore(allReducers, applyMiddleware(thunkMiddleware));
export default applicationStore;
