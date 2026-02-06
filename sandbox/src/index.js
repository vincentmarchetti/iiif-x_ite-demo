
/*
Developer note 12/17/2025 : manifesto is being brought in here
for the purpose of allowing the function handle_manifest_json to
construct an instance of manifesto.Manifest

It is not intended to put manifesto or its contents into global scope
but for all I know that's an unintended consequence.
*/
const manifesto = require("manifesto-prezi4");
const jsonlint  = require('@prantlf/jsonlint')
require("../../src/x_ite_viewer_setup.js");


async function load_manifest_text(){
    const manifestText = document.querySelector("textarea#manifest-text").value;
    console.info(`manifest text: ${manifestText.length} characters`);
    try{
        const json     = jsonlint.parse(manifestText);
        const manifest = new manifesto.Manifest(json, {});
        await document.dispatchEvent( new CustomEvent("new_manifest", { "detail" : {"manifest" : manifest }}) );
    }
    catch (error ){
        console.info(`jsonlint parse failed with ${error}`);
        return;
    }
    return;
}

document.addEventListener("DOMContentLoaded", async () => {
    document
    .querySelector("button#load-manifest-from-text")
    .addEventListener("click",  async () => {
        await load_manifest_text();
    })
    console.debug("DOMContentLoaded listener added to window");
    
    // if the text already has a manifest, then try to load it
    // the length text is intended to allow putting something
    // like "Insert Manifest here"
    if (document.querySelector("textarea#manifest-text").value.length > 32)
        await load_manifest_text();
});    

