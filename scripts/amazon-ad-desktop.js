amazon_ad_tag ="ntactactic-21"; 
amazon_ad_width ="160"; 
amazon_ad_height ="600"; 
amazon_ad_link_target ="new"; 
amazon_ad_discount ="remove"; 
amazon_color_border ="DDDDDD"; 
amazon_color_link ="000000"; 
amazon_color_price ="B22222"; 
amazon_color_logo ="FFFFFF"; 
amazon_ad_exclude ="toy;children;game;card"; 
amazon_ad_include ="kit;boots;golf;sportswear;gym"; 
amazon_ad_categories ="k";
amazon_desktop_ad_append_element = document.getElementsByClassName("ad")[1];

amazon_ad_o = 2;
amazon_ad_rcm = "rcm-eu.amazon-adsystem.com";
amazon_ad_linkcode = "op1";

var script = document.createElement("script");
script.type = "text/javascript";
script.src = "amazon-ad-common-min.js";
amazon_desktop_ad_append_element.appendChild(script);
