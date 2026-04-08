# ComfortableKULMS

A browser extension for improving the KULMS experience.  
Target site: `https://lms.gakusei.kyoto-u.ac.jp/portal`

## Readme
English | [Japanese](https://github.com/MAV3Ndev/ComfortableKULMS/blob/master/README.md)

## About This Fork

This repository is a fork of [das08/ComfortablePandA](https://github.com/das08/ComfortablePandA), adapted for Kyoto University's newer LMS, KULMS.

Main changes in this fork:

- Updated the target URL to KULMS
- Adjusted miniSakai injection points for the newer KULMS portal UI
- Updated course discovery, tab coloring, and unread badge handling to match the KULMS sidebar structure

## Usage

1. Load the extension in your browser
2. Log in to KULMS
3. Open miniSakai from the button added near the top-right area

## Features

### Color-coded course entries

Course entries are color-coded so upcoming deadlines are easier to notice.

- Red: very close deadline
- Yellow: approaching deadline
- Green: moderate time remaining
- Gray: later deadline

### Unread assignment badge

Courses with newly detected assignments get a notification badge.

### miniSakai

miniSakai provides:

- a list of published assignments
- a list of published quizzes
- personal memo entries

### Cache

To reduce load on KULMS, assignment and quiz fetches are cached for a period of time.  
The cache interval can be changed in settings.

## Installation

There is currently no store release for this fork. Please load it manually.

### Chrome / Edge

1. Clone this repository or download it as a ZIP
2. Install dependencies

```bash
npm install
```

3. Build the extension

```bash
npm run build:chrome
```

4. Open `chrome://extensions/` or `edge://extensions/`
5. Enable developer mode
6. Load `dist/source/chrome` as an unpacked extension

## Development

### Build

```bash
npm run build:chrome
```

```bash
npm run build:firefox
```

```bash
npm run build:all
```

### Test

```bash
npm run test
```

## AI Assistance

This fork includes code that was implemented or revised with assistance from OpenAI Codex.  
Changes were reviewed by a human before being kept in the repository.

## License

Apache-2.0 License
