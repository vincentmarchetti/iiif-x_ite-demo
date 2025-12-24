import {RotateTransform} from "manifesto-prezi4/index.js";


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

