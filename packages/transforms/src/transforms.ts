import * as manifesto from "manifesto-prezi4/index.js";
import {Quaternion, Euler,  IOrder, MathUtils, Vector3} from "threejs-math";


type AxesValues = [number, number, number];
const AxesName = ["x", "y", "z"];

function extractAxesValues(obj : object) : AxesValues{
    let rv:number[] = AxesName.reduce( (accum:number[] ,axes_name:string) => {
        accum.push( ( ():number => {   
            const v = obj[axes_name];
            if (v ===  undefined )   
                return 0.0;
            else
                return Number(v);
        }        
        )());
        return accum;
    }, []);
    if (rv.length == 3) return rv as AxesValues;
    throw new TypeError();
}

/*
function insertAxesValues( values : AxesValues, obj: object ):object {
    return  AxesName.reduce( (obj :object, axes_name:string, index:number):object => {
        const val:number = values[index];
        if ((val == 0.0) && (obj[axes_name] != undefined))
            delete obj[axes_name];
        else
            obj[axes_name] = val;
        return obj;
    }, obj);        
}
*/

export abstract class Transform{

    public static from_manifesto_transform(t:manifesto.Transform) : Transform{
        if (t instanceof manifesto.RotateTransform){
            const degreesAngles:AxesValues = extractAxesValues(t);
            const order:string='ZYX';
            const radianValues = degreesAngles.map( MathUtils.degToRad );
            const eulerArgs:any[] = (radianValues as any[]).concat([order])
            const euler = new Euler().fromArray( eulerArgs as [number,number,number,IOrder] );
            const quat = new Quaternion().setFromEuler(euler);
            return new Rotation(quat);
        }
        throw new TypeError();
    }

    abstract get x3dTransformFields():Record<string,string>;
}

export class Rotation extends Transform{

    readonly quat : Quaternion;
    
    public constructor( quat:Quaternion ){
        super();
        this.quat = quat;        
    }
    
    get x3dTransformFields():Record<string,string> {
    
        const vec = new Vector3(this.quat.x, this.quat.y, this.quat.z);
        const vlen:number = vec.length();
        const angle = 2.0 * Math.atan2( vlen , this.quat.w);
    
        const axis:Vector3 = ( angle != 0.0 )?
            vec.divideScalar( vlen ):
            new Vector3(1.0,0.0,0.0);
        
        return {"rotation" : `{vec.x} {vec.y} {vec.z} {angle}`};
    }
}