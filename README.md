# YouTubeVideoNav.js

A YouTube video navigator that remembers video positions and plays unseen videos on websites return. 
An example of this code in action can be [seen here](http://cowardlyvigilantes.com/).

## Setup

In the index.html file notice the divs with "YouTubeVideoNav" as the class. There are some data variables 
which you must change for your specific site, they are rather self explanatory. The data format is in the 
unordered list "&lt;ul&gt;", which you can view below. New list items "&lt;li&gt;" can be added or removed as needed. 
Once the data is set correctly the files in this package can be uploaded to your site and tested.

<pre>
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
        <a href="https://youtu.be/x7zw49-dczY" target="_blank">Home with Bean | Funny Clips | Mr. Bean Official</a>
        <div>What would you do if Mr Bean stayed with you?</div>
        <div>Dec 6, 2017</div>
    </li>
    
    <li>
      <a href="https://youtu.be/0RnKU0o-tDg" target="_blank">Tee Off, Mr. Bean | Episode 12 | Mr. Bean Official</a>
      <div>*Remastered Version* After causing chaos in the town launderette, Bean tries his hand at Krazy Golf, but after being told he can only touch the ball with the club, Bean's poor aim leads him on an elaborate tour around town before returning to the course several hours later to score 3,427.</div>
      <div>Dec 3, 2017</div>
    </li>
    
  </ul>
</div>
</pre>
