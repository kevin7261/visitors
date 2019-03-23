

function funcDraw_ByVisitType_Main() {

	funcPageDisplayControl("span_id_options_by_visit_type");

	// ---------------------------------------------------

	d3.select("#div_id_main")
		.append("span")	
			.attr("id", "svg_id_main")
			.text("By Visit Type");
}
