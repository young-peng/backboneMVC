define(['backbone'],function () {
	var Router = Backbone.Router.extend({

	    routes: {
	        'orderlink': 'orderlink',
	        'orderList': 'orderList',
	        'orderList/:sn': 'orderList',
			"queryItem" : "queryItem",
			"queryItem/:sn" : "queryItem",
			'orderLinkCount': 'orderLinkCount',
			'*actions': 'defaultAction'

	    },
	    view : null,

	    orderlink: function() {
	    	$("a[href=#orderlink]").parent("li").addClass("active").siblings().removeClass("active");
	        var url = 'controller/orderLinkCtrl';
	        require([url], function (controller) {
	        	if (!this.view){
	            	this.view = controller();
	        	} else {
	        		this.view.undelegateEvents();
	        		this.view = controller();
	        	}
	        });
	    },

	    //name跟路由配置里边的:name一致
	    orderList: function(sn) {
	    	$("a[href=#orderList]").parent("li").addClass("active").siblings().removeClass("active");
	        var url = 'controller/orderListCtrl';
	        require([url], function (controller) {
	           if (!this.view){
	           		this.view = controller(sn);
	        	} else {
	        		this.view.undelegateEvents();
	        		this.view = controller(sn);
	        	}
	        });
	    },

        defaultAction: function () {
			location.hash = 'orderlink';
		},

		queryItem : function (sn) {
			$("a[href=#queryItem]").parent("li").addClass("active").siblings().removeClass("active");
			var url = 'controller/queryItemCtrl';
			console.log(sn)
			require([url], function (controller) {
				if (!this.view){
					this.view = controller(sn);
				} else {
					this.view.undelegateEvents();
					this.view = controller(sn);
				}
			});
		},
		orderLinkCount :  function (sn) {
			$("a[href=#orderLinkCount]").parent("li").addClass("active").siblings().removeClass("active");
			var url = 'controller/orderLinkCountCtrl';
			console.log(sn)
			require([url], function (controller) {
				if (!this.view){
					this.view = controller(sn);
				} else {
					this.view.undelegateEvents();
					this.view = controller(sn);
				}
			});
		}
	});
	var router = new Router();
	return router;
});