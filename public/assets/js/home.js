$(document).ready(function(){
	$('#closeAddSurveyModal').on('click',handleCloseModal);
	$(document).on('click', 'input[type="checkbox"]', function() {      
	    $('input[type="checkbox"]').not(this).prop('checked', false);      
	});
	$('#completeSurey').on('click',handleSubmitSurvey);
	setTimeout(function(){
		getAllSurvey()
	},200)
	
	surveyOptions = [];
	surveyFormsId = [];
	surveyId = null;
});

function getSurveyAnswerData(){
	if(surveyFormsId && surveyFormsId.length>0){
		var allFormArr = [];
		for(var i in surveyOptions){
			var options = []
			var obj = {}
			obj.answerType = surveyOptions[i].answerType;
			obj.formId = surveyOptions[i].formId;
			if($("#surveyAnswer_"+surveyOptions[i].id).is(':checked')){
				obj.surveyAnswer = $("#surveyAnswer_"+surveyOptions[i].id).val();
				obj.id = surveyOptions[i].id
			}
			if(!obj.surveyAnswer){
				delete obj;
				continue;
			}
			allFormArr.push(obj);
		}
		return allFormArr
	}
	else{
		return false;
	}
}

function clearAnswerForm(){

}

function handleSubmitSurvey(){
	var data = getSurveyAnswerData();
	if(data.length == surveyFormsId.length){
		if(data && data.length>0){
			var formData = {};
			formData.answers = data;
			formData.allFormsId = surveyFormsId;
			formData.surveyId = surveyId;
		}

		$.ajax({
	      	type: "post",
	      	url: "/survey-responce",
	      	dataType: 'json',
	      	data: formData,
	      	success: function(data) {
	        	surveyId = null;
	        	console.log('process sucess',data);
	        	console.log('--------- saved success fully----')
	        	alert("Succfully Submitted");
	        	handleCloseModal();
	        	
	      	},
	      	error: function(e) {
	      		if(e && e.responseJSON && e.responseJSON.reason){
	      			alert(e.responseJSON.reason);
	      		}
	        	console.log('login error',e);
	      	},
	    });
	}
	else{
		alert("Give All Question's Answer")
	}
}

function getAllSurvey(){
	$.ajax({
      	type: "get",
      	url: "/survey",
      	dataType: 'json',
      	data: '',
      	success: function(data) {
        	renderAllSurvey(data.allSurvey);
      	},
      	error: function(e) {
      		if(e && e.responseJSON && e.responseJSON.reason){
      			alert(e.responseJSON.reason);
      		}
        	console.log('login error',e);
      	},
    });
}

function renderAllSurvey(allSurvey){
	$('#allSurveyHolder').empty()
	if(allSurvey && allSurvey.length>0){
		for(var key in allSurvey){
			$('#allSurveyHolder').append(getAllSurveyTemplate(allSurvey[key]));
			$('#eachSurvey_'+allSurvey[key]._id).on('click',handleGetSurveyById)
		}
	}
	else{
		$('#allSurveyHolder').append(getAllSurveyTemplate({surveyName:"No Survey Added"}));
	}
}

function handleGetSurveyById(){
	var id = this.id.split('_')[1]
	$.ajax({
      	type: "get",
      	url: "/takesurvey/"+id,
      	dataType: 'json',
      	data: '',
      	success: function(data) {
        	console.log('process sucess',data);
        	if(data){
        		renderOneSurvey(data)
        	}
      	},
      	error: function(e) {
      		if(e && e.responseJSON && e.responseJSON.reason){
      			alert(e.responseJSON.reason);
      		}
        	console.log('login error',e);
      	},
    });
}

function renderOneSurvey(oneSurvey){
	if(oneSurvey && Object.keys(oneSurvey).length>0){
		surveyId = oneSurvey._id
		surveyOptions = [];
		surveyFormsId = []
		$('#oneSurveyModal').modal("show");
		if(oneSurvey.formsInfo && oneSurvey.formsInfo.length>0){
			$('#oneSurveyFormHolder').empty()
			$('#surveyName').text(oneSurvey.surveyName);
			for(var key in oneSurvey.formsInfo){
				oneSurvey.formsInfo[key]._id = oneSurvey._id;
				surveyFormsId.push(oneSurvey.formsInfo[key].id)
				$("#oneSurveyFormHolder").append(initialiseTmpl(oneSurvey.formsInfo[key]));
				// $('#answerSurveyTypeHldr_'+oneSurvey._id).append(compileAnserTypeTmpl(oneSurvey.formsInfo[key]))
			}
			for(var i in oneSurvey.formsInfo){
				if(oneSurvey.formsInfo[i] && oneSurvey.formsInfo[i].options && oneSurvey.formsInfo[i].options.length>0){
					var options = oneSurvey.formsInfo[i].options;
					for(var j in  options){
						surveyOptions.push(options[j]);
						options[j].answerType = oneSurvey.formsInfo[i].answerType;
						options[j].check = true;
						$('#answerSurveyTypeHldr_'+oneSurvey.formsInfo[i].id).append(compileAnserTypeTmpl(options[j]))
					}
				}
			}
		}
		console.log('----dfdf',surveyFormsId,surveyOptions)
	}

}

function handleCloseModal(){
	$('#oneSurveyFormHolder').empty();
	$('#surveyName').text('');
	$('#oneSurveyModal').modal("hide");
}

function gettmpl() {
  return `
  	<div id="newSurveyDynamicForm_{{id}}" class="">
  	
	  	<div class="form-group surveyQuestionCls">
	  		<p>{{surveyQuestion}}</p>
		</div>
		<div id="answerSurveyTypeHldr_{{id}}"></div>
	</div>
  `;
}

function renderAnswerTypeField(){
	return `
    	<div id="answerHldr_{{formId}}">
	    	<input class="" type="{{answerType}}" id="surveyAnswer_{{id}}" name= "check" value="{{option}}"/>
			<span class="answerOptionCls">{{option}}</span>
		</div>
	`
}

function compileAnserTypeTmpl(eachData){
	var template = Handlebars.compile(renderAnswerTypeField());
  var d = template(eachData);
  return d;
}

function initialiseTmpl(eachData) {
  var template = Handlebars.compile(gettmpl());
  var d = template(eachData);
  return d;
}


function compileSurveyTmpl() {
  return `
  <tr  id="eachSurvey_{{_id}}" class="allSurveyCls">
    <td>{{surveyName}}</td>
    <td>₹ {{surveyAmount}}</td>

  </tr>
  `;
}

function getAllSurveyTemplate(eachSurvey){
	var template = Handlebars.compile(compileSurveyTmpl());
  	var d = template(eachSurvey);
  	return d;
}

