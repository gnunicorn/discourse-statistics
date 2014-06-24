module ::StatisticsPlugin
  class Statistics

    def self.names
      %w(User Topic Post Category Upload View)
    end

    def self.get_statistics_json
      if Time.now - @time > LIST_KEY_STATISTICS_EXPIRE_LOCAL or @statistics.empty?
        if @mutex.try_lock
          load_statistics
          @time = Time.now
          @mutex.unlock
        end
      end
      result = Array.new
      @statistics.each_with_index do |item, index|
        result << {value:item, name:names[index].pluralize(item <=1 ? 1: item)}
      end
      return {statistics: result}
    end

    private

    LIST_KEY_STATISTICS = 'discourse-statistics'
    LIST_KEY_STATISTICS_EXPIRE_LOCAL = 10.minutes.to_i
    LIST_KEY_STATISTICS_EXPIRE_REDIS = 20.minutes.to_i
    @mutex = Mutex.new
    @time = Time.now
    @statistics = []

    def self.redis
      $redis.without_namespace
    end

    def self.load_statistics
      redis_value = redis.get LIST_KEY_STATISTICS
      if redis_value.nil?
        @statistics = []
        @statistics << User.count
        @statistics << Topic.count
        @statistics << Post.count
        @statistics << Category.count
        @statistics << Upload.count
        @statistics << View.count
        redis.setex LIST_KEY_STATISTICS, LIST_KEY_STATISTICS_EXPIRE_REDIS, @statistics.to_json
      else
        @statistics = JSON.parse(redis_value)
      end
    end
  end
end
