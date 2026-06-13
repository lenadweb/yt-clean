# Feature catalog

This catalog lists the current declarative features. Use it before opening a
feature request or PR to avoid duplicates and to pick the closest config area.

Unless noted otherwise, features are disabled by default and apply on all
YouTube pages.

## Basic template

| Category       | Section        | Feature id            | UI label                     | Action type  | Scope     |
| -------------- | -------------- | --------------------- | ---------------------------- | ------------ | --------- |
| Basic template | Search Bar     | `voiceButtonInSearch` | Hide voice search button     | hide         | all pages |
| Basic template | Search Bar     | `virtualKeyboard`     | Hide virtual keyboard button | hide         | all pages |
| Basic template | Search Bar     | `hideSearchTags`      | Hide search tags             | hide, styles | all pages |
| Basic template | Actions & user | `hideCreateVideo`     | Hide upload button           | hide         | all pages |
| Basic template | Actions & user | `notificationButton`  | Hide notifications           | hide         | all pages |

## Feed & Recommendations

| Category               | Section        | Feature id         | UI label                      | Action type | Scope     |
| ---------------------- | -------------- | ------------------ | ----------------------------- | ----------- | --------- |
| Feed & Recommendations | Content blocks | `hideShorts`       | Hide Shorts sections          | hide        | all pages |
| Feed & Recommendations | Content blocks | `hideNewsSection`  | Hide Explore & News           | hide        | all pages |
| Feed & Recommendations | Content blocks | `hideHoverPreview` | Disable auto-preview on hover | custom      | all pages |
| Feed & Recommendations | Content blocks | `hideJams`         | Hide Mixes & Playlists        | hide        | all pages |
| Feed & Recommendations | Ads            | `adsYoutubeBanner` | Hide YouTube Banners          | hide        | all pages |
| Feed & Recommendations | Ads            | `adsFeedVideo`     | Hide Sponsored feed video     | hide        | all pages |

## Video Playback & Channel

| Category                 | Section                       | Feature id                       | UI label                        | Action type         | Scope         |
| ------------------------ | ----------------------------- | -------------------------------- | ------------------------------- | ------------------- | ------------- |
| Video Playback & Channel | Slider playback speed control | `speedControl`                   | Slider playback speed control   | component, onChange | watch pages   |
| Video Playback & Channel | Player                        | `hidePlayerMiniSizePlayerButton` | Hide mini-size button           | hide                | all pages     |
| Video Playback & Channel | Player                        | `hidePlayerWideSizePlayerButton` | Hide wide-size button           | hide                | all pages     |
| Video Playback & Channel | Player                        | `hidePlayerSubtitlesButton`      | Hide subtitles button           | hide                | all pages     |
| Video Playback & Channel | Player                        | `hidePlayerAutoplay`             | Hide autoplay switcher          | hide                | all pages     |
| Video Playback & Channel | Shorts                        | `shortSpeedControl`              | Speed Control                   | component           | Shorts pages  |
| Video Playback & Channel | Shorts                        | `autoNextShorts`                 | Automatic switching to the next | custom              | Shorts pages  |
| Video Playback & Channel | Channel                       | `hideChannelTrailer`             | Hide Channel trailer            | hide, custom        | channel pages |
| Video Playback & Channel | Channel                       | `hideChannelBanner`              | Hide Channel banner             | hide                | all pages     |

## Sidebar

| Category | Section                 | Feature id                  | UI label                | Action type  | Scope     |
| -------- | ----------------------- | --------------------------- | ----------------------- | ------------ | --------- |
| Sidebar  | Hide sidebar completely | `hideSidebar`               | Hide sidebar completely | hide, styles | all pages |
| Sidebar  | Main menu               | `hideMenuShorts`            | Hide "Shorts"           | hide         | all pages |
| Sidebar  | You                     | `hideMenuHistory`           | Hide "History"          | hide         | all pages |
| Sidebar  | You                     | `hideMenuPlaylists`         | Hide "Playlists"        | hide         | all pages |
| Sidebar  | You                     | `hideMenuYourVideo`         | Hide "Your video"       | hide         | all pages |
| Sidebar  | You                     | `hideMenuWatchLater`        | Hide "Watch later"      | hide         | all pages |
| Sidebar  | You                     | `hideMenuLikedVideos`       | Hide "Liked videos"     | hide         | all pages |
| Sidebar  | You                     | `hideYourMovies`            | Your "Movies"           | hide         | all pages |
| Sidebar  | Hide Subscriptions list | `hideMenuSubscriptionsList` | Hide Subscriptions list | hide         | all pages |
| Sidebar  | Explore                 | `hideMenuExploreTrending`   | Hide "Trending"         | hide         | all pages |
| Sidebar  | Explore                 | `hideMenuExploreMusic`      | Hide "Music"            | hide         | all pages |
| Sidebar  | Explore                 | `hideMenuExploreGaming`     | Hide "Gaming"           | hide         | all pages |
| Sidebar  | Explore                 | `hideMenuExploreNews`       | Hide "News"             | hide         | all pages |
| Sidebar  | Explore                 | `hideMenuExploreSports`     | Hide "Sports"           | hide         | all pages |
| Sidebar  | More from YouTube       | `hideMenuMorePremium`       | Hide "YouTube Premium"  | hide         | all pages |
| Sidebar  | More from YouTube       | `hideMenuMoreMusic`         | Hide "YouTube Music"    | hide         | all pages |
| Sidebar  | More from YouTube       | `hideMenuMoreKids`          | Hide "YouTube Kids"     | hide         | all pages |
| Sidebar  | More from YouTube       | `hideMenuMoreStudio`        | Hide "YouTube Studio"   | hide         | all pages |

## Maintenance notes

- Update this file when adding, removing, or renaming a feature.
- Do not rename released feature ids unless you also provide a storage
  migration. The id is the saved user setting key.
- Section-level `hideWhenAllEnabled` behavior is not listed as a separate
  feature because it is generated from a section, not an individual setting.
