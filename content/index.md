---
template: page.html
title: Gallery
slug: index.html
title: davepoulter.net
---
<ul>
{%- for post in site.posts %}
  <li>
    <a href="{{ post.url }}">
      {{ post.metadata.title }}
    </a>
  </li>
{%- endfor %}
</ul>
