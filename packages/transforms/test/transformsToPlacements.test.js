import {expect} from "chai";


import {S,R,T,Vector3} from "./support.js";
import {Transform, transformsToPlacements} from "../dist-commonjs/index.js"


const testCases = [
        [S(1,1,1),R(90,0,0),T(1.0,2.0,3.0)],
        [T(1.0,2.0,3.0),R(90,0,0),S(1,1,1)],
        [T(1.0,2.0,3.0),R(90,0,0),R(0,45.0,0),S(1,1,1)]
    ];

describe(`transformsToPlacements`, function(){

    [
        [S(1,1,1),R(90,0,0),T(1.0,2.0,3.0)],
        [T(1.0,2.0,3.0),R(90,0,0),S(1,1,1)],
        [T(1.0,2.0,3.0),R(90,0,0),R(0,45.0,0),S(1,1,1)]
    ].forEach( function(manifestoList){
        it(`argument [${manifestoList}]`, function(){        
            const transformsList = manifestoList.map(Transform.from_manifesto_transform);
            expect(transformsList).to.be.a('array');
            
            let placements = transformsToPlacements(transformsList);
            expect(placements).to.be.a('array');
        });
    });
});




