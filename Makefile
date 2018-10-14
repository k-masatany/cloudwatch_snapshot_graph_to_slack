include .env

deps:
	cd cloudwatch_snapshot_graph_to_slack; \
	npm install

run:
	sam local invoke Function --event event_file.json --env-vars env.json

package:
	sam package --template-file template.yaml --output-template-file output.yaml --s3-bucket $(STACK_BUCKET)

deploy:
	aws cloudformation deploy \
	--template-file output.yaml \
	--stack-name cloudwatch-snapshotp-graph-to-slack \
	--parameter-overrides \
	"SNSTopic=$(SNS_TOPIC)" \
	"AssetsBucketName=$(ASSETS_BUCKET)" \
	"WebHookURL=$(WEBHOOK_URL)" \
	"Channel=$(CHANNEL)" \
	"Username=$(USERNAME)" \
	"IconEmoji=$(ICON_EMOJI)" \
	--capabilities CAPABILITY_IAM

