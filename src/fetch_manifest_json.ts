

let MANIFEST_KEY : string = "manifest";
export async function fetch_manifest_json(viewer_url_string : string ,
                    fallback_manifest_url : string|null = null) : object | null {
    /**
    *  extracts a URI, either a URL network location
    *  or a data URI, and does what is necessary to
    *  extract the parsed json object from that URL/URI
    *
    *  If a value is not found under MANIFEST_KEY in the query part
    *  of window.location then the function will use a variable
    *  fallback_manifest_url , defined in global scope
    *
    *  The fallback_manifest_url mechanism is primarly intended
    *  for debug and development
    *
    *  otherwise a value of null is returned
    *
    *  Once a manifest_url string is identified, this function will either
    *  return a parsed Object or will throw an Error object
    *  -- Error will be thrown for network failures or json parsing error
    *  
    **/
    
    // reference : https://developer.mozilla.org/en-US/docs/Web/API/URL
    const viewer_url : URL = new URL(viewer_url_string);
    const manifest_url : string | null = 
        viewer_url.searchParams.get( MANIFEST_KEY ) || fallback_manifest_url;
    
    if ( manifest_url  == null ) return null;
    console.log(`fetch_manifest_json : fetching ${manifest_url}`);
    // reference : https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    const response = await fetch( manifest_url );
    
    if (!response.ok) {
        throw new Error(`Fetch of manifest failed: Response status: ${response.status}`);
    }
    try {        
        const result = await response.json();
        console.log(`fetch_manifest_json parsed result: type ${result.type}`);
        return result;
    } catch (error : unknown ){
        console.error(`fetch_manifest_json :${error}`);
        const message = ( (x:unknown):string => {
            if (x instanceof Error) return x.message;
            return String(x);
        }) (error);
        throw new Error(`json parsing failed: ${message}`);
    }
}

