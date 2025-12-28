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
};

export function T(xv,yv,zv){
    const jsonld = {
        "type" : "TranslateTransform",
        "x"    : xv,
        "y"    : yv,
        "z"    : zv
    };
    const u =  new manifesto.TranslateTransform(jsonld);
    u.label = "T"
    return u;
};


