require "statistics/engine"

module Statistics
  GLOBAL_DC_STATS_CACHE_KEY = "GLOBAL_DC_STATS_CACHE"

  module AddStatisticsToSiteSerializer

    def self.included(klass)
      klass.attributes :statistics
    end

    def statistics
      Rails.cache.read(GLOBAL_DC_STATS_CACHE_KEY) || {}
    end
  end
end

