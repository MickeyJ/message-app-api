import fs from 'fs'
import path from 'path'
import Handlebars from 'handlebars'

import {
    isFunction,
    isArray,
} from './type_check'

Handlebars.registerHelper('ifTrue', function(condition, options) {
    if(condition) {
        return options.fn(this);
    }
    return options.inverse(this);
});

Handlebars.registerHelper('each', function(context, options) {
    let fn = options.fn, inverse = options.inverse;
    let i = 0, ret = '', data;

    if (isFunction(context)) { context = context.call(this); }

    if (options.data) {
        data = options.data;
    }

    if(context && typeof context === 'object') {
        if (isArray(context)) {
            for(let j = context.length; i<j; i++) {
                if (data) {
                    // For zebra tables
                    data.zebra = (((i+1)%2) === 0) ? 'even' : 'odd';
                    // end mod
                    data.index = i;
                    data.first = (i === 0);
                    data.last  = (i === (context.length-1));
                }
                ret = ret + fn(context[i], { data: data });
            }
        } else {
            for(let key in context) {
                if(context.hasOwnProperty(key)) {
                    if(data) {
                        data.key = key;
                        data.index = i;
                        data.first = (i === 0);
                    }
                    ret = ret + fn(context[key], {data: data});
                    i++;
                }
            }
        }
    }

    if(i === 0){
        ret = inverse(this);
    }

    return ret;
});

export default class Html {

    static htmlDirPath = path.join(path.resolve('./'), `html_templates`);

    static parseTemplate(templateName, data){
        if (!templateName) return;
        return this.compile(this.getTemplate(templateName), data)
    }

    static joinTemplates(templates=[]){
        if(!templates.length) return null;
        return templates.join('\n');
    }

    static compile(html, data){
        return Handlebars.compile(html)(data)
    }

    static getTemplatePath(templateName){
        return path.join(this.htmlDirPath, templateName+'.hbs');
    }

    static getTemplate(name){

        const templatePath = this.getTemplatePath(name);
        const templateExists = fs.existsSync(templatePath);

        if(!templateExists){
            throw new Error(`template "${name}.hbs" does not exist`)
        }

        return fs.readFileSync(templatePath).toString();
    }

}