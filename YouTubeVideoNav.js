/*
MIT License

Copyright (c) 2017 0n3tw0 https://github.com/0n3tw0

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

$(document).ready(function(){
    ytapi.readyNext();
});

var ytapi=new YouTubeAPI();
ytapi.init();

function onYouTubeIframeAPIReady() {
    ytapi.readyNext();
};

function YouTubeAPI(){return{
    playersArr:[],
    players:{},
    readyCount:0,
    videoNavs:{},
    init:function(){
        var tag=document.createElement('script');
        tag.src="https://www.youtube.com/iframe_api";
        var firstScriptTag=document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag,firstScriptTag);
    },
    readyNext:function(){
        this.readyCount++;
        if(this.readyCount==2){
            this.readyAll();
        }
    },
    readyAll:function(){
        $('.YouTubeVideoNav').each(function(i,jqo){
            $(jqo).find('iframe').attr('id','vn'+i);
            var vn=new YouTubeVideoNav();
            this.videoNavs['vn'+i]=vn;
            vn.init($(jqo),this);
        }.bind(this));
    },
    videoChanged:function(id){
        if(!this.players[id]){
            this.players[id]=new YT.Player(id,{events:{onError:function(){this.videoNavs[id].ytapiError();}.bind(this)}});
            this.playersArr.push(id);
            this.videoNavs[id].ytapiSetPlayer(this.players[id]);
        }
    },
    getNextVideoNav:function(player){
        var i;
        var len=this.playersArr.length;
        for(i=0;i<len;i++){
            if(this.players[this.playersArr[i]]==player){
                i++;
                if(i==len){
                    i=0;
                }
                break;
            }
        }
        return this.videoNavs[this.playersArr[i]];
    }
}}

function YouTubeVideoNav(){return{

    videos:[],
    currentVideo:-1,
    jqr:null,
    ytapi:null,
    ytapiPlayer:null,
    ytapiEventIntervalId:-1,
    localStorageData:{},
    firstVideoLoaded:false,
    videoStartedAt:0,
    shuffle:false,
    scrollIntoView:false,
    //data vars
    embedLink:'https://www.youtube.com/embed/$videoId?rel=0&enablejsapi=1&origin=$origin',
    origin:'',
    newDays:28,
    progressWidth:36,
    //TODO: data-paginatortotal

    ytapiError:function(){
        this.firstVideoLoaded=true;
        this.nextVideo(false);
    },

    ytapiSetPlayer:function(player){
        if(!this.ytapiPlayer){
            this.ytapiPlayer=player;
            setInterval(this.ytapiEventInterval.bind(this),3000);
        }
    },

    ytapiEventInterval:function(){
        if(this.ytapiPlayer&&this.ytapiPlayer.getVideoUrl&&this.ytapiPlayer.getVideoUrl().split('=').pop()==this.videos[this.currentVideo].videoId){
            var time=Math.floor(this.ytapiPlayer.getCurrentTime());
            var duration=Math.floor(this.ytapiPlayer.getDuration());
            if(time>0&&time!=this.videos[this.currentVideo].time){
                console.log(this.ytapiPlayer);
                if(this.scrollIntoView){
                    var zoom=1;
                    if($('html').hasClass('zoomed')&&$('html').css('zoom')){
                        zoom=$('html').css('zoom');
                        $('html').removeClass('zoomed');
                        setTimeout(function(){$('html').addClass('zoomed');},1000);
                    }
                    $('html,body').animate({scrollTop:(this.jqr.offset().top*zoom)-(($(window).height()/2)/zoom)+((this.jqr.outerHeight()/2)*((zoom!=1?zoom:2)/2))},1000);
                    this.scrollIntoView=false;
                }
                this.firstVideoLoaded=true;
                var timePercent=time/duration;
                if(isNaN(timePercent)){
                    timePercent=0;
                }
                if(timePercent>.98){
                    time=Math.floor(duration*.98);
                }
                this.videos[this.currentVideo].time=time;
                this.videos[this.currentVideo].duration=duration;
                this.localStorageData[this.videos[this.currentVideo].videoId]={time:time,duration:duration};
                if(this.videos[this.currentVideo].completed){
                    this.localStorageData[this.videos[this.currentVideo].videoId].completed=true;
                }
                this.localStorageUpdate();
                this.jqr.find('.nav .viewing .progress').css('width',Math.round(timePercent*this.progressWidth)+'px');
                if(timePercent>=1){
                    this.nextVideo(false);
                }
            }else{
                this.videos[this.currentVideo].time=time;
            }
        }else{
            if(this.firstVideoLoaded&&this.ytapiPlayer.getCurrentTime()==0){
                //error
                this.nextVideo(false);
            }

        }
    },

    localStorageUpdate:function(){
        if (typeof(Storage)!=='undefined'){
            localStorage.setItem('videosTime_'+this.jqr.attr('id'),JSON.stringify(this.localStorageData));
        }
    },

    localStorageCombineVideoData:function(){
        if (typeof(Storage)!=='undefined'){
            var videosTime={};
            if(localStorage['videosTime_'+this.jqr.attr('id')]){
                videosTime=JSON.parse(localStorage['videosTime_'+this.jqr.attr('id')]);
            }
            this.localStorageData=videosTime;
            var i,i2;
            var len=this.videos.length;
            for(i in videosTime){
                for(i2=0;i2<len;i2++){
                    if(i==this.videos[i2].videoId){
                        this.videos[i2].time=videosTime[i].time;
                        this.videos[i2].duration=videosTime[i].duration;
                        if(videosTime[i].completed){
                            this.videos[i2].completed=true;
                        }
                    }
                }
            }
        }
    },

    localStorageUpdateBasedOnVideos:function(){
        var i;
        var len=this.videos.length;
        var videosTime={};
        for(i=0;i<len;i++){
            videosTime[this.videos[i].videoId]={time:this.videos[i].time,duration:this.videos[i].duration};
            if(this.videos[i].completed){
                videosTime[this.videos[i].videoId].completed=true;
            }
        }
        this.localStorageData=videosTime;
        localStorage.setItem('videosTime_'+this.jqr.attr('id'),JSON.stringify(this.localStorageData));
    },

    localStorageWatchedAll:function(){
        var i;
        var len=this.videos.length;
        for(i=0;i<len;i++){
            this.videos[i].time=0;
            this.videos[i].completed=true;
        }
        this.localStorageUpdateBasedOnVideos();
    },

    init:function(jqr,ytapi){
        if(jqr.data('embedlink')){
            this.embedLink=jqr.data('embedlink');
        }
        if(jqr.data('origin')){
            this.origin=jqr.data('origin');
        }
        if(jqr.data('newdays')){
            this.newDays=jqr.data('newdays');
        }
        if(jqr.data('progresswidth')){
            this.progressWidth=jqr.data('progresswidth');
        }
        this.ytapi=ytapi;
        this.jqr=jqr;
        jqr.find('ul').hide();
        jqr.find('.videoContainer').show();
        this.videoListToData();
        this.rebuildNumberNav();
        this.nextVideo(false);
        if(jqr.data('shuffle')=='true'||jqr.data('shuffle')=='1'){
            this.toggleShuffle();
        }
        this.jqr.find('.shuffle').click(this.toggleShuffle.bind(this));
        $(window).scroll(function(){this.scrollIntoView=false;}.bind(this));
    },

    toggleShuffle:function(){
        this.jqr.find('.shuffle').toggleClass('on');
        if(this.jqr.find('.shuffle').hasClass('on')){
            this.shuffle=true;
        }else{
            this.shuffle=false;
        }
    },

    videoListToData:function(){
        this.jqr.find('ul>li').each(function(i,jq){
            this.videos.push({
                title:$(jq).children('a').text(),
                url:$(jq).children('a').attr('href'),
                videoId:$(jq).children('a').attr('href').split('/').pop(),
                desc:$(jq).children('div').first().html(),
                embed:'',
                date:new Date($(jq).children('div').last().text()),
                dateStr:'',
                time:0,
                duration:0
            });
            this.videos[this.videos.length-1].embed=this.embedLink.replace(/\$videoId/g,this.videos[this.videos.length-1].videoId).replace(/\$origin/g,this.origin);
            var date=this.videos[this.videos.length-1].date;
            this.videos[this.videos.length-1].dateStr=(date.getMonth()+1)+'/'+(date.getDate().toString().length==1?'0'+date.getDate():date.getDate())+'/'+date.getFullYear().toString().substr(2);
        }.bind(this));
        this.localStorageCombineVideoData();
    },

    formatTooltipText:function(text){
        var i;
        text=text.replace(/<p>/g,'').replace(/<\/p>/g,'').replace(/  +/g,'').replace(/<br>/g,'\n');
        var text2=text.split(' ');
        text='';
        var letterCount=0;
        for(i=0;i<text2.length;i++){
            letterCount+=text2[i].length;
            text+=text2[i]+' ';
            if(text2[i].indexOf('\n')>=0){
                letterCount=0;
            }else if(letterCount>40){
                text+='\n';
                letterCount=0;
            }
        }
        text=text.replace(/\n\n\n+/g,'\n\n');
        return text;
    },

    rebuildNumberNav:function(){
        this.jqr.find('.nav .prev').unbind('click').click(function(){this.prevVideo();}.bind(this));
        this.jqr.find('.nav .next').unbind('click').click(function(){this.nextVideo(false);}.bind(this));

        var currentVideo=this.currentVideo;
        var nums=this.jqr.find('.nav .numbers');
        nums.html('');

        var total=15;//odd number //TODO: total data
        var start=this.currentVideo-Math.floor(total/2);
        var i;
        var current;
        var aJq;
        var timePercent;
        for(i=0;i<total;i++){
            current=start+i;
            while(current<0){
                current=this.videos.length+current;
            }
            while(current>=this.videos.length){
                current=current-this.videos.length;
            }
            aJq=$('<a data-videoid="'+current+'" href="#" onclick="return false;"><div class="progressBg"></div><div class="progress" style="width:'+Math.round((this.videos[current].time/this.videos[current].duration)*this.progressWidth)+'px"></div>'+(current+1)+'</a>');
            if(this.currentVideo==current){
                aJq.addClass('viewing');
            }else{
                aJq.attr('title',this.formatTooltipText(this.videos[current].title+'\n - '+this.videos[current].dateStr+''+'\n\n'+this.videos[current].desc));
                aJq.click(function(event){this.showVideoById($(event.currentTarget).data('videoid'));}.bind(this));
            }
            nums.append(aJq);
            timePercent=this.videos[current].time/this.videos[current].duration;
            if(isNaN(timePercent)){
                timePercent=0;
            }
            if(!this.videos[current].completed&&timePercent<.75&&this.videos[current].date.getTime()>(new Date().getTime())-(this.newDays*24*60*60*1000)){
                nums.append('<span class="new" title="New">!</span>');
            }else if(timePercent>.75||this.videos[current].completed){
                nums.append('<span class="completed" title="Watched">&#10004;</span>');
            }
        }
    },

    showVideoById:function(id){
        this.currentVideo=id-1;
        this.nextVideo(true);
    },

    nextVideo:function(force){
        if(force){
            this.currentVideo++;
            this.currentVideo=this.currentVideo>=this.videos.length?0:this.currentVideo;
        }else{
            var i;
            var timePercent;
            var lastVideo=this.currentVideo;
            var allVideosWatched=this.areAllVideosCompleted();
            var shuffledIds=[];
            if(this.shuffle){
                while(shuffledIds.length<this.videos.length-1){
                    this.currentVideo=Math.floor(this.videos.length*Math.random());
                    if(this.currentVideo!=lastVideo&&shuffledIds.indexOf(this.currentVideo)<0){
                        shuffledIds.push(this.currentVideo);
                    }
                }
                shuffledIds.push(lastVideo);
            }
            for(i=0;i<this.videos.length-1;i++){
                if(this.shuffle){
                    this.currentVideo=shuffledIds[i];
                }else{
                    this.currentVideo++;
                    this.currentVideo=this.currentVideo>=this.videos.length?0:this.currentVideo;
                }
                timePercent=this.videos[this.currentVideo].time/this.videos[this.currentVideo].duration;
                if(isNaN(timePercent)){
                    timePercent=0;
                }
                if((timePercent<.75&&!this.videos[this.currentVideo].completed)||(timePercent<.75&&allVideosWatched)){
                    break;
                }else if(i==this.videos.length-2){
                    this.currentVideo=0;
                    this.localStorageWatchedAll();
                    if(this.ytapi.getNextVideoNav(this.ytapiPlayer)!=this.ytapiPlayer){
                        this.firstVideoLoaded=false;
                        this.ytapi.getNextVideoNav(this.ytapiPlayer).startFromOtherPlayer();

                    }
                    break;
                }
            }
        }
        this.makeVideoAppear();
        this.rebuildNumberNav();
    },

    startFromOtherPlayer:function(){
        this.scrollIntoView=true;
        this.firstVideoLoaded=true;
        this.currentVideo--;
        this.nextVideo(false);
    },

    areAllVideosCompleted:function(){
        var i;
        var len=this.videos.length;
        for(i=0;i<len;i++){
            if(!this.videos[i].completed){
                return false;
            }
        }
        return true;
    },

    prevVideo:function(){
        var i;
        var timePercent;
        for(i=0;i<this.videos.length-1;i++){
            this.currentVideo--;
            this.currentVideo=this.currentVideo<0?this.videos.length-1:this.currentVideo;
            timePercent=this.videos[this.currentVideo].time/this.videos[this.currentVideo].duration;
            if(isNaN(timePercent)){
                timePercent=0;
            }
            if(timePercent<.75){
                break;
            }
        }
        this.makeVideoAppear();
        this.rebuildNumberNav();
    },

    makeVideoAppear:function(){
        this.jqr.find('.videoContainer .description').fadeOut('fast');
        this.videoStartedAt=new Date().getTime();
        var autoplay='';
        document.webkitExitFullscreen?document.webkitExitFullscreen():false;
        document.mozCancelFullscreen?document.mozCancelFullscreen():false;
        document.exitFullscreen?document.exitFullscreen():false;
        if(this.firstVideoLoaded){
            autoplay='&autoplay=1';

        }
        this.jqr.find('.nav').addClass('disableButtons');
        setTimeout(function(){
            setTimeout(function(){this.jqr.find('.nav').removeClass('disableButtons');}.bind(this),2000);
            this.jqr.find('.videoContainer iframe').attr('src',this.videos[this.currentVideo].embed+'&start='+Math.round(this.videos[this.currentVideo].time)+autoplay).slideUp('fast',function(){
                this.ytapi.videoChanged(this.jqr.find('iframe').attr('id'));
                this.jqr.find('.videoContainer .description').fadeIn('fast');
                this.jqr.find('.videoContainer iframe').slideDown('fast');
                this.jqr.find('.videoContainer .description').html('<h3>'+this.videos[this.currentVideo].title+' <span>('+this.videos[this.currentVideo].dateStr+')</span></h3>'+this.videos[this.currentVideo].desc);

            }.bind(this));
        }.bind(this),100);

    }
}}