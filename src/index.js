
import {fetch_manifest_json} from "./fetch_manifest_json.ts";

async function handle_manifest_json( json ){
    /*
    json is the object obtained from the json text 
    TODO: in productions, this function will "parse" the object
    with manifesto and announce that manifesto object through a 
    window based Custom event, which other parts of the page
    */
    console.log(`handle_manifest_json: type is ${json.type}`);
    // insert parsing with manifesto-3d and if successful
    // raise a custom event
    return;
}



async function  hook(event){
    console.log("DOMContentLoaded fired");  
    const data = await fetch_manifest_json(window.location);
    console.log(`return : fetch_manifest_json( ${window.location} ) ==> ${data}`);
    await handle_manifest_json( data );
    //await show_stub_content();
}

function attach_window_listener(){
    window.addEventListener("DOMContentLoaded", hook);
    console.log("DOMContentLoaded listener added to window");
}

async function show_stub_content(){
    /* 
    this function is a stub to just show something
    -- as specified by a url to a glb model
    in the viewer; eventually this needs to be replaced
    by the call that will cause a manifest to be rendered
    by the viewer
    */
    const model_url = "https://spri-open-resources.s3.us-east-2.amazonaws.com/iiif3dtsg/woodblocks/redF.glb";    
    const canvas = document.createElement("x3d-canvas");
    const container = document.getElementById("xite-view-container");
    container.appendChild(canvas);
    
    console.debug("created " + canvas.browser);
    console.debug("X3D " + X3D );
    // https://create3000.github.io/x_ite/accessing-the-external-browser/#pure-javascript
    const scene = await canvas.browser.createScene();
    console.debug("scene " + scene);
    const inline = scene.createNode("Inline");
    inline.url = new X3D.MFString([ model_url ]);
    scene.rootNodes.push(inline);
    
    console.debug("loading scene");
    await canvas.browser.replaceWorld(scene);  
    console.log("scene replaced");
    // following may not work because it is being called before
    // the glb file is loaded
    
    canvas.browser.viewAll();
}

attach_window_listener();
