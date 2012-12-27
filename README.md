# nodecopter-cockpit

This is work in progress.

The idea is to move towards a pluggable common architecture where
modules controlling or visualising nodecopter data can be mixed and
matched to your own liking.

Right now this is just an express app using

* [dronestream](http://npmjs.org/üackages/dronestream) for the video stream

* an artifical horizon overlayed over the video stream based on
  [autoilot](https://github.com/bjnortier/autopilot) by Benjamin Nortier
  (@bjnortier)

* a battery gauge based on [canv-gauge](https://github.com/Mikhus/canv-gauge)
  by Mykhailo Stadnyk (@Mikhus)

* a compass providing a (fake) magnetic heading.

# Installation

```
git clone git@github.com:bkw/nodecopter-cockpit.git
cd nodecopter-cockpit
npm install
```

# Usage

1. Connect to the drone's wifi
2. run `node app.js`
3. Point your browser to http://localhost:3000/

# TODO

The cockpit does not have any flight control yet. I'm hoping to add these later.

# Demo Video

I made a small [video](http://youtu.be/CNVyN0XnShQ) of the initial appearance
of the cockpit controls.

# Thanks

Special thanks to Benjamin Nortier for doing all the hard work for the
artificial horizon and agreeing to share his code under a liberal license.

