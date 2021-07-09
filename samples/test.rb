desc "Edit a post (defaults to most recent)"
task :edit_post, :title do |t, args|
  args.with_defaults(:title => false)
  posts = Dir.glob("#{source_dir}/#{posts_dir}/*.*")
  post = (args.title) ? post = posts.keep_if {|post| post =~ /#{args.title}/}.last : posts.last
  if post
    puts "Opening #{post} with #{editor}..."
    system "#{ENV['EDITOR']} #{post} &"
  else
    puts "No posts were found with \"#{args.title}\" in the title."
  end
end
