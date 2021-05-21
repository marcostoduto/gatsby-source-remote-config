const report = require("gatsby-cli/lib/reporter")
const firebase = require("firebase-admin")

const getType = (value) => {
    const isNotString = (val) => {
        try {
            JSON.parse(val)
        } catch (e) {
            return false
        }
        return true
    }
    if (isNotString(value) === true) {
        return {
            type: Array.isArray(JSON.parse(value))
                ? "array"
                : typeof JSON.parse(value),
            parsedValue: JSON.parse(value)
        }
    } else return {type: "string", parsedValue: value}
}

exports.sourceNodes = async (
    {
        actions,
        getNode,
        getNodes,
        getNodesByType,
        createNodeId,
        store,
        cache,
        getCache,
        reporter,
        schema,
        parentSpan,
    },
    {credential, parameterGroup, fields, appConfig}
) => {
    try {
        if (!firebase.apps || !firebase.apps.length || (firebase && firebase.apps && firebase.apps.length === 0)) {
            const cfg = appConfig ? appConfig : {credential: firebase.credential.cert(credential)}
            firebase.initializeApp(cfg)
        }
    } catch (e) {
        report.warn(
            "Could not initialize Firebase. Please check `credential` property in gatsby-config.js"
        )
        report.warn(e)
        return
    }
    const remoteConfig = firebase.remoteConfig()
    remoteConfig.settings = {
        minimumFetchIntervalMillis: 3600000
    }
    const {createNode, deleteNode, touchNode, createTypes} = actions;

    const template = await remoteConfig.getTemplate()
    const parameters = Object.entries(parameterGroup && parameterGroup !== null ? template.parameterGroups[parameterGroup].parameters : template.parameters)
    const finalParams = fields && fields !== null && fields.length > 0 ? parameters.filter(([key, value]) => fields.includes(key)) : parameters

    let promises = finalParams
        .map(([key, {defaultValue: {value}}]) => {
            const {type, parsedValue} = getType(value)
            createNode(
                {
                    value: {[type]: parsedValue},
                    valueString: value,
                    type: type,
                    id: key,
                    parent: null,
                    children: [],
                    internal: {
                        type: "RemoteConfigParam",
                        contentDigest: key
                    }
                }
            )
            Promise.resolve()
        })
    await Promise.all(promises)
    return
}