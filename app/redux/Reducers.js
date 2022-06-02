import { mediaUrl } from '../api/api'

const initialState = {
    user: null,
    guides: [{"id":"more","detail":"See more options"},{"id":"search","detail":"Search quickly any videos from our Library!"},{"id":"bell","detail":"Check important alerts sent by Admin!"},{"id":"subscribe","detail":"Subscribe to our monthly plan (7 days free trial) and get unlimited access to our Video Library!"},{"id":"library","detail":"Browse our Video Library for all kinds of training material."},{"id":"special","detail":"We have designed a list of Special Programs for different users based on their ages and goals. Please check out."}],
    fileUrls: {
        "LibraryImages": mediaUrl + "/library/images/",
        "LibraryVideos": mediaUrl + "/library/videos/",
        "Equipment": mediaUrl + "/equipment/",
        "Slide": mediaUrl + "/slides/",
        "SpecialProgram": mediaUrl + "/programs/",
        "User": mediaUrl + "/users/"
    },
    categories: [],
    selectedCategory: null,
    filters: { ages: [], goals: [] },
    copiedVideoID: '',
    unreadChatCount: 0,
    unreadNotificationCount: 0,
    hasSubscribed: '0',
    subscriberFreeProgramAccess: '0'
};

export function UserReducer(state = initialState, action) {
    // console.log('UserReducer: ' + JSON.stringify(action.payload));
    switch (action.type) {
        case 'setUser':
            return {
                user: action.payload,
            };
        default:
            return state;
    }
}

export function FileUrlsReducer(state = initialState, action) {
    // console.log('FileUrlsReducer: ' + JSON.stringify(action.payload));
    switch (action.type) {
        case 'setFileUrls':
            return {
                fileUrls: action.payload,
            };
        default:
            return state;
    }
}

export function CategoriesReducer(state = initialState, action) {
    // console.log('CategoriesReducer: ' + JSON.stringify(action.payload));
    switch (action.type) {
        case 'setCategories':
            return {
                categories: action.payload,
            };
        default:
            return state;
    }
}

export function SelectedCategoryReducer(state = initialState, action) {
    // console.log('SelectedCategoryReducer: ' + JSON.stringify(action.payload));
    switch (action.type) {
        case 'setSelectedCategory':
            return {
                selectedCategory: action.payload,
            };
        default:
            return state;
    }
}

export function FiltersReducer(state = initialState, action) {
    // console.log('FiltersReducer: ' + JSON.stringify(action.payload));
    switch (action.type) {
        case 'setFilters':
            return {
                filters: action.payload,
            };
        default:
            return state;
    }
}

export function CopiedVideoIDReducer(state = initialState, action) {
    // console.log('FiltersReducer: ' + JSON.stringify(action.payload));
    switch (action.type) {
        case 'setCopiedVideoID':
            return {
                copiedVideoID: action.payload,
            };
        default:
            return state;
    }
}

export function ChatCountReducer(state = initialState, action) {
    // console.log('FiltersReducer: ' + JSON.stringify(action.payload));
    switch (action.type) {
        case 'setUnreadChatCount':
            return {
                unreadChatCount: action.payload,
            };
        default:
            return state;
    }
}

export function NotificationCountReducer(state = initialState, action) {
    switch (action.type) {
        case 'setUnreadNotificationCount':
            return {
                unreadNotificationCount: action.payload,
            };
        default:
            return state;
    }
}

export function HasSubscribedReducer(state = initialState, action) {
    // console.log('FiltersReducer: ' + JSON.stringify(action.payload));
    switch (action.type) {
        case 'setHasSubscribed':
            return {
                hasSubscribed: action.payload,
            };
        default:
            return state;
    }
}

export function SubscriberFreeProgramAccess(state = initialState, action) {
    // console.log('FiltersReducer: ' + JSON.stringify(action.payload));
    switch (action.type) {
        case 'setSubscriberFreeProgramAccess':
            return {
                subscriberFreeProgramAccess: action.payload,
            };
        default:
            return state;
    }
}

export function GuidesReducer(state = initialState, action) {
    // console.log('FiltersReducer: ' + JSON.stringify(action.payload));
    switch (action.type) {
        case 'setGuides':
            return {
                guides: action.payload,
            };
        default:
            return state;
    }
}