const manifesto = require("@iiif/3d-manifesto-dev/dist-commonjs/");

import {Manifest3DViewer} from "./Manifest3DViewer.ts";

import {fetch_manifest_json} from "./fetch_manifest_json.ts";

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


function initialize_manifest_elements(){
    const container = document.getElementById("xite-view-container");
    if (container === null)
        throw new Error("initialize_manifest_elements: getElementById(\"xite-view-container\") failed");
        
    document.addEventListener("new_manifest", async (event) => {        
        console.log("new_manifest event fired");
        const container = document.getElementById("xite-view-container");
        const viewer = new Manifest3DViewer(container);
        viewer.showAllButton = document.getElementById("xite-show-all");
        await viewer.display( event.detail.manifest );
    });    
}


async function  dom_loaded_viewer_handler(event){
    console.log("DOMContentLoaded fired");  
    initialize_manifest_elements();
    
    const data = await fetch_manifest_json(window.location);
    if (data !== null){
        console.log(`return : fetch_manifest_json( ${window.location} ) ==> ${data}`);
        await handle_manifest_json( data );
    }
    else
        console.log(`no manifest url identified in ${window.location}`);
}

function attach_window_listener(){
    window.addEventListener("DOMContentLoaded", dom_loaded_viewer_handler);
    console.log("DOMContentLoaded listener added to window");
}


attach_window_listener();
