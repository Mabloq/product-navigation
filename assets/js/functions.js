// Search javascript start
function doSearch(e) {
 
    if (e.keyCode == 13 || e.which == 13) {
 
        var searchValue = document.getElementById('searchBox').value;
        searchValue = searchValue.replace(/^\s+|\s+$/g, "");
 
        search(searchValue);
 
        return false;
 
    } else {
 
        return true;
    }
}
function doSearchResult() {

    var searchValue = document.getElementById('textSearch').value;
    searchValue = searchValue.replace(/^\s+|\s+$/g, "");

    search(searchValue);

    return false;

}

function search(searchVal) {
    if (searchVal.length == 0) {

        window.location = '/search';

    } else {

        window.location = '/search?q=' + searchVal;
    }
}
// Search javascript end

$(document).ready(function () {

    // Home
    if ($("#slideshow").length > 0) {
        $("#slideshow").cycle({
            fx: 'fade',
            pager: '#slidebtn .btns',
            cleartypeNoBg: true
        });
    }
    $(".banner:not('.last')").hover(function () {
        $(this).find("img").attr("src", "/_assets/images/arrow-white.png");
    }, function () {
        $(this).find("img").attr("src", "/_assets/images/arrow-gray.png");
    });

    $("#nav li:last-child").addClass("last");
    $("#footer a:last-child").addClass("last");
    $(".top-link a:last-child").addClass("last");
    $("a[rel=lightbox]").fancybox({
        'titlePosition': 'over'
    });

    // Leadership
    $(".leaders li").last().addClass("last");

    // Online Retailers
    if ($(".retailersBox").length > 0) {
        $(".retailersBox tr").each(function () {
            $(this).find("td").each(function (i) {
                if ((i % 4) == 3) {
                    $(this).addClass("last");
                }
            });
        });
    }


    // Products
    if ($("#title").find("img").length > 0) {
        $("#title").addClass("img");
    }

    var prodHeight = 0;
    var btnArray = [];
    var num = 1;
    var maxNum = 0;

    $("#nav #products .prodWrap").each(function (i) {
        if (prodHeight < $(this).actual('height')) {
            prodHeight = $(this).actual('height');
        }
        btnArray[i % 4] = $(this);
        if (num == $("#nav #products .prodWrap").length) {
            if ($("#nav #products .prodWrap").length % 4 == 0) {
                maxNum = 3;
            }
            else {
                maxNum = ($("#nav #products .prodWrap").length % 4) - 1;
            }
        }
        else {
            maxNum = 3;
        }
        if (i % 4 == maxNum) {
            $.each(btnArray, function () {
                $(this).css("height", prodHeight + "px");
            });
            prodHeight = 0;
            btnArray = [];
        }
        if (i % 4 == 3) {
            $(this).addClass("last");
        }
        num++;
    });

    $("#nav #products").mouseenter(function () {
        $("#nav #products .subwrap").attr("style", "left: 1px");

    });
    $("#nav #products").mouseleave(function () {
        $("#nav #products .subwrap").attr("style", "left: -1415px");
    });

    $("#hideBtn").click(function (e) {
        e.preventDefault();
        //$("#nav #products .subwrap").fadeOut();
        //$("#nav #products .subwrap").css("left","-1415px");
        $("#nav #products .subwrap").attr("style", "left: -1415px");
        //$("#nav #products .subwrap").hide();
        $(this).delay(10).queue(function () {
            $("#nav #products .subwrap").attr("style", "");
        });
    });

    $(".entry").each(function () {
        $(this).children(".box").first().addClass("first");
        $(this).children(".box").last().addClass("last");
    });

    // Gallery
    function calllbackFunction() {
        if ($("#gallery").children("li.active").attr("jcarouselindex") == $("#gallery").children().length) {
            //var newPosition = $("#gallery").position().top - 75;
            //$("#gallery").css("top",newPosition+"px");
        }
    }

    $("#gallery").PikaChoose({
        carousel: true,
        autoPlay: false,
        carouselVertical: true,
        animationFinished: calllbackFunction
    });
    $("#galleryWrap .pika-stage img").wrap('<div class="image"></div>');

    // Accordion
    $(".accordion").accordion({ autoHeight: false });
    
    
    
    
    //Accordion Button
    
    $(document).ready(function() {
    	 
    	//ACCORDION BUTTON ACTION (ON CLICK DO THE FOLLOWING)
    	$('.accordionButton').click(function() {
    
    		//REMOVE THE ON CLASS FROM ALL BUTTONS
    		$('.accordionButton').removeClass('on');
    		
    		  
    		//NO MATTER WHAT WE CLOSE ALL OPEN SLIDES
    	 	$('.accordionContent').slideUp('normal');
       
    		//IF THE NEXT SLIDE WASN'T OPEN THEN OPEN IT
    		if($(this).next().is(':hidden') == true) {
    			
    			//ADD THE ON CLASS TO THE BUTTON
    			$(this).addClass('on');
    			  
    			//OPEN THE SLIDE
    			$(this).next().slideDown('normal');
    		 } 
    		  
    	 });
    	  
    	
    	/*** REMOVE IF MOUSEOVER IS NOT REQUIRED ***/
    	
    	//ADDS THE .OVER CLASS FROM THE STYLESHEET ON MOUSEOVER 
    	$('.accordionButton').mouseover(function() {
    		$(this).addClass('over');
    		
    	//ON MOUSEOUT REMOVE THE OVER CLASS
    	}).mouseout(function() {
    		$(this).removeClass('over');										
    	});
    	
    	/*** END REMOVE IF MOUSEOVER IS NOT REQUIRED ***/
    	
    	
    	/********************************************************************************************************************
    	CLOSES ALL S ON PAGE LOAD
    	********************************************************************************************************************/	
    	$('.accordionContent').hide();
    
    });
    
    
    //Accordion Button Careers
    
    $(document).ready(function() {
    	 
    	//ACCORDION BUTTON ACTION (ON CLICK DO THE FOLLOWING)
    	$('.accordionButtonC').click(function() {
    
    		//REMOVE THE ON CLASS FROM ALL BUTTONS
    		$('.accordionButtonC').removeClass('on');
    		
    		  
    		//NO MATTER WHAT WE CLOSE ALL OPEN SLIDES
    	 	$('.accordionContentC').slideUp('normal');
       
    		//IF THE NEXT SLIDE WASN'T OPEN THEN OPEN IT
    		if($(this).next().is(':hidden') == true) {
    			
    			//ADD THE ON CLASS TO THE BUTTON
    			$(this).addClass('on');
    			  
    			//OPEN THE SLIDE
    			$(this).next().slideDown('normal');
    		 } 
    		  
    	 });
    	  
    	
    	/*** REMOVE IF MOUSEOVER IS NOT REQUIRED ***/
    	
    	//ADDS THE .OVER CLASS FROM THE STYLESHEET ON MOUSEOVER 
    	$('.accordionButtonC').mouseover(function() {
    		$(this).addClass('over');
    		
    	//ON MOUSEOUT REMOVE THE OVER CLASS
    	}).mouseout(function() {
    		$(this).removeClass('over');										
    	});
    	
    	/*** END REMOVE IF MOUSEOVER IS NOT REQUIRED ***/
    	
    	
    	/********************************************************************************************************************
    	CLOSES ALL S ON PAGE LOAD
    	********************************************************************************************************************/	
    	$('.accordionContentC').hide();
    
    });
    
    
    //Accordion Button Careers
    
    $(document).ready(function() {
    	 
    	//ACCORDION BUTTON ACTION (ON CLICK DO THE FOLLOWING)
    	$('.accordionButtonConsumer').click(function() {
    
    		//REMOVE THE ON CLASS FROM ALL BUTTONS
    		$('.accordionButtonConsumer').removeClass('on');
    		
    		  
    		//NO MATTER WHAT WE CLOSE ALL OPEN SLIDES
    	 	$('.accordionContentConsumer').slideUp('normal');
       
    		//IF THE NEXT SLIDE WASN'T OPEN THEN OPEN IT
    		if($(this).next().is(':hidden') == true) {
    			
    			//ADD THE ON CLASS TO THE BUTTON
    			$(this).addClass('on');
    			  
    			//OPEN THE SLIDE
    			$(this).next().slideDown('normal');
    		 } 
    		  
    	 });
    	  
    	
    	/*** REMOVE IF MOUSEOVER IS NOT REQUIRED ***/
    	
    	//ADDS THE .OVER CLASS FROM THE STYLESHEET ON MOUSEOVER 
    	$('.accordionButtonConsumer').mouseover(function() {
    		$(this).addClass('over');
    		
    	//ON MOUSEOUT REMOVE THE OVER CLASS
    	}).mouseout(function() {
    		$(this).removeClass('over');										
    	});
    	
    	/*** END REMOVE IF MOUSEOVER IS NOT REQUIRED ***/
    	
    	
    	/********************************************************************************************************************
    	CLOSES ALL S ON PAGE LOAD
    	********************************************************************************************************************/	
    	$('.accordionContentConsumer').hide();
    
    });
    
    
    
    //Accordion Button Careers
    
    $(document).ready(function() {
    	 
    	//ACCORDION BUTTON ACTION (ON CLICK DO THE FOLLOWING)
    	$('.accordionButtonI').click(function() {
    
    		//REMOVE THE ON CLASS FROM ALL BUTTONS
    		$('.accordionButtonI').removeClass('on');
    		
    		  
    		//NO MATTER WHAT WE CLOSE ALL OPEN SLIDES
    	 	$('.accordionContentI').slideUp('normal');
       
    		//IF THE NEXT SLIDE WASN'T OPEN THEN OPEN IT
    		if($(this).next().is(':hidden') == true) {
    			
    			//ADD THE ON CLASS TO THE BUTTON
    			$(this).addClass('on');
    			  
    			//OPEN THE SLIDE
    			$(this).next().slideDown('normal');
    		 } 
    		  
    	 });
    	  
    	
    	/*** REMOVE IF MOUSEOVER IS NOT REQUIRED ***/
    	
    	//ADDS THE .OVER CLASS FROM THE STYLESHEET ON MOUSEOVER 
    	$('.accordionButtonI').mouseover(function() {
    		$(this).addClass('over');
    		
    	//ON MOUSEOUT REMOVE THE OVER CLASS
    	}).mouseout(function() {
    		$(this).removeClass('over');										
    	});
    	

    	
    	
    	/********************************************************************************************************************
    	CLOSES ALL S ON PAGE LOAD
    	********************************************************************************************************************/	
    	$('.accordionContentI').hide();
    
    });
    
    
      //Accordion Button Utility
        
        $(document).ready(function() {
        	 
        	//ACCORDION BUTTON ACTION (ON CLICK DO THE FOLLOWING)
        	$('.accordionButtonU').click(function() {
        
        		//REMOVE THE ON CLASS FROM ALL BUTTONS
        		$('.accordionButtonU').removeClass('on');
        		
        		  
        		//NO MATTER WHAT WE CLOSE ALL OPEN SLIDES
        	 	$('.accordionContentU').slideUp('normal');
           
        		//IF THE NEXT SLIDE WASN'T OPEN THEN OPEN IT
        		if($(this).next().is(':hidden') == true) {
        			
        			//ADD THE ON CLASS TO THE BUTTON
        			$(this).addClass('on');
        			  
        			//OPEN THE SLIDE
        			$(this).next().slideDown('normal');
        		 } 
        		  
        	 });
        	  
        	
        	/*** REMOVE IF MOUSEOVER IS NOT REQUIRED ***/
        	
        	//ADDS THE .OVER CLASS FROM THE STYLESHEET ON MOUSEOVER 
        	$('.accordionButtonU').mouseover(function() {
        		$(this).addClass('over');
        		
        	//ON MOUSEOUT REMOVE THE OVER CLASS
        	}).mouseout(function() {
        		$(this).removeClass('over');										
        	});
        	
    
        	
        	
        	/********************************************************************************************************************
        	CLOSES ALL S ON PAGE LOAD
        	********************************************************************************************************************/	
        	$('.accordionContentU').hide();
        
        });
        
    //Accordion Button Pricelist
        
        $(document).ready(function() {
        	 
        	//ACCORDION BUTTON ACTION (ON CLICK DO THE FOLLOWING)
        	$('.accordionButtonP').click(function() {
        
        		//REMOVE THE ON CLASS FROM ALL BUTTONS
        		$('.accordionButtonP').removeClass('on');
        		
        		  
        		//NO MATTER WHAT WE CLOSE ALL OPEN SLIDES
        	 	$('.accordionContentP').slideUp('normal');
           
        		//IF THE NEXT SLIDE WASN'T OPEN THEN OPEN IT
        		if($(this).next().is(':hidden') == true) {
        			
        			//ADD THE ON CLASS TO THE BUTTON
        			$(this).addClass('on');
        			  
        			//OPEN THE SLIDE
        			$(this).next().slideDown('normal');
        		 } 
        		  
        	 });
        	  
        	
        	/*** REMOVE IF MOUSEOVER IS NOT REQUIRED ***/
        	
        	//ADDS THE .OVER CLASS FROM THE STYLESHEET ON MOUSEOVER 
        	$('.accordionButtonP').mouseover(function() {
        		$(this).addClass('over');
        		
        	//ON MOUSEOUT REMOVE THE OVER CLASS
        	}).mouseout(function() {
        		$(this).removeClass('over');										
        	});
        	
    
        	
        	
        	/********************************************************************************************************************
        	CLOSES ALL S ON PAGE LOAD
        	********************************************************************************************************************/	
        	$('.accordionContentP').hide();
        
        });
        
        
        //Accordion Button Listing
            
            $(document).ready(function() {
            	 
            	//ACCORDION BUTTON ACTION (ON CLICK DO THE FOLLOWING)
            	$('.accordionButtonList').click(function() {
            
            		//REMOVE THE ON CLASS FROM ALL BUTTONS
            		$('.accordionButtonList').removeClass('on');
            		
            		  
            		//NO MATTER WHAT WE CLOSE ALL OPEN SLIDES
            	 	$('.accordionContentList').slideUp('normal');
               
            		//IF THE NEXT SLIDE WASN'T OPEN THEN OPEN IT
            		if($(this).next().is(':hidden') == true) {
            			
            			//ADD THE ON CLASS TO THE BUTTON
            			$(this).addClass('on');
            			  
            			//OPEN THE SLIDE
            			$(this).next().slideDown('normal');
            		 } 
            		  
            	 });
            	  
            	
            	/*** REMOVE IF MOUSEOVER IS NOT REQUIRED ***/
            	
            	//ADDS THE .OVER CLASS FROM THE STYLESHEET ON MOUSEOVER 
            	$('.accordionButtonList').mouseover(function() {
            		$(this).addClass('over');
            		
            	//ON MOUSEOUT REMOVE THE OVER CLASS
            	}).mouseout(function() {
            		$(this).removeClass('over');										
            	});
            	
        
            	
            	
            	/********************************************************************************************************************
            	CLOSES ALL S ON PAGE LOAD
            	********************************************************************************************************************/	
            	$('.accordionContentList').hide();
            
            });
    
    

    // Accordion Ext
    $('.accordion-ext .header').click(function () {
        event.preventDefault();
        if ($(this).next().is(':hidden') != true) {
            $(this).removeClass('active');
            $(this).next().slideUp("normal");
        } else {
            $('.accordion-ext .header').removeClass('active');
            $('.accordion-ext .content').slideUp('normal');
            if ($(this).next().is(':hidden') == true) {
                $(this).addClass('active');
                $(this).next().slideDown('normal');
            }
        }
    });

    $('.accordion-ext .content').hide();

    $('.accordion-ext .control .expand').click(function (event) {
        event.preventDefault();
        $('.accordion-ext .header').next().slideDown('normal');
        { $('.accordion-ext .header').addClass('active'); }
    });

    $('.accordion-ext .control .collapse').click(function (event) {
        event.preventDefault();
        $('.accordion-ext .header').next().slideUp('normal');
        { $('.accordion-ext .header').removeClass('active'); }
    });

    $(".smallBoxes .smallbox").last().addClass("last");

    // Tabs
    $("#tabs li").last().addClass("last");
    $("#tabs li").first().addClass("first");
    $("#tabs").tabs();


    // Product detail specification
    $("#slidesNext").click(function (event) {
        event.preventDefault();
        $("#slides").animate({ scrollLeft: '+=680' }, 'slow');
    });
    $("#slidesPrev").click(function (event) {
        event.preventDefault();
        $("#slides").animate({ scrollLeft: '-=680' }, 'slow');
    });

    // Product detail
    $("._option").each(function () {
        $(this).find(".optionimg").each(function (i) {
            if (i % 3 == 2) {
                $(this).addClass("last");
            }
        });
    });
    

    

    $("._option").last().addClass("last");

    // Forms
    $("input[type='radio']").addClass("_radio");
    $("input[type='text']").addClass("_text");
    $("input[type='submit']").addClass("_submit");
    $("select").addClass("_select");

    if (BrowserDetect.browser == 'Firefox') {
        //$("#navbar").css("top","13px");
        if (BrowserDetect.OS == 'Windows') {
            $("#nav>li").css("padding", "0 20px");
        } else {
            $("#nav>li").css("padding", "0 21px");
        }
        $(".baseForm ._select").css({
            position: "relative",
            top: "3px"
        });
    }

});

function showFeaturesBenefits() {
    $("#tabs .t3").click();
}

function showUtilityRebate() {
    $("#tabs .t2").click();
}

function showSpecs() {
    $("#tabs .t1").click();
}

function showOptions() {
    $("#tabs .t4").click();
}

function showLighting() {
    $("#tabs .t5").click();
}




//sticky header
function stickyTitles(stickies) {
    this.load = function () {
        stickies.each(function () {
            var thisSticky = jQuery(this).wrap('<div class="followWrap" />');
            thisSticky.parent().height(thisSticky.outerHeight());
            jQuery.data(thisSticky[0], 'pos', thisSticky.offset().top);
        });
    };
    this.scroll = function () {
        stickies.each(function (i) {
            var thisSticky = jQuery(this),
                nextSticky = stickies.eq(i + 1),
                prevSticky = stickies.eq(i - 1),
                pos = jQuery.data(thisSticky[0], 'pos'),
                h = $('.filterDataContent').offset().top;
            if (pos <= jQuery('.filterDataContent').scrollTop() + h) {
                thisSticky.addClass("fixed");
                if (nextSticky.length > 0 && jQuery('.filterDataContent').scrollTop() + h >= jQuery.data(thisSticky[0], 'pos') - prevSticky.outerHeight()) {
                    thisSticky.addClass("absolute").css("top", jQuery.data(nextSticky[0], 'pos') - $('.filterDataContent').scrollTop() - prevSticky.outerHeight() - h);
                }
            } else {
                thisSticky.removeClass("fixed");
                if (prevSticky.length > 0 && jQuery('.filterDataContent').scrollTop() + h <= jQuery.data(thisSticky[0], 'pos') - prevSticky.outerHeight()) {
                    prevSticky.removeClass("absolute").removeAttr("style");
                }
            }
        });
    };
}
jQuery(document).ready(function () {
    var newStickies = new stickyTitles(jQuery(".filterBar"));
    newStickies.load();
    jQuery('.filterDataContent').show("scroll", function () {
        newStickies.scroll();
    });
});


