(function () {
    var StatisticsView = Ember.View.extend({
        templateName: "statistics",
        tagName: "span",
        noteDraft: "",
        classNames: ['statistics-ui'],

        insertElement: function () {
            this._insertElementLater(function () {
                var target = this._parentView.$("div.panel");
                this.$().insertAfter(target);
                this.loadStatistics();
            }.bind(this));
        },

        loadStatistics: function() {
            this.set('loading', true);
            Discourse.ajax("/statistics/load", {}).then(function(receivedJSON) {
                    this.set('loading', false);
                    this.set("statistics", receivedJSON.statistics);
                    this.rerender();
            }.bind(this));
        }
    });

    Discourse.HeaderView.reopen({

        renderStatisticsView: function () {
            if (this.get('statisticsView')) return;
            var view = this.createChildView(StatisticsView);
            view.insertElement();
            this.set('statisticsView', view);
        }.on('didInsertElement'),

        clearStatisticsView: function() {
            if (this.get('statisticsView')) {
                this.get('statisticsView').destroy();
            }
        }.on('willDestroyElement')
    });
})();

(function () {
    if (!Discourse.SidebarView) return; // this is the sidebar feature

    var StatisticsView = Ember.View.extend({
        templateName: "statistics",
        tagName: "span",
        noteDraft: "",
        classNames: ['statistics-ui'],
        classNameBindings: ["shouldBeHidden:hidden"],

        // only show on list pages
        shouldBeHidden: function(){
            return this.get("currentControllerName").indexOf("discovery") === -1;
        }.property("currentControllerName"),

        loadStatistics: function() {
            if (this.get("statistics")) return;
            this.set('loading', true);
            Discourse.ajax("/statistics/load", {}).then(function(receivedJSON) {
                    this.set('loading', false);
                    this.set("statistics", receivedJSON.statistics);
                    this.rerender();
            }.bind(this));
        }.on("didInsertElement")
    });

Discourse.SidebarView.reopen({stats: StatisticsView.create()});

})();
