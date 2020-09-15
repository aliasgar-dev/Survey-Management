$(document).ready(function(){
	
	setTimeout(function(){
		getAllReward()
	},300)
});

function getAllReward(){
	$.ajax({
      	type: "get",
      	url: "/all-reward",
      	dataType: 'json',
      	data: '',
      	success: function(data) {
      		console.log("Reward----",data)
        	renderAllReward(data);
      	},
      	error: function(e) {
      		if(e && e.responseJSON && e.responseJSON.reason){
      			alert(e.responseJSON.reason);
      		}
        	console.log('error in getting all-reward',e);
      	},
    });
}

function renderAllReward(allRewards){
	var total = 0;
	if(allRewards && allRewards.length>0){
		for(var key in allRewards[0].surveys){
			$('#allRewardHolder').append(getAllRewardTemplate(allRewards[0].surveys[key]));
		}
		$('#totalReward').text(allRewards[0].rewardAmount)
	}
	else{
		$('#allRewardHolder').append(getAllEmptyTemplate({msg:"No Reward Added"}));
	}
}

function compileRewardTmpl() {
  return `
  <tr  id="eachReward_{{_id}}" class="allSurveyCls">
    <td>{{surveyName}}</td>
    <td>₹{{amount}}</td>

  </tr>
  `;
}

function getAllRewardTemplate(eachReward){
	var template = Handlebars.compile(compileRewardTmpl());
  	var d = template(eachReward);
  	return d;
}

function compileEmptyTmpl() {
  return `
  <tr  id="eachReward_{{_id}}" class="allSurveyCls" style="text-align:center;">
    <td>{{msg}}</td>
   
  </tr>
  `;
}

function getAllEmptyTemplate(eachReward){
	var template = Handlebars.compile(compileEmptyTmpl());
  	var d = template(eachReward);
  	return d;
}
