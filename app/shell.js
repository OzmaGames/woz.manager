define(['plugins/router', 'add/form','durandal/app', 'knockout'], function (router, form, app, ko) {
    
    var ctor = function() {
       var self =this; 
        self.router = router;
        self.btnText = ko.observable();
        
        self.switchUrl = function() {
            var x = localStorage.getItem("foo");
        
            if(x=="1"){
               localStorage.setItem("foo", 0);
            }else{
               localStorage.setItem("foo", 1);
            }
            
            setTimeout(function(){
                location.reload();     
            },0);
        };
        
        addCatCal = function(){form.show().then(function(){console.log('a')})};
        
    }
    
    ctor.prototype.activate = function(){
        var base= this;
            console.count();
            var x = localStorage.getItem("foo"); 
            base.btnText(x=='1' ? 'Switch to Testing':'Switch to Devel');
            
            return router.map([
               
                { route: 'words',                       moduleId: 'words/index',            title: 'Words',             nav: true },
                { route: 'rules',                       moduleId: 'rules/index',            title: 'Rules',             nav: true },
                { route: 'tile-gallery',                moduleId: 'tiles/index',            title: 'Tiles',             nav: true },
                { route: 'create-rule',                 moduleId: 'rules/form'},
                { route: 'edit-rule/:id',               moduleId: 'rules/form'},
                { route: 'collections',                 moduleId: 'add/index',               title:"Collections/Images",       nav:true  }
                
            
                
            ]).buildNavigationModel()
              .mapUnknownRoutes('words/index', 'not-found')
              .activate();
           
    }
    return ctor;
});

  