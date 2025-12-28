const manifesto = require( "manifesto-prezi4/index.js");



function T(xv,yv,zv){
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

function R(xv,yv,zv){
    const jsonld = {
        "type" : "RotateTransform",
        "x"    : xv,
        "y"    : yv,
        "z"    : zv
    };
    const u =  new manifesto.RotateTransform(jsonld);
    u.label = "R"
    return u;
};

function S(xv,yv,zv){
    const jsonld = {
        "type" : "ScaleTransform",
        "x"    : xv,
        "y"    : yv,
        "z"    : zv
    };
    const u =  new manifesto.ScaleTransform(jsonld);
    u.label = "S"
    return u;
};

module.exports = {S,R,T};