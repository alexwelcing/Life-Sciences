var current, catval, colour, grid, jsData;
var HTML = [],
    HTML1 = [],
    HTML2 = [],
    HTML3 = [];


jQuery(function(){
    loadAjax('categories.json');
    jQuery('.fixed-action-btn').floatingActionButton();
});



function dataTable(dataSet){
    jQuery('#dataSet').DataTable({
        data: dataSet,
        "responsive": true,
        "pageLength": 25,
        "lengthChange": false,
        "columns": [
            { "data": "company_name" },
            { "data": "drug_name" },
            { "data": "health_plan_name" },
            { "data": "therapeutic_area" },
            { "data": "year" },
            { "data": "type" }
        ],
        createdRow: function (row, data, index) {
            jQuery(row).addClass(data.colour);
        },
        columnDefs: [
            {
                targets: [ 0, 1, 2 ],
                className: 'mdl-data-table__cell--non-numeric'
            }
        ]
    });
}
    
function loadAjax(file){
    current = file;
    jQuery.ajax({
        dataType: "json",
		url: "json/"+file,
		data: [],
		success: showData
	});	
}


function showData(data, status, xhr) {
	if(data.length){
	    switch(current){
	        case 'categories.json':
	            HTML.length = 0;
        		for (var i = 0; i < data.length; i++) {
        			createCategories(data[i]);		
        		}
        		jQuery('#categories .dyn').html(HTML);
                loadAjax('sub-categories.json');
        	break;
        	case 'sub-categories.json':
	            HTML1.length = 0;
        		for (var i = 0; i < data.length; i++) {
        			createsubCategories(data[i]);		
        		}
        		jQuery('#subcategories').html(HTML1);
        		loadAjax('data.json');
        	break;
        	case 'data.json':
        	    jsData = data;
        		dataTable(data);
	            dataCall(data);
	            loadAjax('source.json');
        	break;
        	case 'source.json':
	            HTML3.length = 0;
        		for (var i = 0; i < data.length; i++) {
        			createSource(data[i]);		
        		}
        		jQuery('#source').html(HTML3);
        	break;
    	}
	}
}


function createCategories(arr) {
    var html = '<button data-id="'+arr.id+'" data-slug="'+arr.slug+'" class="mdc-button mdc-button--raised '+arr.colour+'">'+arr.name+'</button>';
    HTML.push(html); 
}

function createsubCategories(arr) {
    var html = '<button data-id="'+arr.id+'" class="mdc-button mdc-button--raised cat_'+arr.cat_id+' '+arr.colour+'" style="display:none">'+arr.name+'</button>';
    HTML1.push(html); 
}

function createData(arr) {
    var newDate = new Date(arr.year_fil).getTime();
    newDate = newDate+arr.id;
    var typeClass='';
    if(arr.type==='Value-Based Contracting'){
        typeClass = 'value';
    }
    else{
       typeClass = 'outcomes'; 
    }
    
    var html = '\
    <div class="mdc-card demo-card '+arr.colour+' '+typeClass+'-based" data-date="'+arr.year_fil+'">\
	   <div class="panel">\
			<div class="front card">\
				<div class="demo-card__primary">\
				    <div class="colour-box">'+arr.company_name.charAt(0)+'</div>\
					<h2 class="demo-card__title mdc-typography--headline6">'+arr.company_name+'</h2>\
					<h3 class="demo-card__subtitle mdc-typography--subtitle2">'+arr.drug_name+'</h3>\
					<h3 class="demo-card__subtitle mdc-typography--subtitle2">'+arr.type+'</h3>\
					<h3 class="demo-card__subtitle mdc-typography--subtitle2">'+arr.year+'</h3>\
		        </div>\
		        <div class="demo-card__secondary mdc-typography--body2 my-element--animating">\
					<p><strong>Health Plan/PBM </strong><span>'+arr.health_plan_name+' </span></p>\
					<p><strong>Therapeutic Area </strong><span>'+arr.therapeutic_area+'</span> </p>\
		        </div>\
			</div>\
			<div class="back card">\
				<div class="demo-card__secondary mdc-typography--body2 my-element--animating">\
				'+arr.description.substr(0, 300)+' <a class="source_cls" data-tab="source'+arr.source+'">['+arr.source+']</a>\
				<a class="show-desc" href="#more_Data_'+arr.id+'" >read more</a>\
				</div>\
			</div>\
			<div class="tool-desc" id="more_Data_'+arr.id+'" style="display:none"><div class="inner_tool_tip"><p>'+arr.description+' <a class="source_cls" href="#more_Data_'+arr.id+'" data-tab="source'+arr.source+'">['+arr.source+']</a></p><a class="close_tool_tip" href="#more_Data_'+arr.id+'">Close</a></div>\
			</div>\
		</div>\
	</div>';
    HTML2.push(html);
}

function createSource(arr) {
    var html = '\
    <li id="source'+arr.id+'" data-tab="source'+arr.id+'"><a href="'+arr.link+'" target="_blank">'+arr.description+'</a></li>';
    HTML3.push(html);
}




jQuery(document).on('click', '#categories .dyn button', function(){
    jQuery('#categories .fil button').removeClass('filter');
    jQuery('#subcategories button').removeClass('active');
    if(catval){
        jQuery('#subcategories .cat_'+catval).hide();
        jQuery('#data').removeClass(colour);
        jQuery('#dataSet thead').removeClass(colour);
    }
    catval = jQuery(this).attr('data-id');
    colour = jQuery(this).attr('data-colour');
    jQuery('#subcategories .cat_'+catval).show();
    jQuery('#data').addClass(colour);
    jQuery('#dataSet thead').addClass(colour);
    
    jQuery('#categories .dyn button').removeClass('clicked');
    jQuery(this).addClass('clicked');
    
    jQuery('#dataSet').DataTable().clear().destroy();
    dataTable(jsData);
    dataCall(jsData);
   // jQuery('#data').isotope({ filter: '*' });
    jQuery('#data').addClass("animate-outer");
});





jQuery(document).on('click', '#subcategories button', function() {
    jQuery('#categories .fil button').removeClass('filter');
    jQuery(this).toggleClass('active');
    var catid = jQuery('#categories .dyn button.clicked').attr('data-slug');
    filterDt(catid);
  // jQuery('#data').isotope({ filter: '*' });
});


function filterDt(catid){
    var catid = catid.replace(/-/g, "_");
    var catname;
    var arr1 = new Array();
    var arr2 = new Array();
    var arr3 = new Array();
    var i=0,j=0;
    
    var act = jQuery("#subcategories button.active").length;
    //alert(act);
    
    
    
    
    if(act>0){
        jQuery("#subcategories button.active").each(function( index ) {
            arr3[index] = jQuery(this).attr('data-id');
        });
    }
    else{
        jQuery('#dataSet').DataTable().clear().destroy();
        dataTable(jsData);
        dataCall(jsData);
    }
      
    
    if(arr3.length>0){
        jQuery.each( jsData, function( key, value ) {
            switch(catid){
                case 'company':
                    if(jQuery.inArray(value.company, arr3) !== -1){
                       arr1[i] = value;
                       i++;
                    }
                    else{
                        arr2[j] = value;
                        j++;
                    }
                break;
                case 'drug':
                    if(jQuery.inArray(value.drug, arr3) !== -1){
                       arr1[i] = value;
                       i++;
                    }
                    else{
                        arr2[j] = value; 
                        j++;
                    }
                break;
                case 'health_plan':
                    if(jQuery.inArray(value.health_plan, arr3) !== -1){
                       arr1[i] = value;
                       i++;
                    }
                    else{
                        arr2[j] = value;
                        j++;
                    }
                break;
            }
        });
        
        jQuery('#dataSet').DataTable().clear().destroy();
        dataTable(arr1);
        
        dataCall(arr1);
    }

}

function dataCall(data){
    HTML2.length = 0;
	for (var i = 0; i < data.length; i++) {
		createData(data[i]);		
	}
	jQuery('#data').html("");
	
    jQuery('#data').append(HTML2);
    setTimeout(function(){
        //jQuery('#data').isotope({ filter: '*' });
         jQuery('#data').addClass("animate-outer");
    },100);
}




function getSorted(selector, attrName, dir) {
    return $($(selector).toArray().sort(function(a, b){
        var aVal = parseInt(a.getAttribute(attrName)),
            bVal = parseInt(b.getAttribute(attrName));
        if(dir=='asc'){
            return aVal - bVal;
        }
        else{
           return bVal - aVal; 
        }
    }));
}



jQuery(document).on('click', '#categories .fil button', function(){
    
    
    jQuery('#categories .fil button').removeClass('filter');
    jQuery(this).addClass('filter');
    
    var sortValue = $(this).attr('data-sort-value');
    /* Get the sorting direction: asc||desc */
    var direction = $(this).attr('data-sort-direction');
    /* convert it to a boolean */
    var isAscending = (direction == 'asc');
    var newDirection = (isAscending) ? 'desc' : 'asc';
    
    if(sortValue=='filedate'){
        var sorted_items = getSorted('#data .demo-card', 'data-date', newDirection);
        jQuery('#data').html("");
        jQuery('#data').html(sorted_items);
        jQuery(this).attr('data-sort-direction', newDirection);
        jQuery(this).find('.fa').toggleClass('fa-chevron-up fa-chevron-down');
    }
    else if(sortValue=='filetype'){
        typeFilter();
    }
    jQuery('#data').addClass("animate-outer");
    
});

function typeFilter(){
    
    var arr1='', arr2='';
    
    jQuery("#data .demo-card.outcomes-based").each(function( index ) {
        var date = $(this).attr('data-date');
        var div = jQuery(this).html();
        arr1 += '<div class="mdc-card demo-card colour1 outcomes-based" data-date="'+date+'">'+div+'</div>';
    });
    
    jQuery("#data .demo-card.value-based").each(function( index ) {
        var date = $(this).attr('data-date');
        var div = jQuery(this).html();
        arr2 += '<div class="mdc-card demo-card colour2 value-based" data-date="'+date+'">'+div+'</div>';
    });

    jQuery('#data').html("");
    jQuery('#data').html('<div class="outcomes">\
                        <h4>Outcomes-Based Contracting</h4>\
                        '+arr1+'\
                        </div>\
                        <div class="free"></div>\
                        <div class="value">\
                        <h4>Value-Based Contracting</h4>\
                        '+arr2+'\
                        </div>\
                    ');
   // jQuery('#data').isotope({ filter: '*' });
    
}



jQuery(document).on('click', 'a.source_cls', function (event) {
    event.preventDefault();
    jQuery('#myData').hide();
    jQuery(jQuery(this).attr('href')).hide();
    var tab_id = jQuery(this).attr('data-tab');
    jQuery("#source li").removeClass('selected');
    jQuery("#" + tab_id).addClass('selected ');
    
    goTo(tab_id);
});

function goTo(id){
    jQuery('html, body').animate({
        scrollTop: jQuery("#" + id).offset().top
    }, 1500);
}

function showAll(id){
    var dat;
    jQuery.each(jsData, function(key, value) {
        if(value.id==id){
            dat = value;
        }
    });
    var htmls = '\
    <div class="heading">\
        <h3>'+dat.company_name+'</h3>\
        <sapn class="subtitle">'+dat.drug_name+'</sapn>\
         <sapn class="subtitle">'+dat.type+'</sapn>\
          <sapn class="subtitle">'+dat.year+'</sapn>\
    </div>\
    <div class="health-plan">\
        <h3>Health Plan/PBM </h3>\
        <p>'+dat.health_plan_name+'</p>\
        <h3>Therapeutic Area </h3>\
        <p>'+dat.therapeutic_area+'</p>\
    </div>\
    <div class="discription">\
       <h3>Description</h3>\
       <p>'+dat.description+' <a class="source_cls" data-tab="source'+dat.source+'">['+dat.source+']</a></p>\
    </div>\
    ';
    
    jQuery('.inner').html(htmls);
    jQuery('#myData').show();
}



//----- CLOSE
jQuery(document).on('click', '.popup-close', function() {
	jQuery('#myData').hide();
});
  
  
jQuery(document).on('click', '#data .panel', function() {
	jQuery(this).addClass('active');
}); 
jQuery(document).on('click', '#data .panel.active', function() {
	jQuery(this).removeClass('active');
}); 



//download csv files
function downloadCSV(){
    var link=document.createElement('a');
    document.body.appendChild(link);
    link.href= 'json/data.csv';
    link.download = '';
    link.click();
}  

jQuery(document).on('click', '.show-desc', function(event){
     event.preventDefault();
     jQuery('.tool-desc').hide();
    jQuery(jQuery(this).attr('href')).show();
});
 

jQuery(document).on('click', '.close_tool_tip', function(event){
     event.preventDefault();
    
    jQuery(jQuery(this).attr('href')).hide();
});
 
 
 
 
 
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 


