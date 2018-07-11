var current, catval, colour, grid;
var HTML = [],
    HTML1 = [],
    HTML2 = [];


jQuery(function(){
    loadAjax('categories.json');
});



function dataTable(dataSet){
    jQuery('#dataSet').DataTable( {
        data: dataSet,
        "responsive": true,
        "columns": [
            { "data": "company" },
            { "data": "drug" },
            { "data": "health_plan" },
            { "data": "therapeutic_area" },
            { "data": "year" },
            { "data": "type" }
        ],
        columnDefs: [
            {
                targets: [ 0, 1, 2 ],
                className: 'mdl-data-table__cell--non-numeric'
            }
        ]
    } );
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
        		jQuery('#categories').html(HTML);
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
        		dataTable(data);
	            HTML2.length = 0;
        		for (var i = 0; i < data.length; i++) {
        			createData(data[i]);		
        		}
                jQuery('#data').append(HTML2).isotope({ 'appended':HTML2, itemSelector: '.demo-card'});
                    setTimeout(function(){
                    jQuery('#data').isotope( 'layout' );
                },100);
        	break;
    	}
	}
}


function createCategories(arr) {
    var html = '<button data-id="'+arr.id+'" data-colour="'+arr.colour+'" class="mdc-button mdc-button--raised '+arr.colour+'">'+arr.name+'</button>';
    HTML.push(html); 
}

function createsubCategories(arr) {
    var html = '<button data-filter=".'+arr.slug+'" class="mdc-button mdc-button--raised cat_'+arr.cat_id+'" style="display:none">'+arr.name+'</button>';
    HTML1.push(html); 
}

function createData(arr) {
    var html = '\
    <div class="mdc-card demo-card '+arr.health_slug+' '+arr.sub_cat_slug+' '+arr.drug_slug+'">\
	   <div class="panel">\
			<div class="front card">\
				<div class="demo-card__primary">\
					<h2 class="demo-card__title mdc-typography--headline6">'+arr.company+'</h2>\
					<h3 class="demo-card__subtitle mdc-typography--subtitle2">'+arr.drug+'</h3>\
					<h3 class="demo-card__subtitle mdc-typography--subtitle2">'+arr.year+'</h3>\
		        </div>\
			</div>\
			<div class="back card">\
				<div class="demo-card__secondary mdc-typography--body2 my-element--animating">\
					<p><strong>Health Plan / Delivery System </strong> '+arr.health_plan+' </p>\
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

jQuery(document).on('click', '#categories button', function(){
    if(catval){
        jQuery('#subcategories .cat_'+catval).hide();
        jQuery('#data').removeClass(colour);
    }
    catval = jQuery(this).attr('data-id');
    colour = jQuery(this).attr('data-colour');
    jQuery('#subcategories .cat_'+catval).show();
    jQuery('#data').addClass(colour);
    jQuery('#data').isotope({ filter: '*' });
});


jQuery(document).on('click', '#subcategories button', function() {
    jQuery('#subcategories button').removeClass('active_button');
    jQuery(this).addClass('active_button');
    var filterValue = jQuery(this).attr('data-filter');
    jQuery('#data').isotope({ filter: filterValue });
});



