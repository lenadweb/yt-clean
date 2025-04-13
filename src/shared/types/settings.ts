export interface IBaseSetting {
    enabled?: boolean;
}

interface IDescriptionSettings {
    autoExpand: IBaseSetting;
    disableEpisodes: IBaseSetting;
    disableTranscript: IBaseSetting;
    disableRelatedVideos: IBaseSetting;
}

interface IRelatedSettings extends IBaseSetting {
    maxVideo?: number;
}

export interface IDropdownSettings extends IBaseSetting {
    value?: string;
}

export interface IAllSetting extends IDropdownSettings, IRelatedSettings {}

export interface ISettings {
    hideShorts: IBaseSetting;
    hideSearchTags: IBaseSetting;
    persistentCommentSort: IDropdownSettings;
    persistentQuality: IDropdownSettings;
    persistentPlaybackSpeed: IDropdownSettings;
    adsYoutubeBanner: IBaseSetting;
    adsSearchResults: IBaseSetting;
    adsFeedVideo: IBaseSetting;
    hideJams: IBaseSetting;
    hideCreateVideo: IBaseSetting;
    voiceButtonInSearch: IBaseSetting;
    virtualKeyboard: IBaseSetting;
    subscribeButton: IBaseSetting;
    rightCommentMode: IBaseSetting;
    hideSponsorVideo: IBaseSetting;
    hideSponsorButton: IBaseSetting;
    notificationButton: IBaseSetting;
    relatedVideos: IRelatedSettings;
    hideLiveChat: IBaseSetting;
    disableAutoplay: IBaseSetting;
    commentsRightMode: IBaseSetting;
    hideNewsSection: IBaseSetting;
    hideChannelBanner: IBaseSetting;
    hideChannelTrailer: IBaseSetting;
    hidePlayerAutoplay: IBaseSetting;
    hidePlayerSubtitlesButton: IBaseSetting;
    hidePlayerWideSizePlayerButton: IBaseSetting;
    hidePlayerMiniSizePlayerButton: IBaseSetting;
    autoOpenDescription: IBaseSetting;
    hideEpisodesDescription: IBaseSetting;
    hideTranscriptSection: IBaseSetting;
    hidePeopleMentioned: IBaseSetting;
    hideMenuShorts: IBaseSetting;
    hideMenuHistory: IBaseSetting;
    hideMenuPlaylists: IBaseSetting;
    hideMenuYourVideo: IBaseSetting;
    hideMenuWatchLater: IBaseSetting;
    hideMenuLikedVideos: IBaseSetting;
    hideYourMovies: IBaseSetting;
    hideDescriptionRelatedVideo: IBaseSetting;
    hideMenuSubscriptionsList: IBaseSetting;
    hideMenuExploreTrending: IBaseSetting;
    hideMenuExploreMusic: IBaseSetting;
    hideMenuExploreGaming: IBaseSetting;
    hideMenuExploreNews: IBaseSetting;
    hideMenuExploreSports: IBaseSetting;
    hideMenuMorePremium: IBaseSetting;
    hideMenuMoreMusic: IBaseSetting;
    hideMenuMoreKids: IBaseSetting;
    hideMenuMoreStudio: IBaseSetting;
}
