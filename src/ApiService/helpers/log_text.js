import colors from 'colors/safe'
colors.enabled = true;

function logContent({title, message, error}, output = []){

    const finalOutput = (...args) => {
        if(args.length) output.push(...args);
        return output;
    };

    if(title) output.push(colors.green(title));

    if(error && message) return finalOutput(colors.red(error), colors.cyan(message));

    if(error && !message) return finalOutput(colors.red(error));

    if(message && !error) return finalOutput(colors.cyan(message));

    return finalOutput()
}

export const newFileHeader = (serviceName) => `
······················································
««««««««««««««««««««««««««««««««««««««««««««««««««««««
${colors.yellow.bold(serviceName.toUpperCase())}
»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»
······················································
`;

export const newLog = ({date, service, from, title, message, error}) => `
             ${date}
======================================================
Service : ${service}
File    : ${colors.magenta(from)}
******************************************************\n
${logContent({title, message, error}).join('\n\n')}\n
******************************************************
======================================================

`;