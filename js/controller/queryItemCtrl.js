define(['../view/queryItemView'], function (View) {

    var controller = function (sn) {
        var view = new View();
        view.render(sn);
        return view;
    };
    return controller;
});