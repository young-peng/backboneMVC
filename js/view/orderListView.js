define(["text!../template/orderList.html","../model/orderModel","text!../template/tbody.html","text!../template/map.json"],function (text,model,tbody,json) {
	var OrderListView = Backbone.View.extend({
		el : "#container",
		initialize: function () {

		},
		events : {
			"click .query"     : "query",
			"keydown input"    : "enterEvent"
		},
		model : new model(),
		render: function (sn) {
			var template = _.template(text)
		    this.$el.html(template());
			//var self = this;
			if (sn) {
				$("#serialNumber").val(sn);
				this.query();
			}
		},
		query : function () {
			var params = {};
			$(".other").each(function () {
				var val = $(this).find("input").val();
				var key = $(this).find("label").attr("for");
				params[key]= val;
			});
			$("#loading").showMask();
			$.when(this.model.getOrderList(params)).done(function (data) {
				if (data.code === 0) {
					var html = _.template(tbody);
					$(".tbody").empty().html(html({data:data.data,json:JSON.parse(json)}));
				}
				$("#loading").hideMask();
		    }).fail(function (e) {
		    	alert("失败");
		    	$("#loading").hideMask();
		    });
		},
		enterEvent : function (e) {
			if (e.keyCode === 13) {
				this.query();
			}
		}
	});
	return OrderListView;
});