import DOMPurify from 'isomorphic-dompurify';


// fonction pour sanitize une string anti xss
export const sanitizeString = (value) => {
  // si la value n'est pas une string return la value directement
  if (typeof value !== 'string'){
    return value;
  }else{
    // sinon, on sanitize la value, en remplacant les < et > par des &lt; et &gt;
    return DOMPurify.sanitize(value).trim();
  }
}