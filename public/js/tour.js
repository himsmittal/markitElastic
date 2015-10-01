// Define the tour!
  var tour = {
    id: "markIt-Tour",
      showPrevButton: "true",
      showCloseButton: "true",
    steps: [
      {
        title: "What Is markIt <i class='glyphicon glyphicon-tags'></i>",
        content: "markit is a cloud base app , which lets you manage any URL the way you want.<br><br/><p>It gives you a ability to search for a URL based on the keywords associated.</p>",
        target: "markItBrand",
        placement: "left",
           xOffset: '450',
          yOffset:'-60',
          arrowOffset: 'center'
           
      },
        
         {
        title: "How to Search ?",
        content: "<p>What's on you mind !!!</p><p>If you have an answer for that , just type in , rest all would be done for you. :)</p>",
        target: "searchInput",
        placement: "left",
             xOffset: '20',
          
           
      },
         {
        title: "Click Search",
        content: "To get the results",
        target: "searchButton",
        placement: "bottom",
              yOffset:'-10'
          
           
      },
        {
        title: "Add Link",
        content: "To add Url's and associate  keywords with it.",
        target: "addlinkButton",
        placement: "right",
          
           
      },
        {
        title: "Statistics",
        content: "There is a lot of cool stuff here. Check out this link to get an idea about user activity.",
        target: "statsButton",
        placement: "right",
             yOffset:'-10'
          
           
      }
    ]
      
  };

window.startSiteTour = function(){
    console.log("ddd");
            hopscotch.startTour(tour);
            return undefined;
};