# Delete Tweets!

Node function, configured to be deployed on AWS Lambda for deleting tweets after a number of days.

### Details

1. `.env.sample` is example of what env variables are needed on the Lambda Function setup
1. `aws-cli` is used to upload the zip file, so that we can add local `node_modules` packages ( for the Twitter API Node client )
1. The recurring nature of the function call is managed by `EventBridge (CloudWatch Events)` setup to run once per day.
