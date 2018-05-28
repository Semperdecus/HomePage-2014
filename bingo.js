
  function handleButtonClick(button){
	if ($(button).text().match("Check all")){
	  $(":checkbox").prop("checked", true)
	} else {
	  $(":checkbox").prop("checked", false)
	};
	updateButtonStatus();
  }

  function updateButtonStatus(){
	var allChecked = $(":checkbox").length === $(":checkbox:checked").length;
	$("button").text(allChecked? "Uncheck all" : "Check all");
  }

  function updateCookie(){
	var elementValues = {};
	$(":checkbox").each(function(){
	  elementValues[this.id] = this.checked;
	});

	elementValues["buttonText"] = $("button").text();
	$.cookie('elementValues', elementValues, { expires: 7, path: '/' })
  }

  function repopulateFormELements(){
	var elementValues = $.cookie('elementValues');
	if(elementValues){
	  Object.keys(elementValues).forEach(function(element) {
		var checked = elementValues[element];
		$("#" + element).prop('checked', checked);
	  });

	  $("button").text(elementValues["buttonText"])
	}
  }

  $(":checkbox").on("change", function(){
	updateButtonStatus();
	updateCookie();
  });

  $("button").on("click", function() {
	handleButtonClick(this);
	updateCookie();
  });

  $.cookie.json = true;
  repopulateFormELements();
