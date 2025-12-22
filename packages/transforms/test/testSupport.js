import {RotateTransform} from "@iiif/3d-manifesto-dev/dist-commonjs/index.js";


export function makeRotateTransform(xv,yv,zv){
    return new RotateTransform(
        {
            "type":"RotateTransform",
            "x" : xv,
            "y" : yv,
            "z" :zv
        }
    );
}

