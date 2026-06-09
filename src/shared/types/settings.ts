export interface ToggleSetting {
    enabled?: boolean;
}

export interface ValuedSetting extends ToggleSetting {
    value?: string;
}

export type SettingValue = ValuedSetting;

export interface SettingsState {
    hideShorts: ToggleSetting;
    hideHoverPreview: ToggleSetting;
    hideSearchTags: ToggleSetting;
    speedControl: ValuedSetting;
    adsYoutubeBanner: ToggleSetting;
    adsFeedVideo: ToggleSetting;
    hideJams: ToggleSetting;
    hideCreateVideo: ToggleSetting;
    voiceButtonInSearch: ToggleSetting;
    virtualKeyboard: ToggleSetting;
    notificationButton: ToggleSetting;
    hideNewsSection: ToggleSetting;
    hideChannelBanner: ToggleSetting;
    hideChannelTrailer: ToggleSetting;
    autoNextShorts: ToggleSetting;
    hidePlayerAutoplay: ToggleSetting;
    hidePlayerSubtitlesButton: ToggleSetting;
    hidePlayerWideSizePlayerButton: ToggleSetting;
    hidePlayerMiniSizePlayerButton: ToggleSetting;
    hideSidebar: ToggleSetting;
    hideMenuShorts: ToggleSetting;
    hideMenuHistory: ToggleSetting;
    hideMenuPlaylists: ToggleSetting;
    hideMenuYourVideo: ToggleSetting;
    hideMenuWatchLater: ToggleSetting;
    hideMenuLikedVideos: ToggleSetting;
    hideYourMovies: ToggleSetting;
    hideMenuSubscriptionsList: ToggleSetting;
    hideMenuExploreTrending: ToggleSetting;
    hideMenuExploreMusic: ToggleSetting;
    hideMenuExploreGaming: ToggleSetting;
    hideMenuExploreNews: ToggleSetting;
    hideMenuExploreSports: ToggleSetting;
    hideMenuMorePremium: ToggleSetting;
    hideMenuMoreMusic: ToggleSetting;
    hideMenuMoreKids: ToggleSetting;
    hideMenuMoreStudio: ToggleSetting;
    shortSpeedControl: ToggleSetting;
}
