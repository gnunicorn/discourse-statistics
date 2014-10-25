
GLOBAL_DC_STATS_CACHE_KEY = "GLOBAL_DC_STATS_CACHE"

module AddStatisticsToSiteSerializer

  def self.included(klass)
      klass.attributes :statistics
  end

  def statistics
    Rails.cache.read(GLOBAL_DC_STATS_CACHE_KEY) || {}
  end

end

SiteSerializer.send(:include, AddStatisticsToSiteSerializer)

module Jobs
  class RebuildStatistics < Jobs::Scheduled
    every 15.minute
    sidekiq_options retry: false

    def execute(args)
      stats = {:users => User.count,
               :topics => Topic.count,
               :replies => Post.where("post_number != 1").count}
      Rails.cache.write(GLOBAL_DC_STATS_CACHE_KEY, stats)
    end

  end

end
