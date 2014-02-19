load File.expand_path("../statistics.rb", __FILE__)

StatisticsPlugin = StatisticsPlugin

after_initialize do
  module StatisticsPlugin
    class Engine < ::Rails::Engine
      engine_name "statistics_plugin"
      isolate_namespace StatisticsPlugin
    end
    class StatisticsController < ActionController::Base
      def loadStatistics
        statistics = StatisticsPlugin::Statistics.get_statistics_json()
        render json: statistics
      end
    end
  end

  StatisticsPlugin::Engine.routes.draw do
    get '/load' => 'statistics#loadStatistics'
  end

  Discourse::Application.routes.append do
    mount ::StatisticsPlugin::Engine, at: '/statistics'
  end

end

register_asset "javascripts/discourse/templates/statistics.js.handlebars"
register_asset "javascripts/statistics.js"

register_css <<CSS

.statistics-ui {
  padding: 0;
}

.statistics-ui:after {
  content: " ";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.statistics-ui ul {
  display:inline;
  margin: 5px 0 0 5px;
}

.statistics-ui li {
  display:inline;
  margin: 0;
}

CSS