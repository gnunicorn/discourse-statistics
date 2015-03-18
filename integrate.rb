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

class ModsViewsEmail < ActionMailer::Base
  default charset: 'UTF-8'

  include Email::BuildEmailHelper

  def generate(stats)
    build_email(SiteSetting.report_mods_email,
                :template => 'moderator_stats',
                :stats => stats)
  end
end

module Jobs
  class ModeratorStatistics < Jobs::Scheduled
    every 2.weeks
    sidekiq_options retry: false

    def execute(args)
      return if !SiteSetting.report_mods_email

      view_query = TopicViewItem

      if !SiteSetting.report_mods_category
        cat_query = Category.get_ids_of_all_subs(SiteSetting.report_mods_category)
        view_query = view_query.where("topic_id in (SELECT id FROM topics WHERE category_id IN (#{cat_query}))")
      end

      stats = User.where(:moderator => true).all.map do |user|
        viewItem = view_query.where(:user_id => user.id).order('viewed_at DESC').first
        if viewItem
          topic = Topic.find(viewItem.topic_id)
          " -  #{user.name} (#{user.username}) : #{viewItem.viewed_at} (#{topic.title})"
        else
          " -  #{user.name}(#{user.username}): UNKNOWN"
        end
      end
      mail = ModsViewsEmail.generate(stats.join("\n"))
      Email::Sender.new(mail, :moderator_mails).send
    end
  end
end
