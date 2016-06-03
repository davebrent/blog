---
title: "Hans: Data compiler prototype"
description: Hans data compiler prototype
template: post.html
slug: 2016/06/03/hans-data-compiler/index.html
date: 2016-06-03
markdown: true
comments: true
---

## Original aims

* To create a single file containing **all** runtime data, config and assets
  etc. for creating some cool audio visual thing.
* The file should be simple to load into the runtime to create the cool audio
  visual thing.
* The "compiler" needs to be flexible and have points of extension (so I dont
  have to re-write everything again).

## Why?

* Currently already doing something like this, but really badly with an ad-hoc
  python script, sqlite and sending RPC commands to C++, which is ends being
  slower than it really should be, painful to add new things and well confusing.
* Not really sure how its going to work further down the line when Im adding
  audio, images, meshes etc.
* A relational database isnt really adding much in this situation.
* Its also not particularly straight forward to get all the data back out of
  sqlite into C++ structs, so no big win there either.
* Theres also a lack of code sharing with the C++ side of the code base, as
  I havent added any python bindings because...
* Im also trying to simplify the number of languages and data formats down to
  just Scheme and C++ (for my own sanity).

## Implementation notes

* Objects are declared in scheme, as functions that return srfi-9 records
* The records are basically a configuration for what the objects corresponding
  C++ code needs from the runtime to operate correctly.
* A graph is represented in scheme as a list of objects & a list of connections.
* A program is the combination of an audio graph and a graphics graph.
* Input to the compile function is a list of programs and a list of complile
  "passes".
* A "pass" is a function that transforms the list of programs in some way (or
  validates it in some way).
* During one of these passes the C++ part of an object needs to be loaded from
  its dynamic library & parse its creation arguments (from scheme) and have its
  initial state included in the final output file.
* After all passes are complete, the data is used to create the C++ runtime
  structs, which are then written "as is" to the output file.

## Thoughts

* The code is pretty rushed and crusty but think achieved the above aims and
  I think is already more understandable from how it was all currently working.
* The compiler can be extended by adding another "pass" which has access to all
  object graphs.
* Does Guiles implementation of "map" apply the procedure in the order of the
  list?
* Maybe write the data correctly aligned so it can be used safely "as is"?
* Currently the compile function writes the data straight to disk, instead it
  might simplify testing if it returned something (such as the data it created
  as a bytevector)
* Lots of boring code shuffling associative lists to C structs. Could possibly
  have some binding mechanism to simplify adding new structs in the future.
* Lots of boring code binding enums to symbols in scheme.
* Cant quite see a simple way of applying "patches" of compiled data to a
  previously outputted file in this current implementation.
* Writing objects initial state is a bit of a pain as it increases the overhead
  of writing new objects and its initial state currently needs to be of a fixed
  size. Might be less of a pain if its size could be more dynamic.
