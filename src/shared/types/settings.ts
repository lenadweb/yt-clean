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

export interface ISettings {
    hideShorts: IBaseSetting;
    hideSearchTags: IBaseSetting;
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
    hideDescriptionRelatedVideo: IBaseSetting;
}
