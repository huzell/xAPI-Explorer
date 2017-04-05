
$(document).ready(function(){
	console.log("Jquery Ready");

	var isInEditMode = 1;
	var barPadding = 1, 
		scalor = 10, 
		chartContainerTopBar = 55, 
		bgIndex = Math.floor((Math.random() * 7)),
		numOfContainers = 0;

	var verbs = [];
	$.each(ADL.verbs, function(k){ verbs.push(k) });

	var wrapper = ADL.XAPIWrapper;
	wrapper.changeConfig({"endpoint" : 'https://nglms.com/data/xAPI/', "auth":"Basic " + toBase64('fe5b4a35e595695787b107e081d00dfe10f2fea4:fa7d9706487446865d7e9a6c4e44431029b036d5')});

/*
	var wrapper;
	ADL.launch(function(err, launchdata, xAPIWrapper) {
	    if (!err) {
	        wrapper = xAPIWrapper;
	        console.log("--- content launched via xAPI Launch ---\n", wrapper.lrs, "\n", launchdata);
	    } else {
	        wrapper = ADL.XAPIWrapper;
	        wrapper.changeConfig({
	            endpoint: "https://nglms.com/data/xAPI/",
	            user: 'fe5b4a35e595695787b107e081d00dfe10f2fea4',
	            password: 'fa7d9706487446865d7e9a6c4e44431029b036d5'
	        });
	        console.log("--- content statically configured ---\n", wrapper.lrs);
	    }
	    $('#endpoint').text(wrapper.lrs.endpoint);
	}, true);
*/
	
	var dash = new ADL.XAPIDashboard();

	// get all statements made in the last two weeks
	var query = {'since': new Date(Date.now() - 1000*60*60*24*30).toISOString()};
	
	getData();

	function getData(){

		dash.fetchAllStatements(query, fetchDoneCallback);
	
		//---------------------
		//var conf = {"endpoint" : 'https://nglms.com/data/xAPI/', "auth":"Basic " + toBase64('fe5b4a35e595695787b107e081d00dfe10f2fea4:fa7d9706487446865d7e9a6c4e44431029b036d5')};
		//ADL.XAPIWrapper.changeConfig(conf);
	   
		// Get statements queried by activity ID
		var coll = new ADL.Collection();
		var res = ADL.XAPIWrapper.getStatements();
		coll.append(res.statements);
		while (res.more && res.more !== ""){
		   res = ADL.XAPIWrapper.getStatements(null, res.more);
		   coll.append(res.statements);
		}
		// Save fstmts as a new snapshot of original statements collection and filter it by verb ID
		var fstmts = coll.save();
		fstmts.where('verb.id = "http://adlnet.gov/expapi/verbs/Launched"')
		var completed = coll.save();
		completed.where('verb.id = "http://adlnet.gov/expapi/verbs/completed"')
				
		//---------------------
	}
	

	function fetchDoneCallback(){
		var chart = dash.createBarChart({
			container: '#graphContainer svg',
			groupBy: 'verb.id',
			aggregate: ADL.count(),
			customize: function(chart){
				chart.xAxis.rotateLabels(45);
				chart.xAxis.tickFormat(function(d){ return /[^\/]+$/.exec(d)[0]; });
			}
		});
		chart.draw();
	};


	// Ericsson gradients
	var gradients = [
						[[256,256,256],[256,256,256]], // White
						[[161,197,23],[0,159,128]], 
						[[0,159,128],[0,130,185]], 
						[[0,159,128],[0,130,185]],
						[[36,106,179],[95,31,112]],
						[[95,31,112],[219,0,79]],
						[[226,0,26],[240,138,0]]
					];

	

	var dataset = [5, 10, 15, 20, 25, 25];
	var datasetBarchart = [{label: 'label 1', count: 5}, {label: 'label 2', count: 10}, {label: 'label 3', count: 13}, {label: 'label 4', count: 15}, {label: 'label 5', count: 21} ];
	var datasetScatterPlotChart = [
			                  [ 5,     20 ],
			                  [ 480,   90 ],
			                  [ 250,   50 ],
			                  [ 100,   33 ],
			                  [ 330,   95 ],
			                  [ 410,   12 ],
			                  [ 475,   44 ],
			                  [ 25,    67 ],
			                  [ 85,    21 ],
			                  [ 220,   88 ]
			              ];
	var stackBarChartDataset = [
							        [
							                { x: 0, y: 5 },
							                { x: 1, y: 4 },
							                { x: 2, y: 2 },
							                { x: 3, y: 7 },
							                { x: 4, y: 23 }
							        ],
							        [
							                { x: 0, y: 10 },
							                { x: 1, y: 12 },
							                { x: 2, y: 19 },
							                { x: 3, y: 23 },
							                { x: 4, y: 17 }
							        ],
							        [
							                { x: 0, y: 22 },
							                { x: 1, y: 28 },
							                { x: 2, y: 32 },
							                { x: 3, y: 35 },
							                { x: 4, y: 43 }
							        ]
								];


	function edit(){

		if(isInEditMode){
			$('#edit-btn').find('span').removeClass('glyphicon-ok');
			$('#edit-btn').find('span').addClass('glyphicon-edit');
		}
		else {
			$('#edit-btn').find('span').removeClass('glyphicon-edit');
			$('#edit-btn').find('span').addClass('glyphicon-ok');
		}
		

		isInEditMode = !isInEditMode;
	}

	function setBodyGradient(){

		console.log("setting background");

		// Set Stage Gradient Background
		if(bgIndex == gradients.length -1){
			bgIndex = 0;
			$('#econ').attr('src', 'images/ECON_RGB.png');
		}
		else {
			bgIndex++;
			$('#econ').attr('src', 'images/ECON_white.png');
		}

		var rgbStart = "rgb(" + gradients[bgIndex][0] + ")";
		var rgbEnd = "rgb(" + gradients[bgIndex][1] + ")";

		$("body").css("background", rgbStart);
		$("body").css("background", "-moz-linear-gradient(-45deg,  " + rgbStart + " 0%, " + rgbEnd + " 100%)");
		$("body").css("background", "-webkit-linear-gradient(-45deg,  " + rgbStart + " 0%, " + rgbEnd + " 100%)");
		$("body").css("background", "linear-gradient(135deg,  " + rgbStart + " 0%, " + rgbEnd + " 100%)");
		$("body").css("filter", "progid:DXImageTransform.Microsoft.gradient( startColorstr='#1e5799', endColorstr='#7db9e8',GradientType=0 )"); 
	}

	function setRandomBackgroundColour(elem){

		var index = Math.floor((Math.random() * 7));
		var rgbStart = "rgb(" + gradients[index][0] + ")";
		var rgbEnd = "rgb(" + gradients[index][1] + ")";

		elem = $(elem).closest('figure');
		$(elem).css("background", rgbStart);
		$(elem).css("background", "-moz-linear-gradient(-45deg,  " + rgbStart + " 0%, " + rgbEnd + " 100%)");
		$(elem).css("background", "-webkit-linear-gradient(-45deg,  " + rgbStart + " 0%, " + rgbEnd + " 100%)");
		$(elem).css("background", "linear-gradient(135deg,  " + rgbStart + " 0%, " + rgbEnd + " 100%)");
		$(elem).css("filter", "progid:DXImageTransform.Microsoft.gradient( startColorstr='#1e5799', endColorstr='#7db9e8',GradientType=0 )");
	}

	function newChart(){

		numOfContainers++;

		$('#chart-area').append(
			'<figure id="block_' + numOfContainers + '" class="chartContainer">' +
				'<nav class="block-top-banner">' +
					'<div class="btn-group">' +
						
						'<button class="change-box-bg-btn btn btn-lg btn-default" value="+">' +
					  	'<span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>' +
						'</button>' +
						
						'<button class="box-chart-btn btn btn-lg btn-default">' +
						'<span class="glyphicon glyphicon-stats"></span>' +
						'</button>' +
						
						'<button class="box-text-btn btn btn-lg btn-default" value="+">' +
					  	'<span class="glyphicon glyphicon-font" aria-hidden="true"></span>' +
						'</button>' +

						'<button class="box-delete btn btn-lg btn-default" value="+">' +
					  	'<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
						'</button>' +
					'</div>' +

					'<button type="button" class="btn btn-default btn-lg pull-right">GO</button>' +

					'<div class="btn-group pull-right">' +
					  '<button type="button" class="btn btn-default btn-lg" id="task_' + numOfContainers + '">' +
					  '<div id="task_' + numOfContainers + '_selected">Task</div>' +
					  '</button>' +
					  '<button type="button" class="btn btn-default btn-lg dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
					  	'<span class="caret"></span>' +
					  	'<span class="sr-only">Toggle Dropdown</span>' +
					  '</button>' +
					  '<ul id="task_' + numOfContainers + '_list" class="dropdown-menu" aria-labelledby="task_' + numOfContainers + '">' + 
					  '</ul>' +
					'</div>' +
							
					'<div class="btn-group pull-right">' +
					  '<button type="button" class="btn btn-default btn-lg" id="verb_' + numOfContainers + '">' +
					    '<div id="verb_' + numOfContainers + '_selected">Verb</div>' +
					  '</button>' +
					  '<button type="button" class="btn btn-default btn-lg dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
					  	'<span class="caret"></span>' +
					 	'<span class="sr-only">Toggle Dropdown</span>' +
					  '</button>' +
					  '<ul id="verb_' + numOfContainers + '_list" class="dropdown-menu" aria-labelledby="verb_' + numOfContainers + '">' + 
					  '</ul>' +
					'</div>' +

					'<div class="btn-group pull-right">' +
					  '<button type="button" class="btn btn-default btn-lg" id="noun_' + numOfContainers + '">' +
					  '<div id="noun_' + numOfContainers + '_selected">Noun</div>' +
					  '</button>' +
					  '<button type="button" class="btn btn-default btn-lg dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' + 
					    '<span class="caret"></span>' +
						'<span class="sr-only">Toggle Dropdown</span>' +
					  '</button>' +
					  '<ul id="noun_' + numOfContainers + '_list" class="dropdown-menu" aria-labelledby="noun_' + numOfContainers + '">' + 
					  '</ul>' +
					'</div>' +
				'</nav>' +
			'</figure>'
		);

		var block = '#block_' + numOfContainers;
		$( block ).resizable({
			handles:'n,ne,e,se,s,sw,w,nw',
			start: function(event, ui){
				d3.select(block + "-svg").remove();
			},
			stop: function(event, ui){
				createChart($(block).find('button'));
			}
		});

		$( "#block_" + numOfContainers ).draggable({
			containment:"document"
		});

		$.each(ADL.verbs, function(k){ 
			// List verbs from ADL Verb list
			$("#verb_" + numOfContainers + "_list").append('<li id="verb_option_' + k +'"><a href="#">' + k + '</a></li>');

			// Make each verb selectable
			$("#verb_option_" + k).click(function(){
				console.log("selected: " + $("#verb_option_" + k).text());
				$("#verb_" + numOfContainers + "_selected").text($("#verb_option_" + k).text());
			});
		});

		
		// Hook up buttons
		$(".change-box-bg-btn").click(function(){
			setRandomBackgroundColour(this);
		});

		$(".box-chart-btn").click(function(){
			createChart(this);
		});

		$(".box-text-btn").click(function(){
			newTextArea(this);
		});

		$(".box-delete").click(function(){
			deleteChart(this);
		});

	}

	function deleteChart(elem){

		$(elem).closest("figure").remove();
	}

	function newTextArea(elem){

		var id = "txtarea-" + Math.floor((Math.random() * 200));
		$(elem).closest('figure').append(
			'<textarea rows="1" cols="10" id="' + id + '" class="hovering-txtarea">' +
			'</textarea>'
		);

		$('#' + id).draggable({
			containment:"window",
			cursor:'move',
			cancel: 'text',
		});

		$('#' + id).resizable({
			handles:'n,ne,e,se,s,sw,w,nw'
		});
	}

	function createChart(elem){

		var target = $(elem).closest("figure").attr("id") + "-svg";
		target = $("#" + target).attr("class");


		switch(target){
			
			case "pie":
				createDonutChart(elem);
				break;
			case "donut":
				createBarChart(elem);
				break;
			case "bar":
				createScatterPlotChart(elem);
				break;
			case "scatter":
				createStackedBarChart(elem)
				break;
			default:
				createPieChart(elem);
				break;

		}
	}


	function createPieChart(elem){

		// Get the chart container we're working with
		var container = $(elem).closest("figure"); 
		var topBanner = $(elem).closest("nav");

		// Clear old chart
		d3.select("#" + container.attr('id') + "-svg").remove();

		// Set width and height
		var w = container.width();
		var h = container.height() - topBanner.height();
		var radius = Math.min(w, h) / 2;

		// Set bar colour and label colour
		var colour = 0; //gradients[Math.floor((Math.random() * 7))][Math.floor((Math.random() * 2))]
		var labelColour = (colour == gradients[0][0] || colour == gradients[0][1]) ? 'black' : 'white';

		// Define arc radius
		var arc = d3.svg.arc()
					.outerRadius(radius - 10)
					.innerRadius(0);

		// Use D3 Pie layout helper
		var pie = d3.layout.pie()
					.sort(null)
					.value(function(d){ return d });

		// Create new chart SVG
		var svg = d3.select("#" + container.attr('id'))
							.append("svg")
							.attr("width", w)
							.attr("height", h)
							.attr("id", container.attr('id') + "-svg")
							.attr("class", "pie")
							.append("g")
							.attr("transform", "translate(" + w/2 + "," + h/2 + ")");

		// Add onClick event so we can try another colour
		//svg.on('click', function(){
		//	createPieChart(elem);
		//});
		

		// Create the chart
		var g = svg.selectAll(".arc")
				.data(pie(dataset))
				.enter()
				.append("g")
				.attr("class", "arc");

		// Define chart paths
		g.append("path")
		 .attr("d", arc)
		 .attr("fill", function(d){
		 	
		 	if(colour == gradients.length -1)
		 		colour = 0;
		 	else
		 		colour++;

		 	return "rgb(" + gradients[colour][Math.floor((Math.random() * 2))] + ")";
		 })
		 .attr("stroke", "white")
		 .attr("stroke-width", "2px");

		
		// Add chart labels
		g.append("text")
		 .attr("transform", function(d){ return "translate(" + arc.centroid(d) + ")"; })
		 .attr("dy", ".35em")
		 .attr("fill", "white")
		 .style("text-anchor", "middle")
		 .text(function(d){ return d.data; });

		 // Add onClick event so we can try another colour
		g.on('click', function(){
			console.log("Click on G");
			g.style("fill", function(){

			 	return "rgb(" + gradients[Math.floor((Math.random() * 7))][Math.floor((Math.random() * 2))] + ")";
			})
		});
	}

	function createDonutChart(elem){

		// Get the chart container we're working with
		var container = $(elem).closest("figure"); 
		var topBanner = $(elem).closest("nav");

		// Clear old chart
		d3.select("#" + container.attr('id') + "-svg").remove();

		// Set width and height
		var w = container.width();
		var h = container.height() - topBanner.height();
		var radius = Math.min(w, h) / 2;

		// Set bar colour and label colour
		var colour = 0; //gradients[Math.floor((Math.random() * 7))][Math.floor((Math.random() * 2))]
		var labelColour = (colour == gradients[0][0] || colour == gradients[0][1]) ? 'black' : 'white';

		// Define arc radius
		var arc = d3.svg.arc()
					.outerRadius(radius - 10)
					.innerRadius(radius * 0.6);

		// Use D3 Pie layout helper
		var pie = d3.layout.pie()
					.sort(null)
					.value(function(d){ return d });

		// Create new chart SVG
		var svg = d3.select("#" + container.attr('id'))
							.append("svg")
							.attr("width", w)
							.attr("height", h)
							.attr("id", container.attr('id') + "-svg")
							.attr("class", "donut")
							.append("g")
							.attr("transform", "translate(" + w/2 + "," + h/2 + ")");

		// Add onClick event so we can try another colour
		//svg.on('click', function(){
		//	createPieChart(elem);
		//});
		

		// Create the chart
		var g = svg.selectAll(".arc")
				.data(pie(dataset))
				.enter()
				.append("g")
				.attr("class", "arc");

		// Define chart paths
		g.append("path")
		 .attr("d", arc)
		 .attr("fill", function(d){
		 	
		 	if(colour == gradients.length -1)
		 		colour = 0;
		 	else
		 		colour++;

		 	return "rgb(" + gradients[colour][Math.floor((Math.random() * 2))] + ")";
		 })
		 .attr("stroke", "white")
		 .attr("stroke-width", "2px");

		
		// Add chart labels
		g.append("text")
		 .attr("transform", function(d){ return "translate(" + arc.centroid(d) + ")"; })
		 .attr("dy", ".35em")
		 .attr("fill", "white")
		 .style("text-anchor", "middle")
		 .text(function(d){ return d.data; });

		 // Add onClick event so we can try another colour
		g.on('click', function(){
			console.log("Click on G");
			g.style("fill", function(){

			 	return "rgb(" + gradients[Math.floor((Math.random() * 7))][Math.floor((Math.random() * 2))] + ")";
			})
		});
	}

	function createBarChart(elem){

		// Get the chart container we're working with
		var container = $(elem).closest("figure"); 
		var topBanner = $(elem).closest("nav");

		// Clear old chart
		d3.select("#" + container.attr('id') + "-svg").remove();

		// Set width and height
		var w = container.width();
		var h = container.height() - topBanner.height();

		// Set bar colour and label colour
		var colour = gradients[Math.floor((Math.random() * 7))][Math.floor((Math.random() * 2))];
		var labelColour = (colour == gradients[0][0] || colour == gradients[0][1]) ? 'black' : 'white';

		// Create new chart SVG
		var svg = d3.select("#" + container.attr('id'))
							.append("svg")
							.attr("width", w)
							.attr("height", h)
							.attr("id", container.attr('id') + "-svg")
							.attr("class", "bar")
							.attr("transform", "translate(" + w/2 + "," + h/2 + ")");;

		// Add onClick event so we can try another colour
		svg.on('click', function(){
			createBarChart(elem);
		});

		// Create the chart
		svg.selectAll("svg")
		.data(datasetBarchart)
		.enter()
		.append("rect")
		.attr("x", function(d, i){
			return i * (w / datasetBarchart.length);
		})
		.attr("y", function(d){
			return h - d.count * scalor;
		})
		.attr("width", function(d){
			return w / datasetBarchart.length - barPadding;
		})
		.attr("height", function(d){
			return d.count * scalor;
		})
		.attr("fill", function(d){
			return "rgb(" + colour + ")";
		})
		.attr("stroke", function(d){
			return "white"
		})
		.attr("stroke-width", function(){
			return "2px";
		});

		// Set chart text
		svg.selectAll("text")
		.data(datasetBarchart)
		.enter()
		.append("text")
		.text(function(d){
			return d.count;
		})
		.attr("x", function(d, i){
			return i * (w / datasetBarchart.length) + (w / datasetBarchart.length - barPadding) / 2;
		})
		.attr("y", function(d){
			return h - d.count * scalor + 14;
		})
		.attr("fill", labelColour)
		.attr("font-family", "sans-serif")
		.attr("font-size", "14px")
		.attr("text-anchor", "middle");
	}

	function createScatterPlotChart(elem){

		// Get the chart container we're working with
		var container = $(elem).closest("figure"); 
		var topBanner = $(elem).closest("nav");

		// Clear old chart
		d3.select("#" + container.attr('id') + "-svg").remove();

		// Set width and height
		var w = container.width();
		var h = container.height() - topBanner.height();

		// Set bar colour and label colour
		var colour = gradients[Math.floor((Math.random() * 7))][Math.floor((Math.random() * 2))];
		var labelColour = (colour == gradients[0][0] || colour == gradients[0][1]) ? 'black' : 'white';

		// Create new chart SVG
		var svg = d3.select("#" + container.attr('id'))
							.append("svg")
							.attr("width", w)
							.attr("height", h)
							.attr("id", container.attr('id') + "-svg")
							.attr("class", "scatter");

		// Add onClick event so we can try another colour
		svg.on('click', function(){
			createScatterPlotChart(elem);
		});

		svg.selectAll("circle")
			.data(datasetScatterPlotChart)
			.enter()
			.append("circle")
			.attr("cx", function(d){ return d[0]; 
			})
			.attr("cy", function(d){ 
				return d[1]; 
			})
			.attr("r", function(d){
				return Math.sqrt(h - d[1]);
			})
			.attr("stroke", "white")
			.attr("stroke-width", "2px")
			.attr("fill", function(d){
				return "rgb(" + colour + ")";
			});
	}

	function createStackedBarChart(elem){

		// Get the chart container we're working with
		var container = $(elem).closest("figure"); 
		var topBanner = $(elem).closest("nav");

		// Clear old chart
		d3.select("#" + container.attr('id') + "-svg").remove();

		// Set width and height
		var w = container.width();
		var h = container.height() - topBanner.height();

		// Set bar colour and label colour
		var colour = gradients[Math.floor((Math.random() * 7))][Math.floor((Math.random() * 2))];
		var labelColour = (colour == gradients[0][0] || colour == gradients[0][1]) ? 'black' : 'white';

		var stack = d3.layout.stack();
		stack(stackBarChartDataset);

		var xScale = d3.scale.ordinal()
					.domain(d3.range(stackBarChartDataset[0].length))
					.rangeRoundBands([0, w], 0.05);

		var yScale = d3.scale.linear()
					.domain([0, 
						d3.max(stackBarChartDataset, function(d){
							return d3.max(d, function(d){
								return d.y0 + d.y;
							});
						})
					])
					.range([0, h]);

		// Create new chart SVG
		var svg = d3.select("#" + container.attr('id'))
							.append("svg")
							.attr("width", w)
							.attr("height", h)
							.attr("id", container.attr('id') + "-svg")
							.attr("class", "stack");

		var groups = svg.selectAll("g")
					.data(stackBarChartDataset)
					.enter()
					.append("g")
					.style("fill", function(d){
						return "rgb(" + gradients[Math.floor((Math.random() * 7))][Math.floor((Math.random() * 2))] + ")";
					})
					.attr("stroke", "white")
					.attr("stroke-width", "2px");

		var rects = groups.selectAll("rect")
					.data(function(d){ return d; })
					.enter()
					.append("rect")
					.attr("x", function(d, i){
						return xScale(i);
					})
					.attr("y", function(d){
						return yScale(d.y0);
					})
					.attr("height", function(d){
						return yScale(d.y);
					})
					.attr("width", xScale.rangeBand());

		// Add onClick event so we can try another colour
		svg.on('click', function(){
			createStackedBarChart(elem);
		});
	}


	//getLRSData();
	setBodyGradient();

	// Hook up buttons
	$("#add-chart-btn").click(function(){
		newChart();
	});

	$("#change-bg-btn").click(function(){
		setBodyGradient();
	});

	$("#edit-btn").click(function(){
		edit();
	});
});

