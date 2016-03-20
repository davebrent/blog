---
title: Drawing circular arcs with bezier curves
description: Drawing an arc between two angles with bezier curves
template: post.html
slug: 2016/03/19/bezier-rings/index.html
date: 2016-03-19
markdown: true
---

<div class="propbox-16/9">
  <div class="propbox__inner">
    <div id="gui"></div>
    <canvas class="example" style="width: 100%"></canvas>
  </div>
</div>

## Notes

* A complete circle can be approximated with 4 bezier curves
* So a single arc can be draw with 4 or fewer bezier curves
* One curve in the arc will not have an angle of `PI/2` (but the rest will)
* Control points can calculated from a curves start and end point (see sources)

## Sources

* [Approximation of a cubic bezier curve by circular arc and vice versa][1]
* [More About Approximating Circular Arcs With a Cubic Bezier Path][2]

  [1]: http://itc.ktu.lt/itc354/Riskus354.pdf
  [2]: http://hansmuller-flex.blogspot.co.uk/2011/10/more-about-approximating-circular-arcs.html

<script src="//cdnjs.cloudflare.com/ajax/libs/dat-gui/0.5.1/dat.gui.min.js"></script>
<script src="{{ site.base_url }}/2016/03/19/bezier-rings/main.js"></script>
