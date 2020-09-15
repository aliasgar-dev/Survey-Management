module.exports = function SureyService(instance){

	var self = this
	,	distributedMongo  = null
	,	mongodb = require('mongodb')
	;

	function initialise(cb){

		getMongoService();

		function getMongoService(){
			instance.getService("MongoDBService",function(err,service){
				if(err){
					cb(err,null);
					return;
				}
				distributedMongo = service;
				cb(null,true);
			});
		}
	}

	function saveNewSurvey(data,cb){

		distributedMongo.save("NewSurvey",data,cb)
	}

	function getAllSurvey(cb){
		distributedMongo.find("NewSurvey",{},{},cb)
	}

	function geySurveyById(obj,cb){
		if(obj && obj.id){
			checkisAlreadySubmitted();
		}

		function checkisAlreadySubmitted(){
			var query = {surveyId:obj.id,users:{"$elemMatch":{userId:obj.userId,surveyId:obj.id}}};
			distributedMongo.findOne("CompletedSurvey",query,{},function(err,res){
				if(err){
					console.log(err);
				}
				console.log('---',res)
				if(res){
					if(res && res.users.length>0){
						for(var key in res.users){
							if(res.users[key].userId == obj.userId && res.users[key].surveyId == obj.id){
								cb({reason:"You Already submitted your Answer for this"},null);
								break;
							}
						}
					}
				}
				else{
					var query = {"_id":mongodb.ObjectID(obj.id)};
					distributedMongo.findOne("NewSurvey",query,{},cb)
				}
			})
		}
	}

	function getRewardAmount(surveyId,cb){
		var query = {"_id": mongodb.ObjectID(surveyId)};
		distributedMongo.findOne("NewSurvey",query,{formsInfo:false},(err,res)=>{
			if(err){
				cb(err,null);
				return;
			}
			if(res){
				var obj = {surveyName:res.surveyName,amount:res.surveyAmount}
				cb(null,obj);
			}
		});
	}

	function saveSurveyAnswer(data,cb){

        if(data.answers.length == data.allFormsId.length){
        	getRewardAmount(data.surveyId,function(err,surveyInfo){
        		if(err){
        			console.log('--error while getting reward amount--',err);
        			cb(err,null);
        			return;
        		}
        		if(surveyInfo){	
	        		data.rewardAmount = surveyInfo.amount;
	        		data.surveyName = surveyInfo.surveyName
        		}
        		saveInAnswerCollection();
        	});

        }
        else{
        	cb({reason:"Please Answer All Questions"},true);
        }

        function saveInAnswerCollection(){

        	distributedMongo.save("SurveyResponce",data,function(err,res){
        		if(err){
        			console.log('---error while saving survey response--',err);
        			cb(err,null);
        			return;
        		}
        		updateSurveyForUser()
        	})
        }

        function updateSurveyForUser(){

        	var query = {surveyId: data.surveyId};
        	var updateObj = {surveyId:data.surveyId};
        	var obj = {surveyId:data.surveyId, userId:data.userId}
        	distributedMongo.update("CompletedSurvey",query,{$set:updateObj,$push:{"users":obj}},{upsert:true},(err,res)=>{
        		if(err){
        			console.log('--error while updating users for survey--',err);
        			cb(err,null);
        			return;
        		}

        		updateRewardToUser()
        	});
        }

        function updateRewardToUser(){
			var totalAmount = 0	
			distributedMongo.findOne("Reward",{userId: data.userId},{},(err,rewardData)=>{
				if(err){
					console.log(err);
					cb(err,null);
					return;
				}
				if(rewardData){
					totalAmount = rewardData.rewardAmount;
					totalAmount = parseInt(totalAmount) + parseInt(data.rewardAmount);
				}
				else{
					totalAmount = parseInt(totalAmount) + parseInt(data.rewardAmount);
				}
				var rewardObj = {};
				rewardObj.userId = data.userId;
				rewardObj.rewardAmount = totalAmount;
				var obj = {surveyName:data.surveyName, amount:data.rewardAmount}
				distributedMongo.update("Reward",{userId:data.userId},{$set:rewardObj,"$push":{"surveys":obj}},{upsert:true},(err,res)=>{
					if(err){
						console.log('--error',err);
						cb(err,null);
						return;
					}
					console.log('-----dasasd',res)
					cb(null,true)
				});
			}) ;
        }
	}

	function getAllRewards(userId,cb){
		distributedMongo.find("Reward",{userId:userId},{},(err,res)=>{
			if(err){
				console.log('--error',err);
				cb(err,null);
				return;
			}
			cb(null,res)
		});
	}

	this.initialise = initialise;
	this.saveNewSurvey = saveNewSurvey;
	this.getAllSurvey  = getAllSurvey;
	this.geySurveyById  = geySurveyById;
	this.saveSurveyAnswer = saveSurveyAnswer;
	this.getAllRewards = getAllRewards;
}