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

export interface ITimeLimitSettings extends IBaseSetting {
    valueInMinutes?: string;
}

export interface ISubtitleSettings extends IBaseSetting {
    value?: string;
    tmstp?: number;
}

export interface IAllSetting
    extends IDropdownSettings,
        IRelatedSettings,
        ITimeLimitSettings {}

export interface ISettings {
    hideShorts: IBaseSetting;
    hideSearchTags: IBaseSetting;
    persistentCommentSort: IDropdownSettings;
    persistentQuality: IDropdownSettings;
    persistentPlaybackSpeed: IDropdownSettings;
    defaultMusicPlaybackSpeed: IDropdownSettings;
    adsYoutubeBanner: IBaseSetting;
    adsSearchResults: IBaseSetting;
    adsFeedVideo: IBaseSetting;
    hideJams: IBaseSetting;
    hideCreateVideo: IBaseSetting;
    searchMode: IBaseSetting;
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
    autoNextShorts: IBaseSetting;
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
    shortSpeedControl: IBaseSetting;
    dailyTimeLimit: ITimeLimitSettings;
    spentTimeToday: ISubtitleSettings;
}
