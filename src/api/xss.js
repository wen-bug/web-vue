export const coding=(value) => {
    value = value.replace(/&/g,"&amp;");
    value = value.replace(/</g,"&lt;");
    value = value.replace(/>/g,"&gt;");
    value = value.replace(/ /g,"&nbsp;");
    value = value.replace(/\'/g,"&#39;");
    value = value.replace(/\"/g,"&quot;");
    return value
  }