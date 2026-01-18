import {manifesto} from "manifesto-prezi4";
import {Transform, transformsToPlacements } from "../packages/transforms/dist";

// Developer Note: Jan 13 2026, import of render_stub_content is strictly a 
// development feature, not relevant to production level
import {render_stub_content} from "./render_stub_content.ts";
import {expect} from "chai";


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
    if (resource.isSpecificResource ){
        return (resource.getTransform())
            .map( Transform.from_manifesto_transform );
    };
    return ( [] as Transform[] );
};

function getTransformsForTarget( resource : manifesto.ManifestResource):Transform[] {
    if ( resource.isSpecificResource  || 
        (resource.getSelector && resource.getSelector().isPointSelector()) ){
        const selector : manifesto.PointSelector = (resource as SpecificResource).getSelector();
        return [ Transform.from_manifesto_transform(selector )];
    };
    return ( [] as Transform[] );
};

function thisOrSource(resource: manifesto.ManifestResource):manifesto.ManifestResource{
    if (resource.isSpecificResource )
        return resource.getSource();
    return resource;
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
        
        if ( X3D == undefined ){
            throw new Error("global X3D not defined in SceneRender.constuctor");
        }
    };
    
    private scene_x = null;
    
    private createNode( tag:string ) {
        if (this.scene_x == null){
            throw new Error("SceneRender.createNode: scene_x not initialized");
        }
        console.debug(`SceneRender.createNode ${tag}`);
        return this.scene_x.createNode(tag);
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
        this.scene_x =  await this.browser.createScene();
        
        this.addNavigationInfo( this.scene_x.rootNodes );
        this.addBackground( this.scene_x.rootNodes );
        
        this.scene.annotationPages.forEach( (page:manifesto.AnnotationPage) => {
            this.addAnnotationPage(this.scene_x.rootNodes, page);
        });
        
        await this.browser.replaceWorld(this.scene_x); 
        //await render_stub_content(this.browser);
        
        const hooks = new Object();
        return hooks;
    }
    
    private addNavigationInfo(container):void {}
    private addBackground(container):void {}
    
    private addAnnotationPage(container, page: manifesto.AnnotationPage):void {
        const group  = this.createNode("Group");
        page.getAnnotations().forEach( (anno:manifesto.Annotation):void => {
            this.addAnnotation( group.children , anno );
        });
        container.push(group);
    }
    
    private addAnnotation(container, anno:manifesto.Annotation):void {
        console.debug(`enter SceneRender.addAnnotation ${anno.id}`);
        const bodyOrNull = this.chooseBody( anno.getBody());
        if (bodyOrNull == null) return
        
        
        const body:manifesto.ManifestResource = bodyOrNull as manifesto.ManifestResource;
        expect(body, "SceneRender.addAnnotation  body").to.exist;
        const bodySource:ManifestResource = thisOrSource(body);
        const target = anno.getTarget();
        
        //if (bodySource instanceof manifesto.Model)
        if (bodySource.isModel())
            return this.addModel(container, body,target);

        console.warn(`unsupported body type ${bodySource.getType()}`);
        return;
    }
    
    private addModel(   container, 
                        body : manifesto.ManifestResource, 
                        target: manifesto.ManifestResource):void{
                        
        const prettyPrint = (tlist:Transform[]):string => {
            const subs = tlist.map( (t:Transform):string =>
                {return t.toString();});
            return subs.join();
        }
        
        const model:manifesto.Model = thisOrSource(body);
        console.debug(`adding model ${model.id}`);
        
        const inline = this.createNode("Inline");
        inline.url = new X3D.MFString([ model.id ]);
            
        const net_transforms =  [   ...getTransformsForBody(body),
                                    ...getTransformsForTarget(target) ];
        ( (to_console:bool) => {
            const items:string[] = net_transforms.map((item) => item.toString());
            const msg:string = `SceneRender.addModel net_transforms: ${items.join()}`;
            if (to_console) console.debug(msg);
        })(true);
                                    
        const placements = transformsToPlacements( net_transforms );
        
        ( (to_console:bool) => {
            const items:string[] = placements.map((item) => item.toString());
            const msg:string = `SceneRender.addModel placements: ${items.join()}`;
            if (to_console) console.debug(msg);
        })(true);
        
        container.push(inline);
        return;                       
    }
        
    private chooseBody( resources : manifesto.ManifestResource[] ): ManifestResource | null {
        if (resources.length == 0) return null;
        return resources[0];
    }
}