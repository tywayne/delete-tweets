# Delete Tweets!

Lambda function, deployable to AWS Lambda for deleting tweets after a number of days.

## Details

1. `.env.sample` is example of what env variables are needed on the Lambda config
1. `aws-cli` is used to upload a zip file and update the code deployed on AWS
1. The recurring nature of the function call is managed by `EventBridge (CloudWatch Events)` setup to run hourly.

### Installation

```bash
npm i
```

### Deployment

_Requirements: You must first_

- install and configure `aws-cli` on your machine
- create a Lambda function named `delete-tweets` in your AWS account
- setup your Twitter client ENV variables based on the `.env.sample` provided in this repo

```bash
npm run deploy
```
