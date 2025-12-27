const type = require('type-detect')
const Vector3 = require('threejs-math').Vector3;

function isVector3(vect){
    for(let i = 0; i<3;++i){
        const axis = ["x","y","z"][i];
        if (  type(vect[axis]) !== 'number' )
            return false;
    }
    return true;
}
    
    
function areEqualVector3s(vA,vB ){
   for (let i=0;i<3;++i){
        axis = ["x","y","z"][i];
        if (vA[axis] != vb[axis]) return false
    }
    return true;
}

function areAlmostEqualVector3s(vA,vB, tolerance ){
    for (let i=0;i<3;++i){
        axis = ["x","y","z"][i];
        const err = Math.abs( vA[axis] - vB[axis] );
        if (err > tolerance) return false;
    }
    return true;
}

function prettyVector(vect){
    return `(${vect.x}, ${vect.y}, ${vect.z})`
}


function isAffineTransform(aff, maxdepth=4){
    /* this test if intended to prevent 
    infinite recursion loops
    */
    if (maxdepth < 0)
        throw new Error("excess recursion in isAffineTransform");
        
    if (aff["applyToVector3"] !== undefined) return true;
    
    if ( Array.isArray(aff) && aff.length > 0 )
        for (let i = 0; i < aff.length; ++i)
            if (!isAffineTransform(aff[i], maxdepth-1)) return false;
            
    return false;         
}

function applyIteratedTransforms( op, vector , maxdepth=4 ){
    if (maxdepth < 0)
        throw new Error("excess recursion in applyIteratedTransforms");
    
    if (op.applyToVector3 != undefined)
        return op.applyToVector3(vector);
    else {
        let acc = vector;
        for (let i = 0; i < op.length; ++i)
            acc = applyIteratedTransforms(op[i], acc, maxdepth-1);
        return acc;
    }
    throw new Error(`argument error: passed to applyIteratedTransforms`);
}

/**
*eturns a function to be passed to chai.use
 * @see http://chaijs.com/guide/plugins/
 */
function chaiTransforms () {
  return function (chai, utils) {

    function overrideAssertEqual (_super) {
      return function assertEqual (val, msg) {
        if (msg) utils.flag(this, 'message', msg)

        if ( isVector3(val) && isVector3(this._obj )){
            
            if (utils.flag(this,"tolerance") === undefined){
                const testResult = areEqualVector3s(val, this._obj);
                const message =     `expected ${prettyVector(this._obj)} `+
                                    `to equal ${prettyVector(val)}}`;
                const neg_message = `expected ${prettyVector(this._obj)} `+
                                    `to not equal ${prettyVector(val)}}`;
                return this.assert(testResult,message, neg_message);
            } else {
                const tolerance = utils.flag(this,"tolerance");
                const testResult = areAlmostEqualVector3s(val, this._obj, tolerance);
                const message =     `expected ${prettyVector(this._obj)} `+
                                    `to almost equal ${prettyVector(val)}}`;
                const neg_message = `expected ${prettyVector(this._obj)} `+
                                    `to not almost equal ${prettyVector(val)}}`;
                return this.assert(testResult,message, neg_message);
            }
        } else if (isAffineTransform(this._obj) && isAffineTransform(val)) {
            const tolerance = utils.flag(this,"tolerance");
            const useAlmost = (tolerance != undefined);
            const cVs = [0.0,1.0];
            for (let i = 0; i < 2; ++i)
            for (let j = 0; j < 2; ++j)
            for (let k = 0; k < 2; ++k){
                const testVect = new Vector3(cVs[i] , cVs[j], cVs[k]);
                const objVect = this._obj.applyToVector3( testVect );
                const valVect = val.applyToVector3( testVect );
                
                const testRes = (useAlmost)?
                                areAlmostEqualVector3s(objVect,valVect,tolerance):
                                areEqualVector3s(objVect,valVect);
                                
                if (!testRes){
                    message = (useAlmost)?
                            `test ${prettyVector(testVect)} : ` +
                            `expected ${prettyVector(objVect)} ` +
                                    `to almost equal ${prettyVector(valVect)}`:
                            "no implemented equal message yet";
                            
                    return this.assert(false, message);
                }
            }
            return this.assert(true, "","all test vector comparisons almost equal");
        } else {
          return _super.apply(this, arguments)
        }
      }
    }
    
    chai.Assertion.overwriteMethod('equal', overrideAssertEqual)
    chai.Assertion.overwriteMethod('equals', overrideAssertEqual)
    chai.Assertion.overwriteMethod('eq', overrideAssertEqual)
  }
}

module.exports = chaiTransforms
    
