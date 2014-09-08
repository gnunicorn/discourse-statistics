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
