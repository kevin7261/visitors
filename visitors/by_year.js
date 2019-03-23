

function funcDraw_ByYear_Main() {

	funcPageDisplayControl("span_id_options_by_year");

	// ---------------------------------------------------

	g_vTotalIndex = [];

	for (let i = 1; i <= 2; i++) {

		g_vTotalIndex.push(i * 250 * Math.pow(10, 3) * g_fHeightScale);//g_vTotalIndex.push(i * 5 * Math.pow(10, 6));
	}

	for (let i in g_dsCountries) {

		g_vDisplayMode.push(0);
	}

	// -----------------------------------------

	let d3LineInterpolate = (g_nLineType == 0)	? d3.curveLinear : d3.curveMonotoneX;

	let nYear_Count = g_dsYears.length;//getMonthCount(nMonth_Min, nMonth_Max);

	g_nTotalCount_Max = 5500000;//d3.sum(g_dsYears[6], function (d) { return .total; });

	// ---------------------------------------------------------------

	fScale_Country = d3.scaleLinear()
							.domain([0, g_dsCountries.length])
							.range([0, COUNTRY_HEIGHT * g_dsCountries.length]);

	fScale_Year_PT = d3.scaleLinear()
							.domain([11, 18])
							.range([0, MAIN_WIDTH]);

	fScale_Year_PX = d3.scaleLinear()
							.domain([1, nYear_Count])
							.range([0, funcGetSVGMain_PX(MAIN_WIDTH)]);

	fScale_Total_PX = d3.scaleLinear()
							.domain([0, g_nTotalCount_Max])
							.range([0, funcGetSVGMain_PX(COUNTRY_HEIGHT * g_fHeightScale)]);

	fScale_Total_PT = d3.scaleLinear()
							.domain([0, g_nTotalCount_Max])
							.range([0, (COUNTRY_HEIGHT * g_fHeightScale)]);

	let divOptions_Background = d3.select("#div_id_page_options_background");

	let divOptions = divOptions_Background.append("div")
												.attr("id", "div_id_page_options");

	// -----------------------------------------------------------------------------------------------

	let svgMain = d3.select("#div_id_main")
					.append("svg")	
						.attr("id", "svg_id_main");

	let svgYears = svgMain.append("g")
						.attr("id", "g_id_countries");

	funcDraw_ByMonthes(svgYears, g_dsYears, 
						fScale_Country, 
						fScale_Year_PT,
						fScale_Total_PX,
						vTouristType);
}

function funcDraw_ByMonthes(svgYears_, d, 
							 fScale_Country, 
							 fScale_Year_PT,
							 fScale_Total_PX,
						   	 vTouristType) {

	let stroke_opacity_s = 1.0;//0.8;
	let stroke_opacity_e = 1.0;//0.6;

	let monthes = g_nAllCountrysCount;
	// -------

	d3.select("#svg_id_years_all").remove();

	let svgYears = svgYears_.append("svg")
									.attr("id", "svg_id_all_visitors")
									.attr("class", "svg_class_monthes")
									.attr("width", MAIN_WIDTH + "pt")
									.attr("height", (ALL_HEIGHT * 2) + "pt")
									.attr("x", 0 + "pt")
									.attr("y", fScale_Country(0) + "pt");

	{
		svgYears.append("line")
						.attr("id", "line_id_zero")
						.attr("class", "color_total")
						.attr("x1", fScale_Year_PT(11) + "pt")
						.attr("y1", function(d_year) { return (ALL_HEIGHT) + "pt"; })
						.attr("x2", fScale_Year_PT(18) + "pt")
						.attr("y2", function(d_year) { return (ALL_HEIGHT) + "pt"; });
	}


	{

		let s = 37;

			for (var y = s; y >= 0; y--) {


		let c = y % 6;

		let color = "color_main"
		switch (c) {
			case 0: color = "color_total"; break;
			case 1: color = "color_pleasure"; break;
			case 2: color = "color_business"; break;
			case 3: color = "color_visit_relatives"; break;
			case 4: color = "color_study"; break;
			case 5: color = "color_others"; break;
		}

		svgYears.selectAll("line.line_class_year_" + y)
			.data(d)
			.enter()
				.append("line")
					.attr("class", " line_class_year_" + y)
					.attr("x1", function(d_year) { return fScale_Year_PT(d_year[0].values[0].month.toString().substring(0, 2)) + "pt"; })
					.attr("y1", function(d_year) { 
													let nSum = 0;

													for (let i = s; i >= y + 1; i--)
														nSum += d3.sum(d_year[i].values, function(_d) { 
															  	return _d.total;
															});

													return (ALL_HEIGHT - fScale_Total_PT(nSum)) + "pt"; 	
												})
					.attr("x2", function(d_year) { return fScale_Year_PT(d_year[0].values[0].month.toString().substring(0, 2)) + "pt"; })
					.attr("y2", function(d_year) { 
													let nSum = 0;

													for (let i = s; i >= y; i--)
														nSum += d3.sum(d_year[i].values, function(_d) { 
															  	return _d.total;
															});

													return ((ALL_HEIGHT - fScale_Total_PT(nSum)) + 0.5) + "pt"; 
												})
					.attr("stroke-width", 50 + "pt")
					.attr("stroke", function(d_year, i) { 
													
													let c = "#FCFCFC";

													console.log(d_year[y].values[0].class_residence);

													if (d_year[y].values[0].class_residence == "mainland_china")
														c = "#FF7F50";
													else if (d_year[y].values[0].class_residence == "japan")
														c = "#FFD700";
													if (d_year[y].values[0].class_residence == "hongkong_macao")
														c = "#ADFF2F";
													else if (d_year[y].values[0].class_residence == "korearepublic_of")
														c = "#87CEFA";
													else if (d_year[y].values[0].class_residence == "united_states_of_america")
														c = "#CD853F";

													console.log(c);

													return c; 	
												})
					.attr("stroke-opacity", 1 - (y * 0.075));
				}
	}
	
/*

	{
		svgYears.selectAll("line.line_class_year_0")
			.data(d)
			.enter()
				.append("line")
					.attr("class", "color_pleasure line_class_year_0")
					.attr("x1", function(d_year) { return fScale_Year_PT(d_year[0].values[0].month.toString().substring(0, 2)) + "pt"; })
					.attr("y1", function(d_year) { 
													let nSum = 0;

													for (let i = 3; i >= 4; i--)
														nSum += d3.sum(d_year[i].values, function(_d) { 
															  	return _d.total;
															});

													return (ALL_HEIGHT - fScale_Total_PT(nSum)) + "pt"; 												})
					.attr("x2", function(d_year) { return fScale_Year_PT(d_year[0].values[0].month.toString().substring(0, 2)) + "pt"; })
					.attr("y2", function(d_year) { 
													let nSum = 0;

													for (let i = 3; i >= 3; i--)
														nSum += d3.sum(d_year[i].values, function(_d) { 
															  	return _d.total;
															});

													return (ALL_HEIGHT - fScale_Total_PT(nSum)) + "pt"; 
												})
					.attr("stroke-width", 10 + "pt")
					.attr("stroke-opacity", 1);

		svgYears.selectAll("line.line_class_year_1")
			.data(d)
			.enter()
				.append("line")
					.attr("class", "color_pleasure line_class_year_0")
					.attr("x1", function(d_year) { return fScale_Year_PT(d_year[0].values[0].month.toString().substring(0, 2)) + "pt"; })
					.attr("y1", function(d_year) { 
													let nSum = 0;

													for (let i = 3; i >= 3; i--)
														nSum += d3.sum(d_year[i].values, function(_d) { 
															  	return _d.total;
															});

													return (ALL_HEIGHT - fScale_Total_PT(nSum)) + "pt"; 
												 })
					.attr("x2", function(d_year) { return fScale_Year_PT(d_year[0].values[0].month.toString().substring(0, 2)) + "pt"; })
					.attr("y2", function(d_year) { 
													let nSum = 0;

													for (let i = 3; i >= 2; i--)
														nSum += d3.sum(d_year[i].values, function(_d) { 
															  	return _d.total;
															});

													return (ALL_HEIGHT - fScale_Total_PT(nSum)) + "pt"; })
					.attr("stroke-width", 20 + "pt")
					.attr("stroke-opacity", 1);

		svgYears.selectAll("line.line_class_year_2")
			.data(d)
			.enter()
				.append("line")
					.attr("class", "color_pleasure line_class_year_0")
					.attr("x1", function(d_year) { return fScale_Year_PT(d_year[0].values[0].month.toString().substring(0, 2)) + "pt"; })
					.attr("y1", function(d_year) { 
													let nSum = 0;

													for (let i = 3; i >= 2; i--)
														nSum += d3.sum(d_year[i].values, function(_d) { 
															  	return _d.total;
															});

													return (ALL_HEIGHT - fScale_Total_PT(nSum)) + "pt"; 
												 })
					.attr("x2", function(d_year) { return fScale_Year_PT(d_year[0].values[0].month.toString().substring(0, 2)) + "pt"; })
					.attr("y2", function(d_year) { 
													let nSum = 0;

													for (let i = 3; i >= 1; i--)
														nSum += d3.sum(d_year[i].values, function(_d) { 
															  	return _d.total;
															});

													return (ALL_HEIGHT - fScale_Total_PT(nSum)) + "pt"; 
												 })
					.attr("stroke-width", 30 + "pt")
					.attr("stroke-opacity", 1);

		svgYears.selectAll("line.line_class_year_3")
			.data(d)
			.enter()
				.append("line")
					.attr("class", "color_pleasure line_class_year_0")
					.attr("x1", function(d_year) { return fScale_Year_PT(d_year[0].values[0].month.toString().substring(0, 2)) + "pt"; })
					.attr("y1", function(d_year) { 
													let nSum = 0;

													for (let i = 3; i >= 1; i--)
														nSum += d3.sum(d_year[i].values, function(_d) { 
															  	return _d.total;
															});

													return (ALL_HEIGHT - fScale_Total_PT(nSum)) + "pt"; 
												 })
					.attr("x2", function(d_year) { return fScale_Year_PT(d_year[0].values[0].month.toString().substring(0, 2)) + "pt"; })
					.attr("y2", function(d_year) { 
													let nSum = 0;

													for (let i = 3; i >= 0; i--)
														nSum += d3.sum(d_year[i].values, function(_d) { 
															  	return _d.total;
															});

													return (ALL_HEIGHT - fScale_Total_PT(nSum)) + "pt"; 
												 })
					.attr("stroke-width", 40 + "pt")
					.attr("stroke-opacity", 1);
	}
*/
	// ----------------------------

	for (let y = 11; y <= 18; y++) {

		svgYears.append("text")
					.attr("id", "text_id_year_year_" + y + "_all")
					.attr("class", "text_class_month_year font_size_10 color_main")
					.attr("x", fScale_Year_PT(y) + "pt")
					.attr("y", ALL_HEIGHT + 12 + "pt")
					.attr("fill-opacity", 1)
					.text("'" + y);
	}
}
