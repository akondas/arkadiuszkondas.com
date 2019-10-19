# Arkadiusz Kondas - personal site & blog

[![buddy pipeline](https://app.buddy.works/akondas/arkadiuszkondas-com-1/pipelines/pipeline/191687/badge.svg?token=f043fc3d0fb3414a7b5c2cff118b2a43cc1e39f64b155c73661e03bb4b0d6fb9 "buddy pipeline")](https://app.buddy.works/akondas/arkadiuszkondas-com-1/pipelines/pipeline/191687)
[![Validate RSS](https://img.shields.io/badge/validate-rss-orange.svg)](https://validator.w3.org/feed/check.cgi?url=http%3A//arkadiuszkondas.com/rss.xml)
[![Validate JSON Feed](https://img.shields.io/badge/validate-json_feed-green.svg)](http://validator.jsonfeed.org/?url=http%3A%2F%2Farkadiuszkondas.com%2Ffeed.json)

My personal web site [https://arkadiuszkondas.com](http://arkadiuszkondas.com).

## What's inside?
- PHP static site generator [Statie](https://github.com/Symplify/Statie) - see documentation at [www.statie.org](https://www.statie.org)
- Build for localhost handled by task runner [gulp](http://gulpjs.com/)
- Extension for Parsedown Extra [tovic/parsedown-extra-plugin](Extension for Parsedown Extra)

## Install it
- `$ composer install && npm install`

## Build it
- `$ composer build`

## Use it
- `$ gulp` - starts local server and acts upon changes
- `$ composer check` - runs code standard and static analysis
- `$ composer fix` - fixes code standard errors

## Thanks

This website is heavy inspired by https://github.com/crazko/romanvesely.com
