$(document).ready(function(){
	$('#registerUser').on('click',handleRegisterUser)
});

function getRegisterFormData(){
	var obj = {
		name: $("#userName").val(),
		username: $('#userUserName').val(),
		password: $('#userPassword').val(),
	}
	return obj;
}

function handleRegisterUser(){
	let isValid = validateForm();
	var data = getRegisterFormData();
	if(isValid){
		$.ajax({
	      	type: "post",
	      	url: "/register",
	      	dataType: 'json',
	      	data: data,
	      	success: function(data) {
	        	console.log('process sucess',data);
	        	console.log('--------- registered successfully----')
	        	clearRegisterForm();
	        	window.location.href = "/login"
	      	},
	      	error: function(e) {
	      		if(e && e.responseJSON && e.responseJSON.reason){
	      			alert(e.responseJSON.reason);
	      		}
	        	console.log('login error',e);
	      	},
	    });
	}
}

function clearRegisterForm(){
	$("#adminName").val('')
	$('#adminUserName').val('')
	$('#adminPassword').val('')
}

function validateForm() {
  	$("#user-reg-form").validate({
	    rules: {
	      userName: {
	        required: true,
	        minlength: 3
	      },
	      userUserName: {
	        required: true,
	        minlength: 3,
	        maxlength: 32
	      },
	      userPassword: {
	        required: true
	       
	      },
	    },
  	});
  	return $("#user-reg-form").valid();
}