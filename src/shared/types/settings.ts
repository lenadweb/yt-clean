export interface IBaseSetting {
    enabled?: boolean;
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
    hideHoverPreview: IBaseSetting;
    hideSearchTags: IBaseSetting;
    speedControl: IDropdownSettings;
    adsYoutubeBanner: IBaseSetting;
    adsFeedVideo: IBaseSetting;
    hideJams: IBaseSetting;
    hideCreateVideo: IBaseSetting;
    voiceButtonInSearch: IBaseSetting;
    virtualKeyboard: IBaseSetting;
    notificationButton: IBaseSetting;
    hideNewsSection: IBaseSetting;
    hideChannelBanner: IBaseSetting;
    hideChannelTrailer: IBaseSetting;
    autoNextShorts: IBaseSetting;
    hidePlayerAutoplay: IBaseSetting;
    hidePlayerSubtitlesButton: IBaseSetting;
    hidePlayerWideSizePlayerButton: IBaseSetting;
    hidePlayerMiniSizePlayerButton: IBaseSetting;
    hideSidebar: IBaseSetting;
    hideMenuShorts: IBaseSetting;
    hideMenuHistory: IBaseSetting;
    hideMenuPlaylists: IBaseSetting;
    hideMenuYourVideo: IBaseSetting;
    hideMenuWatchLater: IBaseSetting;
    hideMenuLikedVideos: IBaseSetting;
    hideYourMovies: IBaseSetting;
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
}
