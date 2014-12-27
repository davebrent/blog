build:
	@bundle exec jekyll build --config=config-dev.yml

serve:
	bundle exec jekyll serve -w --config=config-dev.yml

upload:
	@bundle exec jekyll build --config=config-prod.yml
	@s3cmd sync _site/ s3://davepoulter.net/
	@s3cmd sync _site/ s3://www.davepoulter.net/
