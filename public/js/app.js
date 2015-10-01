
(function () {

    
    var app = angular.module('askTom', ['ngRoute','ui.bootstrap']);
    

     app.directive('ngConfirmClick', [
        function () {
            return {
                link: function (scope, element, attr) {
                    var msg = attr.ngConfirmClick || "Are you sure?";
                    var clickAction = attr.confirmedClick;
                    element.bind('click',function (event) {
                        if ( window.confirm(msg) ) {
                            scope.$eval(clickAction)
                        }
                    });
                }
            };
    }])
     
    
       app.directive('drawAreaChart', function () {   

    // return the directive link function. (compile function not needed)
    return function (scope, element, attrs) {

        var container = $(element).attr("id");

   
        
        // watch the expression, and update the UI on change.
        scope.$watch('userActivityData', function () {
            drawPlot();
        }, true);
        
        
              

        var drawPlot = function () {
            var chart1;
            chart1 = new Highcharts.Chart({
                  chart: {
                    renderTo: container1
                  },
                 credits: {
                    enabled: false
                },
                
              title: {
            text: 'User Activity'
        },

        xAxis: {
            type: 'datetime'
        },

        yAxis: {
            title: {
                text: null
            }
        },

        tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: ''
        },

        legend: {
        },

        series: [{
            name: 'User Requests',
            data: scope.userActivityData,
            zIndex: 1,
            marker: {
                fillColor: 'white',
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[0]
            }
        }]
            
        });
            
            
            
        }

    
    }
    

});
    
   app.directive('drawPieChart', function () {
    // return the directive link function. (compile function not needed)
    return function (scope, element, attrs) {

        var container = $(element).attr("id");

        // watch the expression, and update the UI on change.
        scope.$watch('resultStatsData', function () {
            drawPlot();
        }, true);

        var drawPlot = function () {
            var chart;
            chart = new Highcharts.Chart({
                chart: {
                    renderTo: container,
                     plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: true
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: 'Results Stats..'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage}%</b>'
                 
                },
                plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false,
                          style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                
            
                    },
                    showInLegend: true
                }
            },
                series: [{
                    type: 'pie',
                    name: 'Search Results',
                    data: scope.resultStatsData
                }]
            });
            
            
            
        }

    
    }
    

});
    
   app.directive('drawMap', function () {   

    // return the directive link function. (compile function not needed)
    return function (scope, element, attrs) {

        var container = $(element).attr("id");

   
        
        // watch the expression, and update the UI on change.
        scope.$watch('mapData', function () {
            drawPlot();
        }, true);
        
        
              

        var drawPlot = function () {
            var chartMap;
            
            chartMap = new Highcharts.Map({
                             chart : {
                                 renderTo: containerMap,
                borderWidth : 1
            },

                            colors: ['rgba(19,64,117,0.05)', 'rgba(19,64,117,0.2)', 'rgba(19,64,117,0.4)',
                    'rgba(19,64,117,0.5)', 'rgba(19,64,117,0.6)', 'rgba(19,64,117,0.8)', 'rgba(19,64,117,1)'],

                title : {
                    text : 'User Requests by Country'
                },

                mapNavigation: {
                    enabled: true
                },

                legend: {
                    title: {
                        text: '',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                        }
                    },
                    align: 'left',
                    verticalAlign: 'bottom',
                    floating: true,
                    layout: 'vertical',
                    valueDecimals: 0,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, 0.85)',
                    symbolRadius: 0,
                    symbolHeight: 14
                }, credits: {
                    enabled: false
                },

                colorAxis: {
                    dataClasses: [{
                        to: 3
                    }, {
                        from: 3,
                        to: 10
                    }, {
                        from: 10,
                        to: 30
                    }, {
                        from: 30,
                        to: 100
                    }, {
                        from: 100,
                        to: 300
                    }, {
                        from: 300,
                        to: 1000
                    }, {
                        from: 1000
                    }]
                },

                series : [{
                    data : scope.dataCountry,
                    mapData: scope.mapData,
                    joinBy: ['iso-a2', 'code'],
                    animation: true,
                    name: 'User Requets',
                    states: {
                        hover: {
                            color: '#BADA55'
                        }
                    },
                    tooltip: {
                        valueSuffix: ''
                    }
                }]
            });
            
            
            
        }

    
    }
    

});
    
    app.factory('RestApi',function($http) {
	
	return {
		search : function(searchKeywords) {
			return $http.get('/api/' + searchKeywords);
		},
        tagsAutoComplete : function(data) {
			return $http.get('/api/tags', data);
		},
		create : function(postData) {
			return $http.post('/api/insert' , postData);
		},
		delete: function(data) {
			return $http.post('/api/delete', data);
		},
        update : function(postData) {
            return $http.post('/api/update' , postData);
        },
        updateClick : function(postData) {
            return $http.post('/api/updateclick' , postData);
        },
        
        noLinkFound : function(postData) {
            return $http.post('/api/notFoundLinks',postData);
        },
        
          celebLinks : function(postData) {
            return $http.post('/api/celebLinks',postData);
        } ,
        
        userActivity : function(postData) {
            return $http.post('/api/userActivity',postData);
        } ,
        
        resultStats : function(postData) {
            return $http.post('/api/resultStats',postData);
        },
        feedback : function(postData) {
            return $http.post('/api/feedback',postData);
        }
        
	};
	
});

    

app.config(function ($routeProvider, $locationProvider) {
      $routeProvider
        .when('/search',
            {    controller: 'resultsCtrl',
                templateUrl : 'html/results.html'
            })
       .when('/stats',
             {
                controller: 'statsCtrl',
                templateUrl : 'html/stats.html'  
      })
             .when('/whatsNew',
             {
                templateUrl : 'html/whatsNew.html'  
      })
        .otherwise({redirectTo:'/search'}); 
    
    // use the HTML5 History API
	$locationProvider.html5Mode(true);
});

 

    

app.controller('resultsCtrl', function ($scope,$http,$location,RestApi,$routeParams) {  
    
    
     $scope.rate = 7;
  $scope.max = 10;
  $scope.isReadonly = false;

  $scope.hoveringOver = function(value) {
    $scope.overStar = value;
    $scope.percent = 100 * (value / $scope.max);
  };

  $scope.ratingStates = [
   
    {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
   

  ];

    
	
$scope.tagsData = [];   
    $scope.populateAutoComplete=function(){
        $scope.tagsData=[];
                  RestApi.tagsAutoComplete()
			.success(function(data) {
 
                      
                      for(var i=0;i<data.length;i++) {
			
		//console.log(data[i]._source);
               $scope.tagsData.push(data[i]._source) ;
                     
                      }
              
                      // console.log($scope.tagsData);
                      
                      
			})
			.error(function(err) {
				console.log(err);
                    
			}); 
    };
    
    $scope.sendFeedBack=function(){
        
            RestApi.feedback({name:$scope.name,email: $scope.email,suggestions: $scope.suggestions,rate:$scope.rate})
			.success(function(data) {
				//console.log(data);
			$scope.rate='';
        $scope.name='';
        $scope.email='';
        $scope.suggestions='';
            
			})
			.error(function(err) {
            	$scope.rate='';
        $scope.name='';
        $scope.email='';
        $scope.suggestions='';
				console.log(err);
			});
        
        
        
    };
    
     $scope.isCollapsed = false;
      $scope.populateAutoComplete();
     $scope.oldLink="himanshu";
     $scope.oldTitle="himanshu";
    
     $scope.updateFlag=false;
     $scope.linkAdded=false;
    
    //Hide initial Result
    $scope.showResult = false;
	$scope.noResult = false;
    $scope.showHeader = true;
    

    
    $scope.searchResults = [{}];
    // Adding for recommeded and related Link
     $scope.recommendedsearchResults = [];
     $scope.relatedsearchResults = [];
    
         	$scope.showModal = function() {
		$("#addLinkModal").modal({keyboard: false});
	};
    
    	$scope.feedback = function() {
		$("#feedBackModal").modal({keyboard: false});
	};
    
	$scope.addLink = function() {
		RestApi.create({link:$scope.newLink,title: $scope.newTitle})
			.success(function(data) {
				//console.log(data);
				$scope.newLink='';
				$scope.newTitle = '';
             $scope.linkAdded=true;
             $scope.init();
            $scope.populateAutoComplete();
            
			})
			.error(function(err) {
            	$scope.newLink='';
				$scope.newTitle = '';
				console.log(err);
			});
	};
	      
    $scope.cancel = function() {
        $scope.newLink='';
				$scope.newTitle = '';
        
    };
      
       
        
        //for deletion of a keyrod/link
         $scope.removeEntry = function(result){
          
            RestApi.delete({link: result.link, title:result.title})
			.success(function(data) {
				//console.log(data);
                $scope.init();
                $scope.populateAutoComplete();
			})
			.error(function(err) {
				console.log(err);
			});
             
        };
        
        //for updation of keyword/link
         $scope.updateModal = function(result){
          
            $scope.oldLink=result.link;
             $scope.oldTitle= result.title;
            
        $("#updateModel").modal({keyboard: false});
            $scope.link= result.link;
             $scope.title = result.title;
             
        };
        
         $scope.updateEntry= function($route){
          
            
             
            RestApi.update({oldLink:$scope.oldLink, oldTitle: $scope.oldTitle, newLink: $scope.link, newTitle: $scope.title})
			.success(function(data) {
                 $scope.updateFlag=true;
			//	console.log(data);
                $scope.init();
                $scope.populateAutoComplete();
			})
			.error(function(err) {
				console.log(err);
			});
        };
        
        //adding the click count
       $scope.addClick= function(result){
          
            RestApi.updateClick({link:result.link, title: result.title })
			.success(function(data) {
				//console.log(data);
			})
			.error(function(err) {
				console.log(err);
			});
        }; 
        
	//For search permlink
	$scope.init = function() {
		//console.log($routeParams);
       $scope.recommendedsearchResults.length=0;
              $scope.relatedsearchResults.length=0;
		if($routeParams.q) {
			//console.log($routeParams.q);
			//$scope.$spply(function() {
				
				$scope.searchKeywords = $routeParams.q;
            $scope.showrecommendedResult=true;
            $scope.showrelatedResult=true;
				$scope.showResult = true;
		$scope.noResult = false;
            $scope.showHeader = false;
        

		//Time taken to search
		$scope.startTime = Date.now();
		//Sending the search string
		RestApi.search($scope.searchKeywords.toLowerCase())
		.success( function(data) {
			
       //console.log(data.length);
          //  console.log(data);
		
		for(var i=0;i<data.length;i++) {
         data[i]._source.rank=data[i]._score;
            if(data[i]._score>1){
                $scope.recommendedsearchResults.push(data[i]._source);
            }else{
              if(data[i]._score<0.3)
              {
              }else{
             $scope.relatedsearchResults.push(data[i]._source);
              }
            }
            
            
		}

            	if ($scope.recommendedsearchResults.length === 0) {
                    $scope.showrecommendedResult = false;
                }
            if ($scope.relatedsearchResults.length === 0) {
                    $scope.showrelatedResult = false;
                }
            
            
              if ($scope.recommendedsearchResults.length === 0 & $scope.relatedsearchResults.length === 0) {
                  $scope.noResult = true;
                }
            

			//End time for search
			$scope.endTime = Date.now();
			
				
			
		})
        .error( function(err) {
			console.log(err);
		});
              
	}
    };
	

	//Function to get search results
	$scope.getResults = function() {
		
        $scope.searchafterParse=$scope.searchKeywords.replace(/[\\\/]/g,'');
			$location.url('/search?q=' + $scope.searchafterParse);
		}
		
	

	//Function to order results
	$scope.orderResults = function(data) {
		l=data.length;
        console.log(data.length);
		console.log($scope.searchKeywordsList.length);
		for(var i=0;i<l;i++) {
            //console.log(data[i].keywords);
			data[i].rank = $scope.keywordsMatch($scope.searchKeywordsList,data[i].keywords);
			console.log("rank is "+data[i].rank);
		}
		//console.log(data);
		return data;
	};
	
	//Function to match intersecting keywords
	$scope.keywordsMatch = function (list1, list2) {
		//count of overlapping keywords - serve as rank to order
        //console.log(list2.length);
		count = 0;
		var i=0;
		var j=0;
		while((i < list1.length)&&( j < list2.length)) {
			if ((j>=list2.length)||(i>=list1.length))
				break;
			if (list1[i]<list2[j]) {
				i+=1;
			} else if (list1[i]>list2[j]) {
				j+=1;
			} else {
				count+=1;
				//console.log(list1[i]);
				i+=1;
				j+=1;
			}
		}
		
		return count;
	};
        
    
    	//Init method
	$scope.init();
    

        
    });
    
        app.controller('statsCtrl', function ($scope,$routeParams, $location,$http, RestApi) {
                  $scope.type = 'Search Results';
            
            	$scope.showLostKeywordsModal = function() {
		$("#lostKeywordsAddModal").modal({keyboard: false});
	};
            $scope.addLostLink = function() {
		RestApi.create({link:$scope.newLink,title: $scope.newTitle})
			.success(function(data) {
				//console.log(data);
				$scope.newLink='';
				$scope.newTitle = '';
             $scope.linkAdded=true;
            $scope.populateAutoComplete();
            
			})
			.error(function(err) {
            	$scope.newLink='';
				$scope.newTitle = '';
				console.log(err);
			});
	};

                       
        $scope.results =[{}];
             $scope.celebLinksResult =[{}];
            
    

             $scope.showStats= function(){
                 $scope.getValue();
           
                 $location.url('/stats');
           
        };
            
            $scope.getValue=function()
            {
                
               RestApi.noLinkFound()
			.success(function(data) {
				//console.log(data[0].keywordsSearched);
                $scope.results=data;
               
			})
			.error(function(err) {
				console.log(err);
                    $scope.noLinkResults="error";   
			});  
                
                  RestApi.celebLinks()
			.success(function(data) {
				//console.log(data[0]);
                $scope.celebLinksResult=data;
               
			})
			.error(function(err) {
				console.log(err);
                    $scope.celebLinksResult="error";   
			});  
                
                
       
            $scope.userActivityData = [];    
                  RestApi.userActivity()
			.success(function(data) {
 
                      
                      for(var i=0;i<data.length;i++) {
			
		
               $scope.userActivityData.push([new Date(data[i]._id.year,data[i]._id.month-1,data[i]._id.day,0,0,0,0).getTime(),data[i].count]) ;
                     
                      }
              
                     //  console.log($scope.userActivityData);
                      
                      
			})
			.error(function(err) {
				console.log(err);
                    
			}); 
                $scope.countResults2=null;
                $scope.countResults5=null;
                $scope.countResults7=null;
                $scope.countResults7plus=null;
                
                RestApi.resultStats()
			.success(function(resultStats) {
 
                      
                      for(var i=0;i<resultStats.length;i++) {
			
		
                    if(resultStats[i]._id===0||resultStats[i]._id===1||resultStats[i]._id===2)
                    {
                        $scope.countResults2= $scope.countResults2+resultStats[i].count;
                    }
                           if(resultStats[i]._id===3||resultStats[i]._id===4||resultStats[i]._id===5)
                    {
                        $scope.countResults5= $scope.countResults5+resultStats[i].count;
                    }
                           if(resultStats[i]._id===6||resultStats[i]._id===7)
                    {
                        $scope.countResults7= $scope.countResults7+resultStats[i].count;
                    }
                            if(resultStats[i]._id >7 )
                    {
                        $scope.countResults7plus= $scope.countResults7plus+resultStats[i].count;
                    }
                     
                      }
              
         //    console.log(resultStats);   
                 //    console.log($scope.countResults2);
                 //   console.log($scope.countResults5);
//console.log($scope.countResults7);
//console.log($scope.countResults7plus);
                    
                     $scope.resultStatsData = [
                          {
                        name: '0-2 Results',
                        y: $scope.countResults2,
                        sliced: true,
                        selected: true
                    },
           ['3-5 Results', $scope.countResults5],
            ['5-7 Results', $scope.countResults7],
           ['7+ Results', $scope.countResults7plus]
        ];
                    $http.get('js/world.geo.json').
    success(function(data) {
      $scope.mapData = data;
  
    }).
    error(function(data) {
       console.log("error in map data");
    });
                    
                    
                    $http.get('js/data.json').
    success(function(dataCountry) {
      $scope.dataCountry = dataCountry;
  
    }).
    error(function(dataCountry) {
       console.log($scope.dataCountry);
    });
                      
           
                      
			})
			.error(function(err) {
				console.log(err);
                    
			}); 
        
           
                
           
            };
               
	
	
    
    });
    
        
})();  
