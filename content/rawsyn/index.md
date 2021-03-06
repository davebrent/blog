---
title: Automated sonification of non audio files
description: Making noise from regular files
template: post.html
slug: 2014/10/12/rawsyn/index.html
date: 2014-10-12
markdown: true
---

The sonification of non-audio files is a well known [data bending] [1]
technique that can generate interesting and abrasive noises. Often its
done in programs such as [Audacity] [2] that can open raw files and interpret
them as audio.

  [1]: http://en.wikipedia.org/wiki/Databending
  [2]: http://audacity.sourceforge.net/

<img src="{{ page.url }}/rawsyn-audacity.png">

I wanted to find a way to automate this process as I was getting bored of
clicking around Audacity when trying out a handful of files.

After looking at the code in Audacity that is responsible for importing raw
files it was nice to see [nothing magic was happening] [3]: most of the code
is setting up a dialog and guessing default values for it. The main part
simply opens the file with [libsndfile] [4] with a major format of
``SF_FORMAT_RAW`` and sets [sub formats] [5] based on the result of the dialog.

  [3]: https://code.google.com/p/audacity/source/browse/audacity-src/trunk/src/import/ImportRaw.cpp
  [4]: http://www.mega-nerd.com/libsndfile/
  [5]: http://www.mega-nerd.com/libsndfile/api.html#open

So I wrote a small command line [program] [6] that does the same thing: it takes
an input file, opens it with [libsndfile] [4] (providing options for available
formats) and writes the result out to a seperate file.

  [6]: https://github.com/davebrent/dbp/tree/master/apps/rawsyn

Here is a couple of example outputs from the program, the first is a small
selection from a 2gb virtual box file and the second is the ``.Framework``
file from [node-webkit] [7].

  [7]: https://github.com/rogerwang/node-webkit

<iframe width="100%" height="200" scrolling="no" frameborder="no"
        src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/171770713&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"> </iframe>

<iframe width="100%" height="200" scrolling="no" frameborder="no"
        src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/171771553&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"> </iframe>
