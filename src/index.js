

async function  hook(event){
    console.log("DOMContentLoaded fired");  
    
    document.addEventListener("x3dload", function() {console.log("x3dload fired");});
    const cont = document.getElementById("xite-view-container");
    
    const canv = document.createElement("x3d-canvas");
    cont.appendChild(canv);
    console.log("created " + canv.browser);
    console.log("X3D " + X3D );
    // https://create3000.github.io/x_ite/accessing-the-external-browser/#pure-javascript
    const scene = await canv.browser.createScene();
    console.log("scene " + scene);
    const inline = scene.createNode("Inline");
    inline.url = new X3D.MFString(["https://spri-open-resources.s3.us-east-2.amazonaws.com/iiif3dtsg/woodblocks/redF.glb"]);
    scene.rootNodes.push(inline);
    
    console.log("loading scene");
    await canv.browser.replaceWorld(scene);  
    console.log("scene replaced");
    // following may not work because it is being called before
    // the glb file is loaded
    canv.browser.viewAll();
}
window.addEventListener("DOMContentLoaded", hook);
console.log("bootstrap loaded");

