const Tot = require('totjs');
const { buildPComponent } = require('./pcomponent');
const { buildComponent } = require('./component');
const { replaceEvents } = require('./syntax-handler');
const { buildSingleData } = require('./data-handler');
const { getValueFromObj } = require('./value-getter');
const { bundlejs } = require('./bundle');
const { buildPreload } = require('./preload');

/* 
buildPage()
arguments: args
args: {
    filename: `File name for the page, strting .tot file path.`,
    data: `json data for injecting to the html, css and javascript`,
}
*/
async function buildPage(args)
{
    const tot = new Tot(args.filename);

    let html = await tot.getDataByName("html");
    let css = await tot.getDataByName("css");
    let js = await tot.getDataByName("js");

    if (!html) html = "";
    if (!js) js = "";
    if (!css) css = "";

    css = await buildSingleData(css, args.data);
    js = await buildSingleData(js, args.data);

    let result = {
        html: "",
        css: css,
        js: js
    };



    while (html.length > 0)
    {
        let start = html.indexOf("{{") + 2;
        let end = html.indexOf("}}");

        if (start == 1 || end == -1)
        {
            result.html = result.html + html;
            break;
        }

        result.html = result.html + html.substring(0, start - 2);
        let target = html.substring(start, end).trim();
        html = html.substring(end + 2);

        if (target.substring(0, 6) == "@data.")
        {
            result.html = result.html + await getValueFromObj(target.substring(6), args.data)
        }
        else if (target.substring(0, 9) == "@preload.")
        {
            let preloadResult;
            let targetArray = target.split(",");
            let targetName = targetArray[0].trim().substring(9, target.length);
            let preloadDirName = targetArray[1].trim();

            preloadResult = await buildPreload({ dirname: preloadDirName, name: targetName, data: args.data });
            if (result.js.includes(`//rino.js js preload marker`)) result.js = result.js.replace(`//rino.js js preload marker`, preloadResult.js + `\n//rino.js js preload marker\n`);
            else result.js = `${ preloadResult.js }\n//rino.js js preload marker\n${ result.js }`;
            if (result.css.includes(`/* rino.js css preload marker */`)) result.css = result.css.replace(`/* rino.js css preload marker */`, preloadResult.css + `\n/* rino.js css preload marker */\n`);
            else result.css = `${ preloadResult.css }\n/* rino.js css preload marker */\n${ result.css }`;
        }
        else if (target.substring(0, 10) == "component.")
        {
            let compResult;
            let targetArray = target.split(",");
            let targetName = targetArray[0].trim().substring(10, target.length);
            let componentDirName = targetArray[1].trim();
            let htmlName = targetArray[2].trim();

            if (targetArray.length > 3)
            {
                let props;

                if (targetArray[3]) props = JSON.parse(await tot.getDataByName(targetArray[3].trim()))

                compResult = await buildComponent({ dirname: componentDirName, name: targetName, data: args.data, props: props, htmlName: htmlName });
            }
            else
            {
                compResult = await buildComponent({ dirname: componentDirName, name: targetName, data: args.data, htmlName: htmlName });
            }

            result.css = result.css + compResult.css;
            result.js = compResult.js + result.js;
        }
        else if (target.substring(0, 11) == "@component.")
        {
            let compResult;
            let targetArray = target.split(",");
            let targetName = targetArray[0].trim().substring(11, target.length);
            let componentDirName = targetArray[1].trim();

            if (targetArray.length > 2)
            {
                let props;

                if (targetArray[2]) props = JSON.parse(await tot.getDataByName(targetArray[2].trim()))

                compResult = await buildPComponent({ dirname: componentDirName, name: targetName, data: args.data, props: props });
            }
            else
            {
                compResult = await buildPComponent({ dirname: componentDirName, name: targetName, data: args.data });
            }

            if (compResult.prelaodJS)
            {
                if (result.js.includes(`//rino.js js preload marker`)) result.js = result.js.replace(`//rino.js js preload marker`, compResult.prelaodJS + `\n//rino.js js preload marker\n`);
                else result.js = `${ compResult.prelaodJS }\n//rino.js js preload marker\n${ result.js }`;
            }

            if (compResult.preloadCSS)
            {
                if (result.css.includes(`/* rino.js css preload marker */`)) result.css = result.css.replace(`/* rino.js css preload marker */`, compResult.preloadCSS + `\n/* rino.js css preload marker */\n`);
                else result.css = `${ compResult.preloadCSS }\n/* rino.js css preload marker */\n${ result.css }`;
            }

            result.html = result.html + compResult.html;
            result.css = result.css + compResult.css;
            result.js = result.js + compResult.js;
        }
        else
        {
            result.html = result.html + `{{ ${ target } }}`;
        }
    }

    if (result.js.includes(`//rino.js js preload marker`)) result.js = result.js.replace(`//rino.js js preload marker`, ``);
    if (result.css.includes(`/* rino.js css preload marker */`)) result.css = result.css.replace(`/* rino.js css preload marker */`, ``);

    result.html = await replaceEvents(result.html);
    result.js = await bundlejs(result.js);
    return result;
}

module.exports = { buildPage }