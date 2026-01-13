import {manifesto} from "manifesto-prezi4";

// Developer Note: Jan 13 2026, import of render_stub_content is strictly a 
// development feature, not relevant to production level
import {render_stub_content} from "./render_stub_content.ts";

/*
SceneHooks will be an instance with a number of elements
referring to HTMLElements inside the scene, or other constructs,
that can be used to client to connect to external UI elements
for the purpose of modifying the scene.

It will support the mechanism by which activating annotations are triggered
by HTML events.
*/
export interface SceneHooks {
    
}

export class SceneRender {

    private readonly browser:any;
    private readonly scene : manifesto.Scene;
    
    /*
    Developer note: Jan 13 2026 at initial implementation
    a stored reference to the manifest is being maintained with the
    thought that it may be needed in the future, but at this
    stage there is no explicit reason for keeping it.
    */
    private readonly manifest : manifesto.Manifest;
    
    public constructor( scene : manifesto.Scene, manifest : manifesto.Manifest, browser : any){
        this.scene =scene;
        this.manifest = manifest;
        this.browser = browser;
    }
    
    /*
    Developer note: 13 Jan 2026 Functionally this should be put in the
    constructor, but I have a superstition agains putting a instance constructor
    inside an await loop. 
    Clients should call this function asynchrously after constucting the
    SceneRender instance synchronously
    */
    public async render() : SceneHooks {
        console.debug( `enter SceneRende.render for scene ${this.scene.id}`);
        await render_stub_content(this.browser);
        
        const hooks = new Object();
        return hooks;
    }
}