export const Actions = {
    setUser,
    setFileUrls,
    setCategories,
    setSelectedCategory,
    setFilters,
    setCopiedVideoID,
    setUnreadChatCount,
    setUnreadNotificationCount,
    setHasSubscribed,
    setSubscriberFreeProgramAccess,
    setGuides,
};

function setUser(data) {
    return {
        type: 'setUser',
        payload: data
    }
}
function setFileUrls(data) {
    return {
        type: 'setFileUrls',
        payload: data
    }
}
function setCategories(data) {
    return {
        type: 'setCategories',
        payload: data
    }
}
function setSelectedCategory(data) {
    return {
        type: 'setSelectedCategory',
        payload: data
    }
}
function setFilters(data) {
    return {
        type: 'setFilters',
        payload: data
    }
}
function setCopiedVideoID(data) {
    return {
        type: 'setCopiedVideoID',
        payload: data
    }
}
function setUnreadChatCount(data) {
    return {
        type: 'setUnreadChatCount',
        payload: data
    }
}
function setUnreadNotificationCount(data) {
    return {
        type: 'setUnreadNotificationCount',
        payload: data
    }
}
function setHasSubscribed(data) {
    return {
        type: 'setHasSubscribed',
        payload: data
    }
}
function setSubscriberFreeProgramAccess(data) {
    return {
        type: 'setSubscriberFreeProgramAccess',
        payload: data
    }
}
function setGuides(data) {
    return {
        type: 'setGuides',
        payload: data
    }
}