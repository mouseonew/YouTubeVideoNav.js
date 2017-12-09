$(document).ready(function(){new PageZoom().init();});

function PageZoom(){return{
    init:function(){
        $(window).resize(function(){
            if($(window).width()>1600&&$('body').width()<1200){
                if(!$('html').hasClass('zoomed')&&navigator.userAgent.toLowerCase().indexOf('firefox')<0){
                    $('html').addClass('zoomed');
                }
            }else{
                $('html').removeClass('zoomed');
            }
        });
        $(window).trigger('resize');
    }
}}