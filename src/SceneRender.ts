import {manifesto} from "manifesto-prezi4";
import {Transform} from "../packages/transforms/dist";

// Developer Note: Jan 13 2026, import of render_stub_content is strictly a 
// development feature, not relevant to production level
import {render_stub_content} from "./render_stub_content.ts";


/*
Code in this module assumes there is an object X3D in the global context due
to having imported the X_ITE library. This will be sanity-checked in the
constructor for the SceneRender class
*/

/*
SceneHooks will be an instance with a number of elements
referring to HTMLElements inside the scene, or other constructs,
that can be used to client to connect to external UI elements
for the purpose of modifying the scene.

It will support the mechanism by which activating annotations are triggered
by HTML events.
*/
export interface SceneHooks {
    
};


function getTransformsForBody( resource : manifesto.ManifestResource):Transform[] {
    if (resource instanceof manifesto.SpecificResource ){
        return (resource as SpecificResource).getTransform()
            .map( Transform.from_manifesto_transform );
    };
    return ( [] as Transform[] );
};

function getTransformsForTarget( resource : manifesto.ManifestResource):Transform[] {
    if (resource instanceof manifesto.SpecificResource || 
        resource.getSelector() instanceof manifesto.PointSelector ){
        const selector : manifesto.PointSelector = (resource as SpecificResource).getSelector();
        return [ Transform.from_manifesto_transform(selector )];
    };
    return ( [] as Transform[] );
};


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
        
        if ( X3D == undefined ){
            throw new Error("global X3D not defined in SceneRender.constuctor");
        }
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
        
        /*
        scene_x is a constructed representation of the scenegraph int he X_ITE 
        context. It is roughly  the Scene element in the X3D as well as the DOM tree. 
        Strictly, it  it is not an X3D node.
        
        Calling it scene_x to avoid confusion with this.scene, the static IIIF resource
        as represented in manifesto
        */
        let scene_x =  await this.browser.createScene();
        
        this.addNavigationInfo( scene_x );
        this.addBackground( scene_x );
        
        this.scene.annotationPages.forEach( (page:manifesto.AnnotationPage) => {
            this.addAnnotationPage(scene_x, page);
        });
        
        
        
        
        
        await render_stub_content(this.browser);
        
        const hooks = new Object();
        return hooks;
    }
    
    private addNavigationInfo(scene_x):void {}
    private addBackground(scene_x):void {}
    private addAnnotationPage(scene_x):void {}
}