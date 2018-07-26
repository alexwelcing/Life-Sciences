var current, catval, colour, grid, jsData;
var HTML = [],
    HTML1 = [],
    HTML2 = [];


jQuery(function(){
    loadAjax('categories.json');
});



function dataTable(dataSet){
    jQuery('#dataSet').DataTable({
        data: dataSet,
        "responsive": true,
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
	            HTML2.length = 0;
        		for (var i = 0; i < data.length; i++) {
        			createData(data[i]);		
        		}
        		jQuery('#data').html("");
                jQuery('#data').append(HTML2).isotope({ 'appended':HTML2, itemSelector: '.demo-card' });
                    setTimeout(function(){
                    jQuery('#data').isotope( 'layout' );
                },100);
        	break;
    	}
	}
}


function createCategories(arr) {
    var html = '<button data-id="'+arr.id+'" data-slug="'+arr.slug+'" data-colour="'+arr.colour+'" class="mdc-button mdc-button--raised '+arr.colour+'">'+arr.name+'</button>';
    HTML.push(html); 
}

function createsubCategories(arr) {
    var html = '<button data-filter=".cat_'+arr.id+'" data-id="'+arr.id+'" class="mdc-button mdc-button--raised cat_'+arr.cat_id+' '+arr.colour+'" style="display:none">'+arr.name+'</button>';
    HTML1.push(html); 
}

function createData(arr) {
    var date = arr.year;
    date = date.split(',');
    date = date[0].split(" ");
    var newDate = date[0];
    newDate = new Date(newDate).getTime();
    newDate = newDate+arr.id;
    
    var html = '\
    <div class="mdc-card demo-card cat_'+arr.company+' cat_'+arr.drug+' cat_'+arr.health_plan+' '+arr.colour+'" data-ticks="'+newDate+'">\
	   <div class="panel">\
			<div class="front card">\
				<div class="demo-card__primary">\
					<h2 class="demo-card__title mdc-typography--headline6">'+arr.company_name+'</h2>\
					<h3 class="demo-card__subtitle mdc-typography--subtitle2">'+arr.drug_name+'</h3>\
					<h3 class="demo-card__subtitle mdc-typography--subtitle2 filename">'+arr.type+'</h3>\
					<h3 class="demo-card__subtitle mdc-typography--subtitle2">'+arr.year+'</h3>\
		        </div>\
			</div>\
			<div class="back card">\
				<div class="demo-card__secondary mdc-typography--body2 my-element--animating">\
					<p><strong>Health Plan / Delivery System </strong> '+arr.health_plan_name+' </p>\
					<p><strong>Therapeutic Area </strong> '+arr.therapeutic_area+' </p>\
		        </div>\
			</div>\
		</div>\
		<div class="mdc-card__actions read">\
			<div class="mdc-card__action-buttons">\
			   <button class="mdc-button mdc-card__action mdc-card__action--button">Read More<i class="material-icons">navigate_next</i></button>\
			</div>\
		</div>\
	</div>';
    HTML2.push(html);
}

jQuery(document).on('click', '#categories .dyn button', function(){
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
    jQuery('#data').isotope({ filter: '*' });
    
    jQuery('#categories .dyn button').removeClass('clicked');
    jQuery(this).addClass('clicked');
});


jQuery(document).on('click', '#categories .fil button', function(){
    var $iso = jQuery('#data').isotope({
        itemSelector: '.mdc-card',
        layoutMode: 'fitRows',
        getSortData: {
            filedate: '[data-ticks]',
            filename: '.filename'
        }
    });
    
    /* Get the element name to sort */
    var sortValue = $(this).attr('data-sort-value');
    /* Get the sorting direction: asc||desc */
    var direction = $(this).attr('data-sort-direction');
    /* convert it to a boolean */
    var isAscending = (direction == 'asc');
    var newDirection = (isAscending) ? 'desc' : 'asc';

    /* pass it to isotope */
    $iso.isotope({ sortBy: sortValue, sortAscending: isAscending });

    $(this).attr('data-sort-direction', newDirection);

    var span = $(this).find('.fa');
    span.toggleClass('fa-chevron-up fa-chevron-down');
});



jQuery(document).on('click', '#subcategories button', function() {
    jQuery('#subcategories button').removeClass('active_button');
    jQuery(this).addClass('active_button');
    var filterValue = jQuery(this).attr('data-filter');
    jQuery('#data').isotope({ filter: filterValue });
    
    var catid = jQuery('#categories .dyn button.clicked').attr('data-slug');
    var subcatid = jQuery(this).attr('data-id');
    filterDt(catid, subcatid);
});


function filterDt(catid, subcatid){
    var catid = catid.replace(/-/g, "_");
    var catname;
    var arr1 = new Array();
    var arr2 = new Array();
    var i=0,j=0;
    jQuery.each( jsData, function( key, value ) {
        switch(catid){
            case 'company':
                if(value.company==subcatid){
                   arr1[i] = value;
                   i++;
                }
                else{
                    arr2[j] = value;
                    j++;
                }
            break;
            case 'drug':
                if(value.drug==subcatid){
                   arr1[i] = value;
                   i++;
                }
                else{
                    arr2[j] = value; 
                    j++;
                }
            break;
            case 'health_plan':
                if(value.health_plan==subcatid){
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
    
    //var newArray = arr1.concat(arr2);
    //dataTable(newArray);
}






