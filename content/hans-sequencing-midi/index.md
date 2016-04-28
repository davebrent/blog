---
title: "Hans: MIDI Sequencing"
description: Hans MIDI sequencing prototype
template: post.html
slug: 2016/04/28/hans-midi-sequencing/index.html
date: 2016-04-28
markdown: true
comments: true
---

I've been prototyping the sequencing part of [hans][1] recently and have some
random thoughts related to sending MIDI events that I wanted to jot down before
I forget.

Bit of background: the basic idea is a function sends periodic *events* with a
given duration. These events may be sent to different *devices*, in this case a
MIDI device. These events may then be updated over time, so as to trigger a
corresponding note off event or a new CC value etc.

* SO what rate should a function be called, that sends a stream of midi control
  change events, interpolating between two given values over a specificed
  amout of time?
* How are many control change events handled? Should they be sequenced in some
  way to avoid congestion?
* What are the consequences of MIDI congestion? (an explosion? damaged
  hardware? or just terrible timing?)
* MIDI has a fixed transfer rate of [31.25 Kbaud][2] (around 320 microseconds
  per byte).
* Majority of messages are going to be 3 bytes long (note & CC events)?
* So roughly, things are gonna be moving at 1 message per millisecond?
* From a brief skim of [The Truth About Digital Audio Latency][3] things will
  start to feel a bit weird when an event has a delay that excedes 12-15ms
* So maybe a nice round number to balence sending loads of events and it being
  processed in time is a window of 10ms?
* In c++ Im using ``std::this_thread::sleep_for`` which will block the
  execution of the thread for [*at least*][4] the given time, ie. it may be
  longer, so... how much longer may it be? Is it worth worrying about this?
  Are the alternatives?
* Does [RtMIDI][5] pad clock events with two extra bytes? Does this matter?
* Is there any hardware that can make this better if this all proves to a bit
  rubbish?

Here are some numbers from sending combinations of clock message, single
quarter note and a single continous control change event (also at the interval).
Using the Scarlett 18i8 to an Elektron. Just to see roughly whats going on.

    |Interval (microseconds)|Target (bpm)|Displayed (bpm)|Clock|Note|Control|
    |-----------------------|------------|---------------|-----|----|-------|
    |320                    |120         |118            |X    |    |       |
    |320                    |120         |118-119        |X    |X   |       |
    |320                    |120         |47-48          |X    |    |X      |
    |320                    |120         |47-48          |X    |X   |X      |
    |-----------------------|------------|---------------|-----|----|-------|
    |640                    |120         |117-118        |X    |    |       |
    |640                    |120         |116-117        |X    |X   |       |
    |640                    |120         |98-99          |X    |    |X      |
    |640                    |120         |97-99          |X    |X   |X      |
    |-----------------------|------------|---------------|-----|----|-------|
    |960                    |120         |116            |X    |    |       |
    |960                    |120         |116-117        |X    |X   |       |
    |960                    |120         |116-117        |X    |    |X      |
    |960                    |120         |116-117        |X    |X   |X      |
    |-----------------------|------------|---------------|-----|----|-------|
    |1600                   |120         |110-114        |X    |    |       |
    |1600                   |120         |110-112        |X    |X   |       |
    |1600                   |120         |115-117        |X    |    |X      |
    |1600                   |120         |115-117        |X    |X   |X      |

    Quarter note in milliseconds
    120BPM = 500ms
    117BPM = 513ms
    114BPM = 526ms
    110BPM = 545ms

* Not surprising values below 960 microseconds we're shocking but nice to see
  nothing blew up.
* How come it never reached the target BPM?
* Looks like its not gonna be particularly great to send all events at the same
  interval but should be sequenced in some way
* Seems this updating of an event is going to be very device dependant...

  [1]: https://github.com/davebrent/hans
  [2]: https://en.wikipedia.org/wiki/MIDI#Technical_specifications
  [3]: https://www.presonus.com/community/Learn/The-Truth-About-Digital-Audio-Latency
  [4]: http://en.cppreference.com/w/cpp/thread/sleep_for
  [5]: https://www.music.mcgill.ca/~gary/rtmidi/
