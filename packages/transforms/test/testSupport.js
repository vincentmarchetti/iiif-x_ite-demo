import * as manifesto from "manifesto-prezi4/index.js";



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


