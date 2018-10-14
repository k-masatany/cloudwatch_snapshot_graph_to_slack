"use strcit"

const axios = require("axios")
var AWS = require("aws-sdk")
const BASE_URL = process.env.SLACK_WEBHOOK_URL

async function getMetricsGraphFromCloudWatch(MessageId, message) {
    const props = {
        width: 320,
        height: 240,
        start: "-PT1H",
        end: "PT0H",
        timezone: "+0900",
        view: "timeSeries",
        stacked: false,
        metrics: [
            [
                message.Trigger.Namespace,
                message.Trigger.MetricName,
                message.Trigger.Dimensions[0].name,
                message.Trigger.Dimensions[0].value
            ]
        ],
        stat:
            message.Trigger.Statistic.charAt(0).toUpperCase() +
            message.Trigger.Statistic.slice(1).toLowerCase(),
        period: message.Trigger.Period
    }
    const widgetDefinition = {
        MetricWidget: JSON.stringify(props)
    }

    const cloudwatch = new AWS.CloudWatch()
    const s3 = new AWS.S3()

    try {
        const cw_res = await cloudwatch
            .getMetricWidgetImage(widgetDefinition)
            .promise()
        const res = await s3
            .putObject({
                Bucket: process.env.BACKET_NAME,
                Key: `${MessageId}.png`,
                Body: cw_res.MetricWidgetImage,
                ContentType: "image/png"
            })
            .promise()
        return res
    } catch (err) {
        console.error(err)
    }
}

async function createPayload(records) {
    let attachments = []
    for (const record of records) {
        const sns = record.Sns
        const message = JSON.parse(sns.Message)
        let color = "good"
        if (message.NewStateValue == "ALARM") {
            color = "danger"
        } else if (message.NewStateValue != "OK") {
            color = "warning"
        }
        await getMetricsGraphFromCloudWatch(sns.MessageId, message)
        let attachment = {
            fallback: sns.Subject,
            title: message.AlarmName,
            pretext: sns.Subject,
            color: color,
            text: message.NewStateReason,
            image_url: `https://s3-ap-northeast-1.amazonaws.com/${
                process.env.BACKET_NAME
            }/${sns.MessageId}.png`
        }
        attachments.push(attachment)
    }

    return {
        channel: process.env.SLACK_CHANNEL,
        username: process.env.SLACK_USERNAME,
        icon_emoji: process.env.SLACK_ICONEMOJI,
        attachments: attachments
    }
}

function createOptions(payload) {
    let options = {
        method: "post",
        baseURL: BASE_URL,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        data: `payload=${JSON.stringify(payload)}`
    }
    return options
}

exports.lambdaHandler = async (event, context) => {
    const payload = await createPayload(event.Records)
    const options = createOptions(payload)

    try {
        const res = await axios.request(options)
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: "hello world",
                location: res.data.trim()
            })
        }
    } catch (err) {
        console.log(err)
        return err
    }

    return response
}
