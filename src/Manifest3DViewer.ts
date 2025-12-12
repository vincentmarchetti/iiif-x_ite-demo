

export class Manifest3DViewer {

    public readonly browser : any ;
    
    
    public set showAllButton( button:HTMLElement){
        if (button === null){
            logger.warn(`Manifest3DViewer.showAllButton (setter) : null argument`);
        }
        else{
        button.addEventListener("click" , ( event ) => {
            console.debug(`showAllButton click handler fired`);
            this.browser.viewAll();
            });
        }
    }

    
    constructor( container : HTMLElement ){
        const canvas = document.createElement("x3d-canvas");
        container.appendChild(canvas);
        if (canvas.browser == null ){
            throw new Error("Manifest3DViewer.constructor: failed to create X_ITE browser");
        }
        this.browser = canvas.browser;
        console.debug(`created browser: ${this.browser.name}:${this.browser.version}`);
    }
    
    public async display( manifest : any ){
        /*
        manifest will be an instance of Manifest class from manifesto
        */
        console.log(`display manifest ${manifest.id}`);
        await show_stub_content(this.browser)
    }
}


async function show_stub_content(browser:any){
    /* 
    this function is a stub to just show something
    -- as specified by a url to a glb model
    in the viewer; eventually this needs to be replaced
    by the call that will cause a manifest to be rendered
    by the viewer
    */
    
    console.debug("X3D " + X3D );
    const model_url = "https://spri-open-resources.s3.us-east-2.amazonaws.com/iiif3dtsg/woodblocks/redF.glb";
    // https://create3000.github.io/x_ite/accessing-the-external-browser/#pure-javascript
    const scene = await browser.createScene();
    console.debug("scene " + scene);
    const inline = scene.createNode("Inline");
    inline.url = new X3D.MFString([ model_url ]);
    scene.rootNodes.push(inline);
    
    console.debug("loading scene");
    await browser.replaceWorld(scene);  
    console.log("scene replaced");
    // following may not work because it is being called before
    // the glb file is loaded
    
    // canvas.browser.viewAll();
}
