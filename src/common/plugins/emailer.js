import SparkPost from 'sparkpost'

const client = new SparkPost(process.env.SPARKPOST_API_KEY);

export default {
    bccEmail: 'bcc@latitudesoftware.com',

    request: (config) => {

        let {
            options = {
                sandbox: false,
            },
            recipients = [],
            metadata = {},
            substitution_data = {},
            html = null,
            fromEmail,
            fromName,
            subject,
            toEmail,
            template_id,
            attachments = [],
        } = config;

        if(!recipients.length){
            recipients = [
                { address: toEmail },
            ]
        }
        return {
            options,
            content: {
                html,
                template_id,
                subject,
                from: {
                    name: fromName,
                    email: fromEmail,
                },
                attachments,
            },
            metadata: {
                env: process.env.NODE_ENV,
                ...metadata,
            },
            recipients,
            substitution_data,
        };

    },

    send: (request) => {
        return client.transmissions.send(request);
    },

    addToSuppressionList: (recipient, description) => {

        const listEntry = {
            recipient,
            description,
            transactional: false,
            non_transactional: true,
        };

        return client.suppressionList.upsert(listEntry)
    },
}
