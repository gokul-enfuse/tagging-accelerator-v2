//export const DOMAIN= "http://localhost:5001";
//xport const DOMAINCLIENT = "http://localhost:6075/";
//export const TAGGINGSERVERPATH = ""
//export const DOMAIN= "http://44.207.171.24:5001"
const isLocalhost = window.location.hostname === 'localhost';
console.log(process.env.PUBLIC_URL);

export const DOMAIN = process.env.REACT_APP_DOMAIN || (isLocalhost ? "http://localhost:3030" : "http://44.207.171.24:5001");
export const DOMAINCLIENT = process.env.REACT_APP_DOMAINCLIENT || (isLocalhost ? "http://localhost:3001" : "http://44.207.171.24:3001");
export const MEDIAMANUALPATH = (isLocalhost) ? 'D:/Project - Internal/TaggingTool/one-dev/documentTagging/taggingTool-V3/taggingTool-V2/public/uploads/images/manual/image':'/home/devel/applications/taggingTool-V2/public/uploads/images/manual/image';
