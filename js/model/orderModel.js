define(function () {
	var OrderModel = Backbone.Model.extend({
		getOrderList : function (params) {
			var def = $.Deferred();
			$.ajax({
				url : "api/v1/orders",
				type : "GET",
				data : params,
				success : function (data) {
					def.resolve(data);
				},
				error : function (e) {
					def.reject(e);
				}
			});
			return def;
		},
		addOrder : function (params) {
			var def = $.Deferred();
			$.ajax({
				url : "api/v1/logistics_items",
				type : "POST",
				contentType : "application/json;charset=UTF-8",
				data : JSON.stringify(params),
				success : function (data) {
					def.resolve(data);
				},
				error : function (e) {
					def.reject(e);
				}
			});
			return def;
		},
		queryItem : function (params) {
			var def = $.Deferred();
			$.ajax({
				url : "api/v1/items",
				type : "GET",
				data : params,
				contentType : "application/json;charset=UTF-8",
				success : function (data) {
					def.resolve(data);
				},
				error : function (e) {
					def.reject(e);
				}
			});
			return def;
		},
		findLogisticsLogItems : function (pageNo,pageSize) {
			var def = $.Deferred();
			$.ajax({
				url : "/js/model/logisticsLogItems.json",
				type : "GET",
				contentType : "application/json;charset=UTF-8",
				success : function (data) {
					def.resolve(data);
				},
				error : function (e) {
					def.reject(e);
				}
			});
			return def;
		},
		cancelLink : function (params) {
			var def = $.Deferred();
			$.ajax({
				url : "api/v1/logisticsLogItems/"+params.id,
				type : "PUT",
				data : JSON.stringify(params.vo),
				contentType : "application/json;charset=UTF-8",
				success : function (data) {
					def.resolve(data);
				},
				error : function (e) {
					def.reject(e);
				}
			});
			return def;
		},
		orderLinkCount : function (params) {
			var def = $.Deferred();
			$.ajax({
				url : "api/v1/orderStat",
				type : "GET",
				data : params,
				contentType : "application/json;charset=UTF-8",
				success : function (data) {
					def.resolve(data);
				},
				error : function (e) {
					def.reject(e);
				}
			});
			return def;
		},
        orderEntries : function (logisticsNo) {
            var def = $.Deferred();
            $.ajax({
                url : "/api/v1/order_entries?logisticsNo=" + logisticsNo,
                type : "GET",
                contentType : "application/json;charset=UTF-8",
                success : function (data) {
                    def.resolve(data);
                },
                error : function (e) {
                    def.reject(e);
                }
            });
        }
	});
	return OrderModel;
});