
/*
Developer note 12/17/2025 : manifesto is being brought in here
for the purpose of allowing the function handle_manifest_json to
construct an instance of manifesto.Manifest

It is not intended to put manifesto or its contents into global scope
but for all I know that's an unintended consequence.
*/
const manifesto = require("manifesto-prezi4");
const jsonlint  = require('@prantlf/jsonlint')

import {Manifest3DViewer} from "../../src/Manifest3DViewer.ts";
import {fetch_manifest_json} from "../../src/fetch_manifest_json.ts";

/*
    handle_manifest_json is called when an object has
    been parsed from manifest json text.
    
    It is intended to be defined in the global scope so that
    it can be invoked dynamically over the course of a pages lifescycle,
    such as 
        -- on document loading, when a manifest is fetched from a url defined 
           in window.location
        -- on user request to fetch a manifest from a url entered into HTML input
        -- on user request when manifest text is entered or copied into HTML input
*/
async function handle_manifest_json( json ){
    /*
    json is the object obtained from the json text 
    TODO: in productions, this function will "parse" the object
    with manifesto and announce that manifesto object through a 
    window based Custom event, which other parts of the page
    */
    console.debug(`handle_manifest_json: type is ${json.type}`);
    
    // insert parsing with manifesto-3d and if successful
    // raise a custom event
    const rv = new manifesto.Manifest(json, {});
    document.dispatchEvent( new CustomEvent("new_manifest", { detail : {manifest : rv }}) );
    return;
}

/*
Following code in file defines actions triggered by DOMContentLoaded event
*/

/*
Creates a Manifest3DViewer instance inside an existing HTMLElement identified
by id xite-view-container
    -- constructing this instance created both an HTML element with tag x3d-canvas
    -- along with the X_ITE browser object
    
Then configures a handler to a custom event new_manifest fired from document    
*/
function initialize_manifest_elements(){
    const container = document.getElementById("xite-view-container");
    if (container === null)
        throw new Error("initialize_manifest_elements: getElementById(\"xite-view-container\") failed");
        
    document.addEventListener("new_manifest", async (event) => {        
        console.debug("new_manifest event fired");
        const container = document.getElementById("xite-view-container");
        const viewer = new Manifest3DViewer(container);
        viewer.showAllButton = document.getElementById("xite-show-all");
        await viewer.display( event.detail.manifest );
    });    
}

/*
    this handler invokes initialize_manifest_elements and then
    attempts to load and render a manifest specified in a query string in 
    window.location
    
    12/17/2025 : syle note: I have purposely broken this out
    into named functions dom_loaded_viewer_handler and  attach_window_listener
    for readability and flexibility in reconfiguring.
*/
async function  dom_loaded_viewer_handler(event){
    console.debug("DOMContentLoaded fired");  
    initialize_manifest_elements();
    
    let data;
    try{
        data = await fetch_manifest_json(window.location);
        if (data === null){
            window.alert("No initial manifest url declared");
            return;
        }
    } catch (error){
        const message = ( (e) => {
            if (e instanceof Error ) return e.message;
            return String(e);
        })(error);
        window.alert(message);
        console.error(message);
        return;
    }
        
    if (data !== null){
        console.debug(`return : fetch_manifest_json( ${window.location} ) ==> ${data}`);
        await handle_manifest_json( data );
    }
    else
        console.warn(`no manifest url identified in ${window.location}`);
}

function attach_window_listener(){
document
  .querySelector("button#load-manifest-from-text")
  .addEventListener("click",  () => {
    load_manifest_text();

    console.debug("DOMContentLoaded listener added to window");
})
}

async function attach_load_text_listener(){
    document
    .querySelector("button#load-manifest-from-text")
    .addEventListener("click",  () => {
    load_manifest_text()
    });
}

async function load_manifest_text(){
    const manifestText = document.querySelector("textarea#manifest-text").value;
    console.info(`manifest text: ${manifestText.length} characters`);
    try{
        let obj = jsonlint.parse(manifestText);
        console.info(`json object parsed`);
        await handle_manifest_json(obj);
    }
    catch (error ){
        console.info(`jsonlint parse failed with ${error}`);
    }
    return;
}

    
attach_window_listener();
