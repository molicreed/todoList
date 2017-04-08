import AV from 'leancloud-storage'

const APP_ID = 'be0B7Hrmn2ek9qx7d8yFK5eP-gzGzoHsz';
const APP_KEY = 'm4dplgRGaxNu2khXIWPA6ewS';

AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});

export default AV; 