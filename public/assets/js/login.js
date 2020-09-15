
$(document).ready(function(){
	
	$('#login').show();
	$('#SharesPageHldr').hide();
	$('#loginUser').on("click",handleLoginUser);
	$('#logout').on("click",handleLogoutUser);
	// setTimeout(validateForm,500)
	// console.log('---socket----',socket)
	
	function getLoginFormData(){
		let obj = {};
		obj.username = $('#username').val();
		obj.password = $('#password').val();
		return obj;
	}


	function validateForm() {
		$("#admin-login-form").validate({
		    rules: {
		      username: {
		        required: true,
		        minlength: 3,
		      },
		      password: {
		        required: true,
		      },
		    },
		});
		return $("#admin-login-form").valid();
	}


	function handleLoginUser(){
		let isValid = validateForm();
		var loginData = getLoginFormData();
		if(isValid){
			$.ajax({
		      	type: "post",
		      	url: "/login",
		      	dataType: 'json',
		      	data: loginData,
		      	success: function(data) {
		        	console.log('process sucess',data);
		        	console.log('--------- logged in success fully----')
		        	clearLoginForm();
		        	window.location.href = "/home"
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

	function handleLogoutUser(){
		$.ajax({
	      	type: "get",
	      	url: "/logout",
	      	success: function(data) {
	        	console.log('logout sucess');
		    	localStorage.setItem("userId",'');
		    	localStorage.setItem("token",'');
		    	window.location.reload()
	      	},
	      	error: function(e) {
	        	console.log('login error',e);
	      	},
	    });
		
	}

	function clearLoginForm(){
		$('#username').val('');
		$('#password').val('');
	}

	
	function getAllSharesTmpl(){

	  	return `
		  <tr >
		    <td>{{shareName}}</td>
		    <td id="shareValue_{{_id}}">{{currentValue}}</td>
		  </tr>
	  	`;
	}

	function getEmptyTmpl(){

	  	return `
		  <div>{{msg}}</div>
	  	`;
	}

	function renderUserName(user){
		var template = Handlebars.compile(getChatUserNametmpl());
	  	var d = template(user);
	  	return d;
	}

});
