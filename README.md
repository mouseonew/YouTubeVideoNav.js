# YouTubeVideoNav.js

A YouTube UI that remembers positions and watched videos on site return and cycles through unwatched videos. 
An example of this code in action can be [seen here](http://cowardlyvigilantes.com/).

[![cowardlyvigilantes.com](http://cowardlyvigilantes.com/sitescreenshot.jpg)](http://cowardlyvigilantes.com/)

## Setup

In the index.html file notice the divs with "YouTubeVideoNav" as the class. There are some data variables 
which you must change for your specific site, they are rather self explanatory. Make sure "data-origin" is 
set correctly and if you have multiple video navigators on the same page that each id attribute is unique. 
The data format is in the unordered list "&lt;ul&gt;", which you can view below. New list items "&lt;li&gt;" 
can be added or removed as needed. The styling and layout can be modified with the CSS file. Once the data 
is set correctly the files in this package can be uploaded to your site and tested.

```
<div 
  id="videoNav1"
  class="YouTubeVideoNav"
  data-shuffle="false"
  data-origin="http://yoursitehere.com"
  data-newdays="28"
  data-embedlink="https://www.youtube.com/embed/$videoId?rel=0&enablejsapi=1&origin=$origin"
  data-progresswidth="36">
    
    <div class="videoContainer">...</div>

    <ul>
    
      <li>
        <a href="https://youtu.be/CGTJMYWCego" target="_blank">MC #54</a>
        <div>Another day... Convoluted strategies, tiiiiiiiiiiiime limit, ctrl-z undo, anonymous speak freely, I don't wanna grow up capitalists, nonexistent mafia appeasement, LOTR brainstem fantasies, fear of speech, and slaying dragons.</div>
        <div>Nov 27, 2017 4:58 PM</div>
      </li>

      <li>
        <a href="https://youtu.be/Lx9oyGfkJ1k" target="_blank">MC #51</a>
        <div>Another day... One black Friday, kings chamber, work work work stressed out, future adolescents billion person earth battlefield simulation, shoulda coulda woulda, reverse peter principle, pet cone and latex, working hard, scenic lonely roads, twist finger tap knee and pinch ankle, I'm an elf now, and selective empathy.</div>
        <div>Nov 24, 2017 2:17 PM</div>
      </li>
    
    </ul>
</div>
```
