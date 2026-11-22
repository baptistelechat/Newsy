# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this
project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Telegram bot with `/start`, `/stop`, `/latest` and `/help` commands to subscribe to BIM news
- Hourly weekday digest of new articles and a weekly recap, sent to all subscribers
- Tracking of already-sent articles so the same news is never sent twice
- pyRevit release notes feed, so new pyRevit versions show up in the digest

### Changed

- Default news feeds updated (Village BIM, Hexabim, BIMpure, Le Moniteur BIM & IA)

### Fixed

- Only recent articles are sent, newest first
- A single broken feed no longer blocks the daily and weekly digests
